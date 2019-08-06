import {CookieOptions} from '../lib/index.js';

/** Tests the features of the [[CookieOptions]] class. */
describe('CookieOptions', () => {
  const options = new CookieOptions({
    domain: 'domain.com',
    expires: new Date(0),
    path: '/path',
    secure: true
  });

  describe('#maxAge', () => {
    it('should return zero if the expiration time is not set', () => {
      expect(new CookieOptions().maxAge).to.equal(0);
    });

    it('should return zero if the cookie has expired', () => {
      expect(new CookieOptions({expires: new Date(2000, 0)}).maxAge).to.equal(0);
    });

    it('should return the difference with now if the cookie has not expired', () => {
      const duration = 30 * 1000;
      expect(new CookieOptions({expires: new Date(Date.now() + duration)}).maxAge).to.equal(30);
    });

    it('should set the expiration date accordingly', () => {
      const cookieOptions = new CookieOptions();
      const now = Date.now();
      cookieOptions.maxAge = 0;
      expect(cookieOptions.expires.getTime()).to.be.above(now - 1000).and.be.at.most(now);

      const duration = 30 * 1000;
      const later = Date.now() + duration;
      cookieOptions.maxAge = 30;
      expect(cookieOptions.expires.getTime()).to.be.above(later - 1000).and.be.at.most(later);

      cookieOptions.maxAge = null;
      expect(cookieOptions.expires).to.be.null;
    });
  });

  describe('.fromJson()', () => {
    it('should return an instance with default values for an empty map', () => {
      const cookieOptions = CookieOptions.fromJson({});
      expect(cookieOptions.domain).to.be.empty;
      expect(cookieOptions.expires).to.be.null;
      expect(cookieOptions.path).to.be.empty;
      expect(cookieOptions.secure).to.be.false;
    });

    it('should return an initialized instance for a non-empty map', () => {
      const cookieOptions = CookieOptions.fromJson(options.toJSON());
      expect(cookieOptions.domain).to.equal(options.domain);
      expect(cookieOptions.expires.getTime()).to.equal(options.expires.getTime());
      expect(cookieOptions.path).to.equal(options.path);
      expect(cookieOptions.secure).to.equal(options.secure);
    });
  });

  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect((new CookieOptions).toJSON()).to.deep.equal({
        domain: '',
        expires: null,
        path: '',
        secure: false
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new CookieOptions(options).toJSON()).to.deep.equal({
        domain: 'domain.com',
        expires: '1970-01-01T00:00:00.000Z',
        path: '/path',
        secure: true
      });
    });
  });

  describe('#toString()', () => {
    it('should return an empty string for a newly created instance', () => {
      expect(String(new CookieOptions)).to.be.empty;
    });

    it('should return a format like "expires=<expires>; domain=<domain>; path=<path>; secure" for an initialized instance', () => {
      expect(String(new CookieOptions(options)))
        .to.equal('expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=domain.com; path=/path; secure');
    });
  });
});
