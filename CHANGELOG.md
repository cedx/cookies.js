# Changelog

## Version [2.0.0](https://github.com/cedx/cookies.js/compare/v1.0.0...v2.0.0)
- Breaking change: changed the signature of the `CookieOptions` constructor.
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Added the `CookieOptions.fromJson()` static method.
- Replaced [ESDoc](https://esdoc.org) documentation generator by [TypeDoc](https://typedoc.org).
- Replaced [ESLint](https://eslint.org) static analyzer by [TSLint](https://palantir.github.io/tslint).
- Updated the package dependencies.

## Version [1.0.0](https://github.com/cedx/cookies.js/compare/v0.1.0...v1.0.0)
- Breaking change: changed the signature of the `CookieOptions` constructor.
- Breaking change: dropped the support of [CommonJS modules](https://nodejs.org/api/modules.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: replaced the `ChangeEvent` class by the `SimpleChange` one.
- Added the `Cookies#toJSON()` method.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Added new unit tests.
- Replaced the `events` module by `eventemitter3`.
- Replaced the virtual DOM used in unit tests by [Karma](https://karma-runner.github.io).
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version 0.1.0
- Initial release.
