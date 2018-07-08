# Cookie options
Several methods accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the [`CookieOptions`](https://github.com/cedx/cookies.js/blob/master/lib/cookie_options.js) class, which has the following properties:

- **expires**: Date = `null`: The expiration date and time for the cookie.
- **path**: string = `""`: The path to which the cookie applies.
- **domain**: string = `""`: The domain for which the cookie is valid.
- **secure**: boolean = `false`: Value indicating whether to transmit the cookie over HTTPS only.

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

console.log(JSON.stringify(cookies.defaults));
// {"domain": "www.domain.com", "expires": null, "path": "/", "secure": true}
```

!!! tip
    The `Cookies#defaults` property let you override the default cookie options at runtime.
