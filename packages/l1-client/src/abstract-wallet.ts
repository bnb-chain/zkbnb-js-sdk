import { BigNumber, BigNumberish, Contract, ContractTransaction, ethers } from 'ethers';
import { ErrorCode as EthersErrorCode } from '@ethersproject/logger';
import { EthMessageSigner } from './eth-message-signer';
import { ZkBNBProvider } from './provider-interface';
import { Address, l1ChainId, TokenAddress } from './types';
import {
    ERC20_APPROVE_TRESHOLD,
    ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT,
    ETH_RECOMMENDED_DEPOSIT_GAS_LIMIT,
    isTokenETH,
    MAX_ERC20_APPROVE_AMOUNT
} from './utils';
import { ETHOperation } from './operations';
import { IERC20_INTERFACE, ZkBNBInterface } from '../abi';

export abstract class AbstractWallet {
    public provider: ZkBNBProvider;

    protected constructor(public cachedAddress: Address) {}

    connect(provider: ZkBNBProvider) {
        this.provider = provider;
        return this;
    }

    // ****************
    // Abstract getters
    //

    /**
     * Returns the current Ethereum signer connected to this wallet.
     */
    abstract ethSigner(): ethers.Signer;

    /**
     * Returns the current Ethereum **message** signer connected to this wallet.
     *
     * Ethereum message signer differs from common Ethereum signer in that message signer
     * returns Ethereum signatures along with its type (e.g. ECDSA / EIP1271).
     */
    abstract ethMessageSigner(): EthMessageSigner;

    // *************
    // Basic getters
    //

    address(): Address {
        return this.cachedAddress;
    }

    // *************
    // L1 operations
    //
    // Priority operations, ones that sent through Ethereum.
    //

    async approveERC20TokenDeposits(
        tokenAddress: TokenAddress,
        max_erc20_approve_amount: BigNumber = MAX_ERC20_APPROVE_AMOUNT
    ): Promise<ContractTransaction> {
        if (isTokenETH(tokenAddress)) {
            throw Error('ETH token does not need approval.');
        }
        const erc20contract = new Contract(tokenAddress, IERC20_INTERFACE, this.ethSigner());

        try {
            return erc20contract.approve(this.provider.contractAddress.zkBNBContract, max_erc20_approve_amount);
        } catch (e) {
            this.modifyEthersError(e);
        }
    }

    async depositToL2(deposit: {
        to: Address;
        tokenAddress: TokenAddress;
        amount: BigNumberish;
        ethTxOptions?: ethers.providers.TransactionRequest;
        approveDepositAmountForERC20?: boolean;
    }): Promise<ETHOperation> {
        const gasPrice = await this.ethSigner().provider.getGasPrice();

        const mainZkBNBContract = this.getZkBNBContract();

        let ethTransaction;

        if (isTokenETH(deposit.tokenAddress)) {
            try {
                ethTransaction = await mainZkBNBContract.depositBNB(deposit.to, {
                    value: BigNumber.from(deposit.amount),
                    gasLimit: BigNumber.from(ETH_RECOMMENDED_DEPOSIT_GAS_LIMIT),
                    gasPrice,
                    ...deposit.ethTxOptions
                });
            } catch (e) {
                this.modifyEthersError(e);
            }
        } else {
            // ERC20 token deposit
            const erc20contract = new Contract(deposit.tokenAddress, IERC20_INTERFACE, this.ethSigner());
            let nonce: number;
            if (deposit.approveDepositAmountForERC20) {
                try {
                    const approveTx = await erc20contract.approve(
                        this.provider.contractAddress.zkBNBContract,
                        deposit.amount
                    );
                    nonce = approveTx.nonce + 1;
                } catch (e) {
                    this.modifyEthersError(e);
                }
            }
            const args = [
                deposit.tokenAddress,
                deposit.amount,
                deposit.to,
                {
                    nonce,
                    gasPrice,
                    ...deposit.ethTxOptions
                } as ethers.providers.TransactionRequest
            ];

            // We set gas limit only if user does not set it using ethTxOptions.
            const txRequest = args[args.length - 1] as ethers.providers.TransactionRequest;
            if (txRequest.gasLimit == null) {
                try {
                    const gasEstimate = await mainZkBNBContract.estimateGas.depositERC20(...args).then(
                        (estimate) => estimate,
                        () => BigNumber.from('0')
                    );
                    const recommendedGasLimit = ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT;
                    txRequest.gasLimit = gasEstimate.gte(recommendedGasLimit) ? gasEstimate : recommendedGasLimit;
                    args[args.length - 1] = txRequest;
                } catch (e) {
                    this.modifyEthersError(e);
                }
            }

            try {
                ethTransaction = await mainZkBNBContract.depositBEP20(...args);
            } catch (e) {
                this.modifyEthersError(e);
            }
        }

        return new ETHOperation(ethTransaction, this.provider);
    }

    async depositNFTToL2(deposit: {
        to: Address;
        tokenAddress: TokenAddress;
        tokenId: BigNumberish;
        ethTxOptions?: ethers.providers.TransactionRequest;
        approveDepositNFT?: boolean;
    }): Promise<ETHOperation> {
        // todo:
        return null;
    }

    async requestFullExit(fullExit: {
        tokenAddress: TokenAddress;
        accountIndex: number;
        ethTxOptions?: ethers.providers.TransactionRequest;
    }): Promise<ETHOperation> {
        const gasPrice = await this.ethSigner().provider.getGasPrice();

        const mainZkBNBContract = this.getZkBNBContract();

        try {
            const ethTransaction = await mainZkBNBContract.requestFullExit(
                fullExit.accountIndex,
                fullExit.tokenAddress,
                {
                    gasLimit: BigNumber.from('500000'),
                    gasPrice,
                    ...fullExit.ethTxOptions
                }
            );
            return new ETHOperation(ethTransaction, this.provider);
        } catch (e) {
            this.modifyEthersError(e);
        }
    }

    async requestFullExitNft(fullExitNFT: {
        tokenId: number;
        accountIndex: number;
        ethTxOptions?: ethers.providers.TransactionRequest;
    }): Promise<ETHOperation> {
        const gasPrice = await this.ethSigner().provider.getGasPrice();

        const mainZkBNBContract = this.getZkBNBContract();

        try {
            const ethTransaction = await mainZkBNBContract.requestFullExitNFT(
                fullExitNFT.accountIndex,
                fullExitNFT.tokenId,
                {
                    gasLimit: BigNumber.from('500000'),
                    gasPrice,
                    ...fullExitNFT.ethTxOptions
                }
            );
            return new ETHOperation(ethTransaction, this.provider);
        } catch (e) {
            this.modifyEthersError(e);
        }
    }

    // **********
    // L1 getters
    //
    // Getter methods that query information from Web3.
    //

    async isERC20DepositsApproved(
        tokenAddress: TokenAddress,
        erc20ApproveThreshold: BigNumber = ERC20_APPROVE_TRESHOLD
    ): Promise<boolean> {
        if (isTokenETH(tokenAddress)) {
            throw Error('ETH token does not need approval.');
        }
        const erc20contract = new Contract(tokenAddress, IERC20_INTERFACE, this.ethSigner());
        try {
            const currentAllowance = await erc20contract.allowance(
                this.address(),
                this.provider.contractAddress.zkBNBContract
            );
            return BigNumber.from(currentAllowance).gte(erc20ApproveThreshold);
        } catch (e) {
            this.modifyEthersError(e);
        }
    }

    getZkBNBContract() {
        return new ethers.Contract(this.provider.contractAddress.zkBNBContract, ZkBNBInterface, this.ethSigner());
    }

    // ****************
    // Internal methods
    //

    protected async verifyNetworks() {
        if (this.provider.network != undefined && this.ethSigner().provider != undefined) {
            const ethNetwork = await this.ethSigner().provider.getNetwork();
            if (l1ChainId(this.provider.network) !== ethNetwork.chainId) {
                throw new Error(
                    `ETH network ${ethNetwork.name} and ZkBNB network ${this.provider.network} don't match`
                );
            }
        }
    }

    protected modifyEthersError(error: any): never {
        if (this.ethSigner instanceof ethers.providers.JsonRpcSigner) {
            // List of errors that can be caused by user's actions, which have to be forwarded as-is.
            const correct_errors = [
                EthersErrorCode.NONCE_EXPIRED,
                EthersErrorCode.INSUFFICIENT_FUNDS,
                EthersErrorCode.REPLACEMENT_UNDERPRICED,
                EthersErrorCode.UNPREDICTABLE_GAS_LIMIT
            ];
            if (!correct_errors.includes(error.code)) {
                // This is an error which we don't expect
                error.message = `Ethereum smart wallet JSON RPC server returned the following error while executing an operation: "${error.message}". Please contact your smart wallet support for help.`;
            }
        }

        throw error;
    }
}
