/**
 * Defines the values of the `SameSite` cookie attribute.
 * @enum {string}
 */
export const SameSite = Object.freeze({

	/** Only send cookies for top level navigation requests. */
	lax: "Lax",

	/** No restrictions on cross-site requests. */
	none: "None",

	/** Prevents the cookie from being sent to the target site in all cross-site browsing context. */
	strict: "Strict"
});
