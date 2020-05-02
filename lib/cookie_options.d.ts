import { JsonObject } from './json.js';
/** Defines the attributes of a HTTP cookie. */
export declare class CookieOptions {
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
    constructor(options?: Partial<CookieOptionsParams>);
    /** The maximum duration, in seconds, until the cookie expires. A negative value indicates a session cookie. */
    get maxAge(): number;
    set maxAge(value: number);
    /**
     * Creates new cookie options from the specified JSON object.
     * @param map A JSON object representing cookie options.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): CookieOptions;
    /**
     * Creates new options from the specified cookie string.
     * @param value A string representing a cookie.
     * @return The instance corresponding to the specified cookie string.
     */
    static fromString(value: string): CookieOptions;
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
