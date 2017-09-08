'use strict';

const EventEmitter = require('events');
const {CookieOptions} = require('./cookie_options');

/**
 * Provides access to the HTTP cookies.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */
exports.Cookies = class Cookies extends EventEmitter {

  /**
   * Initializes a new instance of the class.
   * @param {CookieOptions} defaults The default cookie options.
   * @param {HTMLDocument} document The underlying HTML document.
   */
  constructor(defaults = new CookieOptions, document = window.document) {
    super();

    /**
     * The default cookie options.
     * @type {CookieOptions}
     */
    this._defaults = defaults;

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
   * @emits {ChangeEvent[]} The "changes" event.
   */
  clear() {
    let changes = this.keys.map(key => ({currentValue: null, key, previousValue: this.get(key)}));
    for (let key of this.keys) this._removeItem(key);
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
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   * @emits {ChangeEvent[]} The "changes" event.
   */
  remove(key, options = this.defaults) {
    let previousValue = this.get(key);
    this._removeItem(key, options);
    this.emit('changes', [{currentValue: null, key, previousValue}]);
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {string} value The cookie value.
   * @param {CookieOptions|Date} [options] The cookie options, or the expiration date and time for the cookie.
   * @throws {TypeError} The specified key is invalid.
   * @emits {ChangeEvent[]} The "changes" event.
   */
  set(key, value, options = this.defaults) {
    if (!key.length || /^(domain|expires|max-age|path|secure)$/i.test(key)) throw new TypeError('Invalid cookie name.');

    let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (options instanceof Date) options = new CookieOptions(options, this.defaults.path, this.defaults.domain, this.defaults.secure);
    if (options.toString().length) cookieValue += `; ${options}`;

    let previousValue = this.get(key);
    this._document.cookie = cookieValue;
    this.emit('changes', [{currentValue: value, key, previousValue}]);
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {*} value The cookie value.
   * @param {CookieOptions|Date} [options] The cookie options, or the expiration date and time for the cookie.
   * @emits {ChangeEvent[]} The "changes" event.
   */
  setObject(key, value, options = this.defaults) {
    this.set(key, JSON.stringify(value), options);
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return this._document.cookie;
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   */
  _removeItem(key, options = this.defaults) {
    if (!this.has(key)) return;

    let {domain, path} = options;
    let cookieOptions = new CookieOptions(0, path, domain);
    this._document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
  }
};
