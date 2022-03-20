import tooltipGenerator, { Feature, Layer } from '@/utils/tooltipGenerator';

describe('tooltipGenerator', () => {
  it('displays properties for lineStrings', () => {
    const layer: Layer = {
      bindTooltip(): void { /* Do nothing */ },
    };
    const bindTooltipSpy = jest.spyOn(layer, 'bindTooltip');
    const lineString: Feature = {
      properties: {
        'hello world': 'world',
        'Evil XSS Stuff': '<script>',
      },
      geometry: {
        type: 'LineString',
        coordinates: [[1, 2], [3, 4]],
      },
    };
    tooltipGenerator(lineString, layer);
    expect(bindTooltipSpy).toBeCalledWith(
      '<div>hello world: world</div><div>Evil XSS Stuff: &lt;script&gt;</div>',
      {
        permanent: false,
        sticky: true,
      },
    );
  });
  it('displays coordinates and properties for Points', () => {
    const layer: Layer = {
      bindTooltip(): void { /* Do nothing */ },
    };
    const bindTooltipSpy = jest.spyOn(layer, 'bindTooltip');
    const lineString: Feature = {
      properties: {
        'hello & world': 'world',
      },
      geometry: {
        type: 'Point',
        coordinates: [10, -30],
      },
    };
    tooltipGenerator(lineString, layer);
    expect(bindTooltipSpy).toBeCalledWith(
      '<div>Latitude: -30</div><div>Longitude: 10</div>'
      + '<div>hello &amp; world: world</div>',
      {
        permanent: false,
        sticky: true,
      },
    );
  });
});
