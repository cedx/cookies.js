path: blob/master
source: lib/cookie_options.js

# Cookie options
Several methods of the [Cookies](api.md) class accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the [`CookieOptions`](https://github.com/cedx/cookies.js/blob/master/lib/cookie_options.js) class, which has the following properties:

- **domain**: string = `""`: The domain for which the cookie is valid.
- **expires**: Date | null = `null`: The expiration date and time for the cookie.
- **path**: string = `""`: The path to which the cookie applies.
- **secure**: boolean = `false`: Value indicating whether to transmit the cookie over HTTPS only.

For example:

```js
import {Cookies, CookieOptions} from '@cedx/cookies';

function main() {
  new Cookies().set('foo', 'bar', new CookieOptions({
    domain: 'www.domain.com',
    expires: new Date(Date.now() + (3600 * 1000)), // One hour.
    path: '/'
  }));
}
```

For convenience, you can also use a literal object instead of a `CookieOptions` instance:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  new Cookies().set('foo', 'bar', {
    domain: 'www.domain.com',
    expires: new Date(Date.now() + (3600 * 1000)), // One hour.
    path: '/'
  });
}
```

It is possible to provide default values for the cookie options when instantiating the `Cookies` service:

```js
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies({
    domain: 'www.domain.com',
    path: '/',
    secure: true
  });

  console.log(JSON.stringify(cookies.defaults));
  // {"domain": "www.domain.com", "expires": null, "path": "/", "secure": true}
}
```

!!! tip
    The [`Cookies#defaults`](api.md) property let you override the default cookie options at runtime.
