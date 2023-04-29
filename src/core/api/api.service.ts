import { ColdObservableOnce } from '../types';
import { ApiAdapter } from './api.adapter';
import { ApiResponse } from './types';

export class ApiService {
  constructor(protected apiAdapter: ApiAdapter) {}

  sendSms(
    phoneNumber: string,
    message: string
  ): ColdObservableOnce<ApiResponse<void>> {
    return this.apiAdapter.post('sendSms', { phoneNumber, message });
  }
}
