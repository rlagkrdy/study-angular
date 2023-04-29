import { HotObservableOnce, ColdObservableOnce } from '../types';


export interface NotifierAdapter {
  info(message: string, duration?: number): HotObservableOnce<void>;
  success(message: string, duration?: number): HotObservableOnce<void>;
  warning(message: string, duration?: number): HotObservableOnce<void>;
  error(message: string, error?: Error, duration?: number): HotObservableOnce<void>;
  confirm?(message: string): ColdObservableOnce<boolean>;
  prompt?(message: string): ColdObservableOnce<string>;
}
