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
      '2eac17234e2440809adbadded994567758ce90b6d6d2a9e050ae6f672a3fe1b906975c7cbbfc0ce15b1684ce2ffa9d3e66890f0ccca969d910ac14aa1aa3c279'
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
      '79c2a31aaa14ac10d969a9cc0c0f89663e9dfa2fce84165be10cfcbb7c5c9786'
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
      '470fcb4a6975695ffba971e22747ca6c7af21a3ae7ce8a0e18285c400f33ea87631abe564a7468625a4ae797db773411426a6a29938d76a20da6db3169b88ad00330da29858a1ad9de1fe4be22d442ee8cd38a813189a1e7f207480d5ff11f05'
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
      '262f345534b2074fe8be673870900a9d1ee685e7f0025b432de7675e7aad5b2d05aa5aa6090437e9683ede67ff2d5e103f3f8b1d47519c7a36127336b11af1aa'
    );
  });
});

describe('eddsaVerify', () => {
  it('should return true', () => {
    assert.equal(
      eddsaVerify(
        '826f2baba76a6c950336819fb79bdfd0951a58bde7fb2fd5e41e7d224c66d88e',
        '262f345534b2074fe8be673870900a9d1ee685e7f0025b432de7675e7aad5b2d05aa5aa6090437e9683ede67ff2d5e103f3f8b1d47519c7a36127336b11af1aa',
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
        '{"from_account_index":0,"to_l1_address":"0xd757C6bDb5837d721B04DE87c155DBa72c9B076C","asset_id":0,"asset_amount":"100","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","memo":"transfer memo","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"FromAccountIndex":0,"ToAccountIndex":0,"ToL1Address":"0xd757C6bDb5837d721B04DE87c155DBa72c9B076C","AssetId":0,"AssetAmount":100,"AssetName":"","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"Memo":"transfer memo","CallData":"","CallDataHash":"LHKY/YfTA5/+oghTj2spe2Czc6Y3krTNBlT9yI/Q1u4=","ExpiredAt":1654656781000,"Nonce":1,"Sig":"+9fE5jExqmO9MS05XPUwHbi5YL8tf4S5iC59Aw0JQQUBdJld+rtgRpqhIpMol1VuRC4hLdxQY7vqs1LrRHI4Rg==","L1Sig":""}'
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
      '{"FromAccountIndex":0,"AssetId":0,"AssetAmount":100,"AssetName":"","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","ExpiredAt":1654656781000,"Nonce":1,"Sig":"orKBcL1QUZ4J2pgly6Sh1R/sDUjcvshXQzdVi1kn8gEBGL2Q8tTWoiNlxdYH7Rl4GKdYrblSKNaDjIs8OMuXGw==","L1Sig":""}'
    );
  });
});

describe('signOfferBuy', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signOffer(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"type":0,"offer_id":0,"account_index":3,"nft_index":1,"asset_id":0,"asset_amount":"10000","listed_at":1680184920810,"expired_at":1680192120810,"royalty_rate":0,"channel_account_index":2,"channel_rate":200,"protocol_rate":200,"protocol_amount":"200"}'
      ),
      '{"Type":0,"OfferId":0,"AccountIndex":3,"NftIndex":1,"NftName":"","AssetId":0,"AssetName":"","AssetAmount":10000,"ListedAt":1680184920810,"ExpiredAt":1680192120810,"RoyaltyRate":0,"ChannelAccountIndex":2,"ChannelRate":200,"ProtocolRate":200,"ProtocolAmount":200,"Sig":"4QfdHg3NUFed4WPnAQd09ZCl/06PlKGdCiYSJYlaBx4CLcECOcSsKZheJp5DZ5xchaBKCClXoINaeSVbr8ROWg==","L1Sig":""}'
    );
  });
});

describe('signOfferSell', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signOffer(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"type":1,"offer_id":1,"account_index":1,"nft_index":1,"asset_id":0,"asset_amount":"10000","listed_at":1680186811478,"expired_at":1680194011478,"royalty_rate":10,"channel_account_index":2,"channel_rate":200}'
      ),
      '{"Type":1,"OfferId":1,"AccountIndex":1,"NftIndex":1,"NftName":"","AssetId":0,"AssetName":"","AssetAmount":10000,"ListedAt":1680186811478,"ExpiredAt":1680194011478,"RoyaltyRate":10,"ChannelAccountIndex":2,"ChannelRate":200,"ProtocolRate":0,"ProtocolAmount":0,"Sig":"LwONc6bYN7unlIvUcDnp50rs3elbsJIV7kwDgSy3+4kF6xVlAIJa4zN08T0o5Zj599PYoS4Hq8WsUiWFv62/gg==","L1Sig":""}'
    );
  });
});

describe('signAtomicMatch', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signAtomicMatch(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"account_index":0,"buy_offer":"{\\"Type\\":0,\\"OfferId\\":1,\\"AccountIndex\\":1,\\"NftIndex\\":1500,\\"AssetId\\":1,\\"AssetAmount\\":10000,\\"ListedAt\\":1654656761000,\\"ExpiredAt\\":1654656781000,\\"RoyaltyRate\\":200,\\"ChannelAccountIndex\\":2,\\"ChannelRate\\":200,\\"ProtocolRate\\":200,\\"ProtocolAmount\\":200,\\"Sig\\":\\"/cNf8c9fnbGtSMgWdJyhjBh/S49ErO0nYDMP6PqO2igAjgFSts4fLTVWnw/rUWpxxckhn0o04hgnMS6uJM7bgA==\\"}","sell_offer":"{\\"Type\\":1,\\"OfferId\\":1,\\"AccountIndex\\":2,\\"NftIndex\\":1500,\\"AssetId\\":1,\\"AssetAmount\\":10000,\\"ListedAt\\":1654656751000,\\"ExpiredAt\\":1654656791000,\\"RoyaltyRate\\":200,\\"ChannelAccountIndex\\":2,\\"ChannelRate\\":200,\\"ProtocolRate\\":0,\\"ProtocolAmount\\":0,\\"Sig\\":\\"LwONc6bYN7unlIvUcDnp50rs3elbsJIV7kwDgSy3+4kASs9AiSByxqCqEfz/OeZOHrtTcILKiLpiQi/IaVPvUA==\\"}","gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","nonce":1,"expired_at":1654656781000}'
      ),
      '{"AccountIndex":0,"BuyOffer":{"Type":0,"OfferId":1,"AccountIndex":1,"NftIndex":1500,"NftName":"","AssetId":1,"AssetName":"","AssetAmount":10000,"ListedAt":1654656761000,"ExpiredAt":1654656781000,"RoyaltyRate":200,"ChannelAccountIndex":2,"ChannelRate":200,"ProtocolRate":200,"ProtocolAmount":200,"Sig":"/cNf8c9fnbGtSMgWdJyhjBh/S49ErO0nYDMP6PqO2igAjgFSts4fLTVWnw/rUWpxxckhn0o04hgnMS6uJM7bgA==","L1Sig":""},"SellOffer":{"Type":1,"OfferId":1,"AccountIndex":2,"NftIndex":1500,"NftName":"","AssetId":1,"AssetName":"","AssetAmount":10000,"ListedAt":1654656751000,"ExpiredAt":1654656791000,"RoyaltyRate":200,"ChannelAccountIndex":2,"ChannelRate":200,"ProtocolRate":0,"ProtocolAmount":0,"Sig":"LwONc6bYN7unlIvUcDnp50rs3elbsJIV7kwDgSy3+4kASs9AiSByxqCqEfz/OeZOHrtTcILKiLpiQi/IaVPvUA==","L1Sig":""},"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"RoyaltyAmount":null,"BuyChannelAmount":null,"SellChannelAmount":null,"Nonce":1,"ExpiredAt":1654656781000,"Sig":"UsFh+JYOqtQZWnBtw2h8bvEgh4YyjrmveNUdr0ln9CQDuuw0vK+ynNFHrekpoNdpzwJxOW+fKzrNrjZ1qSTR9Q=="}'
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
      '{"AccountIndex":0,"OfferId":1,"NftName":"","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"XWlKqcAtbubFmfhkiNDwTwOU9KKv6+sk8YN51wRtzi4B9m5F2OdXVEIxEcylmLK/6YYuQuvEdcOWE+rvjva8GA==","L1Sig":""}'
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
      '{"AccountIndex":0,"CollectionId":0,"Name":"crypto punk","Introduction":"crypto punk is the king of jpeg nft","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"LaUzBV1eoDwKxywj6nkU+wzXmu3FWxJajIueJ1FsTyADffW+jUifGWUplzfRerC7K4cYnKvfdh5jTVLd4mda3w==","L1Sig":""}'
    );
  });
});

describe('signMintNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"creator_account_index":13,"to_account_index":13,"to_l1_address":"0xd757C6bDb5837d721B04DE87c155DBa72c9B076C","nft_collection_id":0,"royalty_rate":1200,"gas_account_index":1,"gas_fee_asset_id":0,"gas_fee_asset_amount":"10000000000000","expired_at":1676674294097,"nonce":3}'
      ),
      '{"CreatorAccountIndex":13,"ToAccountIndex":0,"ToL1Address":"0xd757C6bDb5837d721B04DE87c155DBa72c9B076C","NftIndex":0,"NftContentHash":"","NftContentType":0,"NftCollectionId":0,"RoyaltyRate":1200,"GasAccountIndex":1,"GasFeeAssetId":0,"GasFeeAssetAmount":10000000000000,"ExpiredAt":1676674294097,"Nonce":3,"Sig":"lqWtimus4gSrnpyOFTKTpakGrqTegP9VCvdOuIm7D5kFYshpHDjLNXEsnmSw5lxOt2X54rIZVvF2J3SGLz7K3Q==","MetaData":"","MutableAttributes":"","IpnsName":"","IpnsId":"","L1Sig":""}'
    );
  });
});

describe('signTransferNft', () => {
  it('should return a valid signature', () => {
    assert.equal(
      signMintNft(
        'bd7c6390dd20a2d06e5bc88fa4c6f84ffab19a684e4bcc4c3f9fc8255aa94d28',
        '{"from_account_index":0,"to_l1_address":"0xd757C6bDb5837d721B04DE87c155DBa72c9B076C","nft_index":15,"gas_account_index":1,"gas_fee_asset_id":3,"gas_fee_asset_amount":"3","call_data":"","expired_at":1654656781000,"nonce":1}'
      ),
      '{"CreatorAccountIndex":0,"ToAccountIndex":0,"ToL1Address":"0xd757C6bDb5837d721B04DE87c155DBa72c9B076C","NftIndex":0,"NftContentHash":"","NftContentType":0,"NftCollectionId":0,"RoyaltyRate":0,"GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"NWQUgQn2LAlsxucMgSCexrsopopxdYWS26gjfWbtaA8AoZECNVbCwYX8VFtHGcbMeFbQqoEszoseK9q6DyB20w==","MetaData":"","MutableAttributes":"","IpnsName":"","IpnsId":"","L1Sig":""}'
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
      '{"AccountIndex":1,"CreatorAccountIndex":0,"CreatorL1Address":"","RoyaltyRate":0,"NftIndex":15,"NftName":"","NftContentHash":null,"NftContentType":0,"CollectionId":0,"ToAddress":"0x507Bd54B4232561BC0Ca106F7b029d064fD6bE4c","GasAccountIndex":1,"GasFeeAssetId":3,"GasFeeAssetAmount":3,"ExpiredAt":1654656781000,"Nonce":1,"Sig":"fXIiWN1k3sGaTgpWZfUXEOQpMlIsTI7P1D+7q5a8pJsFF7q46Uufl6ODTXjuSs4SyqWuHHTtI/fXWwq9Gm3iwQ==","L1Sig":""}'
    );
  });
});
