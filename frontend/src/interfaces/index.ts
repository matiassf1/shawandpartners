export interface Person {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

export interface ApiUploadResponse {
  message: string;
  data: Person[];
}

export interface ApiSearchResponse {
  data: Person[];
}