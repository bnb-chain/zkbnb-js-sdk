import { QueryClient } from './query';
import { HttpMethod } from './type';

type QueryData<T> = ReadableStream | Blob | ArrayBuffer | URLSearchParams | T;

function isPureObject(input: unknown) {
  // eslint-disable-next-line no-prototype-builtins -- off
  return input !== null && typeof input === 'object' && Object.getPrototypeOf(Object).isPrototypeOf(Object);
}

export class QueryServer extends QueryClient {
  protected fetchWithData<ReqData, ResData>(
    method: HttpMethod,
    url: string,
    data?: QueryData<ReqData>,
    config?: RequestInit
  ) {
    let body: BodyInit | null = null;
    if (isPureObject(data)) {
      body = JSON.stringify(data);
    } else if (
      data instanceof ReadableStream ||
      data instanceof ArrayBuffer ||
      data instanceof URLSearchParams ||
      data instanceof Blob
    ) {
      body = data;
    } else if (data != null) {
      body = data.toString();
    }

    return this.fetchWithTimeout(url, { ...config, method, body }) as Promise<ResData>;
  }
}
