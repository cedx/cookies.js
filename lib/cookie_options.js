/**
 * Defines the attributes of a HTTP cookie.
 */
export class CookieOptions {

	/**
	 * The domain for which the cookie is valid.
	 * @type {string}
	 */
	domain;

	/**
	 * The expiration date and time for the cookie.
	 * @type {Date|null}
	 */
	expires;

	/**
	 * The maximum duration, in seconds, until the cookie expires.
	 * @type {number}
	 */
	maxAge;

	/**
	 * The path to which the cookie applies.
	 * @type {string}
	 */
	path;

	/**
	 * The cross-site requests policy.
	 * @type {import("./same_site.js").SameSite}
	 */
	sameSite;

	/**
	 * Value indicating whether to transmit the cookie over HTTPS only.
	 * @type {boolean}
	 */
	secure;

	/**
	 * Creates new cookie options.
	 * @param {Partial<CookieOptionsParams>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.domain = options.domain ?? "";
		this.expires = options.expires ?? null;
		this.maxAge = options.maxAge ?? -1;
		this.path = options.path ?? "";
		this.sameSite = options.sameSite ?? "";
		this.secure = options.secure ?? false;
	}

	/**
	 * Returns a string representation of this object.
	 * @returns {string} The string representation of this object.
	 */
	toString() {
		const value = [];
		if (this.domain) value.push(`domain=${this.domain}`);
		if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
		if (this.maxAge >= 0) value.push(`max-age=${this.maxAge}`);
		if (this.path) value.push(`path=${this.path}`);
		if (this.sameSite) value.push(`samesite=${this.sameSite}`);
		if (this.secure) value.push("secure");
		return value.join("; ");
	}
}

/**
 * Defines the parameters of a {@link CookieOptions} instance.
 * @typedef {object} CookieOptionsParams
 * @property {string} domain The domain for which the cookie is valid.
 * @property {Date|null} expires The expiration date and time for the cookie.
 * @property {number} maxAge The maximum duration, in seconds, until the cookie expires.
 * @property {string} path The path to which the cookie applies.
 * @property {import("./same_site.js").SameSite} sameSite The cross-site requests policy.
 * @property {boolean} secure Value indicating whether to transmit the cookie over HTTPS only.
 */
