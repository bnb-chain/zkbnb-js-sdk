const { exec } = require('shelljs');

const getResultLine = (str) => {
  return str.replace(/Zecrey-legend Crypto Assembly/gi, '').trim();
};

const wasmExec = (func, funcArgs) => {
  const result = exec(
    `node ./zecrey/wasm_exec_node.js ./zecrey/zecreyLegend.wasm ${func} ${funcArgs.join(' ')}`,
    {
      silent: true
    }
  );

  return getResultLine(result.stdout);
};

module.exports.generateEddsaKey = (seed) =>
  wasmExec('generateEddsaKey', [seed]);
