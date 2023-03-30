## ZkBNB L1 Client

### Interface
```typescript
export abstract class AbstractWallet {

  abstract ethSigner(): ethers.Signer;

  abstract ethMessageSigner(): EthMessageSigner;

  address(): Address;

  // *************
  // L1 operations

  async approveBEP20TokenDeposits(
    tokenAddress: TokenAddress, 
    maxErc20ApproveAmount: BigNumberish): 
    Promise<ContractTransaction>;
  
  async deposit(deposit: {
    to: Address;
    tokenAddress: TokenAddress;
    amount: BigNumberish;
    ethTxOptions?: ethers.providers.TransactionRequest;
    approveDepositAmountForBEP20?: boolean;
  }): Promise<ETHOperation>;

  async depositNFT(deposit: {
    to: Address;
    tokenAddress: TokenAddress;
    tokenId: BigNumberish;
    ethTxOptions?: ethers.providers.TransactionRequest;
    approveDepositAllNFT?: boolean;
  }): Promise<ETHOperation>;

  async requestFullExit(fullExit: {
    tokenAddress: TokenAddress;
    accountIndex: number;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  async requestFullExitNft(fullExitNFT: {
    tokenId: number;
    accountIndex: number;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  async withdrawPendingBalance(withdrawal: {
    owner: string;
    tokenAddress: string;
    amount: BigNumberish;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  async withdrawPendingNFTBalance(withdrawalNFT: {
    tokenId: number;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  async registerNFTFactory(registerNFTFactory: {
    collectionId: BigNumberish;
    factoryAddress: Address;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  async deployAndRegisterNFTFactory(deployAndRegisterNFTFactory: {
    collectionId: BigNumberish;
    name: string;
    symbol: string;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  // AssetGovernance part
  async addAsset(addAsset: {
    tokenAddress: Address;
    ethTxOptions?: ethers.providers.TransactionRequest;
  }): Promise<ETHOperation>;

  async isTokenLister(address: Address): Promise<boolean>;

  // **********
  // L1 getters
  async isBEP20DepositsApproved(tokenAddress: TokenAddress, erc20ApproveThreshold: BigNumber): Promise<boolean>;

  async isERC721DepositsApprovedForAll(tokenAddress: TokenAddress): Promise<boolean>;
  
  // zkBNB part
  async getPendingBalance(address: Address, tokenAddress: TokenAddress): Promise<BigNumber>;

  // governance part
  async resolveTokenId(token: TokenAddress): Promise<number>;

  async resolveTokenAddress(tokenId: number): Promise<Address>;

  async validateAssetAddress(address: string): Promise<number>;

  async getNFTFactory(creatorAddress: string, collectionId: number): Promise<string>;

  async getNftTokenURI(nftContentType: number, nftContentHash: string): Promise<string>;

}
```

## Install

Using npm:

```bash
> npm install @bnb-chain/zkbnb-l1-sdk
```

Using yarn:

```bash
> yarn add @bnb-chain/zkbnb-l1-sdk
```

Using pnpm:

```bash
> pnpm add @bnb-chain/zkbnb-l1-sdk
```

## Usage

### Init
```typescript
const testEndpoint = 'https://testapi.zkbnbchain.org'; // bsc testnest
const rpcEndpoint = 'https://data-seed-prebsc-2-s1.binance.org:8545'; // bsc testnest rpc
const ethWallet = new ethers.Wallet(
  'your private key',
  new ethers.providers.JsonRpcProvider(rpcEndpoint)
);
const provider = await Provider.newHttpProvider(testEndpoint);
const wallet = await Wallet.fromZkBNBSigner(ethWallet, provider);
```

### Governance
#### Get AssetAddress By AssetId
```typescript
const assetAddress = await wallet.resolveTokenAddress(1);
```

#### Get AssetId By AssetAddress
```typescript
// Please use a legal address according to the actual situation
const assetId = await wallet.resolveTokenId('0x0000000000000000000000000000000000000000');
```

#### Validate Asset Address
```typescript
const addressToken = await wallet.resolveTokenAddress(1);

// If it is a valid address, then return the corresponding assetId value, otherwise return 0
const assetId = await wallet.validateAssetAddress(addressToken);
```

#### Get NFTFactory
```typescript
const creatorAddress = '0xXXXXXXXXXXXXXX';
const collectionId = 1;
// If the factory address has not been updated, the default address is returned, 
// otherwise the updated address is returned
const nftFactory = await wallet.getNFTFactory(creatorAddress, collectionId);
```

#### Get Nft TokenURI
```typescript
const nftContentType = 0;
const nftContentHash = 'hash value';
const tokenUri = await wallet.getNftTokenURI(nftContentType, nftContentHash);
```

### AssetGovernance
#### Add Asset
```typescript
const canAdd = await wallet.isTokenLister(ZERO_ADDRESS);
const tokenAddress = '0xXXXXXXXXXXXXXX'; // change to the token address
let isAdded;
try {
    await wallet.resolveTokenId(tokenAddress);
    isAdded = true;
} catch (e) {
    isAdded = false;
}
// Before adding, it is recommended to check whether the corresponding 
// asset exists and whether it can be added.
if (canAdd && !isAdded) {
  await wallet.addAsset({ tokenAddress });
}
```

### ZkBNB
#### Get Pending Balance
```typescript
// Please change the value of the parameter according to the actual situation
const address = '0xXXXXXXXXXXXXXX';
const assetAddress = '0xXXXXXXXXXXXXXX';

const pendingBalance = await wallet.getPendingBalance(address, assetAddress);
```

### L1 Getter
#### Is BEP20 Deposits Approved
```typescript
// The following addresse can be changed according to the actual situation
const address = await wallet.resolveTokenAddress(1);
const isApproved = await wallet.isBEP20DepositsApproved(address);
```

#### Is ERC721 Deposits ApprovedForAll
```typescript
// The following addresse can be changed according to the actual situation
const address = wallet.provider.contractAddress.defaultNftFactoryContract;
await wallet.isERC721DepositsApprovedForAll(address);
```

#### Get ethMessageSigner
```typescript
const result = await client.ethMessageSigner();
```

#### Get address
```typescript
const address = client.address();
```

### L1 operations
#### Approve BEP20 Token Deposits
```typescript
const address = await wallet.resolveTokenAddress(1);
const result = await wallet.approveBEP20TokenDeposits(address);
// You can determine if it is successful by using the following method
const isApproved = await wallet.isBEP20DepositsApproved(address);
```

#### Deposit BNB
```typescript
const tokenAddress = await wallet.resolveTokenAddress(0);
const result = await wallet.deposit({
  to: wallet.address(),
  tokenAddress,
  amount: ethers.utils.parseEther('0.001'),
});
```

#### Deposit BEP20
```typescript
const tokenAddress = await wallet.resolveTokenAddress(1);
// transfer asset from governor to this test wallet
const governorPrivatekey = 'governor private key';
const testEndpoint = 'https://testapi.zkbnbchain.org'; // bsc testnest
const rpcEndpoint = 'https://data-seed-prebsc-2-s1.binance.org:8545'; // bsc testnest rpc

const ethWallet = new ethers.Wallet(
  governorPrivatekey,
  new ethers.providers.JsonRpcProvider(rpcEndpoint)
);
const provider = await Provider.newHttpProvider(testEndpoint);
const governorWallet = await Wallet.fromZkBNBSigner(ethWallet, provider);

const erc20contract = new Contract(tokenAddress, BEP20Interface, governorWallet.ethSigner());
const amount = ethers.utils.parseEther('0.001');
const transferResult = await erc20contract.transfer(wallet.address(), amount);
await transferResult.wait();

// approveDepositAmountForBEP20 If this option is true, the approval operation will be
// executed during the recharge process, otherwise it will not be executed
const result = await wallet.deposit({
  to: wallet.address(),
  tokenAddress,
  amount,
  approveDepositAmountForBEP20: true,
});
```

#### Deposit NFT
```typescript
const tokenAddress = wallet.provider.contractAddress.defaultNftFactoryContract;
const tokenId = 1;
const depositResult = await wallet.depositNFT({
    to: wallet.address(), // zkbnb contract address
    tokenAddress,
    tokenId,
    approveDepositAllNFT: true,
});
```

#### Request FullExit
```typescript
const tokenAddress = await wallet.resolveTokenAddress(1);
const result = await wallet.requestFullExit({
    tokenAddress,
    accountIndex: 0,
});
```

#### Request FullExit Nft
```typescript
const requestResult = await wallet.requestFullExitNft({
    tokenId: 1,
    accountIndex: 0,
});
```

#### Withdraw Pending Balance
```typescript
// It will not come soon
```

#### Withdraw Pending NFTBalance
```typescript
// It will not come soon
```

#### Deploy And Register NFTFactory
```typescript
async function getUnusedCollectionId(): Promise<number> {
    const collectionId = Math.ceil(10000 * Math.random());
    const factoryAddress = await wallet.getNFTFactory(wallet.address(), collectionId);
    if (factoryAddress === wallet.provider.contractAddress.defaultNftFactoryContract) {
      return collectionId;
    }
    return getUnusedCollectionId();
}

const name = 'testFactory';
const symbol = 'tf';
let collectionId = await getUnusedCollectionId();
await wallet.deployAndRegisterNFTFactory({
    collectionId,
    name,
    symbol,
});

// factoryAddress get method: deployAndRegisterNFTFactory after execution,
// by 'query nftFactory' unit test code to get
const factoryAddress = await wallet.getNFTFactory(wallet.address(), collectionId);
// Just select a collectionId that does not exist
collectionId = await getUnusedCollectionId();
await wallet.registerNFTFactory({ collectionId, factoryAddress });
```
