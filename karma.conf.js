const {join} = require('path');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = config => config.set({
  browsers: ['Chrome'],
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
    'lib/**/*.js': ['coverage'],
    'test/**/*.js': ['rollup']
  },
  rollupPreprocessor: {
    onwarn: warning => {
      if (warning.code == 'CIRCULAR_DEPENDENCY' && warning.importer.includes(join('node_modules', 'chai'))) return;
      console.warn(`(!) ${warning.message}`);
    },
    output: {
      format: 'iife',
      name: 'cookies',
      sourcemap: 'inline'
    },
    plugins: [
      nodeResolve(),
      commonjs({namedExports: {chai: ['expect']}})
    ]
  }
});
