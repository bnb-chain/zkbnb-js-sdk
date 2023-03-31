export type Data = string | FormData | Blob | ArrayBuffer | any;
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH';

export interface QueryConfig extends RequestInit {
  timeout?: number;
  baseURL?: string;
  [k: string]: any;
}

export type QueryData<T> = ReadableStream | Blob | ArrayBuffer | FormData | URLSearchParams | T;

export type RequestHook = (config: QueryConfig) => QueryConfig;
