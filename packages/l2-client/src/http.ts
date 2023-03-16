import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as API from './api';

export class Http {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
    });
  }

  async req<T extends API.URL_INFO>(api: T, params: API.IReqParmsMap[T]): Promise<API.IResponseMap[T]> {
    const [method, url] = api.split(' ') as ['GET' | 'POST', string];

    let response = { data: null };

    if (method === 'GET') {
      response = await this.client.get(url, {
        params,
      });
    }

    if (method === 'POST') {
      response = await this.client.post(url, null, {
        params,
      });
    }

    return (response as AxiosResponse).data;
  }
}
