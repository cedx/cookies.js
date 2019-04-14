const {join} = require('path');
const sources = {
  lib: join(__dirname, '../src/**/*.ts'),
  test: join(__dirname, '**/*_test.ts')
};

module.exports = config => config.set({
  browsers: ['FirefoxHeadless'],
  files: [sources.lib, sources.test],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    include: [sources.test],
    reports: {
      lcovonly: {directory: join(__dirname, '../var'), filename: 'lcov.info', subdirectory: () => ''}
    },
    tsconfig: '../tsconfig.json'
  },
  plugins: [
    require('karma-firefox-launcher'),
    require('karma-mocha'),
    require('karma-typescript')
  ],
  preprocessors: {
    [sources.lib]: ['karma-typescript'],
    [sources.test]: ['karma-typescript']
  },
  reporters: ['progress', 'coverage'],
  singleRun: true
});
