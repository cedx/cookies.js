/**
 * Represents the event parameter used for a change event.
 */
export class ChangeEvent {

  /**
   * Initializes a new instance of the class.
   * @param {string} [key] The cookie name.
   * @param {*} [currentValue] The current value for the cookie.
   * @param {*} [previousValue] The previous value for the cookie.
   */
  constructor(key = '', currentValue = null, previousValue = null) {

    /**
     * The current value for the cookie, or a `null` reference if removed.
     * @type {*}
     */
    this.currentValue = currentValue;

    /**
     * The cookie name.
     * @type {string}
     */
    this.key = key;

    /**
     * The previous value for the cookie, or a `null` reference if added.
     * @type {*}
     */
    this.previousValue = previousValue;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'ChangeEvent';
  }
}
