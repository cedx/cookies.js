import {SameSite} from "./same_site.js";

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
	constructor(options?: CookieOptionsParams);

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	toString(): string;
}

/**
 * Defines the parameters of a {@link CookieOptions} instance.
 */
export type CookieOptionsParams = Partial<{

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
}>;
