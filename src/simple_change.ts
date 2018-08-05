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
  get [Symbol.toStringTag]() {
    return 'SimpleChange';
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      currentValue: this.currentValue,
      previousValue: this.previousValue
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}
