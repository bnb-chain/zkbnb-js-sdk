import { Http} from './http';

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

async getTxsByAccountName(accountName: string, offset: number, limit: number) {
    return await this.http.req(API.API_MAP.GetTxsByAccountName, {
      account_name: accountName,
      offset,
      limit
    });
  }
 
  /*   async getTxsByAccountIndexAndTxType(accountIndex: number, txType: number, offset: number, limit: number) {
    return await this.http.req(API_MAP.GetTxsByAccountIndexAndTxType, {
        account_index: accountIndex,
        tx_type: txType,
        offset,
        limit
      }
    );
  }

  async getTxsListByAccountIndex(accountIndex: number, offset: number, limit: number) {
    return await this.http.req(API_MAP.GetTxsListByAccountIndex, {
      account_index: accountIndex,
      offset,
      limit
    });
  }

  async search(info) {
    return Http.get(`${this.endpoint}`, {
      info
    });
  }

  getAccounts(offset, limit) {
    return Http.get(`${this.endpoint}/api/v1/info/getAccounts`, {
      offset,
      limit
    });
  }

  getGasFeeAssetList() {
    return Http.get(`${this.endpoint}/api/v1/info/getGasFeeAssetList`);
  }

  getWithdrawGasFee(assetId, withdrawAssetId, withdrawAmount) {
    return Http.get(`${this.endpoint}/api/v1/info/getWithdrawGasFee`, {
      asset_id: assetId,
      withdraw_asset_id: withdrawAssetId,
      withdraw_amount: withdrawAmount
    });
  }

  getGetGasFee(assetId) {
    return Http.get(`${this.endpoint}/api/v1/info/getGasFee`, {
      asset_id: assetId
    });
  }

  getAssetsList() {
    
  } */
}
