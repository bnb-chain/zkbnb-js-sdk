import { Contract, ethers, logger } from 'ethers';
import { ContractAddress, Network, PriorityOperationReceipt, TokenAddress } from './types';
import { isTokenETH } from './utils';
import { GovernanceInterface, ZkBNBInterface, ZkBNBNFTFactoryInterface } from '../abi';
import { ZkBNBProvider } from './provider-interface';
import { HTTPTransport } from './transport';

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
    private constructor(public transport: HTTPTransport) {
        super();
        this.providerType = 'RPC';
    }

    static async newHttpProvider(
        address = 'https://testapi.zkbnbchain.org',
        pollIntervalMilliSecs?: number,
        network?: Network
    ): Promise<Provider> {
        const transport = new HTTPTransport(address);
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
                defaultNftFactory: '',
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
                        contractAddress.defaultNftFactory = item['address'];
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

export class L1Proxy {
    private governanceContract: Contract;
    private assetGovernanceContract: Contract;
    private zkBNBContract: Contract;
    private zkBNBNFTFactoryContract: Contract;
    // Needed for typechain to work
    private dummySigner: ethers.VoidSigner;

    constructor(private ethersProvider: ethers.providers.Provider, public contractAddress: ContractAddress) {
        this.dummySigner = new ethers.VoidSigner(ethers.constants.AddressZero, this.ethersProvider);

        this.governanceContract = new ethers.Contract(
            contractAddress.governanceContract,
            GovernanceInterface,
            this.dummySigner
        );

        this.zkBNBContract = new ethers.Contract(contractAddress.zkBNBContract, ZkBNBInterface, this.dummySigner);
    }

    getGovernanceContract(): Contract {
        return this.governanceContract;
    }

    getZkBNBContract(): Contract {
        return this.zkBNBContract;
    }

    async getDefaultNFTFactory(): Promise<Contract> {
        if (this.zkBNBNFTFactoryContract) {
            return this.zkBNBNFTFactoryContract;
        }

        const nftFactoryAddress = await this.governanceContract.defaultNFTFactory();

        this.zkBNBNFTFactoryContract = new ethers.Contract(
            nftFactoryAddress,
            ZkBNBNFTFactoryInterface,
            this.dummySigner
        );

        return this.zkBNBNFTFactoryContract;
    }

    async resolveTokenId(token: TokenAddress): Promise<number> {
        if (isTokenETH(token)) {
            return 0;
        } else {
            const tokenId = await this.governanceContract.assetsList(token);
            if (tokenId == 0) {
                throw new Error(`ERC20 token ${token} is not supported`);
            }
            return tokenId;
        }
    }
}
