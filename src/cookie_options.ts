import {JsonMap} from './map';

/**
 * Defines the attributes of a HTTP cookie.
 */
export class CookieOptions {

  /**
   * The domain for which the cookie is valid.
   */
  public domain: string;

  /**
   * The expiration date and time for the cookie.
   */
  public expires: Date | null;

  /**
   * The path to which the cookie applies.
   */
  public path: string;

  /**
   * Value indicating whether to transmit the cookie over HTTPS only.
   */
  public secure: boolean;

  /**
   * Initializes a new instance of the class.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<CookieOptions> = {}) {
    const {domain = '', expires = null, path = '', secure = false} = options;
    this.domain = domain;
    this.expires = expires;
    this.path = path;
    this.secure = secure;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'CookieOptions';
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): JsonMap {
    return {
      domain: this.domain,
      expires: this.expires ? this.expires.toISOString() : null,
      path: this.path,
      secure: this.secure
    };
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    const value = [];
    if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
    if (this.domain.length) value.push(`domain=${this.domain}`);
    if (this.path.length) value.push(`path=${this.path}`);
    if (this.secure) value.push('secure');
    return value.join('; ');
  }
}
