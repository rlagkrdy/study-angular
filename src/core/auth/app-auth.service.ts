import { tap, switchMap, map } from 'rxjs/operators';
import { User } from '../../entities/user/types';
import { UserService } from '../../entities/user/user.service';
import { AppApiService } from '../api/app-api.service';
import { StoreAdapter } from '../store/store.adapter';
import { HotObservableOnce, ColdObservableOnce } from '../types';
import { AuthAdapter } from './auth.adapter';
import { AuthService } from './auth.service';
import {
  AuthState,
  authStoreNotLoggedInValue,
  authStoreDbLoadedValue,
} from './auth.state';
import { DbListResponse } from '../db/types';

export class AppAuthService extends AuthService {
  constructor(
    protected override auth: AuthAdapter,
    protected override userService: UserService,
    protected override authStore: StoreAdapter<AuthState>,
    protected apiService: AppApiService
  ) {
    super(auth, userService, authStore);
  }

  sendVerificationCode(phoneNumber: string): HotObservableOnce<void> {
    return this.apiService
      .sendVerificationCode(phoneNumber)
      .pipe(map(() => {}));
  }

  checkVerificationCode(
    phoneNumber: string,
    code: string
  ): HotObservableOnce<void> {
    return this.apiService
      .checkVerificationCode(phoneNumber, code)
      .pipe(map(() => {}));
  }

  signUp(
    email: string,
    password: string,
    userInfo: Partial<User>
  ): ColdObservableOnce<User> {
    return this.auth.signUpWithEmail(email, password).pipe(
      switchMap((session) =>
        this.userService.add({ ...userInfo, email, id: session.userId })
      ),
      tap((user) => this.authStore.update({ ...authStoreDbLoadedValue, user }))
    );
  }

  updatePassword(
    currentPassword: string,
    newPassword: string
  ): HotObservableOnce<void> {
    return this.userOnce.pipe(
      switchMap((user) =>
        this.auth.reauthenticateWithPassword(user.email, currentPassword)
      ),
      switchMap(() => this.auth.updatePassword(newPassword))
    );
  }

  checkUserByEmail(email: string): ColdObservableOnce<User> {
    return this.userService
      .list({
        filters: [{ field: 'email', comparison: '==', value: email }],
      })
      .pipe(map((response: DbListResponse<User>) => response.docs[0]));
  }

  checkUserByEmailAndPhoneNumber(
    email: string,
    phoneNumber: string
  ): ColdObservableOnce<User> {
    return this.userService
      .list({
        filters: [
          { field: 'email', comparison: '==', value: email },
          { field: 'phoneNumber', comparison: '==', value: phoneNumber },
        ],
      })
      .pipe(map((response: DbListResponse<User>) => response.docs[0]));
  }

  findEmail(phoneNumber: string): ColdObservableOnce<User> {
    return this.userService
      .list({
        filters: [
          { field: 'phoneNumber', comparison: '==', value: phoneNumber },
        ],
      })
      .pipe(map((response: DbListResponse<User>) => response.docs[0]));
  }

  // findPassword(email: string, phoneNumber: string): ColdObservableOnce<boolean> {
  //   return this.userService.checkEmailAndPhoneNumber(email, phoneNumber).pipe(
  //     tap(checked => {
  //       if (checked) {
  //         this.auth.sendPasswordResetEmail(email);
  //       }
  //     })
  //   );
  // }

  update(userUpdate: Partial<User>): HotObservableOnce<void> {
    if (!this.user) {
      throw new Error('로그인 되어있지 않습니다');
    }

    return this.userService.update(this.user.id, userUpdate);
  }

  override logout(): HotObservableOnce<void> {
    return this.auth
      .logout()
      .pipe(tap(() => this.authStore.update(authStoreNotLoggedInValue)));
  }

  withdraw(): HotObservableOnce<void> {
    return this.apiService
      .withdraw(this.user.id)
      .pipe(switchMap(() => this.logout()));
  }
}
