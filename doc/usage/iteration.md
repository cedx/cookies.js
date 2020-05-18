# Iteration
The [`Cookies`](api.md) class is iterable: you can go through all key/value pairs contained using a `for...of` loop.
Each entry is an array with two elements (i.e. the key and the value):

```js
import {Cookies} from "@cedx/cookies";

function main() {
	const cookies = new Cookies;
	cookies.set("foo", "bar");
	cookies.set("anotherKey", "anotherValue");

	for (const entry of cookies) {
		console.log(entry);
		// Round 1: ["foo", "bar"]
		// Round 2: ["anotherKey", "anotherValue"]
	}
}
```
