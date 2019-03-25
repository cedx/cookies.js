import {JsonMap} from './map';

/**
 * Defines the attributes of a HTTP cookie.
 */
export class CookieOptions {

  /**
   * The domain for which the cookie is valid.
   */
  domain: string;

  /**
   * The expiration date and time for the cookie.
   */
  expires: Date | null;

  /**
   * The path to which the cookie applies.
   */
  path: string;

  /**
   * Value indicating whether to transmit the cookie over HTTPS only.
   */
  secure: boolean;

  /**
   * Creates new cookie options.
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
   * Creates new cookie options from the specified JSON map.
   * @param map A JSON map representing cookie options.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson(map: JsonMap): CookieOptions {
    return new CookieOptions({
      domain: typeof map.domain == 'string' ? map.domain : '',
      expires: typeof map.expires == 'string' ? new Date(map.expires) : null,
      path: typeof map.path == 'string' ? map.path : '',
      secure: typeof map.secure == 'boolean' ? map.secure : false
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
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
  toString(): string {
    const value: string[] = [];
    if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
    if (this.domain.length) value.push(`domain=${this.domain}`);
    if (this.path.length) value.push(`path=${this.path}`);
    if (this.secure) value.push('secure');
    return value.join('; ');
  }
}
