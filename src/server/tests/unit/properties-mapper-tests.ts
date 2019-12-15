import test from 'tape-async';
import {
  Property,
  PropertiesResponse,
  PriceBand,
} from '../../../common/properties';

interface PriceBandGroup {
  low: PriceBand;
  high: PriceBand;
}

function mapProperties(properties: Property[]): PropertiesResponse {
  const mostExpensivePrice = properties.reduce((price, property) => {
    return property.price > price ? property.price : price;
  }, 0);
  const propertiesByPriceBand: PriceBandGroup = properties.reduce(
    (priceBands: PriceBandGroup, property: Property) => {
      const percentageOfMostExpensiveProperty =
        property.price / (mostExpensivePrice / 100);
      if (percentageOfMostExpensiveProperty < 75) {
        priceBands.low.properties.push(property);
      } else {
        priceBands.high.properties.push(property);
      }
      return priceBands;
    },
    {
      low: {range: '25% - 75%', properties: []},
      high: {range: '95% - 100%', properties: []},
    }
  );
  return {
    priceBands: [propertiesByPriceBand.high, propertiesByPriceBand.low],
  };
}

test('a single property is returned as the highest price band', async assert => {
  const property: Property = {
    coordinates: {x: 0, y: 0},
    price: 400000,
  };

  const response: PropertiesResponse = mapProperties([property]);

  assert.equal(response.priceBands.length, 2, 'there are two price bands');
  const priceBand = response.priceBands[0];
  assert.equal(priceBand.range, '95% - 100%', 'is in the top price range');
  assert.deepEqual(
    priceBand.properties,
    [property],
    'price band contains property'
  );
});

test('a property valued at half the price should appear in the 50% price band', async assert => {
  const properties: Property[] = [
    {
      coordinates: {x: 0, y: 0},
      price: 400000,
    },
    {
      coordinates: {x: 2, y: 3},
      price: 200000,
    },
  ];

  const response: PropertiesResponse = mapProperties(properties);

  assert.equal(response.priceBands.length, 2, 'there are two price bands');
  const highPriceBand = response.priceBands[0];
  assert.equal(highPriceBand.range, '95% - 100%', 'is in the top price range');
  assert.deepEqual(
    highPriceBand.properties,
    [properties[0]],
    'price band contains property'
  );

  const lowPriceBand = response.priceBands[1];
  assert.equal(lowPriceBand.range, '25% - 75%', 'is in the low price range');
  assert.deepEqual(
    lowPriceBand.properties,
    [properties[1]],
    'price band contains property'
  );
});
