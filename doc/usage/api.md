---
path: src/branch/master
source: src/cookies.ts
---

# Programming interface
This package provides a service dedicated to the cookie management: the `Cookies` class.

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;

  cookies.set('foo', 'bar');
  console.log(cookies.get('foo')); // "bar"

  cookies.setObject('foo', {baz: 'qux'});
  console.log(cookies.getObject('foo')); // {baz: "qux"}
}
```

!!! warning
    The `Cookies` class exposed by this package is an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget).  
    If you target browsers that do not support the `EventTarget` constructor, you will need
    a dedicated polyfill.  

The `Cookies` class has the following API:

## **defaults**: CookieOptions
Returns the default [options](options.md) to pass when setting cookies:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(JSON.stringify(cookies.defaults));
  // {"domain": "", "expires": null, "path": "", "secure": false}

  cookies.defaults.domain = 'domain.com';
  cookies.defaults.path = '/www';
  cookies.defaults.secure = true;

  console.log(JSON.stringify(cookies.defaults));
  // {"domain": "domain.com", "expires": null, "path": "/www", "secure": true}
}
```

## **keys**: string[]
Returns the keys of the cookies associated with the current document:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.keys); // []

  cookies.set('foo', 'bar');
  console.log(cookies.keys); // ["foo"]
}
```

## **length**: number
Returns the number of cookies associated with the current document:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.length); // 0

  cookies.set('foo', 'bar');
  console.log(cookies.length); // 1
}
```

## **clear**(): void
Removes all cookies associated with the current document:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  cookies.set('foo', 'bar');
  console.log(cookies.length); // 1

  cookies.clear();
  console.log(cookies.length); // 0
}
```

## **get**(key: string, defaultValue?: string): string|undefined
Returns the value associated to the specified key:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.get('foo')); // undefined
  console.log(cookies.get('foo', 'qux')); // "qux"

  cookies.set('foo', 'bar');
  console.log(cookies.get('foo')); // "bar"
}
```

Returns `undefined` or the given default value if the key is not found.

## **getObject**(key: string, defaultValue?: any): any
Deserializes and returns the value associated to the specified key:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.getObject('foo')); // undefined
  console.log(cookies.getObject('foo', 'qux')); // "qux"
  
  cookies.setObject('foo', {bar: 'baz'});
  console.log(cookies.getObject('foo')); // {bar: "baz"}
}
```

!!! info
    The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns `undefined` or the given default value if the key is not found.

## **has**(key: string): boolean
Returns a boolean value indicating whether the current document has a cookie with the specified key:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.has('foo')); // false

  cookies.set('foo', 'bar');
  console.log(cookies.has('foo')); // true
}
```

## **putIfAbsent**(key: string, ifAbsent: () => string, options?: CookieOptions): string
Looks up the cookie with the specified key, or add a new cookie if it isn't there.

Returns the value associated to the key, if there is one. Otherwise calls `ifAbsent` to get a new value, associates the key to that value, and then returns the new value:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.has('foo')); // false

  let value = cookies.putIfAbsent('foo', () => 'bar');
  console.log(cookies.has('foo')); // true
  console.log(value); // "bar"

  value = cookies.putIfAbsent('foo', () => 'qux');
  console.log(value); // "bar"
}
```

## **putObjectIfAbsent**(key: string, ifAbsent: () => any, options?: CookieOptions): any
Looks up the cookie with the specified key, or add a new cookie if it isn't there.

Returns the deserialized value associated to the key, if there is one. Otherwise calls `ifAbsent` to get a new value, serializes and associates the key to that value, and then returns the new value:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.has('foo')); // false

  let value = cookies.putObjectIfAbsent('foo', () => 123);
  console.log(cookies.has('foo')); // true
  console.log(value); // 123

  value = cookies.putObjectIfAbsent('foo', () => 456);
  console.log(value); // 123
}
```

!!! info
    The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method, and deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

## **remove**(key: string, options?: CookieOptions): string|undefined
Removes the value associated to the specified key:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;

  cookies.set('foo', 'bar');
  console.log(cookies.has('foo')); // true

  console.log(cookies.remove('foo')); // "bar"
  console.log(cookies.has('foo')); // false
}
```

## **set**(key: string, value: string, options?: CookieOptions): this
Associates a given value to the specified key:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.get('foo')); // undefined

  cookies.set('foo', 'bar');
  console.log(cookies.get('foo')); // "bar"
}
```

## **setObject**(key: string, value: any, options?: CookieOptions): this
Serializes and associates a given value to the specified key:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  console.log(cookies.getObject('foo')); // undefined

  cookies.setObject('foo', {bar: 'baz'});
  console.log(cookies.getObject('foo')); // {bar: "baz"}
}
```

!!! info
    The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.
