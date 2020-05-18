var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
import { CookieOptions } from "./cookie_options.js";
import { SimpleChange } from "./simple_change.js";
/** Provides access to the [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). */
let Cookies = /** @class */ (() => {
    var _document;
    class Cookies extends EventTarget {
        /**
         * Creates a new cookie service.
         * @param defaults The default cookie options.
         * @param document The underlying HTML document.
         */
        constructor(defaults = new CookieOptions, document = window.document) {
            super();
            this.defaults = defaults;
            /** The underlying HTML document. */
            _document.set(this, void 0);
            __classPrivateFieldSet(this, _document, document);
        }
        /** The keys of the cookies associated with the current document. */
        get keys() {
            const keys = __classPrivateFieldGet(this, _document).cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, "");
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
        *[(_document = new WeakMap(), Symbol.iterator)]() {
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
                const token = encodeURIComponent(key).replace(/[-.+*]/g, String.raw `\$&`);
                const scanner = new RegExp(String.raw `(?:(?:^|.*;)\s*${token}\s*=\s*([^;]*).*$)|^.*$`);
                return decodeURIComponent(__classPrivateFieldGet(this, _document).cookie.replace(scanner, "$1"));
            }
            catch {
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
            catch {
                return defaultValue;
            }
        }
        /**
         * Gets a value indicating whether the current document has a cookie with the specified key.
         * @param key The cookie name.
         * @return `true` if the current document has a cookie with the specified key, otherwise `false`.
         */
        has(key) {
            const token = encodeURIComponent(key).replace(/[-.+*]/g, String.raw `\$&`);
            return new RegExp(String.raw `(?:^|;\s*)${token}\s*=`).test(__classPrivateFieldGet(this, _document).cookie);
        }
        /**
         * Looks up the cookie with the specified key, or add a new cookie if it isn't there.
         *
         * Returns the value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
         * associates `key` to that value, and then returns the new value.
         *
         * @param key The key to seek for.
         * @param ifAbsent The function called to get a new value.
         * @param options The cookie options.
         * @return The value associated with the specified key.
         */
        putIfAbsent(key, ifAbsent, options) {
            if (!this.has(key))
                this.set(key, ifAbsent(), options);
            return this.get(key);
        }
        /**
         * Looks up the cookie with the specified key, or add a new cookie if it isn't there.
         *
         * Returns the deserialized value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
         * serializes and associates `key` to that value, and then returns the new value.
         *
         * @param key The key to seek for.
         * @param ifAbsent The function called to get a new value.
         * @param options The cookie options.
         * @return The deserialized value associated with the specified key.
         */
        putObjectIfAbsent(key, ifAbsent, options) {
            if (!this.has(key))
                this.setObject(key, ifAbsent(), options);
            return this.getObject(key);
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
         * @throws `TypeError` The specified key is invalid.
         */
        set(key, value, options) {
            if (!key.length)
                throw new TypeError("Invalid cookie name.");
            const cookieOptions = this._getOptions(options).toString();
            let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            if (cookieOptions.length)
                cookieValue += `; ${cookieOptions}`;
            const previousValue = this.get(key);
            __classPrivateFieldGet(this, _document).cookie = cookieValue;
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
                map[key] = value !== null && value !== void 0 ? value : null;
            return map;
        }
        /**
         * Returns a string representation of this object.
         * @return The string representation of this object.
         */
        toString() {
            return __classPrivateFieldGet(this, _document).cookie;
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
                expires: (_a = options.expires) !== null && _a !== void 0 ? _a : this.defaults.expires,
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
            __classPrivateFieldGet(this, _document).cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
        }
    }
    /**
     * An event that is triggered when a cookie is changed (added, modified, or removed).
     * @event changes
     */
    Cookies.eventChanges = "changes";
    return Cookies;
})();
export { Cookies };
