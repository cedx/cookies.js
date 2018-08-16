import {JsonMap} from './map';

/**
 * Represents the event parameter used for a cookie change event.
 */
export class SimpleChange {

  /**
   * Initializes a new instance of the class.
   * @param previousValue The previous value for the cookie, or `undefined` if added.
   * @param currentValue The current value for the cookie, or `undefined` if removed.
   */
  constructor(public readonly previousValue?: string, public readonly currentValue?: string) {}

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'SimpleChange';
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): JsonMap {
    return {
      currentValue: this.currentValue,
      previousValue: this.previousValue
    };
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}
