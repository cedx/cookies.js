/**
 * An event dispatched when the cookie store has been changed.
 */
export class CookieEvent extends Event {

	/**
	 * The changed key.
	 */
	readonly key: string;

	/**
	 * The new value.
	 */
	readonly newValue: string|null;

	/**
	 * The original value.
	 */
	readonly oldValue: string|null;

	/**
	 * Creates a new cookie event.
	 * @param type The event type.
	 * @param key The changed key.
	 * @param oldValue The original value.
	 * @param newValue The new value.
	 */
	constructor(type: string, key: string, oldValue: string|null = null, newValue: string|null = null) {
		super(type);
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
