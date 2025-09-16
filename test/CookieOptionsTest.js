import {CookieOptions, SameSite} from "@cedx/cookies";
import {assert} from "chai";

/**
 * Tests the features of the {@link CookieOptions} class.
 */
describe("CookieOptions", () => {
	describe("toString()", () => {
		it("should return an empty string for a newly created instance", () =>
			assert.isEmpty(String(new CookieOptions)));

		it("should return a formatted string for an initialized instance", () => {
			let options = new CookieOptions({expires: new Date(0), path: "/path", secure: true});
			assert.equal(String(options), "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/path; secure");

			options = new CookieOptions({domain: "domain.com", sameSite: SameSite.Strict});
			assert.equal(String(options), "domain=domain.com; samesite=strict");
		});
	});
});
