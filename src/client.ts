import * as Zk from './zk';
import * as API from './api';

import { Http } from './http';

export class Client {
  private http: Http;

  constructor(endpoint: string) {
    this.http = new Http(endpoint);
  }

  async getTx(hash: Zk.Hash) {
    return await this.http.req(API.API_MAP.GetTx, {
      hash,
    });
  }

  /**
   * returns txs by account public key
   */
  async getTxsByAccountPk(accountPk: Zk.AccountPk, offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetTxsByAccount, {
      value: accountPk,
      by: 'account_pk',
      offset,
      limit,
    });
  }

  /**
   * returns txs by account account name
   */
  async getTxsByAccountName(accountName: string, offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetTxsByAccount, {
      value: accountName,
      by: 'account_name',
      offset,
      limit,
    });
  }

  /**
   * returns txs by account account index
   */
  async getTxsByAccountIndex(accountIndex: Zk.AccountIndex, offset: number, limit: number) {
    return this.http.req(API.API_MAP.GetTxsByAccount, {
      by: 'account_index',
      value: accountIndex,
      offset,
      limit,
    });
  }

  /**
   * returns tx by tx hash
   */
  async getTxs(offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetTxs, {
      offset,
      limit,
    });
  }

  /**
   * returns data type by queried info
   */
  async search(info: string) {
    return await this.http.req(API.API_MAP.Search, {
      keyword: info,
    });
  }

  /**
   * returns accounts by query conditions
   */
  async getAccounts(offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetAccounts, {
      offset,
      limit,
    });
  }

  /**
   * returns gas fee asset list
   */
  async getGasFeeAssets() {
    return await this.http.req(API.API_MAP.GetGasFeeAssets, {});
  }

  /**
   * returns withdraw gas fee
   */
  async getWithdrawGasFee(assetId: number, withdrawAssetId: number, withdrawAmount: string) {
    return await this.http.req(API.API_MAP.GetWithdrawGasFee, {
      asset_id: assetId,
      withdraw_asset_id: withdrawAssetId,
      withdraw_amount: withdrawAmount,
    });
  }

  /**
   * returns gas fee for asset
   */
  async getGasFee(assetId: number) {
    return await this.http.req(API.API_MAP.GetGasFee, {
      asset_id: assetId,
    });
  }

  /**
   * returns asset list
   */
  async getAssets(offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetAssets, {
      offset,
      limit,
    });
  }

  /**
   * returns layer 2 basic info
   */
  async getLayer2BasicInfo() {
    return await this.http.req(API.API_MAP.GetLayer2BasicInfo, {});
  }

  /**
   * returns block by commitment
   */
  async getBlockByCommitment(blockCommitment: string) {
    return await this.http.req(API.API_MAP.GetBlockByParam, {
      by: 'commitment',
      value: blockCommitment,
    });
  }

  /**
   * returns block by height
   */
  async getBlockByHeight(blockHeight: number) {
    return await this.http.req(API.API_MAP.GetBlockByParam, {
      by: 'height',
      value: blockHeight,
    });
  }

  /**
   * returns account info by account index
   */
  async getAccountByIndex(accountIndex: number) {
    return await this.http.req(API.API_MAP.GetAccountByParam, {
      by: 'index',
      value: accountIndex,
    });
  }

  /**
   * returns account info by public key
   */
  async getAccountByPubKey(pubKey: string) {
    return await this.http.req(API.API_MAP.GetAccountByParam, {
      by: 'pk',
      value: pubKey,
    });
  }

  /**
   * returns account (mainly pubkey) by using account_name
   */
  async getAccountByName(accountName: string) {
    return await this.http.req(API.API_MAP.GetAccountByParam, {
      by: 'name',
      value: accountName,
    });
  }

  /**
   * returns current block height
   */
  async getCurrentHeight() {
    return await this.http.req(API.API_MAP.GetCurrentHeight, {});
  }

  /**
   * returns currency price by symbol
   */
  async getCurrencyPriceBySymbol(symbol: string) {
    return await this.http.req(API.API_MAP.GetCurrencyPrice, {
      by: 'symbol',
      value: symbol,
    });
  }

  /**
   * returns all currency prices
   */
  async getCurrencyPrices(offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetCurrencyPrices, {
      offset,
      limit,
    });
  }

  /**
   * returns available pairs
   */
  async getPairs(offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetPairs, {
      offset,
      limit,
    });
  }

  /**
   * returns swap amount by request
   */
  async getSwapAmount(params: { pairIndex: number; assetId: number; assetAmount: string; isFrom: boolean }) {
    return await this.http.req(API.API_MAP.GetSwapAmount, {
      pair_index: params.pairIndex,
      asset_id: params.assetId,
      asset_amount: params.assetAmount,
      is_from: params.isFrom,
    });
  }

  /**
   * returns lp value
   */
  async getLPValue(params: { pairIndex: number; lpAmount: string }) {
    return await this.http.req(API.API_MAP.GetLPValue, {
      pair_index: params.pairIndex,
      lp_amount: params.lpAmount,
    });
  }

  /**
   * returns pair by pair index
   */
  async getPair(index: number) {
    return this.http.req(API.API_MAP.GetPair, { index });
  }

  /**
   * returns tx by tx hash
   */
  async getTxByHash(txHash: string) {
    return this.http.req(API.API_MAP.GetTx, {
      hash: txHash,
    });
  }

  /**
   * returns the mempool txs
   */
  async getMempoolTxs(offset: number, limit: number) {
    return this.http.req(API.API_MAP.GetMempoolTxs, {
      offset,
      limit,
    });
  }

  /**
   * returns the mempool txs by account name
   */
  async getMempoolTxsByAccountName(accountName: string) {
    return this.http.req(API.API_MAP.GetMempoolTxsByAccountName, {
      by: 'account_name',
      value: accountName,
    });
  }

  /**
   * returns nonce of account
   */
  async getNextNonce(accountIndex: number) {
    return this.http.req(API.API_MAP.GetNextNonce, {
      account_index: accountIndex,
    });
  }

  /**
   * return txs in block
   */
  async getTxsByBlockHeight(blockHeight: number) {
    return this.http.req(API.API_MAP.GetTxsByBlockHeight, {
      by: 'block_height',
      value: blockHeight,
    });
  }

  /**
   * returns max offer id for an account
   */
  async getMaxOfferId(accountIndex: number) {
    return this.http.req(API.API_MAP.GetMaxOfferId, {
      account_index: accountIndex,
    });
  }

  /**
   * returns total blocks num and block list
   */
  async getBlocks(offset: number, limit: number) {
    return this.http.req(API.API_MAP.GetBlocks, {
      limit,
      offset,
    });
  }

  /**
   * sends signed raw transaction and returns tx id
   */
  async sendRawTx(txType: string, txInfo: string) {
    return this.http.req(API.API_MAP.SendRawTx, {
      tx_info: txInfo,
      tx_type: txType,
    });
  }

  /**
   * returns gas account of layer 2
   */
  async getGasAccount() {
    return this.http.req(API.API_MAP.GetGasAccount, {});
  }

  /**
   * returns nfts by account index
   */
  async getNftsByAccountIndex(accountIndex: number, offset: number, limit: number) {
    return this.http.req(API.API_MAP.GetNftsByAccountIndex, {
      by: 'account_index',
      value: accountIndex,
      offset,
      limit,
    });
  }

  async sendRawCreateCollectionTx(txInfo: string) {
    return this.http.req(API.API_MAP.SendRawCreateCollectionTx, {
      tx_info: txInfo,
    });
  }

  async sendRawMintNftTx(txInfo: string) {
    return this.http.req(API.API_MAP.SendRawMintNftTx, {
      tx_info: txInfo,
    });
  }
}
