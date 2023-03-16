import Axios from 'axios';

export abstract class AbstractJSONRPCTransport {
    abstract request(method: string, params: any): Promise<any>;
    subscriptionsSupported(): boolean {
        return false;
    }
    async subscribe(
        subMethod: string,
        subParams: any,
        unsubMethod: string,
        cb: (data: any) => void
    ): Promise<Subscription> {
        throw new Error('subscription are not supported for this transport');
    }
    abstract disconnect(): any;
}

// Has jrpcError field which is JRPC error object.
// https://www.jsonrpc.org/specification#error_object
export class JRPCError extends Error {
    constructor(message: string, public jrpcError: JRPCErrorObject) {
        super(message);
    }
}
export interface JRPCErrorObject {
    code: number;
    message: string;
    data: any;
}

class Subscription {
    constructor(public unsubscribe: () => Promise<void>) {}
}

export class HTTPTransport extends AbstractJSONRPCTransport {
    public constructor(public address: string) {
        super();
    }

    // JSON RPC request
    async request(method: string, params = null, config?: any): Promise<any> {
        const request = {
            id: 1,
            jsonrpc: '2.0',
            method,
            params
        };

        const response = await Axios.post(this.address, request, config).then((resp) => {
            return resp.data;
        });

        if ('result' in response) {
            return response.result;
        } else if ('error' in response) {
            throw new JRPCError(
                `zkSync API response error: code ${response.error.code}; message: ${response.error.message}`,
                response.error
            );
        } else {
            throw new Error('Unknown JRPC Error');
        }
    }

    async disconnect() {
        return null;
    }
}
