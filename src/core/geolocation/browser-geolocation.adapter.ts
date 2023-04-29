import { throwError, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ColdObservableOnce, ColdObservable } from '../types';
import { GeolocationAdapter } from './geolocation.adapter';
import { GeolocationOptions, GeolocationPosition } from './types';

// TODO: browserGeolocation omh
export class BrowserGeolocationAdapter implements GeolocationAdapter {
  getCurrentPosition(options?: GeolocationOptions): ColdObservableOnce<GeolocationPosition> {
    return new Observable(subscriber => {
      if (!('geolocation' in navigator)) {
        subscriber.error(new Error('지오로케이션을 사용할 수 없습니다.'));
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          subscriber.next(position);
          subscriber.complete();
        },
        err => {
          subscriber.error(err);
        },
        options
      );
    });
  }

  watchPosition(options?: GeolocationOptions): ColdObservable<GeolocationPosition> {
    if (!('geolocation' in navigator)) {
      return throwError(new Error('지오로케이션을 사용할 수 없습니다.'));
    }

    const subject = new Subject<GeolocationPosition>();

    const watchId = navigator.geolocation.watchPosition(
      position => {
        subject.next(position);
      },
      err => {
        subject.error(err);
      },
      options
    );

    return subject.asObservable().pipe(
      finalize(() => navigator.geolocation.clearWatch(watchId))
    );
  }
}
