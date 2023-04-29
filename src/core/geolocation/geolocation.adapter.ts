import { ColdObservableOnce, ColdObservable } from '../types';
import { GeolocationOptions, GeolocationPosition } from './types';


export interface GeolocationAdapter {
  getCurrentPosition(options?: GeolocationOptions): ColdObservableOnce<GeolocationPosition>;
  watchPosition(options?: GeolocationOptions): ColdObservable<GeolocationPosition>;
}
