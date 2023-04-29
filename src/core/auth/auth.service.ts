import { Observable, partition } from 'rxjs';
import { first, filter, tap, switchMap } from 'rxjs/operators';
import { User } from '../../entities/user/types';
import { UserService } from '../../entities/user/user.service';
import { StoreAdapter } from '../store/store.adapter';
import { HotObservableOnce } from '../types';
import { AuthAdapter } from './auth.adapter';
import { AuthState, authStoreLoggedInValue, authStoreDbLoadedValue, authStoreNotLoggedInValue } from './auth.state';
import { AuthSession } from './types';


export class AuthService {
  state$: Observable<AuthState> = this.authStore.select(state => state);
  userOnce = this.authStore.select(state => state.user as User).pipe(first<User>(Boolean));
  user$: Observable<User> = this.authStore.select(state => state.user as User).pipe(filter<User>(Boolean));
  isLoggedIn$: Observable<boolean> = this.authStore.select(state => state.isLoggedIn);

  constructor(
    protected auth: AuthAdapter,
    protected userService: UserService,
    protected authStore: StoreAdapter<AuthState>
  ) {}

  get user(): User {
    const user = this.authStore.getValue().user as User;

    if (!user) {
      throw new Error('로그인되어 있지 않습니다.');
    }

    return user;
  }

  get isLoggedIn(): boolean {
    return this.authStore.getValue().isLoggedIn;
  }

  init(): void {
    const [loggedIn$, notLoggedIn$] = partition<AuthSession>(
      this.auth.sessionChange(),
      Boolean
    );

    loggedIn$.pipe(
      tap(() => this.authStore.update(authStoreLoggedInValue)),
      switchMap((authSession: AuthSession) => this.userService.getChange(authSession.userId))
    ).subscribe(user => {
      this.authStore.update({ ...authStoreDbLoadedValue, user });
    });

    notLoggedIn$.subscribe((res) => {
      this.authStore.update(authStoreNotLoggedInValue);
    });
  }

  login(email: string, password: string): HotObservableOnce<User> {
    return this.auth.loginWithEmail(email, password).pipe(
      switchMap(() => this.userOnce)
    );
  }

  logout(): HotObservableOnce<void> {
    return this.auth.logout().pipe(
      tap(() => this.authStore.update(authStoreNotLoggedInValue))
    );
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return '이미 가입되어있는 이메일입니다.';
      case 'auth/user-mismatch':
        return '로그인 방법이 잘못되었습니다. 다른 방법으로 로그인해 주세요.';
      case 'auth/user-not-found':
        return '유저 정보를 찾을 수 없습니다.';
      case 'auth/invalid-credential':
        return 'SNS 로그인에 실패하였습니다. 다시 시도해주세요.';
      case 'auth/invalid-email':
        return '이메일이 잘못되었습니다. 다시 확인해 주세요.';
      case 'auth/wrong-password':
        return '패스워드가 틀렸습니다. 다시 확인해 주세요.';
      case 'auth/invalid-verification-code':
        return '인증코드가 틀렸습니다. 다시 확인해 주세요.';
      case 'auth/invalid-verification-id':
        return '인증이 실패하였습니다. 다시 시도해주세요.';
      case 'auth/account-exists-with-different-credential':
        return '이미 다른 로그인 방법으로 회원가입이 되어 있습니다.';
      case 'permission-denied':
        return '이미 탈퇴한 회원입니다.';
      case 'auth/credential-already-in-use':
        return '이미 다른 로그인 방법으로 가입되어 있습니다.';
      case 'auth/popup-closed-by-user':
      case 'auth/user-cancelled':
        return null;
    }

    return '알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.';
  }
}
