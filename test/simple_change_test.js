import {expect} from 'chai';
import {SimpleChange} from '../lib/index.js';

/**
 * @test {SimpleChange}
 */
describe('SimpleChange', () => {

  /**
   * @test {SimpleChange#toJSON}
   */
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

  /**
   * @test {SimpleChange#toString}
   */
  describe('#toString()', () => {
    let data = new SimpleChange('baz', 'bar').toString();

    it('should start with the class name', () => {
      expect(data.startsWith('SimpleChange {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"currentValue":"bar"').and.contain('"previousValue":"baz"');
    });
  });
});
