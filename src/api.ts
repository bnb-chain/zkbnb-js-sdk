import * as Zk from './zk';

export interface IReqBaseParam {
  offset: number;
  limit: number;
}

export const API_MAP = {
  GetTxsByPubKey: 'GET /api/v1/tx/getTxsByPubKey',
  GetTxsByAccountName: 'GET /api/v1/tx/getTxsByAccountName',
  GetTxsByAccountIndexAndTxType: 'GET /api/v1/tx/getTxsByAccountIndexAndTxType',
  GetTxsListByAccountIndex: 'GET /api/v1/tx/getTxsListByAccountIndex',
  Search: 'GET /api/v1/info/search',
  GetAccounts: 'GET /api/v1/info/getAccounts',
  GetGasFeeAssetList: 'GET /api/v1/info/getGasFeeAssetList',
  GetWithdrawGasFee: 'GET /api/v1/info/getWithdrawGasFee',
  GetGasFee: 'GET /api/v1/info/getGasFee',
  GetAssetsList: 'GET /api/v1/info/getAssetsList',
  GetLayer2BasicInfo: 'GET /api/v1/info/getLayer2BasicInfo',
  GetBlockByCommitment: 'GET /api/v1/block/getBlockByCommitment',
  GetBalanceByAssetIdAndAccountName: 'GET /api/v1/account/getBalanceByAssetIdAndAccountName',
  GetAccountStatusByAccountName: 'GET /api/v1/account/getAccountStatusByAccountName',
  GetAccountInfoByAccountIndex: 'GET /api/v1/account/getAccountInfoByAccountIndex',
  GetAccountInfoByPubKey: 'GET /api/v1/account/getAccountInfoByPubKey',
  GetAccountStatusByAccountPk: 'GET /api/v1/account/getAccountStatusByAccountPk',
  GetCurrencyPriceBySymbol: 'GET /api/v1/info/getCurrencyPriceBySymbol',
  GetCurrencyPrices: 'GET /api/v1/info/getCurrencyPrices',
  GetSwapAmount: 'GET /api/v1/pair/getSwapAmount',
  GetAvailablePairs: 'GET /api/v1/pair/getAvailablePairs',
  GetLPValue: 'GET /api/v1/pair/getLPValue',
  GetPairInfo: 'GET /api/v1/pair/getPairInfo',
  GetTxByHash: 'GET /api/v1/tx/getTxByHash',
  GetMempoolTxs: 'GET /api/v1/tx/getMempoolTxs',
  GetMempoolTxsByAccountName: 'GET /api/v1/tx/getmempoolTxsByAccountName',
  GetAccountInfoByAccountName: 'GET /api/v1/account/getAccountInfoByAccountName',
  GetNextNonce: 'GET /api/v1/tx/getNextNonce',
  GetTxsListByBlockHeight: 'GET /api/v1/tx/getTxsListByBlockHeight',
  GetMaxOfferId: 'GET /api/v1/nft/getMaxOfferId',
  GetBlockByHeight: 'GET /api/v1/block/getBlockByBlockHeight',
  GetBlocks: 'GET /api/v1/block/getBlocks',
  SendRawTx: 'POST /api/v1/tx/sendTx',
  SendRawCreateCollectionTx: 'POST /api/v1/tx/sendCreateCollectionTx',
  SendRawMintNftTx: 'POST /api/v1/tx/sendMintNftTx',
  MintNft: 'POST /api/v1/tx/sendMintNftTx',
  CreateCollection: 'POST /api/v1/tx/sendCreateCollectionTx',
  GetGasAccount: 'GET /api/v1/info/getGasAccount',
  GetAccountNftList: 'GET /api/v1/nft/getAccountNftList',
  GetTxsList: 'GET /api/v1/tx/getTxsList',
} as const;

// 'GetTxsByPubKey' | 'GetTxsByAccountName' | ... | 'CreateCollection'
export type API_NAME = keyof typeof API_MAP;

// 'GET /api/v1/tx/getTxsByPubKey' | ... | 'POST /api/v1/tx/sendCreateCollectionTx'
export type URL_INFO = typeof API_MAP[API_NAME];

export interface IReqParmsMap {
  [API_MAP.GetTxsByPubKey]: IReqBaseParam & {
    account_pk: Zk.PublicKey;
  };
  [API_MAP.GetTxsByAccountName]: IReqBaseParam & {
    account_name: Zk.AccountName;
  };
  [API_MAP.GetTxsByAccountIndexAndTxType]: IReqBaseParam & {
    account_index: Zk.AccountIndex;
    tx_type: number;
  };
  [API_MAP.GetTxsListByAccountIndex]: IReqBaseParam & {
    account_index: Zk.AccountIndex;
  };
  [API_MAP.Search]: { info: string };
  [API_MAP.GetAccounts]: IReqBaseParam;
  [API_MAP.GetGasFeeAssetList]: Record<string, never>;
  [API_MAP.GetWithdrawGasFee]: {
    asset_id: Zk.AssetId;
    withdraw_asset_id: Zk.AssetId;
    withdraw_amount: Zk.Amount;
  };
  [API_MAP.GetGasFee]: { asset_id: Zk.AssetId };
  [API_MAP.GetAssetsList]: Record<string, never>;
  [API_MAP.GetLayer2BasicInfo]: Record<string, never>;
  [API_MAP.GetBlockByCommitment]: { block_commitment: string };
  [API_MAP.GetBalanceByAssetIdAndAccountName]: {
    asset_id: Zk.AssetId;
    account_name: Zk.AccountName;
  };
  [API_MAP.GetAccountStatusByAccountName]: { account_name: Zk.AccountName };
  [API_MAP.GetAccountInfoByAccountIndex]: { account_index: Zk.AccountIndex };
  [API_MAP.GetAccountInfoByPubKey]: { account_pk: Zk.AccountPk };
  [API_MAP.GetAccountStatusByAccountPk]: { account_pk: Zk.AccountPk };
  [API_MAP.GetCurrencyPriceBySymbol]: { symbol: string };
  [API_MAP.GetCurrencyPrices]: Record<string, never>;
  [API_MAP.GetSwapAmount]: {
    pair_index: number;
    asset_id: Zk.AssetId;
    asset_amount: Zk.Amount;
    is_from: boolean;
  };
  [API_MAP.GetAvailablePairs]: Record<string, never>;
  [API_MAP.GetLPValue]: {
    pair_index: Zk.Pair['pair_index'];
    lp_amount: Zk.Amount;
  };
  [API_MAP.GetPairInfo]: { pair_index: Zk.Pair['pair_index'] };
  [API_MAP.GetTxByHash]: { tx_hash: Zk.Hash };
  [API_MAP.GetMempoolTxs]: IReqBaseParam;
  [API_MAP.GetMempoolTxsByAccountName]: { account_name: Zk.AccountName };
  [API_MAP.GetAccountInfoByAccountName]: { account_name: Zk.AccountName };
  [API_MAP.GetNextNonce]: { account_index: Zk.AccountIndex };
  [API_MAP.GetTxsListByBlockHeight]: IReqBaseParam & {
    block_height: number;
  };
  [API_MAP.GetMaxOfferId]: { account_index: Zk.AccountIndex };
  [API_MAP.GetBlockByHeight]: { block_height: number };
  [API_MAP.GetBlocks]: IReqBaseParam;
  [API_MAP.SendRawTx]: { tx_type: number; tx_info: string };
  [API_MAP.SendRawCreateCollectionTx]: { tx_info: string };
  [API_MAP.SendRawMintNftTx]: { tx_info: string };
  [API_MAP.MintNft]: { tx_info: string };
  [API_MAP.CreateCollection]: { tx_info: string };
  [API_MAP.GetGasAccount]: Record<string, never>;
  [API_MAP.GetAccountNftList]: IReqBaseParam & { account_index: Zk.AccountIndex };
  [API_MAP.GetTxsList]: IReqBaseParam;
}

export interface IResponseMap {
  [API_MAP.GetTxsByPubKey]: { total: number; txs: Zk.Tx[] };
  [API_MAP.GetTxsByAccountName]: { total: number; txs: Zk.Tx[] };
  [API_MAP.GetTxsByAccountIndexAndTxType]: { total: number; txs: Zk.Tx[] };
  [API_MAP.GetTxsListByAccountIndex]: { total: number; txs: Zk.Tx[] };
  [API_MAP.Search]: { data_type: string };
  [API_MAP.GetAccounts]: {
    total: number;
    accounts: (Zk.Account & { public_key: Zk.PublicKey })[];
  };
  [API_MAP.GetGasFeeAssetList]: Record<string, never>;
  [API_MAP.GetWithdrawGasFee]: { gas_fee: number };
  [API_MAP.GetGasFee]: { gas_fee: number };
  [API_MAP.GetAssetsList]: { assets: Zk.AssetInfo[] };
  [API_MAP.GetLayer2BasicInfo]: Zk.Layer2BasicInfo;
  [API_MAP.GetBlockByCommitment]: { block: string };
  [API_MAP.GetBalanceByAssetIdAndAccountName]: { balance_enc: string };
  [API_MAP.GetAccountStatusByAccountName]: {
    account_status: Zk.AccountStatus;
    account_index: Zk.AccountIndex;
    account_pk: Zk.AccountPk;
  };
  [API_MAP.GetAccountInfoByAccountIndex]: {
    account_status: Zk.AccountStatus;
    account_name: Zk.AccountName;
    account_pk: Zk.AccountPk;
    assets: Zk.AccountAsset[];
  };
  [API_MAP.GetAccountInfoByPubKey]: {
    account_status: Zk.AccountStatus;
    account_name: Zk.AccountName;
    account_index: Zk.AccountIndex;
    assets: Zk.AccountAsset[];
  };
  [API_MAP.GetAccountStatusByAccountPk]: {
    account_status: Zk.AccountStatus;
    account_name: Zk.AccountName;
    account_index: Zk.AccountIndex;
  };
  [API_MAP.GetCurrencyPriceBySymbol]: {
    assetId: Zk.AssetId;
    price: Zk.Price;
  };
  [API_MAP.GetCurrencyPrices]: {
    data: { pair: string; assetId: Zk.AssetId; price: Zk.Price };
  };
  [API_MAP.GetSwapAmount]: {
    res_asset_amount: Zk.Amount;
    res_asset_id: Zk.AssetId;
  };
  [API_MAP.GetAvailablePairs]: { result: Zk.Pair };
  [API_MAP.GetLPValue]: Zk.LP;
  [API_MAP.GetPairInfo]: Pick<Zk.Pair, 'asset_a_id' | 'asset_a_amount' | 'asset_b_id' | 'asset_b_amount'> & {
    total_lp_amount: Zk.Amount;
  };
  [API_MAP.GetTxByHash]: {
    result: Zk.Tx;
    committed_at: Zk.TimeStamp;
    verified_at: Zk.TimeStamp;
    executed_at: Zk.TimeStamp;
    asset_a_id: Zk.AssetId;
    asset_b_id: Zk.AssetId;
  };
  [API_MAP.GetMempoolTxs]: { total: number; mempool_txs: Zk.Tx[] };
  [API_MAP.GetMempoolTxsByAccountName]: {
    total: number;
    mempool_txs: Zk.Tx[];
  };
  [API_MAP.GetAccountInfoByAccountName]: Zk.Account & {
    nonce: number;
    account_pk: Zk.PublicKey;
    assets: Zk.AccountAsset[];
  };
  [API_MAP.GetNextNonce]: { nonce: Zk.Nonce };
  [API_MAP.GetTxsListByBlockHeight]: Zk.Tx[];
  [API_MAP.GetMaxOfferId]: { offset_id: number };
  [API_MAP.GetBlockByHeight]: { block: Zk.Block };
  [API_MAP.GetBlocks]: { total: number; blocks: Zk.Block[] };
  [API_MAP.SendRawTx]: { tx_id: string };
  [API_MAP.SendRawCreateCollectionTx]: { collection_id: number };
  [API_MAP.SendRawMintNftTx]: { nft_index: number };
  [API_MAP.MintNft]: { nft_index: number };
  [API_MAP.CreateCollection]: { collection_id: number };
  [API_MAP.GetGasAccount]: {
    account_status: Zk.AccountStatus;
    account_index: Zk.AccountIndex;
    account_name: Zk.AccountName;
  };
  [API_MAP.GetAccountNftList]: {
    total: number;
    nfts: Zk.Nft[];
  };
  [API_MAP.GetTxsList]: {
    total: number;
    txs: Zk.Tx[];
  };
}
