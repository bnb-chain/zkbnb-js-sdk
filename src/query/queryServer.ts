import { QueryClient } from './query';
import { ResponseData } from './response';
import { HttpMethod, QueryConfig } from './type';

type QueryData<T> = ReadableStream | Blob | ArrayBuffer | URLSearchParams | T;

function isPureObject(input: unknown) {
  // eslint-disable-next-line no-prototype-builtins -- off
  return input !== null && typeof input === 'object' && Object.getPrototypeOf(Object).isPrototypeOf(Object);
}

export class QueryServer extends QueryClient {
  protected fetchWithData<RequestData, ResponseType>(
    method: HttpMethod,
    url: string,
    data?: QueryData<RequestData>,
    config?: QueryConfig
  ): Promise<ResponseData<ResponseType>> {
    let body: BodyInit;
    if (isPureObject(data)) {
      body = JSON.stringify(data);
    } else if (
      data instanceof ReadableStream ||
      data instanceof ArrayBuffer ||
      data instanceof URLSearchParams ||
      data instanceof Blob
    ) {
      body = data;
    } else {
      body = JSON.stringify(data);
    }

    return this.fetchWithTimeout<ResponseType>(url, { ...config, method, body });
  }
}
