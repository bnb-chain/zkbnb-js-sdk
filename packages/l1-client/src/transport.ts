import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from 'ethers';

export class HTTPTransport {
    public constructor(public baseEndpoint: string) {}

    /**
     * Get Request
     * @param path request path
     * @param config optional,additional custom parameters for http requests
     */
    async get(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        const url = this.baseEndpoint + path;

        logger.info(`GET url=${url}, config=${config ? JSON.stringify(config) : ''}`);

        const response = await Axios.get(url, config).then((resp) => {
            return resp.data;
        });

        return response;
    }

    /**
     * Post Request
     * @param path request path
     * @param params request params(data)
     * @param config optional, additional custom parameters for http requests
     */
    async post(path: string, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        const url = this.baseEndpoint + path;

        logger.info(
            `POST url=${url}, params=${params ? JSON.stringify(params) : ''}, config=${
                config ? JSON.stringify(config) : ''
            }`
        );
        const response = await Axios.post(url, params, config).then((resp) => {
            return resp.data;
        });

        return response;
    }

    async disconnect() {
        return null;
    }
}
