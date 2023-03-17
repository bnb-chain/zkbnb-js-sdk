import Axios, {AxiosRequestConfig, AxiosResponse, Method} from 'axios';

export class HTTPTransport {
    public constructor(public baseEndpoint: string) {}

    async request(path, method: Method ='GET', params?: any, customConfig?: AxiosRequestConfig): Promise<AxiosResponse> {
        const config: AxiosRequestConfig = {
            baseURL: this.baseEndpoint,
            url: path,
            method,
            data: params,
            ...customConfig
        }

        const response = await Axios.request(config).then((resp) => {
            return resp.data;
        });

        return response;
    }

    async disconnect() {
        return null;
    }
}
