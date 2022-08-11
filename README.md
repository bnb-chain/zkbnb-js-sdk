<p align="center">
  <a href="https://www.npmjs.com/package/@bnb-chain/zkbas-js-sdk"><img src="https://img.shields.io/npm/v/@bnb-chain/zkbas-js-sdk" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@bnb-chain/zkbas-js-sdk"><img src="https://img.shields.io/npm/l/@bnb-chain/zkbas-js-sdk" alt="License"></a>
</p>

# ZkBAS JavaScript SDK 

> [Go SDK](https://github.com/bnb-chain/zkbas-go-sdk)

The ZkBAS JavaScript SDK provides a thin wrapper around thin all the apis provided by ZkBAS, including a simple key manager for signing txs and sending signed txs to ZkBAS.

## Install

Using npm:

```bash
> npm install @bnb-chain/zkbas-js-sdk
```

Using yarn:

```bash
> yarn add @bnb-chain/zkbas-js-sdk
```

Using pnpm:

```bash
> pnpm add @bnb-chain/zkbas-js-sdk
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@bnb-chain/zkbas-js-sdk/dist/web/zk.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@bnb-chain/zkbas-js-sdk/dist/web/zk.js"></script>
```

## Usage

### Browser

Use directly in the browser via script tag:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.jsdelivr.net/npm/@bnb-chain/zkbas-js-sdk/dist/web/zk.js"></script>
</head>
<body>
  <script>
    const client = new Zk.Client('http://172.22.41.67:8888');

    (async () => {
      const res = await client.getAccountInfoByAccountIndex(1);
      console.log(res)
    })()
  </script>
</body>
</html>
```

### ESM

If you use module bundler such as [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/guide/en/), etc:

```typescript
import { Client } from '@bnb-chain/zkbas-js-sdk';

const client = new Client('http://172.22.41.67:8888');

(async () => {
  const res = await client.getAccountInfoByAccountIndex(1);
  console.log(res)
})()
```

### CJS

Using SDK in Nodejs:

```javascript
const { Client } = require('@bnb-chain/zkbas-js-sdk');

const client = new Client('http://172.22.41.67:8888');

(async () => {
  const res = await client.getAccountInfoByAccountIndex(1);
  console.log(res)
})()
```

## Zkbas Crypto API

The wrapper for [Zkbas Crypto](https://github.com/bnb-chain/zkbas-crypto).

## API List

> https://github.com/bnb-chain/zkbas-crypto/blob/master/wasm/legend/main.go#L33-L59

## Usage

Because of [WASM](https://webassembly.org/) different usage scenarios, there are two packages:

### run on Node.js

```javascript
const { ZkCrypto } = require('@bnb-chain/zkbas-js-sdk/zkCrypto');

console.log('getEddsaPublicKey:', ZkCrypto.getEddsaPublicKey('12312123123'))
```

### run on browser

```javascript
import { ZkCrypto } from '@bnb-chain/zkbas-js-sdk/zkCrypto/web';

;(async () => {
  const { getEddsaPublicKey } = await ZkCrypto();
  console.log('getEddsaPublicKey:', getEddsaPublicKey('12312123123'));
})();
```


## CHANGELOG

[CHANGELOG](./docs/CHANGELOG.md)
