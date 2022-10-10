import { assert } from 'chai';

import { ZkCrypto } from '../src/zkbas-crypto/node.index';

const {
  cleanPackedAmount,
  cleanPackedFee,
  getAccountNameHash,
  generateEddsaKey,
  getEddsaPublicKey,
  getEddsaCompressedPublicKey,
  eddsaVerify,
  signWithdraw,
  signAtomicMatch,
  signCancelOffer,
  signCreateCollection,
  signMintNft,
  signWithdrawNft,
  eddsaSign,
  signTransfer,
  signOffer,
} = ZkCrypto;

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
  it('should return the correct account name hash', () => {
    assert.equal(
      getAccountNameHash('example.legend'),
      '2078f919ddd94d2c724cf996c0aced8a7795d3618b538d9b34481bbe8b861958'
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
    const privateKey = generateEddsaKey('28e1a3762ff9944e9a4ad79477b756ef0aff3d2af76f0f40a0c3ec6ca76cf24b');

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
    assert.equal(
      eddsaVerify(
        '06cdb3200f1e0e7dd7ea789b41d88662a1b4c213075633088773025289bdbd05',
        '88b80d96d3eadb67ad7e8d86b731ce4b1bab5a46bc8c33fbf8b346a658007e90024f87ff59fb24adbd8ae56c6880b24c9937807eda097afcb26f0590e4eca860',
        'hello world'
      ),
      'true'
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
      '{"FromAccountIndex":0,"ToAccountIndex":1,"ToAccountNameHash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"Memo":"transfer memo","CallData":"","CallDataHash":"Dd56AihX/sG4/6dmSpN6JQ065o81YGF1TTUx4mdBA9g=","ExpiredAt":1654656781000,"Nonce":1,"Sig":"r9s63bvi5B5a3Q34h6QJ1DZRsYsM3FRvOOlkpwc4RYQBJVYoD+BaOXQMTq75dK6WshFNggqABIH1Jr3fmSqhdw=="}'
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
      '{"FromAccountIndex":0,"AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","ExpiredAt":1654656781000,"Nonce":1,"Sig":"dmyxw9HWjeiepG4holzgy0zxuVDRkTCAdhWQ6chyhpICqQBKBMifMapf5QfgFrrnxeRkVj6BPbfJb0tO/2aEzg=="}'
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
      '{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"vid9clqOCdIq62xKSQoJkypeiQrlF02mUEHcTXsqgAwBc3X9/tqwHU2cRQIFX0eIa42ew19+LEiYXKg32GFvtw=="}'
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
      '{"AccountIndex":0,"BuyOffer":{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgFdYuoMst49X0NFf9MraQevweNVH+728FHh0c1hEz20A=="},"SellOffer":{"Type":1,"OfferId":1,"AccountIndex":2,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656751000,"ExpiredAt":1654656791000,"TreasuryRate":200,"Sig":"cCh08P8RloU+uNZESVVbl5mqOFiiXR2JRJaAnmqxz6gCBXny2J9OUh5X7tRHaEBxDRRXQ1mQGMVMoe1/ncw3sQ=="},"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"CreatorAmount":null,"TreasuryAmount":null,"Nonce":1,"ExpiredAt":1654656781000,"Sig":"Dt+88wbApjRTSxKxeo/YDNfUxFzr+Jwfl0qxLHj2FJICTX0z5EHJhF6izW9Jg8fRO+lyID56GMjmxq78g8mVdQ=="}'
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
      '{"AccountIndex":0,"OfferId":1,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"8ER2WjYaTFJq57In60vHvNpuGX3LdltsSjshcaWFYhgEYavSEGSP5umNh7bOUZOwDkhafuZ3XgiiC+QFsCktcg=="}'
    );
  });
});

describe('signCreateCollection', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signCreateCollection(
        'seed phrase',
        '{"account_index":0,"collection_id":1,"name":"crypto punk","introduction":"crypto punk is the king of jpeg nft","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":0,"CollectionId":0,"Name":"crypto punk","Introduction":"crypto punk is the king of jpeg nft","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"L6YHpXHqTEVhSgHb6YlX4k+I/ww1mLAFrqUOXzt8axECpolm7qrD0pG5A84EVf62BGw2/9AeuRqo3EqEEf73Aw=="}'
    );
  });
});

describe('signMintNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'seed phrase',
        '{"creator_account_index":15,"to_account_index":1,"to_account_name_hash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","nft_content_hash":"7eb645401b85eb499393a2aefe6422a6ddc6171f9fe33153d95c8394c9135c27","nft_collection_id":65,"creator_treasury_rate":30,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":15,"ToAccountIndex":1,"ToAccountNameHash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","NftIndex":0,"NftContentHash":"7eb645401b85eb499393a2aefe6422a6ddc6171f9fe33153d95c8394c9135c27","NftCollectionId":65,"CreatorTreasuryRate":30,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"gQVb6CGj3fsRpRRe8KM5o/pfcXRXQuZtmZkYxlqJ9ocEimnGBbC4zdLQd3KXRum9HQmUguVnX1Do54oaQbZyEg=="}'
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
      '{"CreatorAccountIndex":0,"ToAccountIndex":1,"ToAccountNameHash":"","NftIndex":0,"NftContentHash":"","NftCollectionId":0,"CreatorTreasuryRate":0,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"50i4tsWki5JPyPz2Q7c1NX16FxAnd8hwK9dcJYwez4IFj7ZZaifADi+mtcubk6/YYAPBBAI+YqULqRLfqvVClg=="}'
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
      '{"AccountIndex":1,"CreatorAccountIndex":0,"CreatorAccountNameHash":null,"CreatorTreasuryRate":0,"NftIndex":15,"NftContentHash":null,"NftL1Address":"","NftL1TokenId":null,"CollectionId":0,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"GDt/3bY11JOgjBS+RWlVidaLS1uH6dEs6tOFzvWfVoYFcmC99vslbaB6aP9gqgwIB4BZefdiWBR93dt3TRHGgQ=="}'
    );
  });
});
