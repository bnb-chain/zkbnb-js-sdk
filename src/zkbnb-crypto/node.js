import { resolve } from 'path';
const { spawnSync } = require('node:child_process');

const getResultLine = (str) => {
  return str.replace(/ZkBNB Crypto Assembly\n/gi, '').trim();
};

const getCleanEnv = () => {
  const envs = process.env;
  return Object.entries(envs).reduce((acc, [k, v]) => {
    if (k.startsWith('GITHUB') || k.startsWith('ANDROID') || k.startsWith('HOMEBREW') || k.startsWith('JAVA')) {
      return acc;
    }
    acc[k] = v;
    return acc;
  }, {});
};

const allEnv = getCleanEnv();

const wasmExec = (func, funcArgs) => {
  // ['seed phrase', 'hello world'] => '"seed phrase" "hee world"'
  const wasmExecNodePath = resolve(__dirname, './wasm_exec_node.js');
  const wasmFilePath = resolve(__dirname, './main.wasm');

  const proc = spawnSync('node', [wasmExecNodePath, wasmFilePath, func, ...funcArgs], { env: allEnv });

  return getResultLine(proc.stdout.toString());
};

const cleanPackedAmount = (amount) => wasmExec('cleanPackedAmount', [amount]);

const cleanPackedFee = (amount) => wasmExec('cleanPackedFee', [amount]);

const getAccountNameHash = (accountName) => wasmExec('getAccountNameHash', [accountName]);

const getEddsaPublicKey = (seed) => wasmExec('getEddsaPublicKey', [seed]);

const generateEddsaKey = (seed) => wasmExec('generateEddsaKey', [seed]);

const getEddsaCompressedPublicKey = (seed) => wasmExec('getEddsaCompressedPublicKey', [seed]);

const eddsaSign = (seed, message) => wasmExec('eddsaSign', [seed, message]);

const eddsaVerify = (publicKey, signature, message) => wasmExec('eddsaVerify', [publicKey, signature, message]);

const signTransfer = (seed, segmentstr) => wasmExec('signTransfer', [seed, segmentstr]);

const signWithdraw = (seed, segmentstr) => wasmExec('signWithdraw', [seed, segmentstr]);

const signOffer = (seed, segmentstr) => wasmExec('signOffer', [seed, segmentstr]);

const signAtomicMatch = (seed, segmentstr) => wasmExec('signAtomicMatch', [seed, segmentstr]);

const signCancelOffer = (seed, segmentstr) => wasmExec('signCancelOffer', [seed, segmentstr]);

const signCreateCollection = (seed, segmentstr) => wasmExec('signCreateCollection', [seed, segmentstr]);

const signMintNft = (seed, segmentstr) => wasmExec('signMintNft', [seed, segmentstr]);

const signTransferNft = (seed, segmentstr) => wasmExec('signTransferNft', [seed, segmentstr]);

const signWithdrawNft = (seed, segmentstr) => wasmExec('signWithdrawNft', [seed, segmentstr]);

export const ZkCrypto = {
  cleanPackedAmount,
  cleanPackedFee,
  getAccountNameHash,
  getEddsaPublicKey,
  getEddsaCompressedPublicKey,
  generateEddsaKey,
  eddsaSign,
  eddsaVerify,
  signTransfer,
  signWithdraw,
  signOffer,
  signAtomicMatch,
  signCancelOffer,
  signCreateCollection,
  signMintNft,
  signTransferNft,
  signWithdrawNft,
};
