// Copyright 2021 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

'use strict';

globalThis.require = require;
globalThis.fs = require('fs');
globalThis.TextEncoder = require('util').TextEncoder;
globalThis.TextDecoder = require('util').TextDecoder;

globalThis.performance = {
  now() {
    const [sec, nsec] = process.hrtime();
    return sec * 1000 + nsec / 1000000;
  }
};

const crypto = require('crypto');
globalThis.crypto = {
  getRandomValues(b) {
    crypto.randomFillSync(b);
  }
};

require('./wasm_exec');

const go = new Go();
go.argv = process.argv.slice(2);
go.env = Object.assign({ TMPDIR: require('os').tmpdir() }, process.env);
go.exit = process.exit;

let func = process.argv[3];
let funcArgs = process.argv.slice(4)

WebAssembly.instantiate(fs.readFileSync(process.argv[2]), go.importObject)
  .then((result) => {
    process.on('exit', (code) => {
			const result = globalThis[func](...funcArgs);
      console.log(result);
      process.exit();
    });
    return go.run(result.instance);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/*
let func, funcArgs;

WebAssembly.instantiate(
	fs.readFileSync('./zecreyLegend.wasm'),
	go.importObject
)
	.then((res) => {
		console.log(2);
		process.on('message', (args) => {
			console.log(3);
			func = args.func;
			funcArgs = args.funcArgs;
			// console.log(3);
			// if (code === 0 && !go.exited) {
			//   // deadlock, make Go print error and stack traces
			//   go._pendingEvent = { id: 0 };
			//   go._resume();
			// }

			// const result = globalThis.generateEddsaKey(
			//   '28e1a3762ff9944e9a4ad79477b756ef0aff3d2af76f0f40a0c3ec6ca76cf24b'
			// );
			// console.log(globalThis[func])
			const result = globalThis[func](...funcArgs);
			
			process.send(result);
			process.exit()
		});
		return go.run(res.instance);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
*/








// module.exports = async (func, funcArgs) => {
//   try {
//     const res = await WebAssembly.instantiate(
// 			// setting wasm file
//       fs.readFileSync('./zecreyLegend.wasm'),
//       go.importObject
//     );

//     process.on('message', (code) => {
// 			// console.log(code, !go.exited);

// 			// console.log('ppp', globalThis.generateEddsaKey);

//       // return globalThis.generateEddsaKey;
//       const result = globalThis.generateEddsaKey(
//         '28e1a3762ff9944e9a4ad79477b756ef0aff3d2af76f0f40a0c3ec6ca76cf24b'
//       );
//       // console.log(globalThis[func])
//       // return 110;
//       // const result = globalThis[func](...funcArgs);
//       console.log(result)

// 			process.send(result)

//       // return result;

//     });

//     // return go.run(res.instance);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };
