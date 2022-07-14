declare namespace API {
  const API_MAP: {
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
    GetBalanceByAssetIdAndAccountName:
      'GET /api/v1/account/getBalanceByAssetIdAndAccountName',
    GetAccountStatusByAccountName:
      'GET /api/v1/account/getAccountStatusByAccountName',
    GetAccountInfoByAccountIndex:
      'GET /api/v1/account/getAccountInfoByAccountIndex',
    GetAccountInfoByPubKey: 'GET /api/v1/account/getAccountInfoByPubKey',
    GetAccountStatusByAccountPk:
      'GET /api/v1/account/getAccountStatusByAccountPk',
    GetCurrencyPriceBySymbol: 'GET /api/v1/info/getCurrencyPriceBySymbol',
    GetCurrencyPrices: 'GET /api/v1/info/getCurrencyPrices',
    GetSwapAmount: 'GET /api/v1/pair/getSwapAmount',
    GetAvailablePairs: 'GET /api/v1/pair/getAvailablePairs'
  };

  // 'GetTxsByPubKey' | 'GetTxsByAccountName' | ... | 'GetAvailablePairs'
  type API_NAME = keyof typeof API_MAP;

  // real url
  type URL_INFO = typeof API_MAP[API_NAME];

  interface IReqParmsMap {
    [API_MAP.GetTxsByPubKey]: Zk.ReqParam.IGetTxsByPubKeyParam;
    [API_MAP.GetTxsByAccountName]: Zk.ReqParam.IGetTxsByAccountNameParam;
    [API_MAP.GetTxsByAccountIndexAndTxType]: Zk.ReqParam.IGetTxsByAccountIndexAndTxTypeParam;
    [API_MAP.GetTxsListByAccountIndex]: Zk.ReqParam.IGetTxsListByAccountIndexParam;
    [API_MAP.Search]: Zk.ReqParam.ISearchParam;
    [API_MAP.GetAccounts]: Zk.ReqParam.IReqBaseParam;
    // [API_MAP.GetGasFeeAssetList]: {};
  }

  interface IResponseMap {
    [API_MAP.GetTxsByPubKey]: Zk.Response.IGetTxsRes;
    [API_MAP.GetTxsByAccountName]: Zk.Response.IGetTxsRes;
    [API_MAP.GetTxsByAccountIndexAndTxType]: Zk.Response.IGetTxsRes;
    [API_MAP.GetTxsListByAccountIndex]: Zk.Response.IGetTxsRes;
    [API_MAP.Search]: Zk.Response.ISearchRes;
    [API_MAP.GetAccounts]: Zk.Response.IGetAccountsRes;    
  }



}