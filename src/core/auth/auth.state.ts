import { User } from '../../entities/user/types';


export interface AuthState {
  authLoaded: boolean;
  isLoggedIn: boolean;
  dbLoaded: boolean;
  user: User;
}

export const authStoreInitialValue: AuthState = {
  authLoaded: false,
  isLoggedIn: false,
  dbLoaded: false,
  user: null
};

export const authStoreLoggedInValue: AuthState = {
  authLoaded: true,
  isLoggedIn: true,
  dbLoaded: false,
  user: null
};

export const authStoreDbLoadedValue: AuthState = {
  authLoaded: true,
  isLoggedIn: true,
  dbLoaded: true,
  user: null
};

export const authStoreNotLoggedInValue: AuthState = {
  authLoaded: true,
  isLoggedIn: false,
  dbLoaded: false,
  user: null
};
