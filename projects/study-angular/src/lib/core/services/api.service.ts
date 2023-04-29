import { Injectable } from '@angular/core';
import { NgApiAdapter } from './api.adapter';
import { AppApiService } from '../../../../../../src/core/api/app-api.service';

@Injectable({
  providedIn: 'root',
})
export class NgApiService extends AppApiService {
  constructor(protected override apiAdapter: NgApiAdapter) {
    super(apiAdapter);
  }
}
