import firebase from 'firebase/compat/app';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthAdapter } from '../../core/auth/auth.adapter';
import { AuthSession } from '../../core/auth/types';
import {
  HotObservableOnce,
  ColdObservable,
  ColdObservableOnce,
} from '../../core/types';

export class FirebaseAuthAdapter implements AuthAdapter {
  constructor(protected auth: firebase.auth.Auth) {}

  sessionChange(): ColdObservable<AuthSession> {
    return new Observable((subscriber) => {
      this.auth.onAuthStateChanged(
          (next) => subscriber.next(next),
          (err) => subscriber.error(err),
          () => subscriber.complete()
      );
    }).pipe(
        switchMap((firebaseUser: firebase.User) =>
            this.convertFirebaseUserToSession(firebaseUser)
        )
    );
  }

  signUpWithEmail(
      email: string,
      password: string
  ): HotObservableOnce<AuthSession> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
        switchMap((userCredential) =>
            this.convertFirebaseUserToSession(userCredential.user)
        )
    );
  }

  loginWithEmail(
      email: string,
      password: string
  ): HotObservableOnce<AuthSession> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
        switchMap((userCredential) =>
            this.convertFirebaseUserToSession(userCredential.user)
        )
    );
  }

  logout(): HotObservableOnce<void> {
    return from(this.auth.signOut());
  }

  sendPasswordResetEmail(email: string): HotObservableOnce<void> {
    return from(this.auth.sendPasswordResetEmail(email));
  }

  reauthenticateWithPassword(
      email: string,
      password: string
  ): ColdObservableOnce<AuthSession> {
    const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
    );

    return from(
        this.auth.currentUser.reauthenticateWithCredential(credential)
    ).pipe(
        switchMap((userCredential) =>
            this.convertFirebaseUserToSession(userCredential.user)
        )
    );
  }

  updatePassword(newPassword: string): HotObservableOnce<void> {
    return from(this.auth.currentUser.updatePassword(newPassword));
  }

  withdraw(): HotObservableOnce<void> {
    return from(this.auth.currentUser.delete());
  }

  private async convertFirebaseUserToSession(
      firebaseUser: firebase.User
  ): Promise<AuthSession> {
    if (firebaseUser) {
      const idTokenResult = await firebaseUser.getIdTokenResult();

      let lastLoggedInAt: Date;

      if (firebaseUser.metadata.lastSignInTime) {
        lastLoggedInAt = new Date(firebaseUser.metadata.lastSignInTime);
      }

      return {
        expireAt: new Date(idTokenResult.expirationTime),
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        profilePicture: firebaseUser.photoURL,
        lastLoggedInAt,
        authToken: idTokenResult.token,
        refreshToken: firebaseUser.refreshToken,
        userId: firebaseUser.uid,
      };
    } else {
      return null;
    }
  }
}
