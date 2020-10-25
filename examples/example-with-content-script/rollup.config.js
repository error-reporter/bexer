const plugins = [
];

export default [
  {
    plugins,
    input: './node_modules/bexer/utils.js',
    output: {
      file: './dist/js/inject/bexer-utils.js',
      format: 'iife',
      name: 'Bexer.Utils',
    },
  },
  {
    plugins,
    input: './node_modules/bexer/error-transformer.js',
    output: {
      file: './dist/js/inject/bexer-error-transformer.js',
      format: 'iife',
      name: 'Bexer.ErrorTransformer',
    },
  },
  {
    plugins,
    input: './node_modules/bexer/expose.js',
    output: {
      file: './dist/js/vendor/bexer/index.js',
      format: 'iife',
      name: 'Bexer',
    },
  },
];
