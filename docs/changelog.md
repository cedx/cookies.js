# Changelog

## Version [5.0.1](https://github.com/cedx/cookies.js/compare/v5.0.0...v5.0.1)
- Fixed the [TypeScript](https://www.typescriptlang.org) typings.

## Version [5.0.0](https://github.com/cedx/cookies.js/compare/v4.5.0...v5.0.0)
- Breaking change: removed the `defaultValue` parameter from the getter methods.
- Breaking change: removed the `fromJson()`, `fromString()` and `toJSON()` methods from the `CookieOptions` class.
- Breaking change: renamed the `Cookies` class to `CookieStore`.
- Breaking change: replaced the `SimpleChange` class by the `CookieEvent` one.
- Added support for key prefix.
- Added support for the `samesite` cookie attribute.
- Added the `CookieStore.all` static property.
- Added the `CookieStore.onChange()` instance method.
- Ported the source code to [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript).
- Restored support for [GitHub Packages](https://github.com/features/packages).

## Version [4.5.0](https://github.com/cedx/cookies.js/compare/v4.4.0...v4.5.0)
- Dropped support for [GitHub Packages](https://github.com/features/packages).
- Raised the [Node.js](https://nodejs.org) constraint.
- Updated the documentation.
- Updated the package dependencies.

## Version [4.4.0](https://github.com/cedx/cookies.js/compare/v4.3.0...v4.4.0)
- Updated the package dependencies.

## Version [4.3.0](https://github.com/cedx/cookies.js/compare/v4.2.0...v4.3.0)
- Added the `putIfAbsent()` and `putObjectIfAbsent()` methods to the `Cookies` class.
- Updated the package dependencies.

## Version [4.2.0](https://github.com/cedx/cookies.js/compare/v4.1.0...v4.2.0)
- Replaced [`babel-minify`](https://github.com/babel/minify) by [`terser`](https://terser.org) for minification.

## Version [4.1.0](https://github.com/cedx/cookies.js/compare/v4.0.1...v4.1.0)
- Added the `CookieOptions.fromString()` method.
- Improved the [TypeScript](https://www.typescriptlang.org) typings.
- Removed the restriction on allowed cookie names.

## Version [4.0.1](https://github.com/cedx/cookies.js/compare/v4.0.0...v4.0.1)
- Fixed the [issue #4](https://github.com/cedx/cookies.js/issues/4): the `CookieOptions.maxAge` property is ignored by the constructor.

## Version [4.0.0](https://github.com/cedx/cookies.js/compare/v3.3.0...v4.0.0)
- Breaking change: the `Cookies` service is now an [`EventTarget`](https://developer.mozilla.org/docs/Web/API/EventTarget) instead of an [`EventEmitter`](https://nodejs.org/api/events.html).
- Added the `CookieOptions.maxAge` property.
- Raised the [Node.js](https://nodejs.org) constraint.
- Replaced the [TSLint](https://palantir.github.io/tslint) static analyzer by [ESLint](https://eslint.org).
- Updated the package dependencies.

## Version [3.3.0](https://github.com/cedx/cookies.js/compare/v3.2.0...v3.3.0)
- Modified the package layout.
- Updated the package dependencies.

## Version [3.2.0](https://github.com/cedx/cookies.js/compare/v3.1.0...v3.2.0)
- Replaced the [Webpack](https://webpack.js.org) bundler by [Rollup](https://rollupjs.org) and [Babel Minify](https://github.com/babel/minify).
- Updated the package dependencies.

## Version [3.1.0](https://github.com/cedx/cookies.js/compare/v3.0.0...v3.1.0)
- Updated the package dependencies.
- Updated the URL of the Git repository.

## Version [3.0.0](https://github.com/cedx/cookies.js/compare/v2.0.0...v3.0.0)
- Breaking change: ported the [CommonJS modules](https://nodejs.org/api/modules.html) to ES2015 format.
- Added support for a redistributable bundle.

## Version [2.0.0](https://github.com/cedx/cookies.js/compare/v1.0.0...v2.0.0)
- Breaking change: changed the signature of the `CookieOptions` constructor.
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Added the `CookieOptions.fromJson()` and `SimpleChange.fromJson()` static methods.
- Replaced the [ESDoc](https://esdoc.org) documentation generator by [TypeDoc](https://typedoc.org).
- Replaced the [ESLint](https://eslint.org) static analyzer by [TSLint](https://palantir.github.io/tslint).
- Updated the package dependencies.

## Version [1.0.0](https://github.com/cedx/cookies.js/compare/v0.1.0...v1.0.0)
- Breaking change: changed the signature of the `CookieOptions` constructor.
- Breaking change: dropped the support of [CommonJS modules](https://nodejs.org/api/modules.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: replaced the `ChangeEvent` class by the `SimpleChange` one.
- Added the `Cookies.toJSON()` method.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Added new unit tests.
- Replaced the `events` module by `eventemitter3`.
- Replaced the virtual DOM used in unit tests by [Karma](https://karma-runner.github.io).
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version 0.1.0
- Initial release.
