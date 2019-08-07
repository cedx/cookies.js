import {CookieOptions} from './cookie_options.js';
import {SimpleChange} from './simple_change.js';

/** Provides access to the {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies|HTTP cookies}. */
export class Cookies extends EventTarget {

  /**
   * An event that is triggered when a cookie is changed (added, modified, or removed).
   * @type {string}
   */
  static get eventChanges() {
    return 'changes';
  }

  /**
   * Creates a new cookie service.
   * @param {CookieOptions} [defaults] The default cookie options.
   * @param {Document} [document] The underlying HTML document.
   */
  constructor(defaults = new CookieOptions, document = window.document) {
    super();

    /**
     * The default cookie options.
     * @type {CookieOptions}
     */
    this.defaults = defaults;

    /**
     * The underlying HTML document.
     * @type {Document}
     * @private
     */
    this._document = document;
  }

  /**
   * The keys of the cookies associated with the current document.
   * @type {string[]}
   */
  get keys() {
    const keys = this._document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '');
    return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(decodeURIComponent) : [];
  }

  /**
   * The number of cookies associated with the current document.
   * @type {number}
   */
  get length() {
    return this.keys.length;
  }

  /**
   * Returns a new iterator that allows iterating the cookies associated with the current document.
   * @return {IterableIterator<Array>} An iterator for the cookies of the current document.
   */
  *[Symbol.iterator]() {
    for (const key of this.keys) yield [key, this.get(key)];
  }

  /** Removes all cookies associated with the current document. */
  clear() {
    const changes = new Map;
    for (const [key, value] of this) {
      changes.set(key, new SimpleChange(value));
      this._removeItem(key);
    }

    this.dispatchEvent(new CustomEvent(Cookies.eventChanges, {detail: changes}));
  }

  /**
   * Gets the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {?string} [defaultValue] The default cookie value if it does not exist.
   * @return {?string} The cookie value, or the default value if the item is not found.
   */
  get(key, defaultValue = null) {
    if (!this.has(key)) return defaultValue;

    try {
      const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
      const scanner = new RegExp(`(?:(?:^|.*;)\\s*${token}\\s*=\\s*([^;]*).*$)|^.*$`);
      return decodeURIComponent(this._document.cookie.replace(scanner, '$1'));
    }

    catch {
      return defaultValue;
    }
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {*} [defaultValue] The default cookie value if it does not exist.
   * @return {*} The deserialized cookie value, or the default value if the item is not found.
   */
  getObject(key, defaultValue = null) {
    try {
      const value = this.get(key);
      return typeof value == 'string' ? JSON.parse(value) : defaultValue;
    }

    catch {
      return defaultValue;
    }
  }

  /**
   * Gets a value indicating whether the current document has a cookie with the specified key.
   * @param {string} key The cookie name.
   * @return {boolean} `true` if the current document has a cookie with the specified key, otherwise `false`.
   */
  has(key) {
    const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
    return new RegExp(`(?:^|;\\s*)${token}\\s*=`).test(this._document.cookie);
  }

  /**
   * Removes the cookie with the specified key and its associated value.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   * @return {?string} The value associated with the specified key before it was removed.
   */
  remove(key, options = new CookieOptions) {
    const previousValue = this.get(key);
    this._removeItem(key, options);
    this.dispatchEvent(new CustomEvent(Cookies.eventChanges, {detail: new Map([
      [key, new SimpleChange(previousValue)]
    ])}));

    return previousValue;
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {string} value The cookie value.
   * @param {CookieOptions} [options] The cookie options.
   * @return {this} This instance.
   * @throws {TypeError} The specified key is invalid.
   */
  set(key, value, options = new CookieOptions) {
    if (!key.length || /^(domain|expires|max-age|path|secure)$/i.test(key)) throw new TypeError('Invalid cookie name.');

    const cookieOptions = this._getOptions(options).toString();
    let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (cookieOptions.length) cookieValue += `; ${cookieOptions}`;

    const previousValue = this.get(key);
    this._document.cookie = cookieValue;
    this.dispatchEvent(new CustomEvent(Cookies.eventChanges, {detail: new Map([
      [key, new SimpleChange(previousValue, value)]
    ])}));

    return this;
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {*} value The cookie value.
   * @param {CookieOptions} [options] The cookie options.
   * @return {this} This instance.
   */
  setObject(key, value, options = new CookieOptions) {
    return this.set(key, JSON.stringify(value), options);
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object<string, *>} The map in JSON format corresponding to this object.
   */
  toJSON() {
    const map = {};
    for (const [key, value] of this) map[key] = value;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return this._document.cookie;
  }

  /**
   * Merges the default cookie options with the specified ones.
   * @param {CookieOptions} [options] The options to merge with the defaults.
   * @return {CookieOptions} The resulting cookie options.
   * @private
   */
  _getOptions(options = new CookieOptions) {
    return new CookieOptions({
      domain: typeof options.domain == 'string' && options.domain.length ? options.domain : this.defaults.domain,
      expires: typeof options.expires == 'object' && options.expires ? options.expires : this.defaults.expires,
      path: typeof options.path == 'string' && options.path.length ? options.path : this.defaults.path,
      secure: typeof options.secure == 'boolean' && options.secure ? options.secure : this.defaults.secure
    });
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   * @private
   */
  _removeItem(key, options = new CookieOptions) {
    if (!this.has(key)) return;
    const cookieOptions = this._getOptions(options);
    cookieOptions.expires = new Date(0);
    this._document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
  }
}
