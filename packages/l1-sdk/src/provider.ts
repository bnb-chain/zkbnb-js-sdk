import { logger } from 'ethers';
import { ContractAddress, Network, PriorityOperationReceipt } from './types';
import { ZkBNBProvider } from './provider-interface';
import { HttpTransport } from './http-transport';

export async function getZkBNBDefaultProvider(network: Network, pollIntervalMilliSecs?: number): Promise<Provider> {
    if (network === 'bsc') {
        return await Provider.newHttpProvider('https://testapi.zkbnbchain.org', pollIntervalMilliSecs, network);
    } else if (network === 'bscTestnet') {
        return await Provider.newHttpProvider('https://testapi.zkbnbchain.org', pollIntervalMilliSecs, network);
    } else {
        throw new Error(`BSC network ${network} is not supported`);
    }
}

export class Provider extends ZkBNBProvider {
    notifyPriorityOp(hashOrSerialId: string | number, action: 'COMMIT' | 'VERIFY'): Promise<PriorityOperationReceipt> {
        throw new Error('Method not implemented.');
    }
    private pollIntervalMilliSecs: number;
    private constructor(public transport: HttpTransport) {
        super();
        this.providerType = 'RPC';
    }

    static async newHttpProvider(
        address = 'https://testapi.zkbnbchain.org',
        pollIntervalMilliSecs?: number,
        network?: Network
    ): Promise<Provider> {
        const transport = new HttpTransport(address);
        const provider = new Provider(transport);
        if (pollIntervalMilliSecs) {
            provider.pollIntervalMilliSecs = pollIntervalMilliSecs;
        }
        // get contract addresses
        const contractsAndTokens = await provider.getContractAddress();
        provider.contractAddress = contractsAndTokens;
        provider.network = network;
        return provider;
    }

    async getContractAddress(): Promise<ContractAddress> {
        const response = await this.transport.request('/api/v1/layer2BasicInfo', null);

        logger.debug(`getContractAddress response: ${response ? JSON.stringify(response) : '{}'}`);

        if (response && 'contract_addresses' in response) {
            const contractAddressArr = response['contract_addresses'];

            const contractAddress: ContractAddress = {
                zkBNBContract: '',
                governanceContract: '',
                defaultNftFactoryContract: '',
                assetGovernanceContract: ''
            };

            contractAddressArr.forEach((item) => {
                switch (item['name']) {
                    case 'ZkBNBContract':
                        contractAddress.zkBNBContract = item['address'];
                        break;
                    case 'GovernanceContract':
                        contractAddress.governanceContract = item['address'];
                        break;
                    case 'DefaultNftFactory':
                        contractAddress.defaultNftFactoryContract = item['address'];
                        break;
                    case 'AssetGovernanceContract':
                        contractAddress.assetGovernanceContract = item['address'];
                        break;
                    default:
                        logger.warn(`Unsupported types: ${item['name']}`);
                }
            });

            return contractAddress;
        }

        throw new Error('Failed to get contract address');
    }

    override async disconnect() {
        return await this.transport.disconnect();
    }
}
