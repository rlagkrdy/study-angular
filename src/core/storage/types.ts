import { ColdObservable, ColdObservableOnce } from '../types';


export interface UploadTask {
  filePath: string;
  pause(): boolean;
  resume(): boolean;
  cancel(): boolean;
  percentageChange(): ColdObservable<number>;
  getDownloadURL(): ColdObservableOnce<string>;
}
