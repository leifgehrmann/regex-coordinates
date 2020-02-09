import EpsgIndex from '@/utils/epsgIndex';

describe('EpsgIndex', () => {
  describe('getProjectionByCode', () => {
    it('Returns projection for code', () => {
      const epsgIndex = new EpsgIndex();
      const wgs84Projection = epsgIndex.getProjectionByCode('4326');
      if (wgs84Projection === null) {
        throw Error('');
      }
      expect(wgs84Projection.name).toEqual('WGS 84');
    });

    it('Returns null for unknown code', () => {
      const epsgIndex = new EpsgIndex();
      const unknownProjection = epsgIndex.getProjectionByCode('999999');
      expect(unknownProjection).toBeNull();
    });

    it('Returns null for projection with null proj4', () => {
      const epsgIndex = new EpsgIndex();
      const unknownProjection = epsgIndex.getProjectionByCode('2963');
      expect(unknownProjection).toBeNull();
    });
  });

  describe('searchProjections', () => {
    it('Returns projections with code', () => {
      const epsgIndex = new EpsgIndex();
      const projections = epsgIndex.searchProjections('4326', 10);
      expect(projections).toHaveLength(1);
      expect(projections[0].code).toEqual('4326');
      expect(projections[0].name).toEqual('WGS 84');
    });
    it('Returns projections with code with EPSG prefix', () => {
      const epsgIndex = new EpsgIndex();
      const projections = epsgIndex.searchProjections('EPSG:4326', 10);
      expect(projections).toHaveLength(1);
      expect(projections[0].code).toEqual('4326');
      expect(projections[0].name).toEqual('WGS 84');
    });
    it('Returns projections with name', () => {
      const epsgIndex = new EpsgIndex();
      const projections = epsgIndex.searchProjections('British National', 10);
      expect(projections).toHaveLength(2);
      expect(projections[1].code).toEqual('27700');
    });
    it('Returns projections with area', () => {
      const epsgIndex = new EpsgIndex();
      const projections = epsgIndex.searchProjections('North Sea', 10);
      expect(projections).toHaveLength(7);
      expect(projections[6].code).toEqual('32631');
    });
    it('Returns projections with limit', () => {
      const epsgIndex = new EpsgIndex();
      const projections = epsgIndex.searchProjections('British National', 1);
      expect(projections).toHaveLength(1);
      expect(projections[0].code).toEqual('7405');
    });
  });
});
