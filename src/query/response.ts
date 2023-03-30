import { Data, QueryConfig } from './type';

export class ResponseData<T = Data> extends Response {
  config: QueryConfig;

  data: T;

  constructor(response: Response, config: QueryConfig, data: T) {
    const { body, ...option } = response;
    super(data ? null : body, option);
    this.config = config;
    this.data = data;
  }

  static async getResponseData<T = any>(response: Response, config: QueryConfig) {
    const contentType = response.headers.get('content-type') || '';
    let data: any = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('multipart/form-data')) {
      data = await response.formData();
    } else if (contentType.includes('text/plain')) {
      data = await response.text();
    } else if (contentType.includes('image')) {
      data = await response.blob();
    } else if (contentType.includes('application/octet-stream')) {
      data = await response.arrayBuffer();
    }
    return new ResponseData<T>(response, config, data);
  }
}

export type ResponseReturn = Promise<ResponseData> | ResponseData;

export type ResponseHook = (response: ResponseData) => ResponseReturn;
