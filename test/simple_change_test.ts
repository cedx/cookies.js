/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {SimpleChange} from '../src';

/**
 * Tests the features of the `SimpleChange` class.
 */
describe('SimpleChange', () => {

  /**
   * Tests the `SimpleChange.fromJson()` method.
   */
  describe('.fromJson()', () => {
    it('should return an empty instance with an empty map', () => {
      const change = SimpleChange.fromJson<string>({});
      expect(change.currentValue).to.be.undefined;
      expect(change.previousValue).to.be.undefined;
    });

    it('should return a non-empty map for an initialized instance', () => {
      const change = SimpleChange.fromJson<number>({currentValue: 123, previousValue: 456});
      expect(change.currentValue).to.equal(123);
      expect(change.previousValue).to.equal(456);
    });
  });

  /**
   * Tests the `SimpleChange#toJSON()` method.
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect(new SimpleChange<string>().toJSON()).to.be.an('object').that.deep.equal({
        currentValue: undefined,
        previousValue: undefined
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new SimpleChange<string>('baz', 'bar').toJSON()).to.be.an('object').that.deep.equal({
        currentValue: 'bar',
        previousValue: 'baz'
      });
    });
  });

  /**
   * Tests the `SimpleChange#toString()` method.
   */
  describe('#toString()', () => {
    const data = new SimpleChange<number>(456, 123).toString();

    it('should start with the class name', () => {
      expect(data.startsWith('SimpleChange {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"currentValue":123').and.contain('"previousValue":456');
    });
  });
});
