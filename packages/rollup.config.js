import Path from 'path';
import shell from 'shelljs';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
// import babel from 'rollup-plugin-babel';

const extensions = [
  '.js',
];

const plugins = [
  nodeResolve({ extensions }),
  commonJs(),
  // babel({ extensions }),
];

const { LERNA_ROOT_PATH } = process.env;
const PACKAGE_ROOT_PATH = process.cwd();

// eslint-disable-next-line
const PKG = require(Path.join(PACKAGE_ROOT_PATH, 'package.json'));

/*
  @bexer/utils -> utils.js
  @bexer/commons/error-types -> error-types.js
*/
const pkgNameToFilename = (name) => {

  if (name.startsWith('@bexer')) {
    /*
      @bexer/index -> index.js
      @bexer/common -> common.js
      @bexer/common/esm/error-type -> error-type.js
      @bexer/common/esm/private/debug -> private/debug.js
    */
    return `./${name.replace(/^@bexer\/(?:.+?\/)?(?:esm\/)?(.+)$/, '$1')}.js`;
  }
  return name;
};

const external = (name) => {

  return name.startsWith('@bexer');
};

const filename = pkgNameToFilename(PKG.name);
const allInOnePath = Path.join(LERNA_ROOT_PATH, 'packages', 'bexer-components');

const filenameToExportedName = (fn) => 'BexerComponents.' + fn
  .replace(/^.+\//, '')
  .replace(/\.js$/, '')
  .replace(/-([^-])/g, (w, g) => g.toUpperCase());

const output = (outputFilePath, format = 'esm') => {

  const ifIife = format === 'iife';
  const iifeOpts = ifIife ? {
    name: filenameToExportedName(outputFilePath),
    globals: filenameToExportedName,
  } : {};
  const commonOpts = {
    ...iifeOpts,
    format,
    paths: pkgNameToFilename,
    banner: `// Generated from package ${PKG.name} v${PKG.version}`,
  };
  outputFilePath = outputFilePath.replace(/^(?:\.\/)?esm/, './');
  const outs = [
    {
      file: Path.join(
        allInOnePath,
        format,
        outputFilePath,
      ),
      ...commonOpts,
    },
  ];
  if (ifIife) {
    outs.push({
      file: Path.join(
        '.',
        format,
        outputFilePath,
      ),
      ...commonOpts,
    });
  }
  return outs;
};

const getTasks = (format) => PKG.module
  ? [
      {
        input: PKG.module,
        output: output(filename, format),
        external,
        plugins,
      }
    ]
  : shell.ls('*.js', '**/*.js').filter((fn) => !fn.startsWith('iife')).map((jsFilePath) => ({
      input: Path.join(PACKAGE_ROOT_PATH, jsFilePath),
      output: output(jsFilePath, format),
      external,
      plugins,
  }));

export default ['esm', 'iife'].map(getTasks).flat();
