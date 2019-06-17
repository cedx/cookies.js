/** Defines the attributes of a HTTP cookie. */
export class CookieOptions {

  /**
   * Creates new cookie options.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {
    const {domain = '', expires = null, path = '', secure = false} = options;

    /**
     * The domain for which the cookie is valid.
     * @type {string}
     */
    this.domain = domain;

    /**
     * The expiration date and time for the cookie.
     * @type {?Date}
     */
    this.expires = expires;

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
   * The maximum duration, in seconds, until the cookie expires.
   * @type {number}
   */
  get maxAge() {
    if (!this.expires) return 0;
    const now = Date.now();
    const expires = this.expires.getTime() / 1000;
    return expires > now ? Math.ceil(expires - now) : 0;
  }

  /**
   * Sets the maximum duration, in seconds, until the cookie expires.
   * @param {?number} value The maximum duration, in seconds, until the cookie expires.
   */
  set maxAge(value) {
    this.expires = value == null ? value : new Date(Date.now() + (value * 1000));
  }

  /**
   * Creates new cookie options from the specified JSON map.
   * @param {object} map A JSON map representing cookie options.
   * @return {CookieOptions} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new CookieOptions({
      domain: typeof map.domain == 'string' ? map.domain : '',
      expires: typeof map.expires == 'string' ? new Date(map.expires) : null,
      path: typeof map.path == 'string' ? map.path : '',
      secure: typeof map.secure == 'boolean' ? map.secure : false
    });
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
    const value = [];
    if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
    if (this.domain.length) value.push(`domain=${this.domain}`);
    if (this.path.length) value.push(`path=${this.path}`);
    if (this.secure) value.push('secure');
    return value.join('; ');
  }
}
