import { terser } from 'rollup-plugin-terser';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

const plugins = [
  nodeResolve(),
  commonJs(),
  // terser(),
  builtins(),
];

const popupIndex = './dist/pages/popup/index.js';
const contentScript = '/content-scripts/receive-messages-from-webpages.js'

export default [
  {
    plugins,
    input: './src/index.js',
    output: {
      file: './dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
  },
  {
    plugins,
    input: './src' + contentScript,
    output: {
      file: './dist' + contentScript,
      format: 'iife',
      sourcemap: true,
    },
  },
  {
    plugins,
    input: popupIndex,
    output: {
      file: popupIndex,
      format: 'esm',
      sourcemap: true,
    },
  },
  {
    plugins,
    input: './node_modules/bexer/expose.js',
    output: {
      file: './dist/vendor/bexer/expose.js',
      format: 'esm',
      sourcemap: true,
    },
  },
];
