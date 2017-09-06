'use strict';

/**
 * Represents the event parameter used for a change event.
 */
exports.ChangeEvent = class ChangeEvent {

  /**
   * Initializes a new instance of the class.
   * @param {string} [key] The path to which the cookie applies.
   * @param {*} [currentValue] The domain for which the cookie is valid.
   * @param {*} [previousValue] Value indicating whether to transmit the cookie over HTTPS only.
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
};
