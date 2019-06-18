/** Represents the event parameter used for a change event. */
export class SimpleChange {

  /**
   * Creates a new simple change.
   * @param {*} [previousValue] The previous value, or a `null` reference if added.
   * @param {*} [currentValue] The current value, or a `null` reference if removed.
   */
  constructor(previousValue = null, currentValue = null) {

    /**
     * The current value, or a `null` reference if removed.
     * @type {*}
     */
    this.currentValue = currentValue;

    /**
     * The previous value, or a `null` reference if added.
     * @type {*}
     */
    this.previousValue = previousValue;
  }

  /**
   * Creates a new simple change from the specified JSON map.
   * @param {Object<string, *>} map A JSON map representing a simple change.
   * @return {SimpleChange} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new SimpleChange(
      typeof map.previousValue != 'undefined' ? map.previousValue : null,
      typeof map.currentValue != 'undefined' ? map.currentValue : null
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object<string, *>} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      currentValue: this.currentValue,
      previousValue: this.previousValue
    };
  }
}
