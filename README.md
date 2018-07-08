# Cookies for JS
![Runtime](https://img.shields.io/badge/node-%3E%3D10.6-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/cookies.svg) ![License](https://img.shields.io/npm/l/@cedx/cookies.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/cookies.svg) ![Dependencies](https://david-dm.org/cedx/cookies.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/cookies.js/badge.svg) ![Build](https://travis-ci.org/cedx/cookies.js.svg)

Yet another service for interacting with the [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/cookies
```

## Usage
This package provides a service dedicated to the cookie management: the `Cookies` class.
It should be registered with the application by exposing it as a property on the global object:

```javascript
import {Cookies} from '@cedx/cookies';

// Expose the service as an application-wide singleton.
window.cookies = new Cookies;
```

Then, it will be available in the component classes:

```javascript
// Optional statement: the service should be available globally.
const cookies = window.cookies;

cookies.get('foo');
cookies.getObject('bar');

cookies.set('foo', 'bar');
cookies.setObject('foo', {bar: 'baz'});
```

### Programming interface
The `Cookies` class has the following API:

#### `.defaults: CookieOptions`
Returns the default options to pass when setting cookies:

```javascript
console.log(JSON.stringify(cookies.defaults));
// {"domain": "", "expires": null, "path": "/", "secure": false}

cookies.defaults.domain = 'domain.com';
cookies.defaults.path = '/www';
cookies.defaults.secure = true;

console.log(JSON.stringify(cookies.defaults));
// {"domain": "domain.com", "expires": null, "path": "/www", "secure": true}
```

> This property allows the configuration of the default cookie options at runtime.

#### `.keys: string[]`
Returns the keys of the cookies associated with the current document:

```javascript
console.log(cookies.keys); // []

cookies.set('foo', 'bar');
console.log(cookies.keys); // ["foo"]
```

#### `.length: number`
Returns the number of cookies associated with the current document:

```javascript
console.log(cookies.length); // 0

cookies.set('foo', 'bar');
console.log(cookies.length); // 1
```

#### `.clear()`
Removes all cookies associated with the current document:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.length); // 1

cookies.clear();
console.log(cookies.length); // 0
```

#### `.get(key: string, defaultValue: any = null): string`
Returns the value associated to the specified key:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.get('foo')); // "bar"
```

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookies.get('unknownKey')); // null
console.log(cookies.get('unknownKey', 'foo')); // "foo"
```

#### `.getObject(key: string, defaultValue: any = null): any`
Deserializes and returns the value associated to the specified key:

```javascript
cookies.setObject('foo', {bar: 'baz'});
console.log(cookies.getObject('foo')); // {bar: "baz"}
```

> The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookies.getObject('unknownKey')); // null
console.log(cookies.getObject('unknownKey', false)); // false
```

#### `.has(key: string): boolean`
Returns a boolean value indicating whether the current document has a cookie with the specified key:

```javascript
console.log(cookies.has('foo')); // false

cookies.set('foo', 'bar');
console.log(cookies.has('foo')); // true
```

#### `.remove(key: string, options: CookieOptions|object = this.defaults)`
Removes the value associated to the specified key:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.has('foo')); // true

cookies.remove('foo');
console.log(cookies.has('foo')); // false
```

#### `.set(key: string, value: string, options: CookieOptions|object = this.defaults)`
Associates a given value to the specified key:

```javascript
console.log(cookies.get('foo')); // null

cookies.set('foo', 'bar');
console.log(cookies.get('foo')); // "bar"
```

#### `.setObject(key: string, value: any, options: CookieOptions|object= this.defaults)`
Serializes and associates a given value to the specified key:

```javascript
console.log(cookies.getObject('foo')); // null

cookies.setObject('foo', {bar: 'baz'});
console.log(cookies.getObject('foo')); // {bar: "baz"}
```

> The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.

### Options
Several methods accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the [`CookieOptions`](https://github.com/cedx/cookies.js/blob/master/lib/cookie_options.js) class, which has the following properties:

- `expires: Date = null`: The expiration date and time for the cookie.
- `path: string = ""`: The path to which the cookie applies.
- `domain: string = ""`: The domain for which the cookie is valid.
- `secure: boolean = false`: Value indicating whether to transmit the cookie over HTTPS only.

For example:

```javascript
import {CookieOptions} from '@cedx/cookies';

let options = new CookieOptions({
  domain: 'www.domain.com',
  expires: new Date(Date.now() + (3600 * 1000)), // One hour.
  path: '/'
});

cookies.set('foo', 'bar', options);
```

For convenience, you can also use a literal object instead of a `CookieOptions` instance:

```javascript
cookies.set('foo', 'bar', {
  domain: 'www.domain.com',
  expires: Date.now() + (3600 * 1000), // Numbers and strings also work.
  path: '/'
});
```

It is possible to provide default values for the cookie options when instantiating the `Cookies` service:

```javascript
window.cookies = new Cookies({
  domain: 'www.domain.com',
  path: '/',
  secure: true
});
```

> The `Cookies#defaults` property let you override the default cookie options at runtime.

### Iteration
The `Cookies` class is iterable: you can go through all key/value pairs contained using a `for...of` loop. Each entry is an array with two elements (e.g. the key and the value):

```javascript
cookies.set('foo', 'bar');
cookies.set('anotherKey', 'anotherValue');

for (let entry of cookies) {
  console.log(entry);
  // Round 1: ["foo", "bar"]
  // Round 2: ["anotherKey", "anotherValue"]
}
```

### Events
The `Cookies` class is an [`EventEmitter`](https://nodejs.org/api/events.html): every time one or several values are changed (added, removed or updated) through this class, a `changes` event is triggered.

You can subscribe to this event using the `on()` method:

```javascript
cookies.on('changes', changes => {
  for (let change of changes) console.log(change);
});
```

The changes are expressed as an array of [`SimpleChange`](https://github.com/cedx/cookies.js/blob/master/lib/simple_change.js) instances, where a `null` reference indicates an absence of value:

```javascript
cookies.on('changes', changes => console.log({
  key: changes[0].key,
  currentValue: changes[0].currentValue,
  previousValue: changes[0].previousValue
}));

cookies.set('foo', 'bar');
// Prints: {key: "foo", currentValue: "bar", previousValue: null}

cookies.set('foo', 'baz');
// Prints: {key: "foo", currentValue: "baz", previousValue: "bar"}

cookies.remove('foo');
// Prints: {key: "foo", currentValue: null, previousValue: "baz"}
```

The values contained in the `currentValue` and `previousValue` properties of the `SimpleChange` instances are the raw cookie values. If you use the `Cookies#setObject()` method to set a cookie, you will get the serialized string value, not the original value passed to the method:

```javascript
cookies.setObject('foo', {bar: 'baz'});
// Prints: {key: "foo", currentValue: "{\"bar\": \"baz\"}", previousValue: null}
```

## License
[Cookies for JS](https://github.com/cedx/cookies.js) is distributed under the MIT License.
