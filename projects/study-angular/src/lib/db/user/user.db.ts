import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { FirestoreDbAdapter } from '../../../../../../src/modules/firebase/firestore-db.adapter';
import { User } from '../../../../../../src/entities/user/types';

@Injectable({
  providedIn: 'root',
})
export class NgUserDb extends FirestoreDbAdapter<User> {
  constructor() {
    super(firebase.firestore(), 'users');
  }
}
