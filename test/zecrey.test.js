const { assert } = require('chai');
const { it } = require('mocha');

const {
  generateEddsaKey,
  cleanPackedAmount,
  cleanPackedFee,
  getAccountNameHash,
  getEddsaPublicKey,
  getEddsaCompressedPublicKey,
  eddsaVerify,
  signAddLiquidity,
  signRemoveLiquidity,
  signSwap,
  signWithdraw,
  signAtomicMatch,
  signCancelOffer,
  signCreateCollection,
  signMintNft,
  signWithdrawNft,
  eddsaSign,
  signTransfer,
  signOffer
} = require('../zecrey');

describe('cleanPackedAmount', () => {
  it('should return the correct amount', () => {
    assert.equal(cleanPackedAmount('10000001111'), '10000001111');
  });
});

describe('cleanPackedFee', () => {
  it('convert fee to valid fee', () => {
    assert.equal(cleanPackedFee('10000001111'), '10000000000');
  });
});

describe('getAccountNameHash', () => {
  it('should return the correct hash', () => {
    assert.equal(
      getAccountNameHash('sher.legend'),
      '04b2dd1162802d057ed00dcb516ea627b207970520d1ad583f712cd6e954691f'
    );
  });
});

describe('getEddsaPublicKey', () => {
  it('should return the correct public key', () => {    
    assert.equal(
      getEddsaPublicKey('seed phrase'),
      '22ea61084155b4ee14cfb1f5c066a70e555f07c8d5c492c6ea9e8c1bbef2c70c11c3443469ee512e3aa333aa4cee44182ce1a86cebe85172ce752b5377d69391'
    );
  });
});

describe('getEddsaCompressedPublicKey', () => {
  it('should return the correct compressed public key', () => {
    assert.equal(
      getEddsaCompressedPublicKey('seed phrase'),
      '9193d677532b75ce7251e8eb6ca8e12c1844ee4caa33a33a2e51ee693444c391'
    );
  });
});

describe('generateEddsaKey', () => {
  it('should return a valid private key', () => {
    const privateKey = generateEddsaKey(
      '28e1a3762ff9944e9a4ad79477b756ef0aff3d2af76f0f40a0c3ec6ca76cf24b'
    );

    assert.isString(privateKey);
    assert.lengthOf(privateKey, 192);
    assert.equal(
      privateKey,
      'b0b6f7466154578ec66d51a335ead65ffd6a7210567fad9e68b6df8a5ce5dd851899c1a2674a1975efe6674d4ab24aec281dd2424f87a10e5452f32270995b083b8d8445231226fe94ca066df26a69505b630361c280cd5e7ba449cfbdd82252'
    );
  });
});

describe('eddsaSign', () => {
  it('should return a valid signature', () => {
    assert.equal(
      eddsaSign('seed phrase', 'hello world'),
      '88b80d96d3eadb67ad7e8d86b731ce4b1bab5a46bc8c33fbf8b346a658007e9003db1b5c7f3a030f5cdd7794f419ac96600df450b9db152c747039aa289d7e54'
    );
  });
});

describe('eddsaVerify', () => {
  it('should return true', () => {
    assert.isTrue(
      eddsaVerify(
        '06cdb3200f1e0e7dd7ea789b41d88662a1b4c213075633088773025289bdbd05',
        '88b80d96d3eadb67ad7e8d86b731ce4b1bab5a46bc8c33fbf8b346a658007e90024f87ff59fb24adbd8ae56c6880b24c9937807eda097afcb26f0590e4eca860',
        'hello world'
      )
    );
  });
});

describe('signAddLiquidity', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signAddLiquidity(
        'seed phrase',
        '{"from_account_index":0,"pair_index":0,"asset_a_id":1,"asset_a_amount":"10000","asset_b_id":2,"asset_b_amount":"100","lp_amount":"1000","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"PairIndex":0,"AssetAId":1,"AssetAAmount":10000,"AssetBId":2,"AssetBAmount":100,"LpAmount":null,"KLast":null,"TreasuryAmount":null,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"FC20vfATcrD6J9k3YpAVDUNMHmeaSCqJn8xZS7AYEw8AM4gyk9k5H2psSuS8U6f1CWNNoRaVf6qmow1nOVReKQ=="}'
    );
  });
});

describe('signRemoveLiquidity', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signRemoveLiquidity(
        'seed phrase',
        '{"from_account_index":0,"pair_index":0,"asset_a_id":1,"asset_a_min_amount":"9000","asset_b_id":2,"asset_b_min_amount":"90","lp_amount":"1000","asset_a_amount_delta":"10000","asset_b_amount_delta":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"PairIndex":0,"AssetAId":1,"AssetAMinAmount":9000,"AssetBId":2,"AssetBMinAmount":90,"LpAmount":1000,"AssetAAmountDelta":10000,"AssetBAmountDelta":100,"KLast":null,"TreasuryAmount":null,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"ZZrnIjxQq5FxIqCidXo2cPUtfz3EmEaoh6dO6e8JfQYC3GvnMn39RgZfen97yCBCN3ANjxfzqEydQ7qq8wS6hQ=="}'
    );
  });
});

describe('signSwap', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signSwap(
        'seed phrase',
        '{"from_account_index":0,"pair_index":0,"asset_a_id":1,"asset_a_amount":"10000","asset_b_id":2,"asset_b_min_amount":"95","asset_b_amount_delta":"99","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"PairIndex":0,"AssetAId":1,"AssetAAmount":10000,"AssetBId":2,"AssetBMinAmount":95,"AssetBAmountDelta":99,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"ilrtw7zHEQ69VK/QdFSOfu+0azbvGHsAd2SLzD+NUIMBB0AmmUzePuw5O2O+wnNjyvFWlwIftasu/Ya3go5vmw=="}'
    );
  });
});

describe('signTransfer', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signTransfer(
        'seed phrase',
        '{"from_account_index":0,"to_account_index":1,"to_account_name":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","asset_id":0,"asset_amount":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","memo":"transfer memo","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"ToAccountIndex":1,"ToAccountNameHash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"Memo":"transfer memo","CallData":"","CallDataHash":"Dd56AihX/sG4/6dmSpN6JQ065o81YGF1TTUx4mdBA9g=","ExpiredAt":1654656781000,"Nonce":1,"Sig":"ReS7DYJqOazAv1eH1esmxumHqGMeOWZj4Iq4QjZ9fhwE7jmaYnLjZvCYQukyCH0YQmOJDgWwuE+WDnmqzruoaQ=="}'
    );
  });
});

describe('signWithdraw', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signWithdraw(
        'seed phrase',
        '{"from_account_index":0,"asset_id":0,"asset_amount":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","to_address":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","ExpiredAt":1654656781000,"Nonce":1,"Sig":"2Vb5BZiZ8Y28O6Pmvw7lvbCbbq9JqLzD9XgE4uvFh6kApWSwzFrYB57Km4e6NG3HYXFaeU9sqJK0/MowjdRI8g=="}'
    );
  });
});

describe('signOffer', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signOffer(
        'seed phrase',
        '{"type":0,"offer_id":1,"account_index":1,"nft_index":1500,"asset_id":1,"asset_amount":"10000","listed_at":1654656761000,"expired_at":1654656781000,"treasury_rate":200}'
      ),
      '{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgCIqILlj0+QxbZESPKSmPB/QYmA6apPQT8AOrwSMMBZA=="}'
    );
  });
});

describe('signAtomicMatch', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signAtomicMatch(
        'seed phrase',
        '{"account_index":0,"buy_offer":"{\\"Type\\":0,\\"OfferId\\":1,\\"AccountIndex\\":1,\\"NftIndex\\":1500,\\"AssetId\\":1,\\"AssetAmount\\":10000,\\"ListedAt\\":1654656761000,\\"ExpiredAt\\":1654656781000,\\"TreasuryRate\\":200,\\"Sig\\":\\"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgFdYuoMst49X0NFf9MraQevweNVH+728FHh0c1hEz20A==\\"}","sell_offer":"{\\"Type\\":1,\\"OfferId\\":1,\\"AccountIndex\\":2,\\"NftIndex\\":1500,\\"AssetId\\":1,\\"AssetAmount\\":10000,\\"ListedAt\\":1654656751000,\\"ExpiredAt\\":1654656791000,\\"TreasuryRate\\":200,\\"Sig\\":\\"cCh08P8RloU+uNZESVVbl5mqOFiiXR2JRJaAnmqxz6gCBXny2J9OUh5X7tRHaEBxDRRXQ1mQGMVMoe1/ncw3sQ==\\"}","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","nonce":1,"expired_at":1654656781000}'
      ),
      '{"AccountIndex":0,"BuyOffer":{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgFdYuoMst49X0NFf9MraQevweNVH+728FHh0c1hEz20A=="},"SellOffer":{"Type":1,"OfferId":1,"AccountIndex":2,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656751000,"ExpiredAt":1654656791000,"TreasuryRate":200,"Sig":"cCh08P8RloU+uNZESVVbl5mqOFiiXR2JRJaAnmqxz6gCBXny2J9OUh5X7tRHaEBxDRRXQ1mQGMVMoe1/ncw3sQ=="},"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"CreatorAmount":null,"TreasuryAmount":null,"Nonce":1,"ExpiredAt":1654656781000,"Sig":"zR8C4AShzse5FV1S1qG4l6C21D/m00a9o9RVLjNsXg0FoTiLZ6f9+F7aZRBkyuGuUS5YLiItnWhgk4WX51tQ6g=="}'
    );
  });
});

describe('signCancelOffer', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signCancelOffer(
        'seed phrase',
        '{"account_index":0,"offer_id":1,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":0,"OfferId":1,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"CnxugAhqk/i8sbMRMGtq7vNDKPf+/wSO6u0qzQWXjK0EKXgjVKN8G5MBtNtZB8nRfNw2vrA7DDlV4ib0XEkZXw=="}'
    );
  })
});

describe('signCreateCollection', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signCreateCollection(
        'seed phrase',
        '{"account_index":0,"collection_id":1,"name":"crypto punk","introduction":"crypto punk is the king of jpeg nft","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":0,"CollectionId":0,"Name":"crypto punk","Introduction":"crypto punk is the king of jpeg nft","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"EEEY8rdWg4OF3fupbgpMt0r+n3wHaYxYMYMsNK1XLyUFmL45iydMks/E1skBbsOhl9Ni8qtuHRM1grbVMi8H8Q=="}'
    );
  })
});

describe('signMintNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'seed phrase',
        '{"creator_account_index":15,"to_account_index":1,"to_account_name_hash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","nft_content_hash":"7eb645401b85eb499393a2aefe6422a6ddc6171f9fe33153d95c8394c9135c27","nft_collection_id":65,"creator_treasury_rate":30,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":15,"ToAccountIndex":1,"ToAccountNameHash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","NftIndex":0,"NftContentHash":"7eb645401b85eb499393a2aefe6422a6ddc6171f9fe33153d95c8394c9135c27","NftCollectionId":65,"CreatorTreasuryRate":30,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"tPXOIE5ZtA/KkbSEb6ZZvOpqNo2SacGTtiZaikYr9oEE+I58zHDGWgYhC4fktwqYg2uURMIlH2Kei+XQcX/FAw=="}'
    );
  });
});

describe('signTransferNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'seed phrase',
        '{"from_account_index":0,"to_account_index":1,"to_account_name":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","nft_index":15,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":0,"ToAccountIndex":1,"ToAccountNameHash":"","NftIndex":0,"NftContentHash":"","NftCollectionId":0,"CreatorTreasuryRate":0,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"D3T/4JU11AhTmr681L/Z6Ysy2mPyaoWC1ilPmXtT9aYFS1zInviGQEtkEjuwI9N+dlBVdvrbEFmDmPvBr4RyQw=="}'
    );
  });
});

describe('signWithdrawNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signWithdrawNft(
        'seed phrase',
        '{"account_index":1,"nft_index":15,"to_address":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":1,"CreatorAccountIndex":0,"CreatorAccountNameHash":null,"CreatorTreasuryRate":0,"NftIndex":15,"NftContentHash":null,"NftL1Address":"","NftL1TokenId":null,"CollectionId":0,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"NhSBoRCDwc92j7bUFGGKgmKqdoNCmE1KGfepwBVVgSsARJGtsNN6cihHjE/kA3wv4UYps/j/3YMpssXSu+a+xg=="}'
    );
  })
});
