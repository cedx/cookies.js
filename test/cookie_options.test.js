import {expect} from 'chai';
import {CookieOptions} from '../src/index';

/**
 * @test {CookieOptions}
 */
describe('CookieOptions', () => {

  /**
   * @test {CookieOptions#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect((new CookieOptions).toJSON()).to.be.an('object').that.deep.equal({
        domain: '',
        expires: null,
        path: '',
        secure: false
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new CookieOptions(0, '/path', 'domain.com', true).toJSON()).to.be.an('object').that.deep.equal({
        domain: 'domain.com',
        expires: '1970-01-01T00:00:00.000Z',
        path: '/path',
        secure: true
      });
    });
  });

  /**
   * @test {CookieOptions#toString}
   */
  describe('#toString()', () => {
    it('should return an empty string for a newly created instance', () => {
      expect(String(new CookieOptions)).to.be.empty;
    });

    it('should return a format like "expires=<expires>; domain=<domain>; path=<path>; secure" for an initialized instance', () => {
      expect(String(new CookieOptions(0, '/path', 'domain.com', true)))
        .to.equal('expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=domain.com; path=/path; secure');
    });
  });
});
