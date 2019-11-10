import {JsonObject} from './json';

/** Defines the attributes of a HTTP cookie. */
export class CookieOptions {

  /** The domain for which the cookie is valid. */
  domain: string;

  /** The expiration date and time for the cookie. An `undefined` value indicates a session cookie. */
  expires?: Date;

  /** The path to which the cookie applies. */
  path: string;

  /** Value indicating whether to transmit the cookie over HTTPS only. */
  secure: boolean;

  /**
   * Creates new cookie options.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<CookieOptionsParams> = {}) {
    const {domain = '', expires, maxAge = -1, path = '', secure = false} = options;
    this.domain = domain;
    this.expires = expires;
    this.path = path;
    this.secure = secure;
    if (maxAge >= 0) this.maxAge = maxAge;
  }

  /** The maximum duration, in seconds, until the cookie expires. A negative value indicates a session cookie. */
  get maxAge(): number {
    if (!this.expires) return -1;
    const now = new Date;
    return this.expires > now ? Math.ceil((this.expires.getTime() - now.getTime()) / 1000) : 0;
  }

  set maxAge(value: number) {
    this.expires = value < 0 ? undefined : new Date(Date.now() + (value * 1000));
  }

  /**
   * Creates new cookie options from the specified JSON object.
   * @param map A JSON object representing cookie options.
   * @return The instance corresponding to the specified JSON object.
   */
  static fromJson(map: JsonObject): CookieOptions {
    return new CookieOptions({
      domain: typeof map.domain == 'string' ? map.domain : '',
      expires: typeof map.expires == 'string' ? new Date(map.expires) : undefined,
      maxAge: typeof map.maxAge == 'number' && Number.isInteger(map.maxAge) ? map.maxAge : -1,
      path: typeof map.path == 'string' ? map.path : '',
      secure: typeof map.secure == 'boolean' ? map.secure : false
    });
  }

  /**
   * Creates new options from the specified cookie string.
   * @param value A string representing a cookie.
   * @return The instance corresponding to the specified cookie string.
   */
  static fromString(value: string): CookieOptions {
    const attributes = ['domain', 'expires', 'max-age', 'path', 'secure'];
    const map = new Map<string, string>();
    for (const [optionName, optionValue] of value.split('; ').slice(1).map(part => part.split('='))) {
      const attribute = optionName.toLowerCase();
      if (attributes.includes(attribute)) map.set(attribute, optionValue);
    }

    return new CookieOptions({
      domain: map.has('domain') ? map.get('domain') : '',
      expires: map.has('expires') ? new Date(map.get('expires')!) : undefined,
      maxAge: map.has('max-age') ? Number.parseInt(map.get('max-age')!, 10) : -1,
      path: map.has('path') ? map.get('path') : '',
      secure: map.has('secure')
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
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
    const value = [];
    if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
    if (this.domain.length) value.push(`domain=${this.domain}`);
    if (this.path.length) value.push(`path=${this.path}`);
    if (this.secure) value.push('secure');
    return value.join('; ');
  }
}

/** Defines the parameters of a [[CookieOptions]] instance. */
export interface CookieOptionsParams {

  /** The domain for which the cookie is valid. */
  domain: string;

  /** The expiration date and time for the cookie. An `undefined` value indicates a session cookie. */
  expires: Date;

  /** The maximum duration, in seconds, until the cookie expires. A negative value indicates a session cookie. */
  maxAge: number;

  /** The path to which the cookie applies. */
  path: string;

  /** Value indicating whether to transmit the cookie over HTTPS only. */
  secure: boolean;
}
