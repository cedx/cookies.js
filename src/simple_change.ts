import {JsonMap, StringMap} from './map';

/** Represents the event parameter used for a change event. */
export class SimpleChange<T = string> {

  /**
   * Creates a new simple change.
   * @param previousValue The previous value, or `undefined` if added.
   * @param currentValue The current value, or `undefined` if removed.
   */
  constructor(readonly previousValue?: T, readonly currentValue?: T) {}

  /**
   * Creates a new simple change from the specified JSON map.
   * @param map A JSON map representing a simple change.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson<T = string>(map: StringMap<T | undefined>): SimpleChange<T> {
    return new SimpleChange<T>(
      'previousValue' in map ? map.previousValue : undefined,
      'currentValue' in map ? map.currentValue : undefined
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
    return {
      currentValue: this.currentValue,
      previousValue: this.previousValue
    };
  }
}
