/**
 * Represents the event parameter used for a cookie change event.
 */
export class SimpleChange {

  /**
   * Initializes a new instance of the class.
   * @param {string} [previousValue] The previous value for the cookie, or a `null` reference if added.
   * @param {string} [currentValue] The current value for the cookie, or a `null` reference if removed.
   */
  constructor(previousValue = null, currentValue = null) {

    /**
     * The current value for the cookie, or a `null` reference if removed.
     * @type {string}
     */
    this.currentValue = currentValue;

    /**
     * The previous value for the cookie, or a `null` reference if added.
     * @type {string}
     */
    this.previousValue = previousValue;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag](): string {
    return 'SimpleChange';
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): {[key: string]: any} {
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
