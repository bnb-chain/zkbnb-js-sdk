import wasm from './zecreyLegend.wasm';
import './wasm_exec';

if (!WebAssembly.instantiateStreaming) {
  // polyfill
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

const go = new Go();

export const ZECREY = async () => {
  const { module, instance } = await wasm({ ...go.importObject });
  go.run(instance);

  const methods = [
    'cleanPackedAmount',
    'cleanPackedFee',
    'getAccountNameHash',
    'getEddsaPublicKey',
    'getEddsaCompressedPublicKey',
    'generateEddsaKey',
    'eddsaSign',
    'eddsaVerify',
    'signAddLiquidity',
    'signRemoveLiquidity',
    'signSwap',
    'signTransfer',
    'signWithdraw',
    'signOffer',
    'signAtomicMatch',
    'signCancelOffer',
    'signCreateCollection',
    'signMintNft',
    'signTransferNft',
    'signWithdrawNft',
  ];

  let Z = {};

  methods.map((method) => {
    Z[method] = window[method]
  })

  WebAssembly.instantiate(module, go.importObject);

  return Z;
};
