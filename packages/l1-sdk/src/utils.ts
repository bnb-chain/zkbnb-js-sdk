import { BigNumber, BigNumberish, Contract, constants, ethers, utils } from 'ethers';
import { ZkBNBProvider } from './provider-interface';
import { Address, TokenAddress, TokenLike, TokenRatio, WeiRatio } from './types';
import { BEP20Interface, ZkBNBInterface } from './abi';

// Max number of tokens for the current version, it is determined by the zkBNB circuit implementation.
const MAX_NUMBER_OF_TOKENS = Math.pow(2, 31);
// Max number of accounts for the current version, it is determined by the zkBNB circuit implementation.
const MAX_NUMBER_OF_ACCOUNTS = Math.pow(2, 24);

export const MAX_TIMESTAMP = 4294967295;
export const MIN_NFT_TOKEN_ID = 65536;
export const CURRENT_TX_VERSION = 1;

export const MAX_BEP20_APPROVE_AMOUNT = BigNumber.from(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
); // 2^256 - 1

export const BEP20_APPROVE_THRESHOLD = BigNumber.from(
  '57896044618658097711785492504343953926634992332820282019728792003956564819968'
); // 2^255

// Gas limit that is set for eth deposit by default. For default EOA accounts 60k should be enough, but we reserve
// more gas for smart-contract wallets
export const BNB_RECOMMENDED_DEPOSIT_GAS_LIMIT = BigNumber.from('90000'); // 90k
// For normal wallet/erc20 token 90k gas for deposit should be enough, but for some tokens this can go as high as ~200k
// we try to be safe by default
export const BEP20_RECOMMENDED_DEPOSIT_GAS_LIMIT = BigNumber.from('300000'); // 300k
export const ERC721_RECOMMENDED_DEPOSIT_GAS_LIMIT = BigNumber.from('300000'); // 300k
export const BEP20_RECOMMENDED_FULL_EXIT_GAS_LIMIT = BigNumber.from('500000'); // 500k
export const ERC721_RECOMMENDED_FULL_EXIT_GAS_LIMIT = BigNumber.from('500000'); // 500k
export const BEP20_RECOMMENDED_WITHDRAW_PENDING_BALANCE_GAS_LIMIT = BigNumber.from('500000'); // 500k
export const ERC721_RECOMMENDED_WITHDRAW_PENDING_BALANCE_GAS_LIMIT = BigNumber.from('500000'); // 500k
export const BEP20_RECOMMENDED_ADD_ASSET_GAS_LIMIT = BigNumber.from('500000'); // 500k
export const ERC721_RECOMMENDED_REGISTER_NFT_FACTORY_GAS_LIMIT = BigNumber.from('500000'); // 500k
export const ERC721_RECOMMENDED_DEPLOY_AND_REGISTER_NFT_FACTORY_GAS_LIMIT = BigNumber.from('5000000'); // 500k

const AMOUNT_EXPONENT_BIT_WIDTH = 5;
const AMOUNT_MANTISSA_BIT_WIDTH = 35;
const FEE_EXPONENT_BIT_WIDTH = 5;
const FEE_MANTISSA_BIT_WIDTH = 11;

export function tokenRatio(ratio: { [token: string]: string | number; [token: number]: string | number }): TokenRatio {
  return {
    type: 'Token',
    ...ratio,
  };
}

export function weiRatio(ratio: { [token: string]: BigNumberish; [token: number]: BigNumberish }): WeiRatio {
  return {
    type: 'Wei',
    ...ratio,
  };
}

export function floatToInteger(
  floatBytes: Uint8Array,
  expBits: number,
  mantissaBits: number,
  expBaseNumber: number
): BigNumber {
  if (floatBytes.length * 8 !== mantissaBits + expBits) {
    throw new Error('Float unpacking, incorrect input length');
  }

  const bits = buffer2bitsBE(floatBytes).reverse();
  let exponent = BigNumber.from(0);
  let expPow2 = BigNumber.from(1);
  for (let i = 0; i < expBits; i++) {
    if (bits[i] === 1) {
      exponent = exponent.add(expPow2);
    }
    expPow2 = expPow2.mul(2);
  }
  exponent = BigNumber.from(expBaseNumber).pow(exponent);

  let mantissa = BigNumber.from(0);
  let mantissaPow2 = BigNumber.from(1);
  for (let i = expBits; i < expBits + mantissaBits; i++) {
    if (bits[i] === 1) {
      mantissa = mantissa.add(mantissaPow2);
    }
    mantissaPow2 = mantissaPow2.mul(2);
  }
  return exponent.mul(mantissa);
}

export function bitsIntoBytesInBEOrder(bits: number[]): Uint8Array {
  if (bits.length % 8 !== 0) {
    throw new Error('wrong number of bits to pack');
  }
  const nBytes = bits.length / 8;
  const resultBytes = new Uint8Array(nBytes);

  for (let byte = 0; byte < nBytes; ++byte) {
    let value = 0;
    if (bits[byte * 8] === 1) {
      value |= 0x80;
    }
    if (bits[byte * 8 + 1] === 1) {
      value |= 0x40;
    }
    if (bits[byte * 8 + 2] === 1) {
      value |= 0x20;
    }
    if (bits[byte * 8 + 3] === 1) {
      value |= 0x10;
    }
    if (bits[byte * 8 + 4] === 1) {
      value |= 0x08;
    }
    if (bits[byte * 8 + 5] === 1) {
      value |= 0x04;
    }
    if (bits[byte * 8 + 6] === 1) {
      value |= 0x02;
    }
    if (bits[byte * 8 + 7] === 1) {
      value |= 0x01;
    }

    resultBytes[byte] = value;
  }

  return resultBytes;
}

function numberToBits(integer: number, bits: number): number[] {
  const result = [];
  for (let i = 0; i < bits; i++) {
    result.push(integer & 1);
    integer /= 2;
  }
  return result;
}

export function integerToFloat(integer: BigNumber, expBits: number, mantissaBits: number, expBase: number): Uint8Array {
  const maxExponentPower = BigNumber.from(2).pow(expBits).sub(1);
  const maxExponent = BigNumber.from(expBase).pow(maxExponentPower);
  const maxMantissa = BigNumber.from(2).pow(mantissaBits).sub(1);

  if (integer.gt(maxMantissa.mul(maxExponent))) {
    throw new Error('Integer is too big');
  }

  // The algortihm is as follows: calculate minimal exponent
  // such that integer <= max_mantissa * exponent_base ^ exponent,
  // then if this minimal exponent is 0 we can choose mantissa equals integer and exponent equals 0
  // else we need to check two variants:
  // 1) with that minimal exponent
  // 2) with that minimal exponent minus 1
  let exponent = 0;
  let exponentTemp = BigNumber.from(1);
  while (integer.gt(maxMantissa.mul(exponentTemp))) {
    exponentTemp = exponentTemp.mul(expBase);
    exponent += 1;
  }
  let mantissa = integer.div(exponentTemp);
  if (exponent !== 0) {
    const variant1 = exponentTemp.mul(mantissa);
    const variant2 = exponentTemp.div(expBase).mul(maxMantissa);
    const diff1 = integer.sub(variant1);
    const diff2 = integer.sub(variant2);
    if (diff2.lt(diff1)) {
      mantissa = maxMantissa;
      exponent -= 1;
    }
  }

  // encode into bits. First bits of mantissa in LE order
  const encoding = [];

  encoding.push(...numberToBits(exponent, expBits));
  const mantissaNumber = mantissa.toNumber();
  encoding.push(...numberToBits(mantissaNumber, mantissaBits));

  return bitsIntoBytesInBEOrder(encoding.reverse()).reverse();
}

export function reverseBits(buffer: Uint8Array): Uint8Array {
  const reversed = buffer.reverse();
  reversed.map((b) => {
    // reverse bits in byte
    b = ((b & 0xf0) >> 4) | ((b & 0x0f) << 4);
    b = ((b & 0xcc) >> 2) | ((b & 0x33) << 2);
    b = ((b & 0xaa) >> 1) | ((b & 0x55) << 1);
    return b;
  });
  return reversed;
}

function packAmount(amount: BigNumber): Uint8Array {
  return reverseBits(integerToFloat(amount, AMOUNT_EXPONENT_BIT_WIDTH, AMOUNT_MANTISSA_BIT_WIDTH, 10));
}

function packFee(amount: BigNumber): Uint8Array {
  return reverseBits(integerToFloat(amount, FEE_EXPONENT_BIT_WIDTH, FEE_MANTISSA_BIT_WIDTH, 10));
}

/**
 * packs and unpacks the amount, returning the closest packed value.
 * e.g 1000000003 => 1000000000
 * @param amount
 */
export function closestPackableTransactionAmount(amount: BigNumberish): BigNumber {
  const packedAmount = packAmount(BigNumber.from(amount));
  return floatToInteger(packedAmount, AMOUNT_EXPONENT_BIT_WIDTH, AMOUNT_MANTISSA_BIT_WIDTH, 10);
}

/**
 * packs and unpacks the amount, returning the closest packed value.
 * e.g 1000000003 => 1000000000
 * @param fee
 */
export function closestPackableTransactionFee(fee: BigNumberish): BigNumber {
  const packedFee = packFee(BigNumber.from(fee));
  return floatToInteger(packedFee, FEE_EXPONENT_BIT_WIDTH, FEE_MANTISSA_BIT_WIDTH, 10);
}

export function buffer2bitsBE(buff) {
  const res = new Array(buff.length * 8);
  for (let i = 0; i < buff.length; i++) {
    const b = buff[i];
    res[i * 8] = (b & 0x80) !== 0 ? 1 : 0;
    res[i * 8 + 1] = (b & 0x40) !== 0 ? 1 : 0;
    res[i * 8 + 2] = (b & 0x20) !== 0 ? 1 : 0;
    res[i * 8 + 3] = (b & 0x10) !== 0 ? 1 : 0;
    res[i * 8 + 4] = (b & 0x08) !== 0 ? 1 : 0;
    res[i * 8 + 5] = (b & 0x04) !== 0 ? 1 : 0;
    res[i * 8 + 6] = (b & 0x02) !== 0 ? 1 : 0;
    res[i * 8 + 7] = (b & 0x01) !== 0 ? 1 : 0;
  }
  return res;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isBNBToken(token: TokenLike): boolean {
  return token === 'BNB' || token === constants.AddressZero;
}

export function getSignedBytesFromMessage(message: utils.BytesLike | string, addPrefix: boolean): Uint8Array {
  let messageBytes = typeof message === 'string' ? utils.toUtf8Bytes(message) : utils.arrayify(message);
  if (addPrefix) {
    messageBytes = utils.concat([
      utils.toUtf8Bytes(`\x19Ethereum Signed Message:\n${messageBytes.length}`),
      messageBytes,
    ]);
  }
  return messageBytes;
}

export async function signMessagePersonalAPI(signer: ethers.Signer, message: Uint8Array): Promise<string> {
  if (signer instanceof ethers.providers.JsonRpcSigner) {
    return signer.provider.send('personal_sign', [utils.hexlify(message), await signer.getAddress()]).then(
      (sign) => sign,
      (err) => {
        // We check for method name in the error string because error messages about invalid method name
        // often contain method name.
        if (err.message.includes('personal_sign')) {
          // If no "personal_sign", use "eth_sign"
          return signer.signMessage(message);
        }
        throw err;
      }
    );
  } else {
    return signer.signMessage(message);
  }
}

export async function getEthereumBalance(
  ethProvider: ethers.providers.Provider,
  syncProvider: ZkBNBProvider,
  address: Address,
  tokenAddress: TokenAddress
): Promise<BigNumber> {
  let balance: BigNumber;
  if (isBNBToken(tokenAddress)) {
    balance = await ethProvider.getBalance(address);
  } else {
    const erc20contract = new Contract(tokenAddress, BEP20Interface, ethProvider);

    balance = await erc20contract.balanceOf(address);
  }
  return balance;
}

export async function getPendingBalance(
  ethProvider: ethers.providers.Provider,
  syncProvider: ZkBNBProvider,
  address: Address,
  tokenAddress: TokenAddress
): Promise<BigNumberish> {
  const zkBNBContract = new Contract(syncProvider.contractAddress.zkBNBContract, ZkBNBInterface, ethProvider);

  return zkBNBContract.getPendingBalance(address, tokenAddress);
}
