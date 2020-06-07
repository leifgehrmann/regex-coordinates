import GeoJsonGenerator from '@/utils/geoJsonGenerator';
import proj4 from 'proj4';

describe('GeoJsonGenerator', () => {
  it('works generally', () => {
    const data = [
      ['Alice, 1000, 1, 2', 'Alice', '1000', '1', '2'],
      ['Bob, 2000, 2, 3', 'Bob', '2000', '2', '3'],
      ['Bob, 3000, 3, 4', 'Bob', '3000', '3', '4'],
    ];
    const groupSettings = [
      { type: 'custom:Name' },
      { type: 'custom:Time' },
      { type: 'x' },
      { type: 'y' },
    ];
    const projConverter = proj4('EPSG:4326');
    const output = GeoJsonGenerator.generate(
      data,
      groupSettings,
      projConverter,
      'both',
      'custom:Name',
      'custom:Time',
    );
    expect(output).toContain('Alice');
  });
});
