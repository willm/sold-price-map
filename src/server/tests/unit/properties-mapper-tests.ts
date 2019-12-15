import test from 'tape-async';
import {
  Property,
  PropertiesResponse,
  PriceBand,
} from '../../../common/properties';

interface PriceRange {
  lowerLimit: number;
  upperLimit: number;
  properties: Property[];
}

function mapProperties(properties: Property[]): PropertiesResponse {
  const highestPrice = properties.reduce((price, property) => Math.max(property.price, price), 0);

  const ranges: PriceRange[] = [
    {lowerLimit: 95, upperLimit: 100, properties: []},
    {lowerLimit: 75, upperLimit: 95, properties: []},
    {lowerLimit: 25, upperLimit: 75, properties: []},
    {lowerLimit: 5, upperLimit: 25, properties: []},
    {lowerLimit: 0, upperLimit: 5, properties: []},
  ];

  properties.forEach((property: Property) => {
    const percentageOfHighestPrice = property.price / (highestPrice / 100);
    ranges.forEach(range => {
      if (
        percentageOfHighestPrice <= range.upperLimit &&
        percentageOfHighestPrice > range.lowerLimit
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

  assertPriceBandLength(assert, response.priceBands);
  const priceBand = response.priceBands[0];
  assert.equal(priceBand.range, '95% - 100%', 'is in the top price range');
  assertPropertyInBand(assert, property, priceBand);
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

  assertPriceBandLength(assert, response.priceBands);
  const highPriceBand = response.priceBands[0];
  assert.equal(highPriceBand.range, '95% - 100%', 'is in the top price range');
  assertPropertyInBand(assert, properties[0], highPriceBand);

  const lowPriceBand = response.priceBands[2];
  assert.equal(lowPriceBand.range, '25% - 75%', 'is in the low price range');
  assertPropertyInBand(assert, properties[1], lowPriceBand);
});

test('properties are mapped into all bands', async assert => {
  const properties: Property[] = [
    {
      coordinates: {x: 0, y: 0},
      price: 2000,
    },
    {
      coordinates: {x: 0, y: 0},
      price: 100000,
    },
    {
      coordinates: {x: 0, y: 0},
      price: 200000,
    },
    {
      coordinates: {x: 0, y: 0},
      price: 300001,
    },
    {
      coordinates: {x: 2, y: 3},
      price: 400000,
    },
  ];

  const response: PropertiesResponse = mapProperties(properties);

  assertPriceBandLength(assert, response.priceBands);
  const highPriceBand = response.priceBands[0];
  assert.equal(highPriceBand.range, '95% - 100%', 'is in the top price range');
  assertPropertyInBand(assert, properties[4], highPriceBand);

  const lowPriceBand = response.priceBands[2];
  assert.equal(lowPriceBand.range, '25% - 75%', 'is in the low price range');
  assertPropertyInBand(assert, properties[2], lowPriceBand);
});

function assertPropertyInBand(assert, property: Property, priceBand: PriceBand) {
  assert.deepEqual(
    priceBand.properties,
    [property],
    'price band contains property'
  );
}

function assertPriceBandLength(assert, priceBands) {
  assert.equal(priceBands.length, 5, 'there are five price bands');
}
