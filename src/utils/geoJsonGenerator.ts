type NumericArrayObject = { [key: string]: number[] };

interface FeatureCollection {
  type: string,
  features: any
}

export default class GeoJsonGenerator {
  generate(parsedData: string[][], matchGroupTypes: string[]): string {
    const matchGroupTypeLookup = this.invertMatchGroupTypes(matchGroupTypes);
    const output = this.generateFeatureCollection();

    if (!this.hasCoordinatesDefined(matchGroupTypeLookup)) {
      return 'Please select Latitude and Longitude groups above.';
    }

    if (this.hasTimeDefined(matchGroupTypeLookup)) {
      // Todo: Add linestring feature
    }

    const points = this.generatePointFeatures(parsedData, matchGroupTypeLookup);
    output.features.push(...points);

    return JSON.stringify(output, null, 2);
  }

  // eslint-disable-next-line class-methods-use-this
  private generateFeatureCollection(): FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  private generatePointFeatures(
    parsedData: string[][],
    matchGroupTypeLookup: NumericArrayObject,
  ): any[] {
    const self = this;
    return parsedData.reduce((result: any[], rowGroup) => {
      const coordinate = [
        parseFloat(rowGroup[matchGroupTypeLookup.longitude[0]]),
        parseFloat(rowGroup[matchGroupTypeLookup.latitude[0]]),
      ];
      if (Number.isNaN(coordinate[0]) || Number.isNaN(coordinate[1])) {
        return result;
      }
      const properties: any = {};
      if (self.hasTimeDefined(matchGroupTypeLookup)) {
        properties.time = rowGroup[matchGroupTypeLookup.time[0]];
      }
      if (self.hasNameDefined(matchGroupTypeLookup)) {
        properties.name = rowGroup[matchGroupTypeLookup.name[0]];
      }
      result.push(self.generatePointFeature(coordinate, properties));
      return result;
    }, []);
  }

  // eslint-disable-next-line class-methods-use-this
  private generatePointFeature(coordinate: number[], properties: object) {
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

  private invertMatchGroupTypes(matchGroupTypes: string[]): NumericArrayObject {
    const matchGroupTypeLookup: NumericArrayObject = {};
    matchGroupTypes.forEach((value, index) => {
      if (!this.objectHasProperty(matchGroupTypeLookup, value)) {
        matchGroupTypeLookup[value] = [];
      }
      matchGroupTypeLookup[value].push(index);
    });
    return matchGroupTypeLookup;
  }

  private hasCoordinatesDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return this.objectHasProperty(matchGroupTypeLookup, 'longitude')
      && this.objectHasProperty(matchGroupTypeLookup, 'latitude');
  }

  private hasTimeDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return this.objectHasProperty(matchGroupTypeLookup, 'time');
  }

  private hasNameDefined(matchGroupTypeLookup: NumericArrayObject): boolean {
    return this.objectHasProperty(matchGroupTypeLookup, 'name');
  }

  // eslint-disable-next-line class-methods-use-this
  private objectHasProperty(obj: any, prop: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
