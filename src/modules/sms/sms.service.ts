import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { HotObservableOnce } from '../../core/types';
import { makeHot } from '../../core/utils';


export class SmsService {
  constructor(
    protected apiService: ApiService
  ) {}

  send(phoneNumber: string, message: string): HotObservableOnce<void> {
    const observable = this.apiService.sendSms(phoneNumber, message).pipe(
      map(response => response.data)
    );

    return makeHot(observable);
  }
}
