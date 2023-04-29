export interface ApiOptions {
  headers?: { [header: string]: string | string[]; };
  params?: { [param: string]: string | string[]; };
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message?: string;
  data: T;
}
