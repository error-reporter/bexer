const { series, parallel, src, dest } = require('gulp');
const del = require('del');
const rollup = require('rollup-stream');
const path = require('path');
const fs = require('fs');

const { exec } = require('child_process');

function clean() {
  return del([
    './generated-*',
  ]);
}

function build() {
  return new Promise((resolve) => exec('npx rollup -c ./rollup.config.mjs', {}, resolve));
}

const copyFiles =
  parallel(
    () => src('./src/*.d.ts')
      .pipe(dest('./generated-for-dist/esm/'))
      .pipe(dest('./generated-for-dist/iife/')),

    () => src('./LICENSE.md')
      .pipe(dest('./generated-for-dist/.')),

    () => src('./README.md')
      .pipe(dest('./generated-for-dist/.')),

    () => src('./src/package.json')
      .pipe(dest('./generated-for-dist/.')),
  );

function generateDeclarations() {
  return new Promise((resolve) => exec('npx tsc', resolve));
}

exports.build = build;
exports.default = series(clean, build, copyFiles, generateDeclarations);
