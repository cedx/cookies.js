/**
 * An event dispatched when the cookie store has been changed.
 */
export class CookieEvent extends Event {

	/**
	 * The event type.
	 */
	static readonly type: string;

	/**
	 * The changed key.
	 */
	key: string;

	/**
	 * The new value.
	 */
	newValue: string|null;

	/**
	 * The original value.
	 */
	oldValue: string|null;

	/**
	 * Creates a new cookie event.
	 * @param key The changed key.
	 * @param oldValue The original value.
	 * @param newValue The new value.
	 */
	constructor(key: string, oldValue?: string|null, newValue?: string|null);
}
