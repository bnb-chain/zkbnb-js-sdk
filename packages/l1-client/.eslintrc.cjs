module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    browser: true,
    node: true,
    mocha: true,
    'shared-node-browser': true,
    shelljs: true,
  },
  rules: {
    'no-async-promise-executor': 0,
    '@typescript-eslint/no-var-requires': 0,
  },
  globals: {
    Go: true,
  },
  plugins: ['prettier', '@typescript-eslint'],
};
