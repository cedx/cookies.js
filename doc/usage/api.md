# Programming interface
This package provides a service dedicated to the cookie management: the `Cookies` class.
It should be registered with the application by exposing it as a property on the global object:

```javascript
import {Cookies} from '@cedx/cookies';

// Expose the service as an application-wide singleton.
window.cookies = new Cookies;
```

Then, it will be available in your component classes:

```javascript
// Optional statement: the service should be available globally.
const cookies = window.cookies;

cookies.get('foo');
cookies.getObject('bar');

cookies.set('foo', 'bar');
cookies.setObject('foo', {bar: 'baz'});
```

The `Cookies` class has the following API:

## **#defaults**: CookieOptions
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

!!! tip
    This property allows the configuration of the default cookie options
    at runtime.

## **#keys**: string[]
Returns the keys of the cookies associated with the current document:

```javascript
console.log(cookies.keys); // []

cookies.set('foo', 'bar');
console.log(cookies.keys); // ["foo"]
```

## **#length**: number
Returns the number of cookies associated with the current document:

```javascript
console.log(cookies.length); // 0

cookies.set('foo', 'bar');
console.log(cookies.length); // 1
```

## **#clear**()
Removes all cookies associated with the current document:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.length); // 1

cookies.clear();
console.log(cookies.length); // 0
```

## **#get**(key: string, defaultValue: any = `null`): string
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

## **#getObject**(key: string, defaultValue: any = `null`): any
Deserializes and returns the value associated to the specified key:

```javascript
cookies.setObject('foo', {bar: 'baz'});
console.log(cookies.getObject('foo')); // {bar: "baz"}
```

!!! info
    The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookies.getObject('unknownKey')); // null
console.log(cookies.getObject('unknownKey', false)); // false
```

## **#has**(key: string): boolean
Returns a boolean value indicating whether the current document has a cookie with the specified key:

```javascript
console.log(cookies.has('foo')); // false

cookies.set('foo', 'bar');
console.log(cookies.has('foo')); // true
```

## **#remove**(key: string, options: CookieOptions|Object = `{}`)
Removes the value associated to the specified key:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.has('foo')); // true

cookies.remove('foo');
console.log(cookies.has('foo')); // false
```

## **#set**(key: string, value: string, options: CookieOptions|Object = `{}`)
Associates a given value to the specified key:

```javascript
console.log(cookies.get('foo')); // null

cookies.set('foo', 'bar');
console.log(cookies.get('foo')); // "bar"
```

## **#setObject**(key: string, value: any, options: CookieOptions|Object = `{}`)
Serializes and associates a given value to the specified key:

```javascript
console.log(cookies.getObject('foo')); // null

cookies.setObject('foo', {bar: 'baz'});
console.log(cookies.getObject('foo')); // {bar: "baz"}
```

!!! info
    The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.
