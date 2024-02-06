import {CookieEvent} from "./cookie_event.js";
import {CookieOptions, type CookieOptionsParams} from "./cookie_options.js";

/**
 * Provides access to the [HTTP Cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).
 */
export class CookieStore extends EventTarget {

	/**
	 * The default cookie options.
	 */
	readonly defaults: CookieOptions;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole cookie store.
	 */
	readonly #keyPrefix: string;

	/**
	 * Creates a new cookie store.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: Partial<CookieStoreOptions> = {}) {
		super();
		this.defaults = new CookieOptions(options.defaults ?? {});
		this.#keyPrefix = options.keyPrefix ?? "";
	}

	/**
	 * The map of all cookies.
	 */
	static get all(): Map<string, string> {
		const map = new Map;
		if (document.cookie) for (const item of document.cookie.split(";")) {
			const parts = item.trimStart().split("=");
			if (parts.length >= 2) map.set(parts[0], decodeURIComponent(parts.slice(1).join("=")));
		}

		return map;
	}

	/**
	 * The keys of this cookie store.
	 */
	get keys(): string[] {
		const keys = Array.from(CookieStore.all.keys());
		return keys.filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length));
	}

	/**
	 * The number of entries in this cookie store.
	 */
	get length(): number {
		return this.keys.length;
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this cookie store.
	 * @returns An iterator for the entries of this cookie store.
	 */
	*[Symbol.iterator](): IterableIterator<[string, string]> {
		for (const key of this.keys) yield [key, this.get(key)!];
	}

	/**
	 * Removes all entries from this cookie store.
	 * @param options The cookie options.
	 */
	clear(options: Partial<CookieOptionsParams> = {}): void {
		for (const key of this.keys) this.remove(key, options);
	}

	/**
	 * Gets the value associated to the specified key.
	 * @param key The cookie name.
	 * @returns The cookie value, or `null` if the key does not exist.
	 */
	get(key: string): string|null {
		return CookieStore.all.get(this.#buildKey(key)) ?? null;
	}

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @param key The cookie name.
	 * @returns The cookie value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject<T>(key: string): T|null {
		try { return JSON.parse(this.get(key) ?? "") as T; }
		catch { return null; }
	}

	/**
	 * Gets a value indicating whether this cookie store contains the specified key.
	 * @param key The cookie name.
	 * @returns `true` if this cookie store contains the specified key, otherwise `false`.
	 */
	has(key: string): boolean {
		return CookieStore.all.has(this.#buildKey(key));
	}

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param listener The event handler to register.
	 * @returns This instance.
	 * @event
	 */
	onChange(listener: (event: CookieEvent) => void): this {
		this.addEventListener(CookieEvent.type, listener as EventListener, {passive: true});
		return this;
	}

	/**
	 * Looks up the value of the specified key, or add a new value if it isn't there.
	 * @param key The cookie name.
	 * @param ifAbsent A function producing the new cookie value.
	 * @param options The cookie options.
	 * @returns The value associated with the key.
	 */
	putIfAbsent(key: string, ifAbsent: () => string, options: Partial<CookieOptionsParams> = {}): string {
		if (!this.has(key)) this.set(key, ifAbsent(), options);
		return this.get(key)!;
	}

	/**
	 * Looks up the deserialized value of the specified key, or add a new serialized value if it isn't there.
	 * @param key The cookie name.
	 * @param ifAbsent A function producing the new cookie value.
	 * @param options The cookie options.
	 * @returns The deserialized value associated with the key.
	 */
	putObjectIfAbsent<T>(key: string, ifAbsent: () => T, options: Partial<CookieOptionsParams> = {}): T {
		if (!this.has(key)) this.setObject(key, ifAbsent(), options);
		return this.getObject(key)!;
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param key The cookie name.
	 * @param options The cookie options.
	 * @returns The value associated with the key before it was removed.
	 */
	remove(key: string, options: Partial<CookieOptionsParams> = {}): string|null {
		const oldValue = this.get(key);
		this.#removeItem(this.#buildKey(key), options);
		this.dispatchEvent(new CookieEvent(key, oldValue));
		return oldValue;
	}

	/**
	 * Associates a given value with the specified key.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @returns This instance.
	 * @throws `Error` if the cookie name is invalid.
	 */
	set(key: string, value: string, options: Partial<CookieOptionsParams> = {}): this {
		if (!key || key.includes("=") || key.includes(";")) throw Error("Invalid cookie name.");

		let cookie = `${this.#buildKey(key)}=${encodeURIComponent(value)}`;
		const cookieOptions = this.#getOptions(options).toString();
		if (cookieOptions) cookie += `; ${cookieOptions}`;

		const oldValue = this.get(key);
		document.cookie = cookie;
		this.dispatchEvent(new CookieEvent(key, oldValue, value));
		return this;
	}

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @returns This instance.
	 */
	setObject<T>(key: string, value: T, options: Partial<CookieOptionsParams> = {}): this {
		return this.set(key, JSON.stringify(value), options);
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): [string, string][] {
		return Array.from(this);
	}

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	override toString(): string {
		return this.#keyPrefix ? Array.from(this).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("; ") : document.cookie;
	}

	/**
	 * Builds a normalized cookie key from the given key.
	 * @param key The original key.
	 * @returns The normalized cookie key.
	 */
	#buildKey(key: string): string {
		return `${this.#keyPrefix}${key}`;
	}

	/**
	 * Merges the default cookie options with the specified ones.
	 * @param options The cookie options.
	 */
	#getOptions(options: Partial<CookieOptionsParams> = {}): CookieOptions {
		return new CookieOptions({
			domain: options.domain ?? this.defaults.domain,
			expires: options.expires ?? this.defaults.expires,
			maxAge: options.maxAge ?? this.defaults.maxAge,
			path: options.path ?? this.defaults.path,
			sameSite: options.sameSite ?? this.defaults.sameSite,
			secure: options.secure ?? this.defaults.secure
		});
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param key The key to remove.
	 * @param options The cookie options.
	 */
	#removeItem(key: string, options: Partial<CookieOptionsParams> = {}): void {
		const cookieOptions = this.#getOptions(options);
		cookieOptions.expires = new Date(0);
		cookieOptions.maxAge = 0;
		document.cookie = `${key}=; ${cookieOptions}`;
	}
}

/**
 * Defines the options of a {@link CookieStore} instance.
 */
export interface CookieStoreOptions {

	/**
	 * The default cookie options.
	 */
	defaults: Partial<CookieOptionsParams>;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole cookie store.
	 */
	keyPrefix: string;
}
