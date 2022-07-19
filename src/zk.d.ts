export namespace Zk {
  type Hash = string;

  type Fee = string;

  type Nonce = number;

  type TimeStamp = number;

  type Block = {
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

  type AssetId = number;
  type AssetName = string;
  type AssetDecimals = number;
  type AssetSymbol = string;
  type AssetAddress = string;
  type IsGasAsset = boolean;

  type AssetInfo = {
    asset_id: AssetId;
    asset_name: AssetName;
    asset_decimals: AssetDecimals;
    asset_symbol: AssetSymbol;
    asset_address: AssetAddress;
    is_gas_asset: IsGasAsset;
  };

  type Price = number;
  type Amount = string;

  type AccountIndex = number;
  type AccountName = string;
  type AccountStatus = number;
  type PublicKey = string;
  type AccountPk = PublicKey;

  type AccountAsset = {
    asset_id: AssetId;
    balance: string;
    lp_amount: Amount;
    offer_canceled_or_finalized: string;
  };

  type Account = {
    account_index: AccountIndex;
    account_name: AccountName;
  };

  type Layer2BasicInfo = {
    block_committed: number;
    block_verified: number;
    total_transactions: number;
    transactions_count_yesterday: number;
    transactions_count_today: number;
    dau_yesterday: number;
    dau_today: number;
    contract_addresses: number;
  };

  type Pair = {
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

  type LP = {
    asset_a_id: AssetId;
    asset_a_name: string;
    asset_a_amount: Amount;
    asset_b_id: AssetId;
    asset_b_name: string;
    asset_b_amount: Amount;
  };

  type TxDetail = {
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

  type Tx = {
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
}
