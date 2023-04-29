import { Injectable } from '@angular/core';
import { FunctionsApiAdapter } from '../../../../../../src/modules/firebase/functions-api.adapter';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class NgFrontendApiAdapter extends FunctionsApiAdapter {
  constructor() {
    super(firebase.app().functions('asia-northeast3'));
  }
}
