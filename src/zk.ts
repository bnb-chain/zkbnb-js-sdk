export type Hash = string;

export type Fee = string;

export type Nonce = number;

export type TimeStamp = number;

export type Block = {
  block_commitment: string;
  block_height: number;
  state_root: string;
  priority_operations: number;
  pending_on_chain_operations_hash: Hash;
  pending_on_chain_operations_hub_data: string;
  committed_tx_hash: Hash;
  committed_at: TimeStamp;
  verified_tx_hash: Hash;
  verified_at: TimeStamp;
  txs: Tx[];
  block_status: number;
};

export type AssetId = number;
export type AssetName = string;
export type AssetDecimals = number;
export type AssetSymbol = string;
export type AssetAddress = string;
export type IsGasAsset = boolean;

export type AssetInfo = {
  asset_id: AssetId;
  asset_name: AssetName;
  asset_decimals: AssetDecimals;
  asset_symbol: AssetSymbol;
  asset_address: AssetAddress;
  is_gas_asset: IsGasAsset;
};

export type Price = number;
export type Amount = string;

export type AccountIndex = number;
export type AccountName = string;
export type AccountStatus = number;
export type PublicKey = string;
export type AccountPk = PublicKey;

export type AccountAsset = {
  asset_id: AssetId;
  balance: string;
  lp_amount: Amount;
  offer_canceled_or_finalized: string;
};

export type Account = {
  account_index: AccountIndex;
  account_name: AccountName;
};

export type Layer2BasicInfo = {
  block_committed: number;
  block_verified: number;
  total_transactions: number;
  transactions_count_yesterday: number;
  transactions_count_today: number;
  dau_yesterday: number;
  dau_today: number;
  contract_addresses: number;
};

export type Pair = {
  pair_index: number;
  asset_a_id: AssetId;
  asset_a_name: string;
  asset_a_amount: Amount;
  asset_b_id: AssetId;
  asset_b_name: string;
  asset_b_amount: Amount;
  fee_Rate: number;
  treasury_rate: number;
};

export type LP = {
  asset_a_id: AssetId;
  asset_a_name: string;
  asset_a_amount: Amount;
  asset_b_id: AssetId;
  asset_b_name: string;
  asset_b_amount: Amount;
};

export type TxDetail = {
  tx_id: number;
  asset_id: AssetId;
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
  tx_hash: Hash;
  tx_type: number;
  gas_fee: Fee;
  gas_fee_asset_id: AssetId;
  tx_status: number;
  block_height: number;
  block_id: number;
  state_root: string;
  nft_index: number;
  pair_index: number;
  asset_id: number;
  tx_amount: string;
  native_address: string;
  tx_info: string;
  tx_details: TxDetail[];
  extra_info: string;
  memo: string;
  account_index: AccountIndex;
  nonce: Nonce;
  expired_at: TimeStamp;
};
