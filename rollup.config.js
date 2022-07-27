import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json'
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import builtins from 'rollup-plugin-node-builtins';
import { wasm } from '@rollup/plugin-wasm';

const buildConfig = ({
  input = './src/index.ts',
  es5,
  browser = true,
  minifiedVersion = true,
  ...config
}) => {
  const build = ({ minified }) => ({
    input,
    ...config,
    output: {
      ...config.output
    },
    plugins: [
      json(),
      resolve({ browser }),
      commonjs(),
      minified && terser(),
      ...(es5
        ? [
            babel({
              babelHelpers: 'bundled',
              presets: ['@babel/preset-env']
            })
          ]
        : []),
      ...(config.plugins || [])
    ]
  });

  const configs = [build({ minified: false })];

  if (minifiedVersion) {
    build({ minified: true });
  }

  return configs;
};

const name = 'Zk'
const outputFileName = 'zk'

export default async () => {
  return [
    ...buildConfig({
      input: './src/index.ts',
      es5: true,
      output: {
        file: `dist/web/${outputFileName}.js`,
        name,
        format: 'umd'
      },
      plugins: [
        builtins(),
        nodePolyfills(),
        resolve({
          preferBuiltins: true,
          browser: true
        }),
        wasm({
          targetEnv: 'auto-inline'
        }),
        typescript({
          tsconfig: './tsconfig-esm.json',
          declarationDir: './dist/web/types/'
        })
      ]
    }),
    ...buildConfig({
      input: './src/index.ts',
      output: {
        dir: 'dist/node',
        format: 'cjs'
      },
      plugins: [
        autoExternal(),
        resolve({
          browser: false
        }),
        commonjs(),
        wasm({
          targetEnv: 'auto-inline'
        }),
        typescript({
          tsconfig: './tsconfig-cjs.json',
          declarationDir: './dist/node/types/'
        })
      ]
    }),
    {
      input: ['./src/zecrey/node.index.js', './src/zecrey/web.index.js'],
      output: [
        { dir: 'dist/zecrey/cjs', format: 'cjs', sourcemap: true },
        { dir: 'dist/zecrey/esm', format: 'esm', sourcemap: true },
      ],
      plugins: [
        wasm({
          targetEnv: 'auto-inline'
        })
      ]
    }
  ];
}
