import {CookieOptions, SameSite} from "@cedx/cookies";
import {assert} from "chai";

/**
 * Tests the features of the {@link CookieOptions} class.
 */
describe("CookieOptions", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {equal, isEmpty} = assert;

	describe("toString()", () => {
		it("should return an empty string for a newly created instance", () =>
			isEmpty(String(new CookieOptions)));

		it("should return a formatted string for an initialized instance", () => {
			let options = new CookieOptions({expires: new Date(0), path: "/path", secure: true});
			equal(String(options), "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/path; secure");

			options = new CookieOptions({domain: "domain.com", maxAge: 123, sameSite: SameSite.Strict});
			equal(String(options), "domain=domain.com; max-age=123; samesite=strict");
		});
	});
});
