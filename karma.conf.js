'use strict';

module.exports = config => config.set({
  browsers: ['Firefox'],
  client: {mocha: {opts: true}},
  frameworks: ['mocha'],
  files: ['test/**/*.js'],
  preprocessors: {'src/**/*.js': ['coverage']},
  reporters: ['progress', 'coverage'],
  coverageReporter: {
    dir: 'var',
    includeAllSources: true,
    subdir: '.',
    type: 'lcovonly'
  }
});
