import { BigNumber, BigNumberish } from 'ethers';

// 0x-prefixed, hex encoded, ethereum account address
export type Address = string;
// sync:-prefixed, hex encoded, hash of the account public key
export type PubKeyHash = string;

// Symbol like "ETH" or "FAU" or token contract address(zero address is implied for "ETH").
export type TokenLike = TokenSymbol | TokenAddress | number;
// Token symbol (e.g. "ETH", "FAU", etc.)
export type TokenSymbol = string;
// Token address (e.g. 0xde..ad for ERC20, or 0x00.00 for "ETH")
export type TokenAddress = string;

export type TotalFee = Map<TokenLike, BigNumber>;

export type Nonce = number | 'committed';

export type Network = 'bscTestnet' | 'bsc';

const BSC_NETWORK_CHAIN_ID = 56;
const BSC_TESTNET_NETWORK_CHAIN_ID = 97;

export function l1ChainId(network?: Network): number {
  if (network === 'bsc') {
    return BSC_NETWORK_CHAIN_ID;
  }
  if (network === 'bscTestnet') {
    return BSC_TESTNET_NETWORK_CHAIN_ID;
  }
  throw new Error('Unsupported network');
}

export type EthAccountType = 'Owned' | 'CREATE2' | 'No2FA';

export interface Depositing {
  balances: {
    // Token are indexed by their symbol (e.g. "ETH")
    [token: string]: {
      // Sum of pending deposits for the token.
      amount: BigNumberish;
      // Value denoting the block number when the funds are expected
      // to be received by zkBNB network.
      expectedAcceptBlock: number;
    };
  };
}

export type EthSignerType = {
  verificationMethod: 'ECDSA' | 'ERC-1271';
  // Indicates if signer adds `\x19Ethereum Signed Message\n${msg.length}` prefix before signing message.
  // i.e. if false, we should add this prefix manually before asking to sign message
  isSignedMsgPrefixed: boolean;
};

export interface TxEthSignature {
  type: 'EthereumSignature' | 'EIP1271Signature';
  signature: string;
}

export interface Signature {
  pubKey: string;
  signature: string;
}

export type Ratio = [BigNumberish, BigNumberish];

/// represents ratio between tokens themself
export type TokenRatio = {
  type: 'Token';
  [token: string]: string | number;
  [token: number]: string | number;
};

/// represents ratio between lowest token denominations (wei, satoshi, etc.)
export type WeiRatio = {
  type: 'Wei';
  [token: string]: BigNumberish;
  [token: number]: BigNumberish;
};

export interface BlockInfo {
  blockNumber: number;
  committed: boolean;
  verified: boolean;
}

export interface TransactionReceipt {
  executed: boolean;
  success?: boolean;
  failReason?: string;
  block?: BlockInfo;
}

export interface PriorityOperationReceipt {
  executed: boolean;
  block?: BlockInfo;
}

export interface ContractAddress {
  zkBNBContract: string;
  governanceContract: string;
  defaultNftFactoryContract: string;
  assetGovernanceContract: string;
}

export interface Tokens {
  // Tokens are indexed by their symbol (e.g. "ETH")
  [token: string]: {
    address: string;
    id: number;
    symbol: string;
    decimals: number;
  };
}
