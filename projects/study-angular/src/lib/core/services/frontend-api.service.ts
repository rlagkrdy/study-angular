import { Injectable } from '@angular/core';
import { FrontendApiService } from '../../../../../../src/core/api/frontend-api.service';
import { NgFrontendApiAdapter } from './frontend-api.adapter';

@Injectable({
  providedIn: 'root',
})
export class NgFrontendApiService extends FrontendApiService {
  constructor(
    protected frontendApiAdapter: NgFrontendApiAdapter
  ) {
    super(frontendApiAdapter);
  }
}
