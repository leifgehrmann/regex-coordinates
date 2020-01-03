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
  static generate(parsedData: string[][], matchGroupTypes: string[]): string {
    const matchGroupTypeLookup = GeoJsonGenerator.invertMatchGroupTypes(matchGroupTypes);
    const output = GeoJsonGenerator.generateFeatureCollection();

    if (!GeoJsonGenerator.hasCoordinatesDefined(matchGroupTypeLookup)) {
      return 'Please select Latitude and Longitude groups above.';
    }

    if (GeoJsonGenerator.hasTimeDefined(matchGroupTypeLookup)) {
      // Todo: Add linestring feature
    }

    const points = GeoJsonGenerator.generatePointFeatures(parsedData, matchGroupTypeLookup);
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
    matchGroupTypeLookup: NumericArrayObject,
  ): PointFeature[] {
    return parsedData.reduce((result: object[], rowGroup) => {
      const coordinate = [
        parseFloat(rowGroup[matchGroupTypeLookup.longitude[0]]),
        parseFloat(rowGroup[matchGroupTypeLookup.latitude[0]]),
      ];
      if (Number.isNaN(coordinate[0]) || Number.isNaN(coordinate[1])) {
        return result;
      }
      const properties: Properties = {};
      if (GeoJsonGenerator.hasTimeDefined(matchGroupTypeLookup)) {
        properties.time = rowGroup[matchGroupTypeLookup.time[0]];
      }
      if (GeoJsonGenerator.hasNameDefined(matchGroupTypeLookup)) {
        properties.name = rowGroup[matchGroupTypeLookup.name[0]];
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

  private static invertMatchGroupTypes(matchGroupTypes: string[]): NumericArrayObject {
    const matchGroupTypeLookup: NumericArrayObject = {};
    matchGroupTypes.forEach((value, index) => {
      if (!GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, value)) {
        matchGroupTypeLookup[value] = [];
      }
      matchGroupTypeLookup[value].push(index);
    });
    return matchGroupTypeLookup;
  }

  private static hasCoordinatesDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'longitude')
      && GeoJsonGenerator.objectHasProperty(matchGroupTypeLookup, 'latitude');
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
