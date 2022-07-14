declare namespace Zk {
  type AssetId = number;
  type AssetName = string;
  type AssetDecimals = {};
  type AssetSymbol = {};
  type AssetAddress = {};
  type IsGasAsset = {};


  type AssetInfo = {
    asset_id: AssetId;
    asset_name: AssetName;
    asset_decimals: AssetDecimals;
    asset_symbol: AssetSymbol;
    asset_address: AssetAddress;
    is_gas_asset: IsGasAsset;
  }
  
  type Price = number;
  type Amount = string;

  type AccountIndex = number;
  type AccountName = string;
  type PublicKey = string;

  type Account = {
    account_index: AccountIndex,
    account_name: AccountName;
    public_key: PublicKey;
  }

  namespace ReqParam {
    interface IReqBaseParam {
      offset: number;
      limit: number;
    }

    interface IGetTxsByPubKeyParam extends IReqBaseParam {
      account_pk: string;
    }
  
    interface IGetTxsByAccountNameParam extends IReqBaseParam {
      account_name: AccountName;
    }

    interface IGetTxsByAccountIndexAndTxTypeParam extends IReqBaseParam {
      account_index: AccountIndex;
      tx_type: number;
    }

    interface IGetTxsListByAccountIndexParam extends IReqBaseParam {
      account_index: AccountIndex;
    }

    interface ISearchParam {
      info: string;
    }
  }

  namespace Response {
    interface IGetTxsRes {
      total: number;
      txs?: Tx[];
    }

    interface ISearchRes {
      data_type: string;
    }

    interface IGetAccountsRes {
      total: number;
      accounts: Account[]
    }

    interface IGetGasFeeAssetList {
      assets: AssetInfo[];
    }


    type RespGetCurrencyPriceBySymbol = {
      assetId: AssetId;
      price: Price;
    };
  
    type DataCurrencyPrices = {
      pair: string;
      assetId: AssetId;
      price: Price;
    };
  
    type RespGetSwapAmount = {
      res_asset_amount: string;
      res_asset_id: AssetId;
    };
  
    type Pair = {
      pair_index: number;
      asset_a_id: number;
      asset_a_name: string;
      asset_a_amount: Amount;
      asset_b_id: number;
      asset_b_name: string;
      asset_b_amount: Amount;
      fee_Rate: number;
      treasury_rate: number;
    };
  
    type TxDetail = {
      tx_id: number;
      asset_id: number;
      asset_type: number;
      account_index: number;
      account_name: string;
      balance: string;
      balance_delta: string;
      order: number;
      account_order: number;
      nonce: number;
      collection_nonce: number;
    };
  
    type Tx = {
      tx_hash: string;
      tx_type: number;
      gas_fee: string;
      gas_fee_asset_id: number;
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
      account_index: number;
      nonce: number;
      expired_at: number;
    };

  }
}
