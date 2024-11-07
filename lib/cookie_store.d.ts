import {CookieEvent} from "./cookie_event.js";
import {CookieOptions, CookieOptionsParams} from "./cookie_options.js";

/**
 * Provides access to the [HTTP Cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).
 */
export class CookieStore extends EventTarget {

	/**
	 * The map of all cookies.
	 */
	static readonly all: Map<string, string>;

	/**
	 * The default cookie options.
	 */
	defaults: CookieOptions;

	/**
	 * The keys of this cookie store.
	 */
	readonly keys: Set<string>;

	/**
	 * The number of entries in this cookie store.
	 */
	readonly length: number;

	/**
	 * Creates a new cookie store.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options?: CookieStoreOptions);

	/**
	 * Returns a new iterator that allows iterating the entries of this cookie store.
	 * @returns An iterator for the entries of this cookie store.
	 */
	[Symbol.iterator](): IterableIterator<[string, string]>;

	/**
	 * Removes all entries from this cookie store.
	 * @param options The cookie options.
	 */
	clear(options?: CookieOptionsParams): void;

	/**
	 * Removes the value associated with the specified key.
	 * @param key The cookie name.
	 * @param options The cookie options.
	 * @returns The value associated with the key before it was removed.
	 */
	delete(key: string, options?: CookieOptionsParams): string|null;

	/**
	 * Gets the value associated to the specified key.
	 * @param key The cookie name.
	 * @returns The cookie value, or `null` if the key does not exist.
	 */
	get(key: string): string|null;

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @param key The cookie name.
	 * @returns The cookie value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject<T>(key: string): T|null;

	/**
	 * Gets a value indicating whether this cookie store contains the specified key.
	 * @param key The cookie name.
	 * @returns `true` if this cookie store contains the specified key, otherwise `false`.
	 */
	has(key: string): boolean;

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param listener The event handler to register.
	 * @returns This instance.
	 */
	onChange(listener: (event: CookieEvent) => void): this;

	/**
	 * Associates a given value with the specified key.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @returns This instance.
	 * @throws `Error` if the cookie name is invalid.
	 */
	set(key: string, value: string, options?: CookieOptionsParams): this;

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @returns This instance.
	 */
	setObject(key: string, value: unknown, options?: CookieOptionsParams): this;

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Array<[string, string]>;

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	toString(): string;
}

/**
 * Defines the options of a {@link CookieStore} instance.
 */
export type CookieStoreOptions = Partial<{

	/**
	 * The default cookie options.
	 */
	defaults: CookieOptionsParams;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole cookie store.
	 */
	keyPrefix: string;
}>;
