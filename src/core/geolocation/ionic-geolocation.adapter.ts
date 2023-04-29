import { from } from 'rxjs';
import { ColdObservableOnce, ColdObservable } from '../types';
import { GeolocationAdapter } from './geolocation.adapter';
import { GeolocationOptions, GeolocationPosition } from './types';
import { Geolocation } from '@ionic-native/geolocation/ngx';

// TODO: IonicGeolocation omh
export class IonicGeolocationAdapter implements GeolocationAdapter {
  constructor(
    protected geolocation: Geolocation
  ) {}

  getCurrentPosition(options?: GeolocationOptions): ColdObservableOnce<GeolocationPosition> {
    return from(this.geolocation.getCurrentPosition(options));
  }

  watchPosition(options?: GeolocationOptions): ColdObservable<GeolocationPosition> {
    return this.geolocation.watchPosition(options) as ColdObservable<GeolocationPosition>;
  }
}
