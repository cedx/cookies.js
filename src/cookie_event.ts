/**
 * An event dispatched when the cookie store has been changed.
 */
export class CookieEvent extends Event {

	/**
	 * The event type.
	 */
	static readonly type = "cookie:change";

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
	 * @param key The changed key.
	 * @param oldValue The original value.
	 * @param newValue The new value.
	 */
	constructor(key: string, oldValue: string|null = null, newValue: string|null = null) {
		super(CookieEvent.type);
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
