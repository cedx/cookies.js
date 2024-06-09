/* eslint-disable curly */
import console from "node:console";
import {CookieStore} from "@cedx/cookies";

// Loop over all entries of the cookie store.
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

cookieStore.clear();

// Loop over entries of the cookie store that use the same key prefix.
cookieStore
	.set("foo", "bar")
	.set("prefix:bar", "baz");

const prefixedStore = new CookieStore({keyPrefix: "prefix:"})
	.set("baz", "qux");

for (const [key, value] of prefixedStore) {
	console.log(`${key} => ${value}`);
	// Round 1: "bar => baz"
	// Round 2: "baz => qux"
}
