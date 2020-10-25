import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

const plugins = [
  nodeResolve(),
  commonJs(),
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
    input: './node_modules/bexer/index.js',
    output: {
      file: './dist/vendor/bexer/index.js',
      format: 'iife',
      name: 'Bexer',
    },
  },
];
