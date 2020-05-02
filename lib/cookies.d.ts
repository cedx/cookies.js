import { CookieOptions } from './cookie_options.js';
import { JsonObject } from './json.js';
/** Provides access to the [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). */
export declare class Cookies extends EventTarget implements Iterable<[string, string | undefined]> {
    #private;
    readonly defaults: CookieOptions;
    /**
     * An event that is triggered when a cookie is changed (added, modified, or removed).
     * @event changes
     */
    static readonly eventChanges: string;
    /**
     * Creates a new cookie service.
     * @param defaults The default cookie options.
     * @param document The underlying HTML document.
     */
    constructor(defaults?: CookieOptions, document?: Document);
    /** The keys of the cookies associated with the current document. */
    get keys(): string[];
    /** The number of cookies associated with the current document. */
    get length(): number;
    /**
     * Returns a new iterator that allows iterating the cookies associated with the current document.
     * @return An iterator for the cookies of the current document.
     */
    [Symbol.iterator](): IterableIterator<[string, string | undefined]>;
    /** Removes all cookies associated with the current document. */
    clear(): void;
    /**
     * Gets the value associated to the specified key.
     * @param key The cookie name.
     * @param defaultValue The value to return if the cookie does not exist.
     * @return The cookie value, or the default value if the cookie is not found.
     */
    get(key: string, defaultValue?: string): string | undefined;
    /**
     * Gets the deserialized value associated to the specified key.
     * @param key The cookie name.
     * @param defaultValue The value to return if the cookie does not exist.
     * @return The deserialized cookie value, or the default value if the cookie is not found.
     */
    getObject(key: string, defaultValue?: any): any;
    /**
     * Gets a value indicating whether the current document has a cookie with the specified key.
     * @param key The cookie name.
     * @return `true` if the current document has a cookie with the specified key, otherwise `false`.
     */
    has(key: string): boolean;
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
    putIfAbsent(key: string, ifAbsent: () => string, options?: CookieOptions): string;
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
    putObjectIfAbsent(key: string, ifAbsent: () => any, options?: CookieOptions): any;
    /**
     * Removes the cookie with the specified key and its associated value.
     * @param key The cookie name.
     * @param options The cookie options.
     * @return The value associated with the specified key before it was removed.
     */
    remove(key: string, options?: CookieOptions): string | undefined;
    /**
     * Associates a given value to the specified key.
     * @param key The cookie name.
     * @param value The cookie value.
     * @param options The cookie options.
     * @return This instance.
     * @throws `TypeError` The specified key is invalid.
     */
    set(key: string, value: string, options?: CookieOptions): this;
    /**
     * Serializes and associates a given value to the specified key.
     * @param key The cookie name.
     * @param value The cookie value.
     * @param options The cookie options.
     * @return This instance.
     */
    setObject(key: string, value: any, options?: CookieOptions): this;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
    /**
     * Returns a string representation of this object.
     * @return The string representation of this object.
     */
    toString(): string;
    /**
     * Merges the default cookie options with the specified ones.
     * @param options The options to merge with the defaults.
     * @return The resulting cookie options.
     */
    private _getOptions;
    /**
     * Removes the value associated to the specified key.
     * @param key The cookie name.
     * @param options The cookie options.
     */
    private _removeItem;
}
