import { UserService } from '../../entities/user/user.service';
import { StoreAdapter } from '../store/store.adapter';
import { AuthAdapter } from './auth.adapter';
import { AuthService } from './auth.service';
import { AuthState } from './auth.state';


export class AdminAuthService extends AuthService {
  constructor(
    protected auth: AuthAdapter,
    protected userService: UserService,
    protected authStore: StoreAdapter<AuthState>
  ) {
    super(auth, userService, authStore);
  }
}
