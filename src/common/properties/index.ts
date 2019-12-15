interface Coordinates {
  x: number;
  y: number;
}

export interface Property {
  price: number;
  coordinates: Coordinates;
}

interface PriceBand {
  range: string;
  properties: Property[];
}

export interface PropertiesResponse {
  priceBands: PriceBand[];
}
