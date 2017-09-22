'use strict';

const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = config => config.set({
  browsers: ['Firefox'],
  client: {mocha: {opts: true}},
  frameworks: ['mocha'],
  files: ['test/**/*.js'],
  reporters: ['progress', 'coverage'],
  coverageReporter: {
    dir: 'var',
    includeAllSources: true,
    subdir: '.',
    type: 'lcovonly'
  },
  preprocessors: {
    'src/**/*.js': ['coverage'],
    'test/**/*.js': ['rollup']
  },
  rollupPreprocessor: {
    format: 'iife',
    name: 'cookies',
    plugins: [
      nodeResolve(),
      commonjs({namedExports: {chai: ['expect']}})
    ],
    sourcemap: 'inline'
  }
});
