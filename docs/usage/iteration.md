# Iteration
The [`CookieStore`](usage/api.md) class is iterable: it implements the [`Symbol.iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) function.
You can go through all key/value pairs contained using a `for...of` loop:

```javascript
import {CookieStore} from "@cedx/cookies";

const cookieStore = new CookieStore()
  .set("foo", "bar")
  .set("bar", "baz")
  .set("baz", "qux");

for (const [key, value] of cookieStore) {
  console.log(`${key} => ${value}`);
  // Round 1: "foo => bar"
  // Round 2: "bar => baz"
  // Round 3: "baz => qux"
}
```

> The order of keys is user-agent defined, so you should not rely on it.

If you have configured the instance to use a [key prefix](usage/key_prefix.md), the iteration will only loop over the values that have that same key prefix:

```javascript
import {CookieStore} from "@cedx/cookies";

const cookieStore = new CookieStore()
  .set("foo", "bar")
  .set("prefix:bar", "baz");

const prefixedStore = new CookieStore({keyPrefix: "prefix:"})
  .set("baz", "qux");

for (const [key, value] of prefixedStore) {
  console.log(`${key} => ${value}`);
  // Round 1: "bar => baz"
  // Round 2: "baz => qux"
}
```

> The prefix is stripped from the keys returned by the iteration.
