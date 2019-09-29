path: blob/master
source: src/simple_change.ts

# Events
The [`Cookies`](api.md) class is an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget): every time one or several values are changed (added, removed or updated) through this class, a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) is triggered.

!!! tip
    If you target browsers that do not support the `EventTarget` constructor, you will need
    a dedicated polyfill. We recommend using the [`@ungap/event-target`](https://www.npmjs.com/package/@ungap/event-target) package.   

You can subscribe to these `changes` events using the `addEventListener()` method:

```typescript
import {Cookies, SimpleChange} from '@cedx/cookies';

function main(): void {
  new Cookies().addEventListener(Cookies.eventChanges, (event: Event): void => {
    const changes = (event as CustomEvent<Map<string, SimpleChange>>).detail;
    for (const [key, value] of changes.entries()) console.log(`${key}: ${value}`);
  });
}
```

The changes are expressed as a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
of [`SimpleChange`](https://github.com/cedx/cookies.js/blob/master/src/simple_change.ts) instances, where an `undefined` property indicates an absence of value:

```typescript
import {Cookies, SimpleChange} from '@cedx/cookies';

function main(): void {
  const cookies = new Cookies;
  cookies.addEventListener(Cookies.eventChanges, (event: Event): void => {
    const changes = (event as CustomEvent<Map<string, SimpleChange>>).detail;
    for (const [key, change] of changes.entries()) console.log({
      key,
      current: change.currentValue,
      previous: change.previousValue
    });
  });

  cookies.set('foo', 'bar');
  // Prints: {key: "foo", current: "bar", previous: undefined}

  cookies.set('foo', 'baz');
  // Prints: {key: "foo", current: "baz", previous: "bar"}

  cookies.remove('foo');
  // Prints: {key: "foo", current: undefined, previous: "baz"}
}
```

The values contained in the `currentValue` and `previousValue` properties of the `SimpleChange` instances are the raw cookie values. If you use the `Cookies#setObject()` method to set a cookie, you will get the serialized string value, not the original value passed to the method:

```typescript
cookies.setObject('foo', {bar: 'baz'});
// Prints: {key: "foo", current: "{\"bar\": \"baz\"}", previous: undefined}
```
