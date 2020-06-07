import {CookieOptions} from "../lib/index.js";

/** Tests the features of the `CookieOptions` class. */
describe("CookieOptions", function() {
	const options = new CookieOptions({
		domain: "domain.com",
		expires: new Date(0),
		path: "/path",
		secure: true
	});

	describe(".maxAge", function() {
		it("should return `-1` if the expiration time is not set", function() {
			expect(new CookieOptions().maxAge).to.equal(-1);
		});

		it("should return zero if the cookie has expired", function() {
			expect(new CookieOptions({expires: new Date(2000, 0)}).maxAge).to.equal(0);
		});

		it("should return the difference with now if the cookie has not expired", function() {
			const duration = 30 * 1000;
			expect(new CookieOptions({expires: new Date(Date.now() + duration)}).maxAge).to.equal(30);
		});

		it("should set the expiration date accordingly", function() {
			const cookieOptions = new CookieOptions;

			cookieOptions.maxAge = 0;
			const now = Date.now();
			expect(cookieOptions.expires.getTime()).to.be.above(now - 1000).and.be.at.most(now);

			cookieOptions.maxAge = 30;
			const later = Date.now() + (30 * 1000);
			expect(cookieOptions.expires.getTime()).to.be.above(later - 1000).and.be.at.most(later);

			cookieOptions.maxAge = -1;
			expect(cookieOptions.expires).to.be.undefined;
		});
	});

	describe(".fromJson()", function() {
		it("should return an instance with default values for an empty map", function() {
			const cookieOptions = CookieOptions.fromJson({});
			expect(cookieOptions.domain).to.be.empty;
			expect(cookieOptions.expires).to.be.undefined;
			expect(cookieOptions.maxAge).to.equal(-1);
			expect(cookieOptions.path).to.be.empty;
			expect(cookieOptions.secure).to.be.false;
		});

		it("should return an initialized instance for a non-empty map", function() {
			const cookieOptions = CookieOptions.fromJson(options.toJSON());
			expect(cookieOptions.domain).to.equal("domain.com");
			expect(cookieOptions.expires.toISOString()).to.equal("1970-01-01T00:00:00.000Z");
			expect(cookieOptions.maxAge).to.equal(0);
			expect(cookieOptions.path).to.equal("/path");
			expect(cookieOptions.secure).to.be.true;
		});
	});

	describe(".fromString()", function() {
		it("should return an instance with default values for an empty string", function() {
			const cookieOptions = CookieOptions.fromString("");
			expect(cookieOptions.domain).to.be.empty;
			expect(cookieOptions.expires).to.be.undefined;
			expect(cookieOptions.maxAge).to.equal(-1);
			expect(cookieOptions.path).to.be.empty;
			expect(cookieOptions.secure).to.be.false;
		});

		it("should return an initialized instance for a cookie string", function() {
			const cookieOptions = CookieOptions.fromString(`foo=bar; ${options}`);
			expect(cookieOptions.domain).to.equal("domain.com");
			expect(cookieOptions.expires.toISOString()).to.equal("1970-01-01T00:00:00.000Z");
			expect(cookieOptions.maxAge).to.equal(0);
			expect(cookieOptions.path).to.equal("/path");
			expect(cookieOptions.secure).to.be.true;
		});
	});

	describe(".toJSON()", function() {
		it("should return a map with default values for a newly created instance", function() {
			expect(new CookieOptions().toJSON()).to.deep.equal({
				domain: "",
				expires: null,
				path: "",
				secure: false
			});
		});

		it("should return a non-empty map for an initialized instance", function() {
			expect(options.toJSON()).to.deep.equal({
				domain: "domain.com",
				expires: "1970-01-01T00:00:00.000Z",
				path: "/path",
				secure: true
			});
		});
	});

	describe(".toString()", function() {
		it("should return an empty string for a newly created instance", function() {
			expect(String(new CookieOptions)).to.be.empty;
		});

		it("should return a format like 'expires=<expires>; domain=<domain>; path=<path>; secure' for an initialized instance", function() {
			expect(String(options)).to.equal("expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=domain.com; path=/path; secure");
		});
	});
});
