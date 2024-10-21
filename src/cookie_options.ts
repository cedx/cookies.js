import type {SameSite} from "./same_site.js";

/**
 * Defines the attributes of a HTTP cookie.
 */
export class CookieOptions {

	/**
	 * The domain for which the cookie is valid.
	 */
	domain: string;

	/**
	 * The expiration date and time for the cookie.
	 */
	expires: Date|null;

	/**
	 * The maximum duration, in seconds, until the cookie expires.
	 */
	maxAge: number;

	/**
	 * The path to which the cookie applies.
	 */
	path: string;

	/**
	 * The cross-site requests policy.
	 */
	sameSite: SameSite|null;

	/**
	 * Value indicating whether to transmit the cookie over HTTPS only.
	 */
	secure: boolean;

	/**
	 * Creates new cookie options.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: CookieOptionsParams = {}) {
		this.domain = options.domain ?? "";
		this.expires = options.expires ?? null;
		this.maxAge = options.maxAge ?? -1;
		this.path = options.path ?? "";
		this.sameSite = options.sameSite ?? null;
		this.secure = options.secure ?? false;
	}

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	toString(): string {
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
 */
export type CookieOptionsParams = Partial<{

	/**
	 * The domain for which the cookie is valid.
	 */
	domain: string,

	/**
	 * The expiration date and time for the cookie.
	 */
	expires: Date|null,

	/**
	 * The maximum duration, in seconds, until the cookie expires.
	 */
	maxAge: number,

	/**
	 * The path to which the cookie applies.
	 */
	path: string,

	/**
	 * The cross-site requests policy.
	 */
	sameSite: SameSite|null,

	/**
	 * Value indicating whether to transmit the cookie over HTTPS only.
	 */
	secure: boolean
}>;
