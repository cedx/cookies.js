import {CookieStore} from "@cedx/cookies"
import console from "node:console"

# Loop over all entries of the local storage.
cookieStore = new CookieStore
	.set "foo", "bar"
	.set "bar", "baz"
	.set "baz", "qux"

console.log "#{key} => #{value}" for [key, value] from cookieStore
# Round 1: "foo => bar"
# Round 2: "bar => baz"
# Round 3: "baz => qux"

cookieStore.clear()

# Loop over entries of the session storage that use the same key prefix.
cookieStore
	.set "foo", "bar"
	.set "prefix:bar", "baz"

prefixedStore = new CookieStore(keyPrefix: "prefix:").set "baz", "qux"
console.log "#{key} => #{value}" for [key, value] from prefixedStore
# Round 1: "bar => baz"
# Round 2: "baz => qux"
