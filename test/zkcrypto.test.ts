import { assert } from 'chai';

import { ZkCrypto } from '../src/zkbnb-crypto/node.index';

const {
  cleanPackedAmount,
  cleanPackedFee,
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
        '{"from_account_index":0,"to_account_index":1,"to_l1_address":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","asset_id":0,"asset_amount":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","memo":"transfer memo","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"ToAccountIndex":1,"ToL1Address":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"Memo":"transfer memo","CallData":"","CallDataHash":"Dd56AihX/sG4/6dmSpN6JQ065o81YGF1TTUx4mdBA9g=","ExpiredAt":1654656781000,"Nonce":1,"Sig":"BArVP0smfrTN6E4Utpl54VzGFN3T25abJprlAj+1qS0FukrwcMuy02xajRxsE+A991Tr1c3kq9xzg2nTU0/oPw=="}'
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
      '{"FromAccountIndex":0,"AssetId":0,"AssetAmount":100,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","ExpiredAt":1654656781000,"Nonce":1,"Sig":"orKBcL1QUZ4J2pgly6Sh1R/sDUjcvshXQzdVi1kn8gEAhuH5BTu1Xid4FAUAZHO4I04fvWOt2ki5PDBTaDaing=="}'
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
      '{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"YcHGjGTA5uJUt+Z+HLo65/EYfifsLDQS0CL5VmvhWpMGCLZeqCNkhBS8xMa9DSv2l2GkgEx9lxZsxpaLV8J4kg=="}'
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
      '{"AccountIndex":0,"BuyOffer":{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"TreasuryRate":200,"Sig":"f7EryTm0P7xCgDYsyB+R+Of3ZHHyVa4uEI721shjoQgFdYuoMst49X0NFf9MraQevweNVH+728FHh0c1hEz20A=="},"SellOffer":{"Type":1,"OfferId":1,"AccountIndex":2,"NftIndex":1500,"AssetId":1,"AssetAmount":10000,"ListedAt":1654656751000,"ExpiredAt":1654656791000,"TreasuryRate":200,"Sig":"cCh08P8RloU+uNZESVVbl5mqOFiiXR2JRJaAnmqxz6gCBXny2J9OUh5X7tRHaEBxDRRXQ1mQGMVMoe1/ncw3sQ=="},"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"CreatorAmount":null,"TreasuryAmount":null,"Nonce":1,"ExpiredAt":1654656781000,"Sig":"dE3vICTxnWCZGsdWfk1JzrRzb3JLd+u6hfrPNzvLigMAKOVF5EHEIYNS4MWH6eMR+XRKPwkZAyHrGyOMzHBUGg=="}'
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
      '{"AccountIndex":0,"OfferId":1,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"XWlKqcAtbubFmfhkiNDwTwOU9KKv6+sk8YN51wRtzi4DHxtdNLcLCZN+kqD2YyrQswpuRjUUR5nN5yak+JlkJQ=="}'
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
      '{"AccountIndex":0,"CollectionId":0,"Name":"crypto punk","Introduction":"crypto punk is the king of jpeg nft","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"LaUzBV1eoDwKxywj6nkU+wzXmu3FWxJajIueJ1FsTyAC2fnTbWfS+kNsOeaYJltZEBeQHD86uZR07bZf3zsHSA=="}'
    );
  });
});

describe('signMintNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        '5a8ceed126069ba42d8eb0965b9d982941ad3b7d3f118ab65b5a1322a2cc5c6b17c59fd44af43f9f3e2e80cdda58aa8fd76d3b8500024d013d131f7b30304b0e1b',
        '{"creator_account_index":13,"to_account_index":13,"to_l1_address":"0ff61a3ef954cfe2bd985c4da93a93948a356aa861667c8454a6b00a302babfd","nft_content_hash":"2d0794241d3d73f2952d3fe24207e6a042d6056708a2a01ee868f237b0c495e4","nft_collection_id":0,"creator_treasury_rate":1200,"gas_account_index":1,"gas_fee_asset_id":0,"gas_fee_asset_amount":"10000000000000","expired_at":1676674294097,"nonce":3}'
      ),
      '{"CreatorAccountIndex":13,"ToAccountIndex":13,"ToL1Address":"0ff61a3ef954cfe2bd985c4da93a93948a356aa861667c8454a6b00a302babfd","NftIndex":0,"NftContentHash":"2d0794241d3d73f2952d3fe24207e6a042d6056708a2a01ee868f237b0c495e4","NftCollectionId":0,"CreatorTreasuryRate":1200,"GasAccountIndex":1,"GasFeeAssetId":0,"GasFeeAssetAmount":10000000000000,"ExpiredAt":1676674294097,"Nonce":3,"Sig":"uXCmUnSejOf5hwzpd6NR9MF82TkwSypEEb7G5Vk0wZMD0xi9VxoXtyAG8nHShtwHqpHuu8Oi1Rp8ExoMvW1Hyw==","MetaData":"","MutableAttributes":"","IpnsName":"","IpnsId":""}'
    );
  });
});

describe('signTransferNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"from_account_index":0,"to_account_index":1,"to_l1_address":"ddc6171f9fe33153d95c8394c9135c277eb645401b85eb499393a2aefe6422a6","nft_index":15,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":0,"ToAccountIndex":1,"ToL1Address":"","NftIndex":0,"NftContentHash":"","NftCollectionId":0,"CreatorTreasuryRate":0,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"sr0JH6MnawTk3S0uLDsCD2a799f4RIomUXZtowsSEKgD/mbLoveQAcV2q07VNzprn/2pjI+kX4cXAjbOK6pHyA==","MetaData":"","MutableAttributes":"","IpnsName":"","IpnsId":""}'
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
      '{"AccountIndex":1,"CreatorAccountIndex":0,"CreatorL1Address":null,"CreatorTreasuryRate":0,"NftIndex":15,"NftContentHash":null,"CollectionId":0,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"fXIiWN1k3sGaTgpWZfUXEOQpMlIsTI7P1D+7q5a8pJsEtpp5hWVK3oJ/AKgEiZi1nrjJZFs/0P3AdrRY/tcFnw=="}'
    );
  });
});
