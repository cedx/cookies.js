import {CookieEvent} from "./CookieEvent.js";
import {CookieOptions, type CookieOptionsParams} from "./CookieOptions.js";

/**
 * Provides access to the [HTTP Cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).
 */
export class CookieStore extends EventTarget implements Iterable<[string, string], void, void> {

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
	constructor(options: CookieStoreOptions = {}) {
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
	get keys(): Set<string> {
		const keys = CookieStore.all.keys();
		return new Set(this.#keyPrefix ? keys.filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length)) : keys);
	}

	/**
	 * The number of entries in this cookie store.
	 */
	get length(): number {
		return this.keys.size;
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this cookie store.
	 * @returns An iterator for the entries of this cookie store.
	 */
	*[Symbol.iterator](): Iterator<[string, string], void, void> {
		for (const key of this.keys) yield [key, this.get(key)!];
	}

	/**
	 * Removes all entries from this cookie store.
	 * @param options The cookie options.
	 */
	clear(options: CookieOptionsParams = {}): void {
		for (const key of this.keys) this.delete(key, options);
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param key The cookie name.
	 * @param options The cookie options.
	 * @returns The value associated with the key before it was removed.
	 */
	delete(key: string, options: CookieOptionsParams = {}): string|null {
		const oldValue = this.get(key);

		const cookieOptions = this.#getOptions(options);
		cookieOptions.expires = new Date(0);
		cookieOptions.maxAge = 0;
		document.cookie = `${this.#buildKey(key)}=; ${cookieOptions}`;

		this.dispatchEvent(new CookieEvent(key, oldValue));
		return oldValue;
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
	getObject<T>(key: string): T|null { // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
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
	 */
	onChange(listener: (event: CookieEvent) => void): this {
		this.addEventListener(CookieEvent.type, listener as EventListener);
		return this;
	}

	/**
	 * Associates a given value with the specified key.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @returns This instance.
	 * @throws `Error` if the cookie name is invalid.
	 */
	set(key: string, value: string, options: CookieOptionsParams = {}): this {
		if (!key || key.includes("=") || key.includes(";")) throw new Error("Invalid cookie name.");

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
	setObject(key: string, value: unknown, options: CookieOptionsParams = {}): this {
		return this.set(key, JSON.stringify(value), options);
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Array<[string, string]> {
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
	 * @param options Some cookie options.
	 * @returns The merged cookie options.
	 */
	#getOptions(options: CookieOptionsParams = {}): CookieOptions {
		return new CookieOptions({
			domain: options.domain ?? this.defaults.domain,
			expires: options.expires ?? this.defaults.expires,
			maxAge: options.maxAge ?? this.defaults.maxAge,
			path: options.path ?? this.defaults.path,
			sameSite: options.sameSite ?? this.defaults.sameSite,
			secure: options.secure ?? this.defaults.secure
		});
	}
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
