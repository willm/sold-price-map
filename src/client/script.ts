import {PropertiesResponse, Property} from '../common/properties/index';

export async function main() {
  function drawProperty(c: CanvasRenderingContext2D, property: Property) {
    c.fillStyle = 'black';
    c.beginPath();
    c.arc(property.coordinates.x, property.coordinates.y, 2, 0, Math.PI * 2, true);
    c.fill();
  }

  async function getProperties() {
    /*const response: PropertiesResponse = {
      priceBands: [
        {
          name: 'foo',
          properties:[
            {
              coordinates: {
                x: 101,
                y: 50
              },
              price: 500000
            },
            {
              coordinates: {
                x: 50,
                y: 75
              },
              price: 500000
            }
          ]
        }
      ]
    };
    return await Promise.resolve(response);*/
    const response = await fetch('http://localhost:3000/properties');
    return response.json();
  }

  const canvas = document.getElementById('plot') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const data =  await getProperties();

  data.priceBands.forEach(band => {
    band.properties.forEach(p => {
      // tslint:disable-next-line: no-console
      console.log(p);
      drawProperty(ctx, p);
    });
  });
}

main();
