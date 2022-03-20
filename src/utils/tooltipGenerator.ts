export interface Feature {
  geometry: {
    type: 'Point'|'LineString';
    coordinates: [number, number]|[number, number][];
  }
  properties: Record<string, string>;
}

export interface Layer {
  bindTooltip: (tooltip: string, options: Record<string, boolean>) => void;
}

const str2html = (input: string): string => {
  let output = input.replace(/&/g, '&amp;');
  output = output.replace(/</g, '&lt;');
  output = output.replace(/>/g, '&gt;');
  return output;
};

export default (feature: Feature, layer: Layer) => {
  let tooltip = '';
  if (feature.geometry.type === 'Point') {
    tooltip += `<div>Latitude: ${str2html(feature.geometry.coordinates[1].toString())}</div>`;
    tooltip += `<div>Longitude: ${str2html(feature.geometry.coordinates[0].toString())}</div>`;
  }
  Object.entries(feature.properties).forEach(([key, value]) => {
    tooltip += `<div>${str2html(key)}: ${str2html(value)}</div>`;
  });
  layer.bindTooltip(
    tooltip,
    {
      permanent: false,
      sticky: true,
    },
  );
};
