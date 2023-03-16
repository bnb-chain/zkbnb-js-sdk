import { Contract, ethers } from 'ethers';
import { ContractAddress, Network, PriorityOperationReceipt, TokenAddress } from './types';
import { isTokenETH } from './utils';
import { GovernanceInterface, ZkBNBInterface, ZkBNBNFTFactoryInterface } from '../abi';
import { ZkBNBProvider } from './provider-interface';
import { AbstractJSONRPCTransport, HTTPTransport } from './transport';

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
    private constructor(public transport: AbstractJSONRPCTransport) {
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
        // todo
        return {
            zkBNBContract: '0x1ecB4fA9Ff17835a10485350a05f53668783383a',
            governanceContract: '0x2E964A58edCA5586157b6CcaC1cCe849316E1643',
            defaultNftFactory: '0x6AAeE5FCB563661A4c457F3add1c1b46f5b07A5D',
            assetGovernanceContract: '0x796C239e99A79C6552446297e63b596296eC743b'
        };
        // return await this.transport.request('contract_address', null);
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
