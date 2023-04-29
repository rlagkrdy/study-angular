export interface Coords {
  lat: number;
  lng: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number; // milliseconds
  timeout?: number; // milliseconds
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number
    altitude: number;
    accuracy: number
    altitudeAccuracy: number
    heading: number;
    speed: number
  };
  timestamp: number;
}
