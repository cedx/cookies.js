import {JsonMap, StringMap} from './map';

/**
 * Represents the event parameter used for a change event.
 */
export class SimpleChange<T = string> {

  /**
   * Creates a new simple change.
   * @param previousValue The previous value, or `undefined` if added.
   * @param currentValue The current value, or `undefined` if removed.
   */
  constructor(public readonly previousValue?: T, public readonly currentValue?: T) {}

  /**
   * Creates a new simple change from the specified JSON map.
   * @param map A JSON map representing a simple change.
   * @return The instance corresponding to the specified JSON map.
   */
  public static fromJson<T = string>(map: StringMap<T | undefined>): SimpleChange<T> {
    return new this<T>(
      'currentValue' in map ? map.currentValue : undefined,
      'previousValue' in map ? map.previousValue : undefined
    );
  }

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
