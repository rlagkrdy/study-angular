import { Injectable } from '@angular/core';
import { FirebaseStorageAdapter } from '../../../../../../src/modules/firebase/firebase-storage.adapter';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import storage = firebase.storage;

@Injectable({
  providedIn: 'root',
})
export class NgUploadService extends FirebaseStorageAdapter {
  constructor() {
    super(storage());
  }
}
