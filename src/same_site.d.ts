/**
 * Defines the values of the `SameSite` cookie attribute.
 */
export const SameSite: Readonly<{

	/**
	 * Only send cookies for top level navigation requests.
	 */
	lax: "lax",

	/**
	 * No restrictions on cross-site requests.
	 */
	none: "none",

	/**
	 * Prevents the cookie from being sent to the target site in all cross-site browsing context.
	 */
	strict: "strict"
}>;

/**
 * Defines the values of the `SameSite` cookie attribute.
 */
export type SameSite = typeof SameSite[keyof typeof SameSite];
