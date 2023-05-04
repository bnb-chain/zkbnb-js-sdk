import * as Zk from './zk';
import { API_MAP, URL_INFO, IReqParmsMap, IResponseMap } from './api';
import { QueryClient, QueryConfig, QueryServer } from './query';

export type ZkbnbResponse<T> = T & { code: number; message?: string };

export class Client {
  query: QueryClient;

  constructor(baseURL: string, timeout = 30000) {
    const config = {
      timeout,
      baseURL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    };

    this.query = typeof window === 'undefined' ? new QueryServer(config) : new QueryClient(config);
  }

  private async req<T extends URL_INFO>(
    api: T,
    params: IReqParmsMap[T],
    config?: QueryConfig
  ): Promise<IResponseMap[T]> {
    const [method, url] = api.split(' ') as ['GET' | 'POST' | 'PUT', string];

    if (method === 'GET') {
      const { data } = await this.query.get<ZkbnbResponse<IResponseMap[T]>>(
        url + (params ? '?' + new URLSearchParams(params as any).toString() : ''),
        config
      );

      return data;
    }

    if (method === 'POST' || method === 'PUT') {
      const { data } = await this.query.post<IReqParmsMap[T], ZkbnbResponse<IResponseMap[T]>>(
        url + (params ? '?' + new URLSearchParams(params as any).toString() : ''),
        undefined,
        config
      );
      return data;
    }

    throw new Error('only support the http methods: GET, POST, PUT');
  }

  getTx(hash: Zk.Hash) {
    return this.req(API_MAP.GetTx, {
      hash,
    });
  }

  /**
   * returns txs by l1 address
   */
  async getTxsByL1Address(
    {
      l1Address,
      types,
      offset,
      limit,
    }: {
      l1Address: string;
      types: Zk.TxType[];
      offset: number;
      limit: number;
    },
    config?: QueryConfig
  ) {
    return this.req(
      API_MAP.GetTxsByAccount,
      {
        value: l1Address,
        by: 'l1_address',
        types: JSON.stringify(types),
        offset,
        limit,
      },
      config
    );
  }

  /**
   * returns txs by account account index
   */
  async getTxsByAccountIndex(
    {
      accountIndex,
      types,
      offset,
      limit,
    }: {
      accountIndex: Zk.AccountIndex;
      types: Zk.TxType[];
      offset: number;
      limit: number;
    },
    config?: QueryConfig
  ) {
    return this.req(
      API_MAP.GetTxsByAccount,
      {
        by: 'account_index',
        value: accountIndex,
        types: JSON.stringify(types),
        offset,
        limit,
      },
      config
    );
  }

  /**
   * returns tx by tx hash
   */
  async getTxs({ offset, limit }: { offset: number; limit: number }, config?: QueryConfig) {
    return this.req(API_MAP.GetTxs, { offset, limit }, config);
  }

  /**
   * returns data type by queried info
   */
  async search(info: string, config?: QueryConfig) {
    return this.req(API_MAP.Search, { keyword: info }, config);
  }

  /**
   * returns accounts by query conditions
   */
  async getAccounts({ offset, limit }: { offset: number; limit: number }, config?: QueryConfig) {
    return this.req(API_MAP.GetAccounts, { offset, limit }, config);
  }

  /**
   * returns gas fee asset list
   */
  async getGasFeeAssets(config?: QueryConfig) {
    return this.req(API_MAP.GetGasFeeAssets, {}, config);
  }

  /**
   * returns withdraw gas fee
   */
  async getWithdrawGasFee(
    {
      assetId,
      withdrawAssetId,
      withdrawAmount,
    }: {
      assetId: number;
      withdrawAssetId: number;
      withdrawAmount: string;
    },
    config?: QueryConfig
  ) {
    return this.req(
      API_MAP.GetWithdrawGasFee,
      {
        asset_id: assetId,
        withdraw_asset_id: withdrawAssetId,
        withdraw_amount: withdrawAmount,
      },
      config
    );
  }

  /**
   * returns gas fee for asset
   */
  async getGasFee({ assetId, txType }: { assetId: number; txType: number }, config?: QueryConfig) {
    return this.req(
      API_MAP.GetGasFee,
      {
        asset_id: assetId,
        tx_type: txType,
      },
      config
    );
  }

  /**
   * returns gas fee asset list
   */
  async getProtocolRateFee(config?: QueryConfig) {
    return this.req(API_MAP.GetProtocolRate, {}, config);
  }

  /**
   * returns asset by asset id
   */
  async getAssetById(assetId: number, config?: QueryConfig) {
    return this.req(
      API_MAP.GetAsset,
      {
        by: 'id',
        value: assetId,
      },
      config
    );
  }

  async getAssetBySymbol(symbol: string, config?: QueryConfig) {
    return this.req(
      API_MAP.GetAsset,
      {
        by: 'symbol',
        value: symbol,
      },
      config
    );
  }

  /**
   * returns asset list
   */
  async getAssets({ offset, limit }: { offset: number; limit: number }, config?: QueryConfig) {
    return this.req(
      API_MAP.GetAssets,
      {
        offset,
        limit,
      },
      config
    );
  }

  /**
   * returns layer 2 basic info
   */
  async getLayer2BasicInfo(config?: QueryConfig) {
    return this.req(API_MAP.GetLayer2BasicInfo, {}, config);
  }

  /**
   * returns block by commitment
   */
  async getBlockByCommitment(blockCommitment: string, config?: QueryConfig) {
    return this.req(
      API_MAP.GetBlockByParam,
      {
        by: 'commitment',
        value: blockCommitment,
      },
      config
    );
  }

  /**
   * returns block by height
   */
  async getBlockByHeight(blockHeight: number, config?: QueryConfig) {
    return this.req(
      API_MAP.GetBlockByParam,
      {
        by: 'height',
        value: blockHeight,
      },
      config
    );
  }

  /**
   * returns account info by account index
   */
  async getAccountByIndex(accountIndex: number, config?: QueryConfig) {
    return this.req(
      API_MAP.GetAccountByParam,
      {
        by: 'index',
        value: accountIndex,
      },
      config
    );
  }

  /**
   * returns account (mainly pubkey) by using l1_address
   */
  async getAccountByL1Address(l1Address: string, config?: QueryConfig) {
    return this.req(
      API_MAP.GetAccountByParam,
      {
        by: 'l1_address',
        value: l1Address,
      },
      config
    );
  }

  /**
   * returns current block height
   */
  async getCurrentHeight(config?: QueryConfig) {
    return this.req(API_MAP.GetCurrentHeight, {}, config);
  }

  /**
   * returns available pairs
   */
  async getPairs({ offset, limit }: { offset: number; limit: number }, config?: QueryConfig) {
    return this.req(
      API_MAP.GetPairs,
      {
        offset,
        limit,
      },
      config
    );
  }

  /**
   * returns swap amount by request
   */
  async getSwapAmount(
    params: { pairIndex: number; assetId: number; assetAmount: string; isFrom: boolean },
    config?: QueryConfig
  ) {
    return this.req(
      API_MAP.GetSwapAmount,
      {
        pair_index: params.pairIndex,
        asset_id: params.assetId,
        asset_amount: params.assetAmount,
        is_from: params.isFrom,
      },
      config
    );
  }

  /**
   * returns lp value
   */
  async getLPValue(params: { pairIndex: number; lpAmount: string }, config?: QueryConfig) {
    return this.req(
      API_MAP.GetLPValue,
      {
        pair_index: params.pairIndex,
        lp_amount: params.lpAmount,
      },
      config
    );
  }

  /**
   * returns pair by pair index
   */
  async getPair(index: number, config?: QueryConfig) {
    return this.req(API_MAP.GetPair, { index }, config);
  }

  /**
   * returns tx by tx hash
   */
  async getTxByHash(txHash: string, config?: QueryConfig) {
    return this.req(
      API_MAP.GetTx,
      {
        hash: txHash,
      },
      config
    );
  }

  /**
   * returns the mempool txs
   */
  async getMempoolTxs({ offset, limit }: { offset: number; limit: number }, config?: QueryConfig) {
    return this.req(
      API_MAP.GetMempoolTxs,
      {
        offset,
        limit,
      },
      config
    );
  }

  /**
   * returns the mempool txs by l1 address
   */
  async getMempoolTxsByL1Address(l1Address: string, config?: QueryConfig) {
    return this.req(
      API_MAP.GetMempoolTxsByL1Address,
      {
        by: 'l1_address',
        value: l1Address,
      },
      config
    );
  }

  /**
   * returns nonce of account
   */
  async getNextNonce(accountIndex: number, config?: QueryConfig) {
    return this.req(
      API_MAP.GetNextNonce,
      {
        account_index: accountIndex,
      },
      config
    );
  }

  /**
   * return txs in block
   */
  async getTxsByBlockHeight(blockHeight: number, config?: QueryConfig) {
    return this.req(
      API_MAP.GetTxsByBlockHeight,
      {
        by: 'block_height',
        value: blockHeight,
      },
      config
    );
  }

  /**
   * returns max offer id for an account
   */
  async getMaxOfferId(accountIndex: number, config?: QueryConfig) {
    return this.req(
      API_MAP.GetMaxOfferId,
      {
        account_index: accountIndex,
      },
      config
    );
  }

  /**
   * returns total blocks num and block list
   */
  async getBlocks({ offset, limit }: { offset: number; limit: number }, config?: QueryConfig) {
    return this.req(
      API_MAP.GetBlocks,
      {
        limit,
        offset,
      },
      config
    );
  }

  /**
   * get tx message that needs to be signed
   * @param txType
   * @param txInfo
   */
  async getSignatureMessage({ txType, txInfo }: { txType: Zk.TxType; txInfo: string }, config?: QueryConfig) {
    const body = await this.req(
      API_MAP.GetSignatureMessage,
      {
        tx_info: txInfo,
        tx_type: txType,
      },
      config
    );
    return body.sign_body;
  }

  /**
   * sends signed raw transaction and returns tx id
   */
  async sendRawTx({ txType, txInfo }: { txType: Zk.TxType; txInfo: string }, config?: QueryConfig) {
    return this.req(
      API_MAP.SendRawTx,
      {
        tx_info: txInfo,
        tx_type: txType,
      },
      config
    );
  }

  /**
   * returns gas account of layer 2
   */
  async getGasAccount(config?: QueryConfig) {
    return this.req(API_MAP.GetGasAccount, {}, config);
  }

  /**
   * returns nfts by account index
   */
  async getNftsByAccountIndex(
    { accountIndex, offset, limit }: { accountIndex: number; offset: number; limit: number },
    config?: QueryConfig
  ) {
    return this.req(
      API_MAP.GetNftsByAccountIndex,
      {
        by: 'account_index',
        value: accountIndex,
        offset,
        limit,
      },
      config
    );
  }

  /**
   * @deprecated
   * @param txInfo
   */
  async sendRawCreateCollectionTx(txInfo: string, config?: QueryConfig) {
    return this.req(
      API_MAP.SendRawCreateCollectionTx,
      {
        tx_info: txInfo,
      },
      config
    );
  }

  /**
   * @deprecated
   * @param txInfo
   */
  async sendRawMintNftTx(txInfo: string, config?: QueryConfig) {
    return this.req(
      API_MAP.SendRawMintNftTx,
      {
        tx_info: txInfo,
      },
      config
    );
  }
}
