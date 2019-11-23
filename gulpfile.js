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

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

function copyForTypeChecks() {
  return src('./src/**')
    .pipe(dest('./generated-for-type-checks/.'));
}

function build() {
  const folders = getFolders('./src');
  if (folders.length === 0) return; // nothing to do!
  return Promise.all(
    folders.map(function(folder) {
      return new Promise((resolve) => exec('npx rollup -c ../rollup.config.js', { cwd: path.join('./src', folder) }, resolve));
    }),
  );
}

function copyForDist() {
  return src('./generated-for-type-checks/**')
    .pipe(dest('./generated-for-dist/.'));
}

function generateDeclarations() {
  return new Promise((resolve) => exec('npx tsc', resolve));
}

exports.build = build;
exports.default = series(clean, copyForTypeChecks, build, copyForDist, generateDeclarations);
