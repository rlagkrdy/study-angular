import { ColdObservableOnce } from '../types';
import { ApiAdapter } from './api.adapter';
import { ApiService } from './api.service';
import { ApiResponse } from './types';

export class AppApiService extends ApiService {
  constructor(protected override apiAdapter: ApiAdapter) {
    super(apiAdapter);
  }

  sendVerificationCode(
    phoneNumber: string
  ): ColdObservableOnce<ApiResponse<void>> {
    return this.apiAdapter.post('sendVerificationCode', { phoneNumber });
  }

  checkVerificationCode(
    phoneNumber: string,
    code: string
  ): ColdObservableOnce<ApiResponse<void>> {
    return this.apiAdapter.post('checkVerificationCode', { phoneNumber, code });
  }

  withdraw(userId: string): ColdObservableOnce<ApiResponse<void>> {
    return this.apiAdapter.post('withdraw', { userId });
  }
}
