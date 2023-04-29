import firebase from 'firebase/compat/app';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiAdapter } from '../../core/api/api.adapter';
import { ApiOptions, ApiResponse } from '../../core/api/types';
import { ColdObservableOnce } from '../../core/types';

export class FunctionsApiAdapter implements ApiAdapter {
  constructor(protected functions: firebase.functions.Functions) {
    //functions.useEmulator('localhost', 5001);
  }

  get<T = any>(
      path: string,
      options?: ApiOptions
  ): ColdObservableOnce<ApiResponse<T>> {
    throw new Error('사용할 수 없습니다');
  }

  post<T = any, D = any>(
      path: string,
      data: D,
      options?: ApiOptions
  ): ColdObservableOnce<ApiResponse<T>> {
    return from(this.functions.httpsCallable(path)(data)).pipe(
        map((response) => {
          return {
            statusCode: 200,
            data: response.data,
          };
        }),
        catchError((err) => {
          return throwError({
            statusCode: 500,
            message: err.message,
            data: null,
          });
        })
    );
  }

  put<T = any, D = any>(
      path: string,
      data: D,
      options?: ApiOptions
  ): ColdObservableOnce<ApiResponse<T>> {
    throw new Error('사용할 수 없습니다');
  }

  delete<T = any>(
      path: string,
      options?: ApiOptions
  ): ColdObservableOnce<ApiResponse<T>> {
    throw new Error('사용할 수 없습니다');
  }
}
