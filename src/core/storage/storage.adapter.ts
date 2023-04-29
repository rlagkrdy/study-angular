import { ColdObservableOnce } from '../types';
import { UploadTask } from './types';


export interface StorageAdapter {
  upload(data: File | Blob | string, dir?: string, fileName?: string): UploadTask;
  getDownloadURL(filePath: string): ColdObservableOnce<string>;
}
