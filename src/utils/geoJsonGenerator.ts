import proj4 from 'proj4';
import GroupSettings from '@/utils/groupSettings';

type NumericArrayObject = { [key: string]: number[] };

interface FeatureCollection {
  type: string;
  features: PointFeature[];
}

interface Properties {
  [key: string]: string;
}

interface PointFeature {
  type: string;
  properties: object;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export default class GeoJsonGenerator {
  static generate(
    parsedData: string[][],
    allGroupSettings: GroupSettings[],
    projection: proj4.Converter,
  ): string {
    const groupNumberLookupByType = GeoJsonGenerator.getGroupNumberLookupByType(allGroupSettings);
    const output = GeoJsonGenerator.generateFeatureCollection();

    if (!GeoJsonGenerator.hasCoordinatesDefined(groupNumberLookupByType)) {
      return 'Please select Latitude and Longitude groups above.';
    }

    if (GeoJsonGenerator.hasTimeDefined(groupNumberLookupByType)) {
      // Todo: Add linestring feature
    }

    const points = GeoJsonGenerator.generatePointFeatures(
      parsedData,
      groupNumberLookupByType,
      projection,
    );
    output.features.push(...points);

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
    projection: proj4.Converter,
  ): PointFeature[] {
    return parsedData.reduce((result: object[], rowGroup) => {
      let coordinate = [
        parseFloat(rowGroup[groupNumberLookupByType.x[0] + 1]),
        parseFloat(rowGroup[groupNumberLookupByType.y[0] + 1]),
      ];
      if (Number.isNaN(coordinate[0]) || Number.isNaN(coordinate[1])) {
        return result;
      }
      coordinate = projection.inverse(coordinate);
      const properties: Properties = {};
      if (GeoJsonGenerator.hasTimeDefined(groupNumberLookupByType)) {
        properties.time = rowGroup[groupNumberLookupByType.time[0] + 1];
      }
      if (GeoJsonGenerator.hasNameDefined(groupNumberLookupByType)) {
        properties.name = rowGroup[groupNumberLookupByType.name[0] + 1];
      }
      result.push(GeoJsonGenerator.generatePointFeature(coordinate, properties));
      return result;
    }, []) as PointFeature[];
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

  private static hasCoordinatesDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'x')
      && GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'y');
  }

  private static hasTimeDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'time');
  }

  private static hasNameDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'name');
  }

  private static objectHasProperty(obj: object, prop: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
