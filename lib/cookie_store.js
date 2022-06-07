import {CookieEvent} from "./cookie_event.js";
import {CookieOptions} from "./cookie_options.js";

/**
 * Provides access to the [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).
 */
export class CookieStore extends EventTarget {

	/**
	 * The default cookie options.
	 * @readonly
	 * @type {CookieOptions}
	 */
	defaults;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole cookie store.
	 * @type {string}
	 */
	#keyPrefix;

	/**
	 * Creates a new cookie store.
	 * @param {Partial<CookieStoreOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super();
		const {defaults = {}, keyPrefix = ""} = options;
		this.defaults = new CookieOptions(defaults);
		this.#keyPrefix = keyPrefix;
	}

	/**
	 * The map of all cookies.
	 * @type {Map<string, string>}
	 */
	static get all() {
		const map = new Map;
		if (document.cookie) for (const item of document.cookie.split(";")) {
			const parts = item.trimStart().split("=");
			if (parts.length >= 2) map.set(parts[0], decodeURIComponent(parts.slice(1).join("=")));
		}

		return map;
	}

	/**
	 * The keys of this cookie store.
	 * @type {string[]}
	 */
	get keys() {
		return [...CookieStore.all.keys()].filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length));
	}

	/**
	 * The number of entries in this cookie store.
	 * @type {number}
	 */
	get length() {
		return this.keys.length;
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this cookie store.
	 * @returns {IterableIterator<[string, string]>} An iterator for the entries of this cookie store.
	 */
	*[Symbol.iterator]() {
		for (const key of this.keys) yield [key, /** @type {string} */ (this.get(key))];
	}

	/**
	 * Removes all entries from this cookie store.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 */
	clear(options = {}) {
		this.keys.forEach(key => this.remove(key, options));
	}

	/**
	 * Gets the value associated to the specified key.
	 * @param {string} key The cookie name.
	 * @returns {string|null} The cookie value, or `null` if the key does not exist.
	 */
	get(key) {
		return CookieStore.all.get(this.#buildKey(key)) ?? null;
	}

	/**
	 * Gets a value indicating whether this cookie store contains the specified key.
	 * @param {string} key The cookie name.
	 * @returns {boolean} `true` of this cookie store contains the specified key, otherwise `false`.
	 */
	has(key) {
		return CookieStore.all.has(this.#buildKey(key));
	}

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @template T
	 * @param {string} key The cookie name.
	 * @returns {T|null} The cookie value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject(key) {
		try { return JSON.parse(CookieStore.all.get(this.#buildKey(key)) ?? ""); }
		catch { return null; }
	}

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param {(event: CookieEvent) => void} callback The event handler to register.
	 */
	onChange(callback) {
		this.addEventListener("change", /** @type {EventListener} */ (callback), {passive: true});
	}

	/**
	 * Looks up the value of the specified key, or add a new value if it isn't there.
	 * @param {string} key The cookie name.
	 * @param {() => string} ifAbsent A function producing the new cookie value.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 * @returns {string} The value associated with the key.
	 */
	putIfAbsent(key, ifAbsent, options = {}) {
		if (!this.has(key)) this.set(key, ifAbsent(), options);
		return /** @type {string} */ (this.get(key));
	}

	/**
	 * Looks up the deserialized value of the specified key, or add a new serialized value if it isn't there.
	 * @template T
	 * @param {string} key The cookie name.
	 * @param {() => T} ifAbsent A function producing the new cookie value.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 * @returns {T} The deserialized value associated with the key.
	 */
	putObjectIfAbsent(key, ifAbsent, options = {}) {
		if (!this.has(key)) this.setObject(key, ifAbsent(), options);
		return /** @type {T} */ (this.getObject(key));
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param {string} key The cookie name.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 * @returns {string|null} The value associated with the key before it was removed.
	 */
	remove(key, options = {}) {
		const oldValue = this.get(key);
		this.#removeItem(this.#buildKey(key), options);
		this.dispatchEvent(new CookieEvent(key, oldValue));
		return oldValue;
	}

	/**
	 * Associates a given value with the specified key.
	 * @param {string} key The cookie name.
	 * @param {string} value The cookie value.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} [options] The cookie options.
	 * @returns {this} This instance.
	 * @throws {Error} The cookie name is invalid.
	 */
	set(key, value, options = {}) {
		if (key.length == 0 || key.includes("=") || key.includes(";")) throw new Error("Invalid cookie name.");

		let cookie = `${this.#buildKey(key)}=${encodeURIComponent(value)}`;
		const cookieOptions = this.#getOptions(options).toString();
		if (cookieOptions.length > 0) cookie += `; ${cookieOptions}`;

		const oldValue = this.get(key);
		document.cookie = cookie;
		this.dispatchEvent(new CookieEvent(key, oldValue, value));
		return this;
	}

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @template T
	 * @param {string} key The cookie name.
	 * @param {T} value The cookie value.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} [options] The cookie options.
	 * @returns {this} This instance.
	 */
	setObject(key, value, options = {}) {
		return this.set(key, JSON.stringify(value), options);
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns {Array<[string, string]>} The JSON representation of this object.
	 */
	toJSON() {
		return [...this];
	}

	/**
	 * Returns a string representation of this object.
	 * @returns {string} The string representation of this object.
	 */
	toString() {
		return this.#keyPrefix ? [...this].map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("; ") : document.cookie;
	}

	/**
	 * Builds a normalized cookie key from the given key.
	 * @param {string} key The original key.
	 * @returns {string} The normalized cookie key.
	 */
	#buildKey(key) {
		return `${this.#keyPrefix}${key}`;
	}

	/**
	 * Merges the default cookie options with the specified ones.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} [options] The cookie options.
	 */
	#getOptions(options = {}) {
		const {domain, expires, maxAge, path, sameSite, secure} = options;
		return new CookieOptions({
			domain: domain ?? this.defaults.domain,
			expires: expires ?? this.defaults.expires,
			maxAge: maxAge ?? this.defaults.maxAge,
			path: path ?? this.defaults.path,
			sameSite: sameSite ?? this.defaults.sameSite,
			secure: secure ?? this.defaults.secure
		});
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param {string} key The key to remove.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} [options] The cookie options.
	 */
	#removeItem(key, options = {}) {
		const cookieOptions = this.#getOptions(options);
		cookieOptions.expires = new Date(0);
		cookieOptions.maxAge = 0;
		document.cookie = `${key}=; ${cookieOptions}`;
	}
}

/**
 * Defines the options of a {@link CookieStore} instance.
 * @typedef {object} CookieStoreOptions
 * @property {Partial<import("./cookie_options.js").CookieOptionsParams>} defaults The default cookie options.
 * @property {string} keyPrefix A string prefixed to every key so that it is unique globally in the whole cookie store.
 */
