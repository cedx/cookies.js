import {CookieEvent} from "./cookie_event.js";
import {CookieOptions} from "./cookie_options.js";

/**
 * Provides access to the [HTTP Cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).
 */
export class CookieStore extends EventTarget {

	/**
	 * The default cookie options.
	 * @type {CookieOptions}
	 * @readonly
	 */
	defaults;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole cookie store.
	 * @type {string}
	 * @readonly
	 */
	#keyPrefix;

	/**
	 * Creates a new cookie store.
	 * @param {Partial<CookieStoreOptions>} options An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super();
		this.defaults = new CookieOptions(options.defaults ?? {});
		this.#keyPrefix = options.keyPrefix ?? "";
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
		const keys = Array.from(CookieStore.all.keys());
		return keys.filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length));
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
		for (const key of this.keys) this.delete(key, options);
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param {string} key The cookie name.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 * @returns {string|null} The value associated with the key before it was removed.
	 */
	delete(key, options = {}) {
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
	 * @param {string} key The cookie name.
	 * @returns {string|null} The cookie value, or `null` if the key does not exist.
	 */
	get(key) {
		return CookieStore.all.get(this.#buildKey(key)) ?? null;
	}

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @template T
	 * @param {string} key The cookie name.
	 * @returns {T|null} The cookie value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject(key) {
		try { return JSON.parse(this.get(key) ?? ""); }
		catch { return null; }
	}

	/**
	 * Gets a value indicating whether this cookie store contains the specified key.
	 * @param {string} key The cookie name.
	 * @returns {boolean} `true` if this cookie store contains the specified key, otherwise `false`.
	 */
	has(key) {
		return CookieStore.all.has(this.#buildKey(key));
	}

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param {(event: CookieEvent) => void} listener The event handler to register.
	 * @returns {this} This instance.
	 * @event
	 */
	onChange(listener) {
		this.addEventListener(CookieEvent.type, /** @type {EventListener} */ (listener), {passive: true});
		return this;
	}

	/**
	 * Associates a given value with the specified key.
	 * @param {string} key The cookie name.
	 * @param {string} value The cookie value.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 * @returns {this} This instance.
	 * @throws `Error` if the cookie name is invalid.
	 */
	set(key, value, options = {}) {
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
	 * @template T
	 * @param {string} key The cookie name.
	 * @param {T} value The cookie value.
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options The cookie options.
	 * @returns {this} This instance.
	 */
	setObject(key, value, options = {}) {
		return this.set(key, JSON.stringify(value), options);
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns {[string, string][]} The JSON representation of this object.
	 */
	toJSON() {
		return Array.from(this);
	}

	/**
	 * Returns a string representation of this object.
	 * @returns {string} The string representation of this object.
	 * @override
	 */
	toString() {
		return this.#keyPrefix ? Array.from(this).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("; ") : document.cookie;
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
	 * @param {Partial<import("./cookie_options.js").CookieOptionsParams>} options Some cookie options.
	 * @returns {CookieOptions} The merged cookie options.
	 */
	#getOptions(options = {}) {
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
 * @typedef {object} CookieStoreOptions
 * @property {Partial<import("./cookie_options.js").CookieOptionsParams>} defaults The default cookie options.
 * @property {string} keyPrefix A string prefixed to every key so that it is unique globally in the whole cookie store.
 */
