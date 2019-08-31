path: blob/master
source: src/cookie_options.ts

# Cookie options
Several methods of the [Cookies](api.md) class accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the `CookieOptions` class, which has the following properties:

- **domain**: `string`: The domain for which the cookie is valid.
- **expires**: `Date`: The expiration date and time for the cookie.
- **maxAge**: `number`: The maximum duration, in seconds, until the cookie expires.
- **path**: `string`: The path to which the cookie applies.
- **secure**: `boolean`: Value indicating whether to transmit the cookie over HTTPS only.

!!! info
    The `maxAge` property has precedence over the `expires` one.

For example:

```typescript
import {Cookies, CookieOptions} from '@cedx/cookies';

function main(): void {
  new Cookies().set('foo', 'bar', new CookieOptions({
    domain: 'www.domain.com',
    maxAge: 3600, // One hour.
    path: '/'
  }));
}
```
    
## Configuring defaults
It is possible to provide default values for the cookie options when instantiating the `Cookies` service:

```typescript
import {Cookies, CookieOptions} from '@cedx/cookies';

function main(): void {
  const cookies = new Cookies(new CookieOptions({
    domain: 'www.domain.com',
    path: '/',
    secure: true
  }));

  console.log(JSON.stringify(cookies.defaults));
  // {"domain": "www.domain.com", "expires": null, "path": "/", "secure": true}
}
```

!!! tip
    The [`Cookies#defaults`](api.md) property let you override the default cookie options at runtime.
