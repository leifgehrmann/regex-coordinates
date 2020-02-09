import allEpsgProjections from 'epsg-index/all.json';

export interface Projection {
  accuracy: number|null;
  area: string|null;
  bbox: number[]|null;
  code: string;
  kind: string;
  name: string;
  proj4: string|null;
  unit: string|null;
  wkt: string|null;
}

export default class EpsgIndex {
  private readonly projectionsByCode: {[key: string]: Projection};

  private readonly excludeProjectionsWithoutProj4: boolean;

  constructor() {
    this.excludeProjectionsWithoutProj4 = true;
    this.projectionsByCode = allEpsgProjections as {[key: string]: Projection};
  }

  getProjectionByCode(code: string): Projection|null {
    const projection = this.projectionsByCode[code];
    if (projection === undefined) {
      return null;
    }
    if (this.excludeProjectionsWithoutProj4 && projection.proj4 === null) {
      return null;
    }
    return projection;
  }

  searchProjections(searchString: string, limit: number): Projection[] {
    const matches: Projection[] = [];
    const searchInputLower = searchString.toLowerCase();
    const projections = Object.values(this.projectionsByCode);
    for (let i = 0, len = projections.length; i < len; i += 1) {
      if (matches.length >= limit) {
        break;
      }

      const projection = projections[i];

      if (
        !(this.excludeProjectionsWithoutProj4 && projection.proj4 === null)
        && EpsgIndex.projectionMatchesSearchTerm(projection, searchInputLower)) {
        matches.push(projection);
      }
    }
    return matches;
  }

  /**
   * @param {Projection} projection
   * @param {string} searchInput Must be a lowercase string
   */
  private static projectionMatchesSearchTerm(projection: Projection, searchInput: string): boolean {
    // Does the search input contain the epsg code?
    if (
      projection.code.indexOf(searchInput) !== -1
      || `epsg:${projection.code}`.indexOf(searchInput) !== -1
    ) {
      return true;
    }

    // Does the name contain the search input?
    if (projection.name.toLowerCase().indexOf(searchInput) !== -1) {
      return true;
    }

    // Does the area contain the search input?
    return (projection.area !== null && projection.area.toLowerCase().indexOf(searchInput) !== -1);
  }
}
