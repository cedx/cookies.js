import {CookieEvent} from "./CookieEvent.js";

/**
 * Defines the attributes of a HTTP cookie.
 */
export type CookieOptions = Omit<CookieInit, "name"|"value">;

/**
 * Provides access to the [HTTP Cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).
 */
export class CookieStore extends EventTarget implements AsyncIterable<[string, any], void, void> {

	/**
	 * The `change` event type.
	 */
	static readonly changeEvent = "cookies:change";

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
		this.defaults = options.defaults ?? {};
		this.#keyPrefix = options.keyPrefix ?? "";
	}

	/**
	 * The keys of this cookie store.
	 */
	get keys(): Promise<Set<string>> {
		return cookieStore.getAll().then(cookies => {
			const keys = cookies.map(cookie => cookie.name!);
			return new Set(this.#keyPrefix ? keys.filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length)) : keys);
		});
	}

	/**
	 * The number of entries in this cookie store.
	 */
	get length(): Promise<number> {
		return this.keys.then(keys => keys.size);
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this cookie store.
	 * @returns An iterator for the entries of this cookie store.
	 */
	async *[Symbol.asyncIterator](): AsyncIterator<[string, any], void, void> {
		for (const key of await this.keys) yield [key, await this.get(key)];
	}

	/**
	 * Removes all entries from this cookie store.
	 * @param options The cookie options.
	 */
	async clear(options: CookieOptions = {}): Promise<void> {
		for (const key of await this.keys) await this.delete(key, options);
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param key The cookie name.
	 * @param options The cookie options.
	 * @returns The value associated with the key before it was removed.
	 */
	async delete<T>(key: string, options: CookieOptions = {}): Promise<T|null> {
		const oldValue = await this.get<T>(key);
		await cookieStore.delete({...this.#getOptions(options), name: this.#buildKey(key)});
		this.dispatchEvent(new CookieEvent(CookieStore.changeEvent, key, oldValue));
		return oldValue;
	}

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @param key The cookie name.
	 * @returns The cookie value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	async get<T>(key: string): Promise<T|null> {
		try { return JSON.parse((await cookieStore.get(this.#buildKey(key)))?.value ?? "") as T; }
		catch { return null; }
	}

	/**
	 * Gets a value indicating whether this cookie store contains the specified key.
	 * @param key The cookie name.
	 * @returns `true` if this cookie store contains the specified key, otherwise `false`.
	 */
	async has(key: string): Promise<boolean> {
		return await cookieStore.get(this.#buildKey(key)) != null;
	}

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param listener The event handler to register.
	 * @returns This instance.
	 */
	onChange(listener: (event: CookieEvent) => void): this {
		this.addEventListener(CookieStore.changeEvent, listener as EventListener);
		return this;
	}

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @param key The cookie name.
	 * @param value The cookie value.
	 * @param options The cookie options.
	 * @returns This instance.
	 */
	async set(key: string, value: unknown, options: CookieOptions = {}): Promise<this> {
		const oldValue = await this.get(key);
		await cookieStore.set({...this.#getOptions(options), name: this.#buildKey(key), value: JSON.stringify(value)});
		this.dispatchEvent(new CookieEvent(CookieStore.changeEvent, key, oldValue, value));
		return this;
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
	#getOptions(options: CookieOptions = {}): CookieOptions {
		return {
			domain: options.domain ?? this.defaults.domain,
			expires: options.expires ?? this.defaults.expires,
			partitioned: options.partitioned ?? this.defaults.partitioned,
			path: options.path ?? this.defaults.path,
			sameSite: options.sameSite ?? this.defaults.sameSite
		};
	}
}

/**
 * Defines the options of a {@link CookieStore} instance.
 */
export type CookieStoreOptions = Partial<{

	/**
	 * The default cookie options.
	 */
	defaults: Partial<CookieOptions>;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole cookie store.
	 */
	keyPrefix: string;
}>;
