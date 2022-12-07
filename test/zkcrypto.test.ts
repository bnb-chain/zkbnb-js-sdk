import { assert } from 'chai';

import { ZkCrypto } from '../src/zkbnb-crypto/node.index';

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
      getEddsaPublicKey('0aa91d7b4cae6defdbe536cfb2d41773edcc3a9bdbff2160eee55d37a31a78e7'),
      '27b8f76862bead3baae809c9f046c8441d99f4761293246fe6e2a0d5e6e03e9a1715a842b451ff068ba9bc5e5bc59199a9dad979fe232ead8429f4f81375b484'
    );
  });

  it('should fail to getEddsaPublicKey', () => {
    assert.equal(getEddsaPublicKey('hello world'), "encoding/hex: invalid byte: U+0068 'h'");
  });
});

describe('getEddsaCompressedPublicKey', () => {
  it('should return the correct compressed public key', () => {
    assert.equal(
      getEddsaCompressedPublicKey('0aa91d7b4cae6defdbe536cfb2d41773edcc3a9bdbff2160eee55d37a31a78e7'),
      '84b47513f8f42984ad2e23fe79d9daa99991c55b5ebca98b06ff51b442a81597'
    );
  });

  it('should fail to get the correct compressed public key', () => {
    assert.equal(getEddsaCompressedPublicKey('hello world'), "encoding/hex: invalid byte: U+0068 'h'");
  });
});

describe('generateEddsaKey', () => {
  it('should return a valid private key', () => {
    const privateKey = generateEddsaKey('28e1a3762ff9944e9a4ad79477b756ef0aff3d2af76f0f40a0c3ec6ca76cf24b');

    assert.isString(privateKey);
    assert.lengthOf(privateKey, 192);
    assert.equal(
      privateKey,
      'b4d9dfa7c05adcd2fb2216855e1c35cdc12dfe995c3f0c889da5228b615b880c001abe564a7468625a4ae797db773411426a6a29938d76a20da6db3169b88ad00330da29858a1ad9de1fe4be22d442ee8cd38a813189a1e7f207480d5ff11f05'
    );
  });

  it('should fail to get private key', () => {
    const privateKey = generateEddsaKey('a seed string');

    assert.equal(privateKey, "encoding/hex: invalid byte: U+0020 ' '");
  });
});

describe('eddsaSign', () => {
  it('should return a valid signature', () => {
    assert.equal(
      eddsaSign('d096c85fb3e7f02ef8627c270aa00cfcbbab0c92fce3d9af06bb2b356607e6b1', 'hello world'),
      '7b4051d47f037e48547881fc075e8a11e7c3eaa6a7ad882ab48ec8ebad58808403faf2bde63b5ce072499ebdb82c176adf53398ca349ffc6c1bb701d659f8a34'
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
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"from_account_index":0,"to_account_index":1,"to_account_name":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","asset_id":0,"asset_amount":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","memo":"transfer memo","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"ToAccountIndex":1,"ToAccountNameHash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"Memo":"transfer memo","CallData":"","CallDataHash":"Dd56AihX/sG4/6dmSpN6JQ065o81YGF1TTUx4mdBA9g=","ExpiredAt":1654656781000,"Nonce":1,"Sig":"w79Q2zhzyzTg+J+xz63hw+QXYb9P5bzLHaup1Rbi4xUEMCe/CQE/ibIwtWjrYZzIVaeMQagsna6fMCin7y+LDQ=="}'
    );
  });
});

describe('signWithdraw', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signWithdraw(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"from_account_index":0,"asset_id":0,"asset_amount":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","to_address":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","ExpiredAt":1654656781000,"Nonce":1,"Sig":"8gwvorWHocZqQSFUdIuonWF7jKfLKa7jUOz2f/FxM4AAzYJI8w8puHe0NHRUbhxg9tu7WR2MI9dBCSF5boTbsw=="}'
    );
  });
});

describe('signOffer', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signOffer(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"type":0,"offer_id":1,"account_index":1,"nft_index":1500,"asset_id":1,"asset_amount":"10000","listed_at":1654656761000,"expired_at":1654656781000,"treasury_rate":200}'
      ),
      '{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"eK4yDVoSwuewAPCXHwAVON1l/1hgAdVkNaKQUhwGaBoF0DPNFqW/IlH/ED3q2D+TUx7RX0S35HTHiAueRI1exg=="}'
    );
  });
});

describe('signAtomicMatch', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signAtomicMatch(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"account_index":0,"buy_offer":"{\\"Type\\":0,\\"OfferId\\":1,\\"AccountIndex\\":1,\\"NftIndex\\":1500,\\"AssetId\\":1,\\"AssetAmount\\":10000,\\"ListedAt\\":1654656761000,\\"ExpiredAt\\":1654656781000,\\"TreasuryRate\\":200,\\"Sig\\":\\"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgFdYuoMst49X0NFf9MraQevweNVH+728FHh0c1hEz20A==\\"}","sell_offer":"{\\"Type\\":1,\\"OfferId\\":1,\\"AccountIndex\\":2,\\"NftIndex\\":1500,\\"AssetId\\":1,\\"AssetAmount\\":10000,\\"ListedAt\\":1654656751000,\\"ExpiredAt\\":1654656791000,\\"TreasuryRate\\":200,\\"Sig\\":\\"cCh08P8RloU+uNZESVVbl5mqOFiiXR2JRJaAnmqxz6gCBXny2J9OUh5X7tRHaEBxDRRXQ1mQGMVMoe1/ncw3sQ==\\"}","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","nonce":1,"expired_at":1654656781000}'
      ),
      '{"AccountIndex":0,"BuyOffer":{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgFdYuoMst49X0NFf9MraQevweNVH+728FHh0c1hEz20A=="},"SellOffer":{"Type":1,"OfferId":1,"AccountIndex":2,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656751000,"ExpiredAt":1654656791000,"TreasuryRate":200,"Sig":"cCh08P8RloU+uNZESVVbl5mqOFiiXR2JRJaAnmqxz6gCBXny2J9OUh5X7tRHaEBxDRRXQ1mQGMVMoe1/ncw3sQ=="},"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"CreatorAmount":null,"TreasuryAmount":null,"Nonce":1,"ExpiredAt":1654656781000,"Sig":"CAcQQjc7mwFzfeiO4rj5zPXjtwKXhGXCWSWgZGA8QAkC9ukamTrPVOG/92xLDUEVKcVfRomxTHLn7QFuLNa0eQ=="}'
    );
  });
});

describe('signCancelOffer', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signCancelOffer(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"account_index":0,"offer_id":1,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":0,"OfferId":1,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"Y2r7cgMU23pA74BUprnLUW7ooF4bR22VBbq6nqyVOx8EX6C3MFlW1wD4lb4JTmTq0K2bcda7GZ5H01snC+bjkQ=="}'
    );
  });
});

describe('signCreateCollection', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signCreateCollection(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"account_index":0,"collection_id":1,"name":"crypto punk","introduction":"crypto punk is the king of jpeg nft","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":0,"CollectionId":0,"Name":"crypto punk","Introduction":"crypto punk is the king of jpeg nft","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"++srZFA76Q+W6ydXDR9/P6CRqKqSlPOFf0s4WL04Z5MELkukFH7ZYK5EEC4lrE6SieHp2FufDLp8U+6Swk48ZQ=="}'
    );
  });
});

describe('signMintNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"creator_account_index":15,"to_account_index":1,"to_account_name_hash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","nft_content_hash":"7eb645401b85eb499393a2aefe6422a6ddc6171f9fe33153d95c8394c9135c27","nft_collection_id":65,"creator_treasury_rate":30,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":15,"ToAccountIndex":1,"ToAccountNameHash":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","NftIndex":0,"NftContentHash":"7eb645401b85eb499393a2aefe6422a6ddc6171f9fe33153d95c8394c9135c27","NftCollectionId":65,"CreatorTreasuryRate":30,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"oyafcJxCtnkaiofsA3OpTTZ9vbtKiVremRXx9lJmaIQCDGFdAMq1DxUTooQTQ+geN/d3iOVrwxYUE7BgEnkHBA=="}'
    );
  });
});

describe('signTransferNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"from_account_index":0,"to_account_index":1,"to_account_name":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","nft_index":15,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":0,"ToAccountIndex":1,"ToAccountNameHash":"","NftIndex":0,"NftContentHash":"","NftCollectionId":0,"CreatorTreasuryRate":0,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"CGZ6BCRdKCIRIijEmJYVDFMnj06jJD8+3cFX+2WZnooFzfcQv9jI1vwdHygnuJnfJ3GSv8tNE6fQxnVdrbFaIg=="}'
    );
  });
});

describe('signWithdrawNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signWithdrawNft(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"account_index":1,"nft_index":15,"to_address":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","expired_at":1654656781000,"nonce":1}'
      ),
      '{"AccountIndex":1,"CreatorAccountIndex":0,"CreatorAccountNameHash":null,"CreatorTreasuryRate":0,"NftIndex":15,"NftContentHash":null,"CollectionId":0,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"T23dO7BhByu42Pd0rEsCxSCrrUe51ezCHZYx94FXtpkC9aUICadw3qT03B9IeczndQrZSL2lYVovH91I1XrzQQ=="}'
    );
  });
});
