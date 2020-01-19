import { CookieOptions } from './cookie_options.js';
import { SimpleChange } from './simple_change.js';
/** Provides access to the [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). */
export class Cookies extends EventTarget {
    /**
     * Creates a new cookie service.
     * @param defaults The default cookie options.
     * @param _document The underlying HTML document.
     */
    constructor(defaults = new CookieOptions, _document = document) {
        super();
        this.defaults = defaults;
        this._document = _document;
    }
    /** The keys of the cookies associated with the current document. */
    get keys() {
        const keys = this._document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '');
        return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(decodeURIComponent) : [];
    }
    /** The number of cookies associated with the current document. */
    get length() {
        return this.keys.length;
    }
    /**
     * Returns a new iterator that allows iterating the cookies associated with the current document.
     * @return An iterator for the cookies of the current document.
     */
    *[Symbol.iterator]() {
        for (const key of this.keys)
            yield [key, this.get(key)];
    }
    /** Removes all cookies associated with the current document. */
    clear() {
        const changes = new Map();
        for (const [key, value] of this) {
            changes.set(key, new SimpleChange(value));
            this._removeItem(key);
        }
        this.dispatchEvent(new CustomEvent(Cookies.eventChanges, { detail: changes }));
    }
    /**
     * Gets the value associated to the specified key.
     * @param key The cookie name.
     * @param defaultValue The value to return if the cookie does not exist.
     * @return The cookie value, or the default value if the cookie is not found.
     */
    get(key, defaultValue) {
        if (!this.has(key))
            return defaultValue;
        try {
            const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
            const scanner = new RegExp(`(?:(?:^|.*;)\\s*${token}\\s*=\\s*([^;]*).*$)|^.*$`);
            return decodeURIComponent(this._document.cookie.replace(scanner, '$1'));
        }
        catch (err) {
            return defaultValue;
        }
    }
    /**
     * Gets the deserialized value associated to the specified key.
     * @param key The cookie name.
     * @param defaultValue The value to return if the cookie does not exist.
     * @return The deserialized cookie value, or the default value if the cookie is not found.
     */
    getObject(key, defaultValue) {
        try {
            const value = this.get(key);
            return value != undefined ? JSON.parse(value) : defaultValue;
        }
        catch (err) {
            return defaultValue;
        }
    }
    /**
     * Gets a value indicating whether the current document has a cookie with the specified key.
     * @param key The cookie name.
     * @return `true` if the current document has a cookie with the specified key, otherwise `false`.
     */
    has(key) {
        const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
        return new RegExp(`(?:^|;\\s*)${token}\\s*=`).test(this._document.cookie);
    }
    /**
     * Removes the cookie with the specified key and its associated value.
     * @param key The cookie name.
     * @param options The cookie options.
     * @return The value associated with the specified key before it was removed.
     */
    remove(key, options) {
        const previousValue = this.get(key);
        this._removeItem(key, options);
        this.dispatchEvent(new CustomEvent(Cookies.eventChanges, { detail: new Map([
                [key, new SimpleChange(previousValue)]
            ]) }));
        return previousValue;
    }
    /**
     * Associates a given value to the specified key.
     * @param key The cookie name.
     * @param value The cookie value.
     * @param options The cookie options.
     * @return This instance.
     * @throws [[TypeError]] The specified key is invalid.
     */
    set(key, value, options) {
        if (!key.length)
            throw new TypeError('Invalid cookie name.');
        const cookieOptions = this._getOptions(options).toString();
        let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        if (cookieOptions.length)
            cookieValue += `; ${cookieOptions}`;
        const previousValue = this.get(key);
        this._document.cookie = cookieValue;
        this.dispatchEvent(new CustomEvent(Cookies.eventChanges, { detail: new Map([
                [key, new SimpleChange(previousValue, value)]
            ]) }));
        return this;
    }
    /**
     * Serializes and associates a given value to the specified key.
     * @param key The cookie name.
     * @param value The cookie value.
     * @param options The cookie options.
     * @return This instance.
     */
    setObject(key, value, options) {
        return this.set(key, JSON.stringify(value), options);
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        const map = {};
        for (const [key, value] of this)
            map[key] = (value !== null && value !== void 0 ? value : null);
        return map;
    }
    /**
     * Returns a string representation of this object.
     * @return The string representation of this object.
     */
    toString() {
        return this._document.cookie;
    }
    /**
     * Merges the default cookie options with the specified ones.
     * @param options The options to merge with the defaults.
     * @return The resulting cookie options.
     */
    _getOptions(options = new CookieOptions) {
        var _a;
        return new CookieOptions({
            domain: options.domain.length ? options.domain : this.defaults.domain,
            expires: (_a = options.expires, (_a !== null && _a !== void 0 ? _a : this.defaults.expires)),
            path: options.path.length ? options.path : this.defaults.path,
            secure: options.secure ? options.secure : this.defaults.secure
        });
    }
    /**
     * Removes the value associated to the specified key.
     * @param key The cookie name.
     * @param options The cookie options.
     */
    _removeItem(key, options) {
        if (!this.has(key))
            return;
        const cookieOptions = this._getOptions(options);
        cookieOptions.expires = new Date(0);
        this._document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
    }
}
/**
 * An event that is triggered when a cookie is changed (added, modified, or removed).
 * @event changes
 */
Cookies.eventChanges = 'changes';
