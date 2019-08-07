import {SimpleChange} from '../lib/index.js';

/** Tests the features of the [[SimpleChange]] class. */
describe('SimpleChange', () => {
  describe('.fromJson()', () => {
    it('should return an empty instance with an empty map', () => {
      const change = SimpleChange.fromJson({});
      expect(change.currentValue).to.be.null;
      expect(change.previousValue).to.be.null;
    });

    it('should return a non-empty map for an initialized instance', () => {
      const change = SimpleChange.fromJson({currentValue: 123, previousValue: 456});
      expect(change.currentValue).to.equal(123);
      expect(change.previousValue).to.equal(456);
    });
  });

  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect(new SimpleChange().toJSON()).to.be.an('object').that.deep.equal({
        currentValue: null,
        previousValue: null
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new SimpleChange('baz', 'bar').toJSON()).to.be.an('object').that.deep.equal({
        currentValue: 'bar',
        previousValue: 'baz'
      });
    });
  });
});
