import {
  PropertiesResponse,
  Property,
  Coordinates,
} from '../common/properties/index';
import {propertyRenderer} from './property-renderer';

export async function main() {
  async function getProperties(): Promise<PropertiesResponse> {
    const response = await fetch('http://localhost:3000/properties');
    return response.json();
  }

  const canvas = document.getElementById('plot') as HTMLCanvasElement;
  const data = await getProperties();

  const allProperties = data.priceBands.reduce(
    (properties, p) => properties.concat(p.properties),
    []
  );
  const highestCoorinate: Coordinates = allProperties.reduce(
    (coordinate, property: Property) => {
      return {
        x: Math.max(coordinate.x, property.coordinates.x),
        y: Math.max(coordinate.y, property.coordinates.y),
      };
    },
    {x: 0, y: 0}
  );
  const drawProperty = propertyRenderer(canvas, highestCoorinate);
  data.priceBands.forEach(band => {
    band.properties.forEach(p => {
      drawProperty(p, band.range);
    });
  });
}

main();
