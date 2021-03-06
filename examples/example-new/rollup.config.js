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

export default [
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
    input: './node_modules/@bexer/components/esm/index.js',
    output: {
      file: './dist/vendor/bexer/index.js',
      format: 'iife',
      name: 'Bexer',
    },
  },
];
