import EventEmitter from 'eventemitter3';
import {CookieOptions} from './cookie_options.js';
import {SimpleChange} from './simple_change.js';

/**
 * Provides access to the HTTP cookies.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */
export class Cookies extends EventEmitter {

  /**
   * Initializes a new instance of the class.
   * @param {CookieOptions|object} defaults The default cookie options.
   * @param {HTMLDocument} document The underlying HTML document.
   */
  constructor(defaults = {}, document = window.document) {
    super();

    /**
     * The default cookie options.
     * @type {CookieOptions}
     */
    this._defaults = defaults instanceof CookieOptions ? defaults : new CookieOptions(defaults);

    /**
     * The underlying HTML document.
     * @type {HTMLDocument}
     */
    this._document = document;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Cookies';
  }

  /**
   * The default cookie options.
   * @type {CookieOptions}
   */
  get defaults() {
    return this._defaults;
  }

  /**
   * The keys of the cookies associated with the current document.
   * @type {string[]}
   */
  get keys() {
    let keys = this._document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '');
    return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(key => decodeURIComponent(key)) : [];
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
   */
  *[Symbol.iterator]() {
    for (let key of this.keys) yield [key, this.get(key)];
  }

  /**
   * Removes all cookies associated with the current document.
   * @emits {Map<string, SimpleChange>} The "changes" event.
   */
  clear() {
    let changes = new Map;
    for (let [key, value] of this) {
      changes.set(key, new SimpleChange({previousValue: value}));
      this._removeItem(key);
    }

    this.emit('changes', changes);
  }

  /**
   * Gets the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {*} defaultValue The default cookie value if it does not exist.
   * @return {string} The cookie value, or the default value if the item is not found.
   */
  get(key, defaultValue = null) {
    if (!this.has(key)) return defaultValue;

    try {
      let token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
      let scanner = new RegExp(`(?:(?:^|.*;)\\s*${token}\\s*\\=\\s*([^;]*).*$)|^.*$`);
      return decodeURIComponent(this._document.cookie.replace(scanner, '$1'));
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {*} defaultValue The default cookie value if it does not exist.
   * @return {*} The deserialized cookie value, or the default value if the item is not found.
   */
  getObject(key, defaultValue = null) {
    try {
      let value = this.get(key);
      return typeof value == 'string' ? JSON.parse(value) : defaultValue;
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets a value indicating whether the current document has a cookie with the specified key.
   * @param {string} key The cookie name.
   * @return {boolean} `true` if the current document has a cookie with the specified key, otherwise `false`.
   */
  has(key) {
    let token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
    return new RegExp(`(?:^|;\\s*)${token}\\s*\\=`).test(this._document.cookie);
  }

  /**
   * Removes the cookie with the specified key and its associated value.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   * @return {string} The value associated with the specified key before it was removed.
   * @emits {Map<string, SimpleChange>} The "changes" event.
   */
  remove(key, options = new CookieOptions) {
    let previousValue = this.get(key);
    this._removeItem(key, options);
    this.emit('changes', new Map([
      [key, new SimpleChange({previousValue}]
    ]);

    return previousValue;
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {string} value The cookie value.
   * @param {CookieOptions} [options] The cookie options.
   * @throws {TypeError} The specified key is invalid.
   * @emits {Map<string, SimpleChange>} The "changes" event.
   */
  set(key, value, options = new CookieOptions) {
    if (!key.length || /^(domain|expires|max-age|path|secure)$/i.test(key)) throw new TypeError('Invalid cookie name.');

    let cookieOptions = this._getOptions(options);
    let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (cookieOptions.toString().length) cookieValue += `; ${cookieOptions}`;

    let previousValue = this.get(key);
    this._document.cookie = cookieValue;
    this.emit('changes', new Map([
      [key, new SimpleChange({currentValue: value, previousValue}]
    ]);
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {*} value The cookie value.
   * @param {CookieOptions} [options] The cookie options.
   * @emits {Map<string, SimpleChange>} The "changes" event.
   */
  setObject(key, value, options = new CookieOptions) {
    this.set(key, JSON.stringify(value), options);
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};
    for (let [key, value] of this) map[key] = value;
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
   * @param {CookieOptions} options The options to merge with the defaults.
   * @return {CookieOptions} The resulting cookie options.
   */
  _getOptions(options = new CookieOptions) {
    return new CookieOptions({
      domain: options.domain.length ? options.domain : defaults.domain,
      expires: options.expires ? options.expires : defaults.expires,
      path: options.path.length ? options.path : defaults.path,
      secure: options.secure ? options.secure : defaults.secure
    });
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   */
  _removeItem(key, options = new CookieOptions) {
    if (!this.has(key)) return;
    let cookieOptions = this._getOptions(options);
    cookieOptions.expires = new Date(0);
    this._document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
  }
}
