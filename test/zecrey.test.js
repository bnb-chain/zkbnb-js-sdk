const { assert } = require('chai');

const { generateEddsaKey } = require('../zecrey');

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
