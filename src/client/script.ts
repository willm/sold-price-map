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
  const highestX: number = allProperties.reduce(
    (x, p: Property) => Math.max(p.coordinates.x, x),
    0
  );
  const highestY: number = allProperties.reduce(
    (y, p: Property) => Math.max(p.coordinates.y, y),
    0
  );
  const highestCoorinate: Coordinates = {x: highestX, y: highestY};
  const drawProperty = propertyRenderer(canvas, highestCoorinate);
  data.priceBands.forEach(band => {
    band.properties.forEach(p => {
      drawProperty(p, band.range);
    });
  });
}

main();
