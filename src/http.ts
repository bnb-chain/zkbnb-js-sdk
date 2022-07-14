import axios, { AxiosInstance } from 'axios';

export class Http {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      url: baseUrl
    });
  }

  async req<T extends keyof API.IResponseMap, P extends keyof API.IReqParmsMap>(
    api: T,
    params?: API.IReqParmsMap[P]
  ): Promise<API.IResponseMap[T]> {
    const [method, url] = api.split(' ');

    const response = await this.client.request({
      url,
      method,
      params
    });

    return response.data;
  }
}
