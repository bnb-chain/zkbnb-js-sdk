import { BigNumber, BigNumberish, Contract, ContractTransaction, ethers } from 'ethers';
import { ErrorCode as EthersErrorCode } from '@ethersproject/logger';
import { EthMessageSigner } from './eth-message-signer';
import { ZkBNBProvider } from './provider-interface';
import { Address, TokenAddress, l1ChainId } from './types';
import {
  BEP20_APPROVE_THRESHOLD,
  BEP20_RECOMMENDED_DEPOSIT_GAS_LIMIT,
  BNB_RECOMMENDED_DEPOSIT_GAS_LIMIT,
  MAX_BEP20_APPROVE_AMOUNT,
  isBNBToken,
  ERC721_RECOMMENDED_DEPOSIT_GAS_LIMIT,
  BEP20_RECOMMENDED_FULL_EXIT_GAS_LIMIT,
  ERC721_RECOMMENDED_FULL_EXIT_GAS_LIMIT,
  ERC721_RECOMMENDED_WITHDRAW_PENDING_BALANCE_GAS_LIMIT,
  BEP20_RECOMMENDED_WITHDRAW_PENDING_BALANCE_GAS_LIMIT,
  BEP20_RECOMMENDED_ADD_ASSET_GAS_LIMIT,
  ERC721_RECOMMENDED_DEPLOY_AND_REGISTER_NFT_FACTORY_GAS_LIMIT,
  ERC721_RECOMMENDED_REGISTER_NFT_FACTORY_GAS_LIMIT,
} from './utils';
import { ETHOperation } from './operations';
import {
  AssetGovernanceInterface,
  GovernanceInterface,
  BEP20Interface,
  ZkBNBInterface,
  ZkBNBNFTFactoryInterface,
} from './abi';

export abstract class AbstractWallet {
  public provider: ZkBNBProvider;
  private governanceContract: Contract;
  private assetGovernanceContract: Contract;
  private zkBNBContract: Contract;

  protected constructor(public cachedAddress: Address) {
    this.cachedAddress = cachedAddress;
  }

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

  async approveBEP20TokenDeposits(
    tokenAddress: TokenAddress,
    maxErc20ApproveAmount: BigNumberish = MAX_BEP20_APPROVE_AMOUNT
  ): Promise<ContractTransaction> {
    if (isBNBToken(tokenAddress)) {
      throw Error('ETH token does not need approval.');
    }
    const erc20contract = new Contract(tokenAddress, BEP20Interface, this.ethSigner());

    try {
      const gasPrice = await this.ethSigner().provider.getGasPrice();
      return erc20contract.approve(this.provider.contractAddress.zkBNBContract, maxErc20ApproveAmount, {
        gasPrice,
        gasLimit: BigNumber.from(BEP20_RECOMMENDED_DEPOSIT_GAS_LIMIT),
      });
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  async approveForAllERC721TokenDeposits(tokenAddress: TokenAddress): Promise<ContractTransaction> {
    const erc721contract = new Contract(tokenAddress, ZkBNBNFTFactoryInterface, this.ethSigner());
    try {
      const gasPrice = await this.ethSigner().provider.getGasPrice();
      return erc721contract.setApprovalForAll(this.provider.contractAddress.zkBNBContract, {
        gasPrice,
        gasLimit: BigNumber.from(ERC721_RECOMMENDED_DEPOSIT_GAS_LIMIT),
      });
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  async deposit(deposit: {
    to: Address;
    tokenAddress: TokenAddress;
    amount: BigNumberish;
    ethTxOptions?: ethers.providers.TransactionRequest;
    approveDepositAmountForBEP20?: boolean;
  }): Promise<ETHOperation> {
    const gasPrice = deposit.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    const zkBNBContract = this.getZkBNBContract();

    let ethTransaction;

    if (isBNBToken(deposit.tokenAddress)) {
      try {
        ethTransaction = await zkBNBContract.depositBNB(deposit.to, {
          value: BigNumber.from(deposit.amount),
          gasLimit: BigNumber.from(BNB_RECOMMENDED_DEPOSIT_GAS_LIMIT),
          gasPrice,
          ...deposit.ethTxOptions,
        });
      } catch (e) {
        this.modifyEthersError(e);
      }
    } else {
      // BEP20 token deposit
      let nonce: number;
      if (deposit.approveDepositAmountForBEP20) {
        const approveTx = await this.approveBEP20TokenDeposits(
          this.provider.contractAddress.zkBNBContract,
          deposit.amount
        );
        nonce = approveTx.nonce + 1;
      }
      const args = [
        deposit.tokenAddress,
        deposit.amount,
        deposit.to,
        {
          nonce,
          gasPrice,
          ...deposit.ethTxOptions,
        } as ethers.providers.TransactionRequest,
      ];

      // We set gas limit only if user does not set it using ethTxOptions.
      const txRequest = args[args.length - 1] as ethers.providers.TransactionRequest;
      if (!txRequest.gasLimit) {
        try {
          const gasEstimate = await zkBNBContract.estimateGas.depositBEP20(...args).then(
            (estimate) => estimate,
            () => BigNumber.from('0')
          );
          const recommendedGasLimit = BEP20_RECOMMENDED_DEPOSIT_GAS_LIMIT;
          txRequest.gasLimit = gasEstimate.gte(recommendedGasLimit) ? gasEstimate : recommendedGasLimit;
          args[args.length - 1] = txRequest;
        } catch (e) {
          this.modifyEthersError(e);
        }
      }

      try {
        ethTransaction = await zkBNBContract.depositBEP20(...args);
      } catch (e) {
        this.modifyEthersError(e);
      }
    }

    return new ETHOperation(ethTransaction, this.provider);
  }

  async depositNFT(deposit: {
    to: Address;
    tokenAddress: TokenAddress;
    tokenId: BigNumberish;
    ethTxOptions?: ethers.providers.TransactionRequest;
    approveDepositAllNFT?: boolean;
  }): Promise<ETHOperation> {
    const zkBNBContract = this.getZkBNBContract();

    let ethTransaction;

    let nonce: number;
    if (deposit.approveDepositAllNFT) {
      const approveTx = await this.approveForAllERC721TokenDeposits(deposit.tokenAddress);
      nonce = approveTx.nonce + 1;
    }

    const gasPrice = deposit.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());
    const args = [
      deposit.to,
      deposit.tokenAddress,
      deposit.tokenId,
      {
        gasLimit: BigNumber.from(ERC721_RECOMMENDED_DEPOSIT_GAS_LIMIT),
        nonce,
        gasPrice,
        ...deposit.ethTxOptions,
      },
    ];

    try {
      ethTransaction = await zkBNBContract.depositNft(...args);
    } catch (e) {
      this.modifyEthersError(e);
    }

    return new ETHOperation(ethTransaction, this.provider);
  }

  async requestFullExit(fullExit: {
    tokenAddress: TokenAddress;
    accountIndex: number;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation> {
    const gasPrice = fullExit.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    const zkBNBContract = this.getZkBNBContract();

    try {
      const ethTransaction = await zkBNBContract.requestFullExit(fullExit.accountIndex, fullExit.tokenAddress, {
        gasLimit: BEP20_RECOMMENDED_FULL_EXIT_GAS_LIMIT,
        gasPrice,
        ...fullExit.ethTxOptions,
      });
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
    const gasPrice = fullExitNFT.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    const zkBNBContract = this.getZkBNBContract();

    try {
      const ethTransaction = await zkBNBContract.requestFullExitNft(fullExitNFT.accountIndex, fullExitNFT.tokenId, {
        gasLimit: ERC721_RECOMMENDED_FULL_EXIT_GAS_LIMIT,
        gasPrice,
        ...fullExitNFT.ethTxOptions,
      });
      return new ETHOperation(ethTransaction, this.provider);
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  async withdrawPendingBalance(withdrawal: {
    owner: string;
    tokenAddress: string;
    amount: BigNumberish;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation> {
    const gasPrice = withdrawal.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    const zkBNBContract = this.getZkBNBContract();

    try {
      const ethTransaction = await zkBNBContract.withdrawPendingBalance(
        withdrawal.owner,
        withdrawal.tokenAddress,
        withdrawal.amount,
        {
          gasLimit: BEP20_RECOMMENDED_WITHDRAW_PENDING_BALANCE_GAS_LIMIT,
          gasPrice,
          ...withdrawal.ethTxOptions,
        }
      );
      return new ETHOperation(ethTransaction, this.provider);
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  async withdrawPendingNFTBalance(withdrawalNFT: {
    tokenId: number;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation> {
    const gasPrice = withdrawalNFT.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    const zkBNBContract = this.getZkBNBContract();

    try {
      const ethTransaction = await zkBNBContract.withdrawPendingNFTBalance(withdrawalNFT.tokenId, {
        gasLimit: ERC721_RECOMMENDED_WITHDRAW_PENDING_BALANCE_GAS_LIMIT,
        gasPrice,
        ...withdrawalNFT.ethTxOptions,
      });
      return new ETHOperation(ethTransaction, this.provider);
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  async registerNFTFactory(registerNFTFactory: {
    collectionId: BigNumberish;
    factoryAddress: Address;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation> {
    const gasPrice = registerNFTFactory.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    try {
      const ethTransaction = await this.getGovernanceContract().registerNFTFactory(
        registerNFTFactory.collectionId,
        registerNFTFactory.factoryAddress,
        {
          gasPrice,
          gasLimit: BigNumber.from(ERC721_RECOMMENDED_REGISTER_NFT_FACTORY_GAS_LIMIT),
          ...registerNFTFactory.ethTxOptions,
        }
      );
      return new ETHOperation(ethTransaction, this.provider);
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  async deployAndRegisterNFTFactory(deployAndRegisterNFTFactory: {
    collectionId: BigNumberish;
    name: string;
    symbol: string;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation> {
    const gasPrice =
      deployAndRegisterNFTFactory.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    try {
      const ethTransaction = await this.getGovernanceContract().deployAndRegisterNFTFactory(
        deployAndRegisterNFTFactory.collectionId,
        deployAndRegisterNFTFactory.name,
        deployAndRegisterNFTFactory.symbol,
        {
          gasPrice,
          gasLimit: BigNumber.from(ERC721_RECOMMENDED_DEPLOY_AND_REGISTER_NFT_FACTORY_GAS_LIMIT),
          ...deployAndRegisterNFTFactory.ethTxOptions,
        }
      );
      return new ETHOperation(ethTransaction, this.provider);
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  // AssetGovernance part
  async addAsset(addAsset: {
    tokenAddress: Address;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation> {
    const gasPrice = addAsset.ethTxOptions?.gasPrice || (await this.ethSigner().provider.getGasPrice());

    try {
      const ethTransaction = await this.getAssetGovernanceContract().addAsset(addAsset.tokenAddress, {
        gasPrice,
        gasLimit: BigNumber.from(BEP20_RECOMMENDED_ADD_ASSET_GAS_LIMIT),
        ...addAsset.ethTxOptions,
      });
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

  async isBEP20DepositsApproved(
    tokenAddress: TokenAddress,
    erc20ApproveThreshold: BigNumber = BEP20_APPROVE_THRESHOLD
  ): Promise<boolean> {
    if (isBNBToken(tokenAddress)) {
      throw Error('BNB token does not need approval.');
    }
    const erc20contract = new Contract(tokenAddress, BEP20Interface, this.ethSigner());
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

  async isERC721DepositsApprovedForAll(tokenAddress: TokenAddress): Promise<boolean> {
    const erc721contract = new Contract(tokenAddress, ZkBNBNFTFactoryInterface, this.ethSigner());
    try {
      return erc721contract.isApprovedForAll(this.address(), this.provider.contractAddress.zkBNBContract);
    } catch (e) {
      this.modifyEthersError(e);
    }
  }

  getZkBNBContract() {
    if (this.zkBNBContract) {
      return this.zkBNBContract;
    }
    this.zkBNBContract = new ethers.Contract(
      this.provider.contractAddress.zkBNBContract,
      ZkBNBInterface,
      this.ethSigner()
    );
    return this.zkBNBContract;
  }

  getGovernanceContract() {
    if (this.governanceContract) {
      return this.governanceContract;
    }
    this.governanceContract = new ethers.Contract(
      this.provider.contractAddress.governanceContract,
      GovernanceInterface,
      this.ethSigner()
    );
    return this.governanceContract;
  }

  getAssetGovernanceContract() {
    if (this.assetGovernanceContract) {
      return this.assetGovernanceContract;
    }
    this.assetGovernanceContract = new ethers.Contract(
      this.provider.contractAddress.assetGovernanceContract,
      AssetGovernanceInterface,
      this.ethSigner()
    );
    return this.assetGovernanceContract;
  }

  // zkBNB part
  async getPendingBalance(address: Address, tokenAddress: TokenAddress): Promise<BigNumber> {
    return this.getZkBNBContract().getPendingBalance(address, tokenAddress);
  }

  // governance part
  async resolveTokenId(token: TokenAddress): Promise<number> {
    if (isBNBToken(token)) {
      return 0;
    } else {
      const tokenId = await this.getGovernanceContract().assetsList(token);
      if (tokenId == 0) {
        throw new Error(`BEP20 token ${token} is not supported`);
      }
      return tokenId;
    }
  }

  async resolveTokenAddress(tokenId: number): Promise<Address> {
    if (tokenId === 0) {
      return ethers.constants.AddressZero;
    }
    const tokenAddress = await this.getGovernanceContract().assetAddresses(tokenId);
    if (tokenAddress === ethers.constants.AddressZero) {
      throw new Error(`BEP20 token ${tokenId} is not supported`);
    }
    return tokenAddress;
  }

  async validateAssetAddress(address: string): Promise<number> {
    return this.getGovernanceContract().validateAssetAddress(address);
  }

  async getNFTFactory(creatorAddress: string, collectionId: number): Promise<string> {
    return this.getGovernanceContract().getNFTFactory(creatorAddress, collectionId);
  }

  async getNftTokenURI(nftContentType: number, nftContentHash: string): Promise<string> {
    return this.getGovernanceContract().getNftTokenURI(nftContentType, nftContentHash);
  }

  // AssetGovernance part
  async isTokenLister(address: Address) {
    return this.getAssetGovernanceContract().tokenLister(address);
  }

  // ****************
  // Internal methods
  //

  protected async verifyNetworks() {
    if (this.provider.network != undefined && this.ethSigner().provider != undefined) {
      const ethNetwork = await this.ethSigner().provider.getNetwork();
      if (l1ChainId(this.provider.network) !== ethNetwork.chainId) {
        throw new Error(`ETH network ${ethNetwork.name} and ZkBNB network ${this.provider.network} don't match`);
      }
    }
  }

  protected modifyEthersError(error: any): never {
    if (this.ethSigner instanceof ethers.providers.JsonRpcSigner) {
      // List of errors that can be caused by user's actions, which have to be forwarded as-is.
      const correctErrors = [
        EthersErrorCode.NONCE_EXPIRED,
        EthersErrorCode.INSUFFICIENT_FUNDS,
        EthersErrorCode.REPLACEMENT_UNDERPRICED,
        EthersErrorCode.UNPREDICTABLE_GAS_LIMIT,
      ];
      if (!correctErrors.includes(error.code)) {
        // This is an error which we don't expect
        error.message = `Ethereum smart wallet JSON RPC server returned the following error while executing an operation: "${error.message}". Please contact your smart wallet support for help.`;
      }
    }

    throw error;
  }
}
