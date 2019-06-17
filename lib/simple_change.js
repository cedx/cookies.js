/** Represents the event parameter used for a change event. */
export class SimpleChange {

  /**
   * Creates a new simple change.
   * @param {?string} [previousValue] The previous value, or a `null` reference if added.
   * @param {?string} [currentValue] The current value, or a `null` reference if removed.
   */
  constructor(previousValue = null, currentValue = null) {

    /**
     * The current value, or a `null` reference if removed.
     * @type {?string}
     */
    this.currentValue = currentValue;

    /**
     * The previous value, or a `null` reference if added.
     * @type {?string}
     */
    this.previousValue = previousValue;
  }

  /**
   * Creates a new simple change from the specified JSON map.
   * @param {object} map A JSON map representing a simple change.
   * @return {SimpleChange} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new SimpleChange(
      typeof map.previousValue == 'string' ? map.previousValue : null,
      typeof map.currentValue == 'string' ? map.currentValue : null
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      currentValue: this.currentValue,
      previousValue: this.previousValue
    };
  }
}
