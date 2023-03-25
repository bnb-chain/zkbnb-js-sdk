import Axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export class HttpTransport {
    public constructor(public endpoint: string) {
        this.endpoint = endpoint;
    }

    async request(
        path: string,
        method: Method = 'GET',
        params?: any,
        customConfig?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
        const config: AxiosRequestConfig = {
            baseURL: this.endpoint,
            url: path,
            method,
            data: params,
            ...customConfig
        };

        const response = await Axios.request(config).then((resp) => {
            return resp.data;
        });

        return response;
    }

    async disconnect() {
        return null;
    }
}
