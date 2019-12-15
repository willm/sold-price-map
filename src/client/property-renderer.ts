import {
  Coordinates,
  Property
} from '../common/properties/index';

const colours = [
  {range: '0% - 5%', colour: '#fac358'},
  {range: '5% - 25%', colour: '#d28f33'},
  {range: '25% - 75%', colour: '#c95f2a'},
  {range: '75% - 95%', colour: '#a72023'},
  {range: '95% - 100%', colour: '#751a33'},
];

export function propertyRenderer(canvas: HTMLCanvasElement, maxCoordinate: Coordinates) {
  const ctx = canvas.getContext('2d');
  return (property: Property, range: string) => {
    const colourForRange = colours.find(colour => colour.range === range);
    // todo: using the range string is not great here, maybe each range should have an id instead
    ctx.fillStyle = colourForRange ? colourForRange.colour : '#000';
    const xPos = Math.floor(property.coordinates.x * (canvas.width / maxCoordinate.x));
    const yPos = Math.floor(property.coordinates.y * (canvas.height / maxCoordinate.y));

    ctx.beginPath();
    ctx.fillRect(xPos, yPos, 1 * window.devicePixelRatio, 1 * window.devicePixelRatio);
    ctx.fill();
  };
}
