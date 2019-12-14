interface Coordinates {
  x: number;
  y: number;
}

interface Property {
  price: number;
  coordinates: Coordinates;
}

interface PriceBand {
  name: string;
  properties: Property[];
}

export interface PropertiesResponse {
  priceBands: PriceBand[];
}
