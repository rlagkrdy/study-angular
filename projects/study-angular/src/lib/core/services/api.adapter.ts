import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { FunctionsApiAdapter } from '../../../../../../src/modules/firebase/functions-api.adapter';
import app = firebase.app;
import { environment } from '../../../../../app/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NgApiAdapter extends FunctionsApiAdapter {
  constructor() {
    super(app().functions('asia-northeast3'));
  }
}
