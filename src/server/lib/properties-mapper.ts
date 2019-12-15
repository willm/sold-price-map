import {Property, PropertiesResponse} from '../../common/properties';

interface PriceRange {
  lowerLimit: number;
  upperLimit: number;
  properties: Property[];
}

export function mapProperties(properties: Property[]): PropertiesResponse {
  const highestPrice = properties.reduce(
    (price, property) => Math.max(property.price, price),
    0
  );

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
