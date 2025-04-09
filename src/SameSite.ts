/**
 * Defines the values of the `SameSite` cookie attribute.
 */
export const SameSite = Object.freeze({

	/**
	 * Only send cookies for top level navigation requests.
	 */
	Lax: "lax",

	/**
	 * No restrictions on cross-site requests.
	 */
	None: "none",

	/**
	 * Prevents the cookie from being sent to the target site in all cross-site browsing context.
	 */
	Strict: "strict"
});

/**
 * Defines the values of the `SameSite` cookie attribute.
 */
export type SameSite = typeof SameSite[keyof typeof SameSite];
