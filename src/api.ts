import * as Zk from './zk';

export interface IReqBaseParam {
  offset: number;
  limit: number;
}

export const enum API_MAP {
  GetAccountByParam = 'GET /api/v1/account',
  GetAccounts = 'GET /api/v1/accounts',
  GetAsset = 'GET /api/v1/asset',
  GetAssets = 'GET /api/v1/assets',
  GetBlockByParam = 'GET /api/v1/block',
  GetBlocks = 'GET /api/v1/blocks',
  GetCurrentHeight = 'GET /api/v1/currentHeight',
  GetGasAccount = 'GET /api/v1/gasAccount',
  GetGasFee = 'GET /api/v1/gasFee',
  GetGasFeeAssets = 'GET /api/v1/gasFeeAssets',
  GetLayer2BasicInfo = 'GET /api/v1/layer2BasicInfo',
  GetLPValue = 'GET /api/v1/lpValue',
  GetMaxOfferId = 'GET /api/v1/maxOfferId',
  GetMempoolTxs = 'GET /api/v1/mempoolTxs',
  GetMempoolTxsByL1Address = 'GET /api/v1/accountMempoolTxs',
  GetNextNonce = 'GET /api/v1/nextNonce',
  GetNftsByAccountIndex = 'GET /api/v1/accountNfts',
  GetPair = 'GET /api/v1/pair',
  GetPairs = 'GET /api/v1/pairs',
  GetSwapAmount = 'GET /api/v1/swapAmount',
  GetTx = 'GET /api/v1/tx',
  GetTxs = 'GET /api/v1/txs',
  GetTxsByAccount = 'GET /api/v1/mergedAccountTxs',
  GetTxsByBlockHeight = 'GET /api/v1/blockTxs',
  GetWithdrawGasFee = 'GET /api/v1/withdrawGasFee',
  Search = 'GET /api/v1/search',
  SendRawCreateCollectionTx = 'POST /api/v1/tx/sendCreateCollectionTx',
  SendRawMintNftTx = 'POST /api/v1/tx/sendMintNftTx',
  GetSignatureMessage = 'POST /api/v1/l2Signature',
  SendRawTx = 'POST /api/v1/sendTx',
  GetProtocolRate = 'GET /api/v1/getProtocolRate',
}

// 'GetTxsByPubKey' | 'GetTxsByL1Address' | ... | 'CreateCollection'
export type API_NAME = keyof typeof API_MAP;

// 'GET /api/v1/tx/getTxsByPubKey' | ... | 'POST /api/v1/tx/sendCreateCollectionTx'
export type URL_INFO = (typeof API_MAP)[API_NAME];

export interface IReqParmsMap {
  [API_MAP.GetTxsByAccount]: IReqBaseParam & {
    types: string;
  } & (
      | {
          value: Zk.PublicKey;
          by: 'account_pk';
        }
      | {
          value: Zk.L1Address;
          by: 'l1_address';
        }
      | {
          value: Zk.AccountIndex;
          by: 'account_index';
        }
    );
  [API_MAP.GetTxs]: IReqBaseParam;
  [API_MAP.Search]: { keyword: string };
  [API_MAP.GetAsset]:
    | {
        value: number;
        by: 'id';
      }
    | {
        value: string;
        by: 'symbol';
      };
  [API_MAP.GetAccounts]: IReqBaseParam;
  [API_MAP.GetGasFeeAssets]: Record<string, never>;
  [API_MAP.GetWithdrawGasFee]: {
    asset_id: Zk.Asset['id'];
    withdraw_asset_id: Zk.Asset['id'];
    withdraw_amount: Zk.Amount;
  };
  [API_MAP.GetGasFee]: { asset_id: Zk.Asset['id']; tx_type: Zk.TxType };
  [API_MAP.GetAssets]: IReqBaseParam;
  [API_MAP.GetLayer2BasicInfo]: Record<string, never>;
  [API_MAP.GetBlockByParam]: { by: 'commitment'; value: string } | { by: 'height'; value: number };
  [API_MAP.GetCurrentHeight]: Record<string, never>;
  [API_MAP.GetAccountByParam]: { by: 'index'; value: Zk.AccountIndex } | { by: 'l1_address'; value: Zk.L1Address };
  [API_MAP.GetSwapAmount]: {
    pair_index: number;
    asset_id: Zk.Asset['id'];
    asset_amount: string;
    is_from: boolean;
  };
  [API_MAP.GetPairs]: IReqBaseParam;
  [API_MAP.GetLPValue]: {
    pair_index: Zk.Pair['index'];
    lp_amount: Zk.Amount;
  };
  [API_MAP.GetPair]: { index: Zk.Pair['index'] };
  [API_MAP.GetTx]: { hash: Zk.Hash };
  [API_MAP.GetMempoolTxs]: IReqBaseParam;
  [API_MAP.GetMempoolTxsByL1Address]: { by: 'l1_address'; value: Zk.L1Address };

  [API_MAP.GetNextNonce]: { account_index: Zk.AccountIndex };
  [API_MAP.GetTxsByBlockHeight]: {
    by: 'block_height';
    value: number;
  };
  [API_MAP.GetMaxOfferId]: { account_index: Zk.AccountIndex };
  [API_MAP.GetBlocks]: IReqBaseParam;
  [API_MAP.GetSignatureMessage]: { tx_type: Zk.TxType; tx_info: string };
  [API_MAP.SendRawTx]: { tx_type: Zk.TxType; tx_info: string };
  [API_MAP.SendRawCreateCollectionTx]: { tx_info: string };
  [API_MAP.SendRawMintNftTx]: { tx_info: string };
  [API_MAP.GetGasAccount]: Record<string, never>;
  [API_MAP.GetNftsByAccountIndex]: IReqBaseParam & { by: 'account_index'; value: Zk.AccountIndex };
  [API_MAP.GetProtocolRate]: Record<string, never>;
}

export interface IResponseMap {
  [API_MAP.GetTxsByAccount]: { total: number; txs: Zk.Tx[] };
  [API_MAP.GetTxs]: { total: number; txs: Zk.Tx[] };
  [API_MAP.Search]: { data_type: number };
  [API_MAP.GetAccounts]: {
    total: number;
    accounts: Zk.SimpleAccount[];
  };
  [API_MAP.GetGasFeeAssets]: { assets: Zk.Asset[] };
  [API_MAP.GetWithdrawGasFee]: { gas_fee: string };
  [API_MAP.GetGasFee]: { gas_fee: string };
  [API_MAP.GetAsset]: Zk.Asset;
  [API_MAP.GetAssets]: { total: number; assets: Zk.Asset[] };
  [API_MAP.GetLayer2BasicInfo]: Zk.Layer2BasicInfo;
  [API_MAP.GetBlockByParam]: Zk.Block;
  [API_MAP.GetBlocks]: { total: number; blocks: Zk.Block[] };
  [API_MAP.GetCurrentHeight]: { height: number };
  [API_MAP.GetAccountByParam]: Zk.Account;
  [API_MAP.GetSwapAmount]: {
    asset_id: Zk.Asset['id'];
    asset_name: Zk.Asset['name'];
    asset_amount: string;
  };
  [API_MAP.GetPairs]: { pairs: Zk.Pair[] };
  [API_MAP.GetLPValue]: Zk.LpValue;
  [API_MAP.GetPair]: Zk.Pair;
  [API_MAP.GetTx]: Zk.Tx & {
    committed_at: Zk.TimeStamp;
    verified_at: Zk.TimeStamp;
    executed_at: Zk.TimeStamp;
    asset_a_id: Zk.Asset['id'];
    asset_b_id: Zk.Asset['id'];
  };
  [API_MAP.GetMempoolTxs]: { total: number; txs: Zk.Tx[] };
  [API_MAP.GetMempoolTxsByL1Address]: {
    total: number;
    mempool_txs: Zk.Tx[];
  };

  [API_MAP.GetNextNonce]: { nonce: Zk.Nonce };
  [API_MAP.GetTxsByBlockHeight]: { txs: Zk.Tx[]; total: number };
  [API_MAP.GetMaxOfferId]: { offer_id: number };
  [API_MAP.GetSignatureMessage]: { sign_body: string };
  [API_MAP.SendRawTx]: { tx_hash: string };
  [API_MAP.SendRawCreateCollectionTx]: { collection_id: number };
  [API_MAP.SendRawMintNftTx]: { nft_index: number };
  [API_MAP.GetGasAccount]: Zk.GasAccount;
  [API_MAP.GetNftsByAccountIndex]: {
    total: number;
    nfts: Zk.Nft[];
  };
  [API_MAP.GetProtocolRate]: { protocol_rate: string };
}
