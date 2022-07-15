import { Http } from './http';

export class Client {
  private http: Http;

  constructor(endpoint: string) {
    this.http = new Http(endpoint);
  }

  // setKeyManager(keyManager) {
  //   this.keyManager = keyManager;
  // }

  async getTxsByPubKey(accountPk: string, offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetTxsByPubKey, {
      account_pk: accountPk,
      offset,
      limit
    });
  }

  async getTxsByAccountName(
    accountName: string,
    offset: number,
    limit: number
  ) {
    return await this.http.req(API.API_MAP.GetTxsByAccountName, {
      account_name: accountName,
      offset,
      limit
    });
  }

  async getTxsByAccountIndexAndTxType(
    accountIndex: number,
    txType: number,
    offset: number,
    limit: number
  ) {
    return await this.http.req(API.API_MAP.GetTxsByAccountIndexAndTxType, {
      account_index: accountIndex,
      tx_type: txType,
      offset,
      limit
    });
  }

  async getTxsListByAccountIndex(
    accountIndex: number,
    offset: number,
    limit: number
  ) {
    return await this.http.req(API.API_MAP.GetTxsListByAccountIndex, {
      account_index: accountIndex,
      offset,
      limit
    });
  }

  async search(info: string) {
    return await this.http.req(API.API_MAP.Search, {
      info
    });
  }

  async getAccounts(offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetAccounts, {
      offset,
      limit
    });
  }

  async getGasFeeAssetList() {
    return await this.http.req(API.API_MAP.GetGasFeeAssetList, {});
  }

  async getWithdrawGasFee(
    assetId: number,
    withdrawAssetId: number,
    withdrawAmount: string
  ) {
    return await this.http.req(API.API_MAP.GetWithdrawGasFee, {
      asset_id: assetId,
      withdraw_asset_id: withdrawAssetId,
      withdraw_amount: withdrawAmount
    });
  }

  async getGetGasFee(assetId: number) {
    return await this.http.req(API.API_MAP.GetGasFee, {
      asset_id: assetId
    });
  }

  async getAssetsList() {
    return await this.http.req(API.API_MAP.GetAssetsList, {});
  }

  async getLayer2BasicInfo() {
    return await this.http.req(API.API_MAP.GetLayer2BasicInfo, {});
  }

  async getBlockByCommitment(blockCommitment: string) {
    return await this.http.req(API.API_MAP.GetBlockByCommitment, {
      block_commitment: blockCommitment
    });
  }

  async getBalanceByAssetIdAndAccountName(
    accountName: string,
    assetId: number
  ) {
    return await this.http.req(API.API_MAP.GetBalanceByAssetIdAndAccountName, {
      account_name: accountName,
      asset_id: assetId
    });
  }

  async getAccountStatusByAccountName(accountName: string) {
    return await this.http.req(API.API_MAP.GetAccountStatusByAccountName, {
      account_name: accountName
    });
  }

  async getAccountInfoByAccountIndex(accountIndex: number) {
    return await this.http.req(API.API_MAP.GetAccountInfoByAccountIndex, {
      account_index: accountIndex
    });
  }

  async getAccountInfoByPubKey(pubKey: string) {
    return await this.http.req(API.API_MAP.GetAccountInfoByPubKey, {
      account_pk: pubKey
    });
  }

  async getAccountStatusByAccountPk(pubKey: string) {
    return await this.http.req(API.API_MAP.GetAccountStatusByAccountPk, {
      account_pk: pubKey
    });
  }

  async getCurrencyPriceBySymbol(symbol: string) {
    return await this.http.req(API.API_MAP.GetCurrencyPriceBySymbol, {
      symbol: symbol
    });
  }

  async getCurrencyPrices() {
    return await this.http.req(API.API_MAP.GetCurrencyPrices, {});
  }

  async getSwapAmount(params: {
    pairIndex: number;
    assetId: number;
    assetAmount: string;
    isFrom: boolean;
  }) {
    return await this.http.req(API.API_MAP.GetSwapAmount, {
      pair_index: params.pairIndex,
      asset_id: params.assetId,
      asset_amount: params.assetAmount,
      is_from: params.isFrom
    });
  }

  async getAvailablePairs() {
    return await this.http.req(API.API_MAP.GetAvailablePairs, {});
  }

  async getLPValue(params: { pairIndex: number; lpAmount: string }) {
    return await this.http.req(API.API_MAP.GetLPValue, {
      pair_index: params.pairIndex,
      lp_amount: params.lpAmount
    });
  }

  async getPairInfo(pairIndex: number) {
    return this.http.req(API.API_MAP.GetPairInfo, { pair_index: pairIndex });
  }

  async getTxByHash(txHash: string) {
    return this.http.req(API.API_MAP.GetTxByHash, {
      tx_hash: txHash
    });
  }

  async getMempoolTxs(offset: number, limit: number) {
    return this.http.req(API.API_MAP.GetMempoolTxs, {
      offset,
      limit
    });
  }

  async getMempoolTxsByAccountName(accountName: string) {
    return this.http.req(API.API_MAP.GetMempoolTxsByAccountName, {
      account_name: accountName
    });
  }

  async getAccountInfoByAccountName(accountName: string) {
    return this.http.req(API.API_MAP.GetAccountInfoByAccountName, {
      account_name: accountName
    });
  }

  async getNextNonce(accountIndex: number) {
    return this.http.req(API.API_MAP.GetNextNonce, {
      account_index: accountIndex
    });
  }

  async getTxsListByBlockHeight(blockHeight: number) {
    return this.http.req(API.API_MAP.GetTxsListByBlockHeight, {
      block_height: blockHeight,
      offset: 0,
      limit: 0
    });
  }

  async getMaxOfferId(accountIndex: number) {
    return this.http.req(API.API_MAP.GetMaxOfferId, {
      account_index: accountIndex
    });
  }

  async getBlockByHeight(blockHeight: number) {
    return this.http.req(API.API_MAP.GetBlockByHeight, {
      block_height: blockHeight
    });
  }

  async getBlocks(offset: number, limit: number) {
    return this.http.req(API.API_MAP.GetBlocks, {
      limit,
      offset
    });
  }

  async sendRawTx(txInfo: string, txType: number) {
    return this.http.req(API.API_MAP.SendRawTx, {
      tx_info: txInfo,
      tx_type: txType
    });
  }

  async sendRawCreateCollectionTx(txInfo: string) {
    return this.http.req(API.API_MAP.SendRawCreateCollectionTx, {
      tx_info: txInfo
    });
  }

  async sendRawMintNftTx(txInfo: string) {
    return this.http.req(API.API_MAP.SendRawMintNftTx, {
      tx_info: txInfo
    });
  }

  async mintNft(txInfo: string) {
    return this.http.req(API.API_MAP.MintNft, {
      tx_info: txInfo
    });
  }

  async createCollection(txInfo: string) {
    return this.http.req(API.API_MAP.CreateCollection, {
      tx_info: txInfo
    });
  }
}
