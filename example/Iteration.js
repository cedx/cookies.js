import {CookieStore} from "@cedx/cookies";
import console from "node:console";

// Loop over all entries of the cookie store.
const cookieStore = new CookieStore;
await cookieStore.set("foo", "bar");
await cookieStore.set("bar", "baz");
await cookieStore.set("baz", "qux");

for await (const [key, value] of cookieStore) console.log(`${key} => ${value}`);
// Round 1: "foo => bar"
// Round 2: "bar => baz"
// Round 3: "baz => qux"

await cookieStore.clear();

// Loop over entries of the cookie store that use the same key prefix.
await cookieStore.set("foo", "bar");
await cookieStore.set("prefix:bar", "baz");

const prefixedStore = await new CookieStore({keyPrefix: "prefix:"}).set("baz", "qux");
for await (const [key, value] of prefixedStore) console.log(`${key} => ${value}`);
// Round 1: "bar => baz"
// Round 2: "baz => qux"
