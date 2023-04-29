import { ColdObservable, HotObservableOnce, ColdObservableOnce } from '../types';
import { AuthSession } from './types';

export interface AuthAdapter {
  sessionChange(): ColdObservable<AuthSession>;
  signUpWithEmail(email: string, password: string): HotObservableOnce<AuthSession>;
  loginWithEmail(email: string, password: string): HotObservableOnce<AuthSession>;
  logout(): HotObservableOnce<void>;
  sendPasswordResetEmail(email: string): HotObservableOnce<void>;
  reauthenticateWithPassword(email: string, password: string): ColdObservableOnce<AuthSession>;
  updatePassword?(newPassword: string): HotObservableOnce<void>;
  withdraw(): HotObservableOnce<void>;
}
