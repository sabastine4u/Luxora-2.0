import type { AxiosRequestConfig } from 'axios';

export interface HttpClient {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T>;


  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T>;

  request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<T>;
}

export class ApiError extends Error {
  status: number | null;
  code: string | null;
  errors: unknown;
  isNetwork: boolean;
  isCancel: boolean;

  constructor(options: {
    message: string;
    status?: number | null;
    code?: string | null;
    errors?: unknown;
    isNetwork?: boolean;
    isCancel?: boolean;
  });
}

declare const http: HttpClient;

export default http;