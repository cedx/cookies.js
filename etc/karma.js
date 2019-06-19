const {normalize, resolve} = require('path');

module.exports = config => config.set({
  basePath: resolve(__dirname, '..'),
  browsers: ['FirefoxHeadless'],
  files: [
    {pattern: 'test/**/*.js', type: 'module'}
  ],
  frameworks: ['mocha', 'chai'],
  reporters: ['progress'],
  singleRun: true
});
