import axios, { AxiosInstance } from 'axios';
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

    const config: Config = {
      url,
      method,
    };

    if (isGetConfig<API.IReqParmsMap[T]>(config)) {
      config.params = params;
    } else if (isPostConfig<API.IReqParmsMap[T]>(config)) {
      config.data = params;
    }

    const response = await this.client.request(config);

    return response.data;
  }
}

interface GetConfig<T> extends Config {
  params: T;
}

interface PostConfig<T> extends Config {
  data: T;
}

type Config = {
  url: string;
  method: 'POST' | 'GET';
};

function isGetConfig<T>(config: Config): config is GetConfig<T> {
  return config.method === 'GET';
}

function isPostConfig<T>(config: Config): config is PostConfig<T> {
  return config.method === 'POST';
}
