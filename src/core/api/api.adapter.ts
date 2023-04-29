import { ColdObservableOnce } from '../types';
import { ApiResponse, ApiOptions } from './types';


export interface ApiAdapter {
  get<T = any>(path: string, options?: ApiOptions): ColdObservableOnce<ApiResponse<T>>;
  post<T = any, D = any>(path: string, data: D, options?: ApiOptions): ColdObservableOnce<ApiResponse<T>>;
  put<T = any, D = any>(path: string, data: D, options?: ApiOptions): ColdObservableOnce<ApiResponse<T>>;
  delete<T = any>(path: string, options?: ApiOptions): ColdObservableOnce<ApiResponse<T>>;
}
