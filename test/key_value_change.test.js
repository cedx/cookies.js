import {expect} from 'chai';
import {KeyValueChange} from '../src/index';

/**
 * @test {KeyValueChange}
 */
describe('KeyValueChange', () => {

  /**
   * @test {KeyValueChange#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect(new KeyValueChange('').toJSON()).to.be.an('object').that.deep.equal({
        currentValue: null,
        key: '',
        previousValue: null
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new KeyValueChange('foo', {currentValue: 'bar', previousValue: 'baz'}).toJSON()).to.be.an('object').that.deep.equal({
        currentValue: 'bar',
        key: 'foo',
        previousValue: 'baz'
      });
    });
  });

  /**
   * @test {KeyValueChange#toString}
   */
  describe('#toString()', () => {
    let data = new KeyValueChange('foo', {currentValue: 'bar', previousValue: 'baz'}).toString();

    it('should start with the class name', () => {
      expect(data.startsWith('KeyValueChange {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"currentValue":"bar"')
        .and.contain('"key":"foo"')
        .and.contain('"previousValue":"baz"');
    });
  });
});
