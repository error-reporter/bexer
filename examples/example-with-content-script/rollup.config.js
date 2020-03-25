const plugins = [
];

export default [
  {
    plugins,
    input: './node_modules/@bexer/components/esm/utils.js',
    output: {
      file: './dist/js/inject/bexer-utils.js',
      format: 'iife',
      name: 'Bexer.Utils',
    },
  },
  {
    plugins,
    input: './node_modules/@bexer/components/esm/error-transformer.js',
    output: {
      file: './dist/js/inject/bexer-error-transformer.js',
      format: 'iife',
      name: 'Bexer.ErrorTransformer',
    },
  },
  {
    plugins,
    input: './node_modules/@bexer/components/expose-to-window-esm.js',
    output: {
      file: './dist/js/vendor/bexer/index.js',
      format: 'iife',
      name: 'Bexer',
    },
  },
];
