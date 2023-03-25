import { expect } from 'chai';
import { closestPackableTransactionAmount, closestPackableTransactionFee } from '../src/utils';
import { BigNumber } from 'ethers';

describe('Packing and unpacking', function () {
  it('Test basic fee packing/unpacking', function () {
    const nums = ['0', '1', '2', '2047000', '1000000000000000000000000000000000'];
    for (const num of nums) {
      const bigNumberAmount = BigNumber.from(num);
      expect(closestPackableTransactionFee(bigNumberAmount).toString()).equal(
        bigNumberAmount.toString(),
        'fee packing'
      );
      expect(closestPackableTransactionAmount(bigNumberAmount).toString()).equal(
        bigNumberAmount.toString(),
        'amount packing'
      );
    }
    expect(closestPackableTransactionFee('2048').toString()).equal('2047', 'fee packing');
  });
});
