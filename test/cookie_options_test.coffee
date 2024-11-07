import {CookieOptions, SameSite} from "@cedx/cookies"
import {assert} from "chai"

# Tests the features of the `CookieOptions` class.
describe "CookieOptions", ->
	{equal, isEmpty} = assert

	describe "toString()", ->
		it "should return an empty string for a newly created instance", ->
			isEmpty String new CookieOptions

		it "should return a formatted string for an initialized instance", ->
			options = new CookieOptions expires: new Date(0), path: "/path", secure: true
			equal String(options), "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/path; secure"

			options = new CookieOptions domain: "domain.com", maxAge: 123, sameSite: SameSite.strict
			equal String(options), "domain=domain.com; max-age=123; samesite=strict"
