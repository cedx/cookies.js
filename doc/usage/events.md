path: blob/master/lib
source: simple_change.js

# Events
The `Cookies` class is an [`EventEmitter`](https://nodejs.org/api/events.html): every time one or several values are changed (added, removed or updated) through this class, a `changes` event is triggered.

You can subscribe to this event using the `on()` method:

```ts
import {Cookies} from '@cedx/cookies';

function main() {
  new Cookies().on('changes', changes => {
    for (let [key, value] of changes.entries()) console.log(`${key}: ${value}`);
  });
}
```

The changes are expressed as a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of [`SimpleChange`](https://github.com/cedx/cookies.js/blob/master/lib/simple_change.js) instances, where a `null` property indicates an absence of value:

```ts
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;

  cookies.on('changes', changes => {
    for (let [key, change] of changes.entries()) console.log({
      key,
      current: change.currentValue,
      previous: change.previousValue
    });
  });

  cookies.set('foo', 'bar');
  // Prints: {key: "foo", current: "bar", previous: null}

  cookies.set('foo', 'baz');
  // Prints: {key: "foo", current: "baz", previous: "bar"}

  cookies.remove('foo');
  // Prints: {key: "foo", current: null, previous: "baz"}
}
```

The values contained in the `currentValue` and `previousValue` properties of the `SimpleChange` instances are the raw cookie values. If you use the `Cookies#setObject()` method to set a cookie, you will get the serialized string value, not the original value passed to the method:

```ts
import {Cookies} from '@cedx/cookies';

function main() {
  const cookies = new Cookies;
  cookies.setObject('foo', {bar: 'baz'});
  // Prints: {key: "foo", current: "{\"bar\": \"baz\"}", previous: null}
}
```
