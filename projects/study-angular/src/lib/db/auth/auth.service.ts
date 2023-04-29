import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { FirebaseAuthAdapter } from '../../../../../../src/modules/firebase/firebase-auth.adapter';
import { AuthStore } from '../../../../../../src/core/auth/auth.store';
import { NgUserService } from '../user/user.service';
import { AppAuthService } from '../../../../../../src/core/auth/app-auth.service';
import { NgApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class NgAuthService extends AppAuthService {
  constructor(
      protected override userService: NgUserService,
      protected override apiService: NgApiService
  ) {
    super(
        new FirebaseAuthAdapter(firebase.auth()),
        userService,
        new AuthStore(),
        apiService
    );
  }
}
