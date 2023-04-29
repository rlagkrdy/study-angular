import { ColdObservableOnce } from '../types';
import { ApiAdapter } from './api.adapter';
import { ApiResponse } from './types';


export class AdminApiService {
  constructor(
    protected apiAdapter: ApiAdapter
  ) {}

  bigquery(countQuery: string, query: string): ColdObservableOnce<ApiResponse<{ count: number, docs: any[] }>> {
    return this.apiAdapter.post('bigquery', { countQuery, query });
  }
}
