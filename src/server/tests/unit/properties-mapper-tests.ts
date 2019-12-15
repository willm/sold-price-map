import test from 'tape-async';
import {Property, PropertiesResponse} from '../../../common/properties';

function mapProperties(properties: Property[]): PropertiesResponse {
  return {
    priceBands: [
      {
        properties,
        range: '95% - 100%'
      }
    ]
  };
}

test('a single property is returned as the highest price band', async assert => {
  const property: Property = {
    coordinates: {x: 0, y: 0},
    price: 400000
  };

  const response: PropertiesResponse = mapProperties([property]);

  assert.equal(response.priceBands.length, 1, 'there is one price band');
  const priceBand = response.priceBands[0];
  assert.equal(priceBand.range, '95% - 100%', 'is in the top price range');
  assert.deepEqual(priceBand.properties, [property], 'price band contains property');
});
