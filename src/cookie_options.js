'use strict';

/**
 * Defines the attributes of a HTTP cookie.
 */
exports.CookieOptions = class CookieOptions {

  /**
   * Initializes a new instance of the class.
   * @param {Date|number|string} [expires] The expiration date and time for the cookie.
   * @param {string} [path] The path to which the cookie applies.
   * @param {string} [domain] The domain for which the cookie is valid.
   * @param {boolean} [secure] Value indicating whether to transmit the cookie over HTTPS only.
   */
  constructor(expires = null, path = '', domain = '', secure = false) {

    /**
     * The domain for which the cookie is valid.
     * @type {string}
     */
    this.domain = domain;

    /**
     * The expiration date and time for the cookie.
     * @type {Date}
     */
    this.expires = expires instanceof Date ? expires : null;
    if (Number.isInteger(expires) || typeof expires == 'string') this.expires = new Date(expires);

    /**
     * The path to which the cookie applies.
     * @type {string}
     */
    this.path = path;

    /**
     * Value indicating whether to transmit the cookie over HTTPS only.
     * @type {boolean}
     */
    this.secure = secure;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'CookieOptions';
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      domain: this.domain,
      expires: this.expires ? this.expires.toISOString() : null,
      path: this.path,
      secure: this.secure
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    let value = [];
    if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
    if (this.domain.length) value.push(`domain=${this.domain}`);
    if (this.path.length) value.push(`path=${this.path}`);
    if (this.secure) value.push('secure');
    return value.join('; ');
  }
};
