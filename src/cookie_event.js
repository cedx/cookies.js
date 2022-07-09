/**
 * An event triggered when the cookie store has been changed.
 */
export class CookieEvent extends Event {

	/**
	 * The event type.
	 * @type {string}
	 * @readonly
	 */
	static type = "change";

	/**
	 * The changed key.
	 * @type {string}
	 * @readonly
	 */
	key;

	/**
	 * The new value.
	 * @type {string|null}
	 * @readonly
	 */
	newValue;

	/**
	 * The original value.
	 * @type {string|null}
	 * @readonly
	 */
	oldValue;

	/**
	 * Creates a new cookie event.
	 * @param {string} key The changed key.
	 * @param {string|null} oldValue The original value.
	 * @param {string|null} newValue The new value.
	 */
	constructor(key, oldValue = null, newValue = null) {
		super(CookieEvent.type);
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
