/**
 * An event triggered when the cookie store has been changed.
 */
export class CookieEvent extends Event {

	/**
	 * The changed key.
	 * @readonly
	 * @type {string}
	 */
	key;

	/**
	 * The new value.
	 * @readonly
	 * @type {string|null}
	 */
	newValue;

	/**
	 * The original value.
	 * @readonly
	 * @type {string|null}
	 */
	oldValue;

	/**
	 * Creates a new cookie event.
	 * @param {string} key The changed key.
	 * @param {string|null} oldValue The original value.
	 * @param {string|null} newValue The new value.
	 */
	constructor(key, oldValue = null, newValue = null) {
		super("change");
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
