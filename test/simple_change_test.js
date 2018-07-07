import {expect} from 'chai';
import {SimpleChange} from './index';

/**
 * @test {SimpleChange}
 */
describe('SimpleChange', () => {

  /**
   * @test {SimpleChange#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect(new SimpleChange('').toJSON()).to.be.an('object').that.deep.equal({
        currentValue: null,
        key: '',
        previousValue: null
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new SimpleChange('foo', {currentValue: 'bar', previousValue: 'baz'}).toJSON()).to.be.an('object').that.deep.equal({
        currentValue: 'bar',
        key: 'foo',
        previousValue: 'baz'
      });
    });
  });

  /**
   * @test {SimpleChange#toString}
   */
  describe('#toString()', () => {
    let data = new SimpleChange('foo', {currentValue: 'bar', previousValue: 'baz'}).toString();

    it('should start with the class name', () => {
      expect(data.startsWith('SimpleChange {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"currentValue":"bar"')
        .and.contain('"key":"foo"')
        .and.contain('"previousValue":"baz"');
    });
  });
});
