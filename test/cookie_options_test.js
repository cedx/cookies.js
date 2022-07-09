/* eslint-disable no-unused-expressions */
import {expect} from "@esm-bundle/chai";
import {CookieOptions, SameSite} from "../src/index.js";

/**
 * Tests the features of the {@link CookieOptions} class.
 */
describe("CookieOptions", () => {
	describe(".toString()", () => {
		it("should return an empty string for a newly created instance", () => {
			const options = new CookieOptions;
			expect(String(options)).to.be.empty;
		});

		it("should return a formatted string for an initialized instance", () => {
			let options = new CookieOptions({expires: new Date(0), path: "/path", secure: true});
			expect(String(options)).to.equal("expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/path; secure");

			options = new CookieOptions({domain: "domain.com", maxAge: 123, sameSite: SameSite.strict});
			expect(String(options)).to.equal("domain=domain.com; max-age=123; samesite=strict");
		});
	});
});
