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
    return await this.http.req('GET /api/v1/tx/getTxsByPubKey', {
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
    return await this.http.req('GET /api/v1/tx/getTxsByAccountName', {
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
    return await this.http.req('GET /api/v1/tx/getTxsByAccountIndexAndTxType', {
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
    return await this.http.req('GET /api/v1/tx/getTxsListByAccountIndex', {
      account_index: accountIndex,
      offset,
      limit
    });
  }

  async search(info: string) {
    return await this.http.req('GET /api/v1/info/search', {
      info
    });
  }

  async getAccounts(offset: number, limit: number) {
    return await this.http.req('GET /api/v1/info/getAccounts', {
      offset,
      limit
    });
  }

  async getGasFeeAssetList() {
    return await this.http.req('GET /api/v1/info/getGasFeeAssetList', {});
  }

  async getWithdrawGasFee(
    assetId: number,
    withdrawAssetId: number,
    withdrawAmount: string
  ) {
    return await this.http.req('GET /api/v1/info/getWithdrawGasFee', {
      asset_id: assetId,
      withdraw_asset_id: withdrawAssetId,
      withdraw_amount: withdrawAmount
    });
  }

  async getGetGasFee(assetId: number) {
    return await this.http.req('GET /api/v1/info/getGasFee', {
      asset_id: assetId
    });
  }

  async getAssetsList() {
    return await this.http.req('GET /api/v1/info/getAssetsList', {});
  }

  async getLayer2BasicInfo() {
    return await this.http.req('GET /api/v1/info/getLayer2BasicInfo', {});
  }

  async getBlockByCommitment(blockCommitment: string) {
    return await this.http.req('GET /api/v1/block/getBlockByCommitment', {
      block_commitment: blockCommitment
    });
  }

  async getBalanceByAssetIdAndAccountName(
    accountName: string,
    assetId: number
  ) {
    return await this.http.req('GET /api/v1/account/getBalanceByAssetIdAndAccountName', {
      account_name: accountName,
      asset_id: assetId
    });
  }

  async getAccountStatusByAccountName(accountName: string) {
    return await this.http.req('GET /api/v1/account/getAccountStatusByAccountName', {
      account_name: accountName
    });
  }

  async getAccountInfoByAccountIndex(accountIndex: number) {
    return await this.http.req('GET /api/v1/account/getAccountInfoByAccountIndex', {
      account_index: accountIndex
    });
  }

  async getAccountInfoByPubKey(pubKey: string) {
    return await this.http.req('GET /api/v1/account/getAccountInfoByPubKey', {
      account_pk: pubKey
    });
  }

  async getAccountStatusByAccountPk(pubKey: string) {
    return await this.http.req('GET /api/v1/account/getAccountStatusByAccountPk', {
      account_pk: pubKey
    });
  }

  async getCurrencyPriceBySymbol(symbol: string) {
    return await this.http.req('GET /api/v1/info/getCurrencyPriceBySymbol', {
      symbol: symbol
    });
  }

  async getCurrencyPrices() {
    return await this.http.req('GET /api/v1/info/getCurrencyPrices', {});
  }

  async getSwapAmount(params: {
    pairIndex: number;
    assetId: number;
    assetAmount: string;
    isFrom: boolean;
  }) {
    return await this.http.req('GET /api/v1/pair/getSwapAmount', {
      pair_index: params.pairIndex,
      asset_id: params.assetId,
      asset_amount: params.assetAmount,
      is_from: params.isFrom
    });
  }

  /* async getAvailablePairs() {
    return await this.http.req('GET /api/v1/pair/getSwapAmount', {});
  } */

  async getLPValue(params: { pairIndex: number; lpAmount: string }) {
    return await this.http.req('GET /api/v1/pair/getLPValue', {
      pair_index: params.pairIndex,
      lp_amount: params.lpAmount
    });
  }

  async getPairInfo(pairIndex: number) {
    return this.http.req('GET /api/v1/pair/getPairInfo', { pair_index: pairIndex });
  }

  async getTxByHash(txHash: string) {
    return this.http.req('GET /api/v1/tx/getTxByHash', {
      tx_hash: txHash
    });
  }

  async getMempoolTxs(offset: number, limit: number) {
    return this.http.req('GET /api/v1/tx/getMempoolTxs', {
      offset,
      limit
    });
  }

  async getMempoolTxsByAccountName(accountName: string) {
    return this.http.req('GET /api/v1/tx/getmempoolTxsByAccountName', {
      account_name: accountName
    });
  }

  async getAccountInfoByAccountName(accountName: string) {
    return this.http.req('GET /api/v1/account/getAccountInfoByAccountName', {
      account_name: accountName
    });
  }

  async getNextNonce(accountIndex: number) {
    return this.http.req('GET /api/v1/tx/getNextNonce', {
      account_index: accountIndex
    });
  }

  async getTxsListByBlockHeight(blockHeight: number) {
    return this.http.req('GET /api/v1/tx/getTxsListByBlockHeight', {
      block_height: blockHeight,
      offset: 0,
      limit: 0
    });
  }

  async getMaxOfferId(accountIndex: number) {
    return this.http.req('GET /api/v1/nft/getMaxOfferId', {
      account_index: accountIndex
    });
  }

  async getBlockByHeight(blockHeight: number) {
    return this.http.req('GET /api/v1/block/getBlockByBlockHeight', {
      block_height: blockHeight
    });
  }

  async getBlocks(offset: number, limit: number) {
    return this.http.req('GET /api/v1/block/getBlocks', {
      limit,
      offset
    });
  }

  async sendRawTx(txInfo: string, txType: number) {
    return this.http.req('POST /api/v1/tx/sendTx', {
      tx_info: txInfo,
      tx_type: txType
    });
  }

  async sendRawCreateCollectionTx(txInfo: string) {
    return this.http.req('POST /api/v1/tx/sendCreateCollectionTx', {
      tx_info: txInfo
    });
  }

  async sendRawMintNftTx(txInfo: string) {
    return this.http.req('POST /api/v1/tx/sendMintNftTx', {
      tx_info: txInfo
    });
  }

  async mintNft(txInfo: string) {
    return this.http.req('POST /api/v1/tx/sendMintNftTx', {
      tx_info: txInfo
    });
  }

  async createCollection(txInfo: string) {
    return this.http.req('POST /api/v1/tx/sendCreateCollectionTx', {
      tx_info: txInfo
    });
  }
}
