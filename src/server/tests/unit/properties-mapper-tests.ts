import test from 'tape-async';
import {
  Property,
  PropertiesResponse,
} from '../../../common/properties';

interface PriceRange {
  lowerLimit: number;
  upperLimit: number;
  properties: Property[];
}

function mapProperties(properties: Property[]): PropertiesResponse {
  const mostExpensivePrice = properties.reduce((price, property) => {
    return property.price > price ? property.price : price;
  }, 0);

  const ranges: PriceRange[] = [
    {lowerLimit: 95, upperLimit: 100, properties: []},
    {lowerLimit: 25, upperLimit: 75, properties: []},
  ];

  properties.forEach((property: Property) => {
    const percentageOfMostExpensiveProperty =
      property.price / (mostExpensivePrice / 100);
    ranges.forEach(range => {
      if (
        percentageOfMostExpensiveProperty <= range.upperLimit &&
        percentageOfMostExpensiveProperty >= range.lowerLimit
      ) {
        range.properties.push(property);
      }
    });
  });
  return {
    priceBands: ranges.map(range => ({
      properties: range.properties,
      range: `${range.lowerLimit}% - ${range.upperLimit}%`,
    })),
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
