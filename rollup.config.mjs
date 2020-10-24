import Path from 'path';
import shell from 'shelljs';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

const extensions = [
  'js',
];

const plugins = [
  nodeResolve({ extensions }),
  commonJs(),
];

const filenameToExportedName = (filename) => 'Bexer.' + filename
  .replace(/^.+\//, '')
  .replace(/\.js$/, '')
  .replace(/-([^-])/g, (w, g) => g.toUpperCase());

const getTasks = (format) =>
  shell.ls('./src/*\.js', './src/**/*\.js').map((jsFilePath) => ({
    input: jsFilePath,
    output: {
      file: jsFilePath.replace(/\.\/src\//g, `./generated-for-dist/${format}/`),
      format,
      name: filenameToExportedName(jsFilePath),
    },
    plugins,
  }));

export default [].concat(...['esm', 'iife'].map(getTasks));
