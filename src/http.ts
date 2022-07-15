import axios, { AxiosInstance } from 'axios';

export class Http {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      url: baseUrl
    });
  }

  async req<T extends API.URL_INFO>(api: T, params: API.IReqParmsMap[T]): Promise<API.IResponseMap[T]> {
    const [method, url] = api.split(' ');

    const response = await this.client.request({
      url,
      method,
      params
    });

    return response.data;
  }
}
