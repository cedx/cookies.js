import {JsonMap} from './json_map';

/** Represents the event parameter used for a change event. */
export class SimpleChange {

  /**
   * Creates a new simple change.
   * @param previousValue The previous value, or `undefined` if added.
   * @param currentValue The current value, or `undefined` if removed.
   */
  constructor(readonly previousValue?: string, readonly currentValue?: string) {}

  /**
   * Creates a new simple change from the specified JSON map.
   * @param map A JSON map representing a simple change.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson(map: JsonMap): SimpleChange {
    return new SimpleChange(
      typeof map.previousValue == 'string' ? map.previousValue : undefined,
      typeof map.currentValue == 'string' ? map.currentValue : undefined
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
