export type Hash = string;

export type Fee = string;

export type Nonce = number;

export type TimeStamp = number;

export type Block = {
  commitment: string;
  height: number;
  state_root: string;
  priority_operations: number;
  pending_on_chain_operations_hash: Hash;
  pending_on_chain_operations_pub_data: string;
  committed_tx_hash: Hash;
  committed_at: TimeStamp;
  verified_tx_hash: Hash;
  verified_at: TimeStamp;
  txs: Tx[];
  status: number;
};

export type Asset = {
  id: number;
  name: string;
  decimals: number;
  symbol: string;
  address: string;
  is_gas_asset: number;
};

export type Price = number;
export type Amount = string;

export type AccountIndex = number;
export type AccountName = string;
export type AccountStatus = number;
export type PublicKey = string;
export type AccountPk = PublicKey;

export type AccountAsset = {
  id: number;
  name: string;
  balance: string;
  lp_amount: string;
};

export type GasAccount = {
  staus: number;
  index: number;
  name: string;
};

export type Account = {
  status: number;
  index: number;
  name: string;
  pk: string;
  nonce: number;
  assets: AccountAsset[];
};

export type SimpleAccount = {
  index: AccountIndex;
  name: AccountName;
  pk: AccountPk;
};

type ContractAddress = {
  name: string;
  address: string;
};

export type Layer2BasicInfo = {
  block_committed: number;
  block_verified: number;
  total_transaction_count: number;
  yesterday_transaction_count: number;
  today_transaction_count: number;
  yesterday_active_user_count: number;
  today_active_user_count: number;
  contract_addresses: ContractAddress[];
};

export type Pair = {
  index: number;
  asset_a_id: Asset['id'];
  asset_a_name: string;
  asset_a_amount: Amount;
  asset_b_id: Asset['id'];
  asset_b_name: string;
  asset_b_amount: Amount;
  fee_rate: number;
  treasury_rate: number;
  total_lp_amount: string;
};

export type LP = {
  asset_a_id: Asset['id'];
  asset_a_name: string;
  asset_a_amount: Amount;
  asset_b_id: Asset['id'];
  asset_b_name: string;
  asset_b_amount: Amount;
};

export type TxDetail = {
  tx_id: number;
  asset_id: Asset['id'];
  asset_type: number;
  account_index: AccountIndex;
  account_name: AccountName;
  balance: string;
  balance_delta: string;
  order: number;
  account_order: number;
  nonce: Nonce;
  collection_nonce: Nonce;
};

export const TxType = {
  TxTypeEmpty: 0,
  TxTypeRegisterZns: 1,
  TxTypeCreatePair: 2,
  TxTypeUpdatePairRate: 3,
  TxTypeDeposit: 4,
  TxTypeDepositNft: 5,
  TxTypeTransfer: 6,
  TxTypeSwap: 7,
  TxTypeAddLiquidity: 8,
  TxTypeRemoveLiquidity: 9,
  TxTypeWithdraw: 10,
  TxTypeCreateCollection: 11,
  TxTypeMintNft: 12,
  TxTypeTransferNft: 13,
  TxTypeAtomicMatch: 14,
  TxTypeCancelOffer: 15,
  TxTypeWithdrawNft: 16,
  TxTypeFullExit: 17,
  TxTypeFullExitNft: 18,
  TxTypeOffer: 19,
} as const;

export type Tx = {
  hash: Hash;
  type: number;
  amount: string;
  info: string;
  status: number;
  index: number;
  gas_fee_asset_id: Asset['id'];
  gas_fee: Fee;
  nft_index: number;
  collection_id: number;
  pair_index: number;
  asset_id: number;
  asset_name: string;
  native_address: string;
  extra_info: string;
  memo: string;
  account_index: AccountIndex;
  account_name: string;
  nonce: Nonce;
  expired_at: TimeStamp;
  block_height: number;
  block_id: number;
  create_at: TimeStamp;
  state_root: string;
};

export type Nft = {
  index: number;
  creator_account_index: number;
  owner_account_index: number;
  content_hash: Hash;
  l1_address: string;
  l1_token_id: string;
  creator_treasury_rate: number;
  collection_id: number;
};
