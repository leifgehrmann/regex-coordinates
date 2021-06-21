import proj4 from 'proj4';
import GroupSettings from '@/utils/groupSettings';

type NumericArrayObject = { [key: string]: number[] };

interface Properties {
  [key: string]: string;
}

interface PointFeature {
  type: string;
  properties: Properties;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

interface LineStringFeature {
  type: 'Feature';
  properties: Properties;
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
}

interface FeatureCollection {
  type: string;
  features: (PointFeature|LineStringFeature)[];
}

export default class GeoJsonGenerator {
  static generate(
    parsedData: string[][],
    allGroupSettings: GroupSettings[],
    projection: proj4.Converter,
    featureType: string,
    groupBy: string,
    orderBy: string,
  ): string {
    const groupNumberLookupByType = GeoJsonGenerator.getGroupNumberLookupByType(allGroupSettings);
    const customTypes = GeoJsonGenerator.getCustomTypes(allGroupSettings);
    const output = GeoJsonGenerator.generateFeatureCollection();

    if (!GeoJsonGenerator.hasCoordinatesDefined(groupNumberLookupByType)) {
      return 'Please select Latitude and Longitude groups in the capture group settings.';
    }

    if (featureType === 'points' || featureType === 'both') {
      const points = GeoJsonGenerator.generatePointFeatures(
        parsedData,
        groupNumberLookupByType,
        customTypes,
        projection,
      );
      output.features.push(...points);
    }

    if (featureType === 'linestring' || featureType === 'both') {
      const lineStrings = GeoJsonGenerator.generateLineStringFeatures(
        parsedData,
        groupNumberLookupByType,
        projection,
        groupBy,
        orderBy,
      );
      output.features.push(...lineStrings);
    }

    return JSON.stringify(output, null, 2);
  }

  private static generateFeatureCollection(): FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  private static generatePointFeatures(
    parsedData: string[][],
    groupNumberLookupByType: NumericArrayObject,
    customTypes: string[],
    projection: proj4.Converter,
  ): PointFeature[] {
    return parsedData.reduce((result: PointFeature[], rowGroup) => {
      let coordinate = [
        parseFloat(rowGroup[groupNumberLookupByType.x[0] + 1]),
        parseFloat(rowGroup[groupNumberLookupByType.y[0] + 1]),
      ];
      if (Number.isNaN(coordinate[0]) || Number.isNaN(coordinate[1])) {
        return result;
      }
      coordinate = projection.inverse(coordinate);
      const properties: Properties = {};
      customTypes.forEach((customType) => {
        const propertyName = customType.substr('custom:'.length);
        properties[propertyName] = rowGroup[groupNumberLookupByType[customType][0] + 1];
      });

      result.push(GeoJsonGenerator.generatePointFeature(coordinate, properties));
      return result;
    }, []) as PointFeature[];
  }

  private static generateLineStringFeatures(
    parsedData: string[][],
    groupNumberLookupByType: NumericArrayObject,
    projection: proj4.Converter,
    groupBy: string,
    orderBy: string,
  ): LineStringFeature[] {
    let groupByName: string|null = null;
    let groupByIndex: number|null = null;
    if (groupBy !== '') {
      groupByName = groupBy.substr('custom:'.length);
      groupByIndex = groupNumberLookupByType[groupBy][0] + 1;
    }
    let orderByIndex: number|null = null;
    if (orderBy !== '') {
      orderByIndex = groupNumberLookupByType[orderBy][0] + 1;
    }
    const coordinatesWithOrderByValueByGroupByValue:
      {[key: string]: {coordinate: number[]; orderByValue: string}[]} = {};
    parsedData.forEach((rowGroup) => {
      let coordinate = [
        parseFloat(rowGroup[groupNumberLookupByType.x[0] + 1]),
        parseFloat(rowGroup[groupNumberLookupByType.y[0] + 1]),
      ];
      if (Number.isNaN(coordinate[0]) || Number.isNaN(coordinate[1])) {
        return;
      }
      coordinate = projection.inverse(coordinate);

      let groupByValue = '-';
      if (groupByIndex !== null) {
        groupByValue = rowGroup[groupByIndex];
      }

      let orderByValue = '-';
      if (orderByIndex !== null) {
        orderByValue = rowGroup[orderByIndex];
      }

      if (!(groupByValue in coordinatesWithOrderByValueByGroupByValue)) {
        coordinatesWithOrderByValueByGroupByValue[groupByValue] = [];
      }
      coordinatesWithOrderByValueByGroupByValue[groupByValue].push({ coordinate, orderByValue });
    });

    const results: LineStringFeature[] = [];
    Object.entries(coordinatesWithOrderByValueByGroupByValue)
      .forEach((coordinatesWithOrderByValueWithGroupByValue) => {
        const groupByValue = coordinatesWithOrderByValueWithGroupByValue[0];
        const coordinatesWithOrderByValue = coordinatesWithOrderByValueWithGroupByValue[1];
        coordinatesWithOrderByValue.sort((a, b) => {
          const orderByValueA = a.orderByValue;
          const orderByValueB = b.orderByValue;
          if (orderByValueA < orderByValueB) {
            return -1;
          }
          if (orderByValueA > orderByValueB) {
            return 1;
          }
          return 0;
        });
        const coordinates = coordinatesWithOrderByValue.map(
          (coordinateWithOrderByValue) => coordinateWithOrderByValue.coordinate,
        );
        const properties: {[key: string]: string} = {};
        if (groupByName !== null) {
          properties[groupByName] = groupByValue;
        }
        results.push(GeoJsonGenerator.generateLineStringFeature(coordinates, properties));
      });
    return results;
  }

  private static generatePointFeature(coordinate: number[], properties: Properties): PointFeature {
    return {
      type: 'Feature',
      properties,
      geometry: {
        type: 'Point',
        coordinates: [
          coordinate[0],
          coordinate[1],
        ],
      },
    };
  }

  private static generateLineStringFeature(
    coordinates: number[][],
    properties: Properties = {},
  ): LineStringFeature {
    return {
      type: 'Feature',
      properties,
      geometry: {
        type: 'LineString',
        coordinates,
      },
    };
  }

  private static getGroupNumberLookupByType(allGroupSettings: GroupSettings[]): NumericArrayObject {
    const groupNumberLookupByType: NumericArrayObject = {};
    allGroupSettings.forEach((groupSettings, groupNumber) => {
      if (groupSettings.type === null) {
        return;
      }
      if (!GeoJsonGenerator.objectHasProperty(groupNumberLookupByType, groupSettings.type)) {
        groupNumberLookupByType[groupSettings.type] = [];
      }
      groupNumberLookupByType[groupSettings.type].push(groupNumber);
    });
    return groupNumberLookupByType;
  }

  private static getCustomTypes(allGroupSettings: GroupSettings[]): string[] {
    const customTypes: string[] = [];
    allGroupSettings.forEach((groupSettings) => {
      if (groupSettings.type === null) {
        return;
      }
      if (groupSettings.type.startsWith('custom:')) {
        customTypes.push(groupSettings.type);
      }
    });
    return customTypes;
  }

  private static hasCoordinatesDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'x')
      && GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'y');
  }

  private static objectHasProperty(obj: NumericArrayObject, prop: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
