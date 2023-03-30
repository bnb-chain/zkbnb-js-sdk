import { merge } from 'lodash-es';
import { ResponseData, ResponseHook } from './response';
import { ResponseError, TimeoutError } from './errors';
import { HttpMethod, QueryConfig, QueryData, RequestHook } from './type';

export class QueryClient {
  protected defaultConfig: QueryConfig = {};

  protected requestHooks: RequestHook[] = [];

  protected responseHooks: [ResponseHook?, ResponseHook?][] = [];

  constructor(config: QueryConfig) {
    this.defaultConfig = config;
  }

  static createTimeout(duration: number) {
    return new Promise<never>((_, reject) => {
      setTimeout(() => reject(new TimeoutError('request timeout')), duration);
    });
  }

  protected fetchWithTimeout<ResponseType = any>(
    url: string,
    config: QueryConfig
  ): Promise<ResponseData<ResponseType>> {
    const timeout = config.timeout || this.defaultConfig.timeout;
    const fullUrl = (config.baseURL || this.defaultConfig.baseURL) + url;

    let mergedConfig = merge({}, this.defaultConfig, config);

    mergedConfig = this.requestHooks.reduce((acc, curFn) => curFn(acc), mergedConfig);

    const fetchPromise = fetch(fullUrl, mergedConfig).then(async (response) => {
      let newResponse: Promise<ResponseData<ResponseType>>;
      if (response.status === 200) {
        newResponse = ResponseData.getResponseData(response, mergedConfig);
      } else {
        newResponse = Promise.reject(
          new ResponseError(response.statusText, await ResponseData.getResponseData(response, mergedConfig))
        );
      }

      for (const hooks of this.responseHooks) {
        newResponse = newResponse.then(hooks[0], hooks[1]);
      }
      return newResponse;
    });

    if (timeout) {
      return Promise.race([QueryClient.createTimeout(timeout), fetchPromise]);
    }

    return fetchPromise;
  }

  protected fetchWithUrl<ResponseType>(method: HttpMethod, url: string, config?: RequestInit) {
    return this.fetchWithTimeout<ResponseType>(url, { ...config, method });
  }

  protected fetchWithData<RequestData, ResponseType>(
    method: HttpMethod,
    url: string,
    data?: QueryData<RequestData>,
    config?: QueryConfig
  ): Promise<ResponseData<ResponseType>> {
    let body: BodyInit;
    if (
      data instanceof ReadableStream ||
      data instanceof Blob ||
      data instanceof ArrayBuffer ||
      data instanceof FormData ||
      data instanceof URLSearchParams
    ) {
      body = data;
    } else {
      body = JSON.stringify(data);
    }

    return this.fetchWithTimeout<ResponseType>(url, { ...config, method, body });
  }

  addRequestHook(requestHook: (config: QueryConfig) => QueryConfig) {
    this.requestHooks.push(requestHook);
  }

  addResponseHook(successHook: ResponseHook, errorHook?: ResponseHook) {
    this.responseHooks.push([successHook, errorHook]);
  }

  get<ResponseType>(url: string, config?: QueryConfig): Promise<ResponseData<ResponseType>> {
    return this.fetchWithUrl<ResponseType>('GET', url, config);
  }

  post<RequestData, ResponseType>(
    url: string,
    data?: QueryData<RequestData>,
    config?: QueryConfig
  ): Promise<ResponseData<ResponseType>> {
    return this.fetchWithData<RequestData, ResponseType>('POST', url, data, config);
  }

  put<RequestData, ResponseType>(
    url: string,
    data?: QueryData<RequestData>,
    config?: QueryConfig
  ): Promise<ResponseData<ResponseType>> {
    return this.fetchWithData<RequestData, ResponseType>('PUT', url, data, config);
  }
}
