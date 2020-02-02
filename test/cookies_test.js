import {Cookies, SimpleChange} from '../lib/index.js';

/** Tests the features of the {@link Cookies} class. */
describe('Cookies', () => {
  const {expect} = chai;

  // Returns a map of the native cookies.
  function getNativeCookies() {
    const nativeCookies = new Map;
    if (document.cookie.length) for (const value of document.cookie.split(';')) {
      const index = value.indexOf('=');
      nativeCookies.set(value.substring(0, index), value.substring(index + 1));
    }

    return nativeCookies;
  }

  describe('#keys', () => {
    it('should return an empty array if the current document has no associated cookie', () => {
      expect(new Cookies().keys).to.be.an('array').and.have.lengthOf([...getNativeCookies().keys()].length);
    });

    it('should return the keys of the cookies associated with the current document', () => {
      document.cookie = 'key1=foo';
      document.cookie = 'key2=bar';
      expect(new Cookies().keys).to.be.an('array').and.include.members(['key1', 'key2']);
    });
  });

  describe('#length', () => {
    it('should return zero if the current document has no associated cookie', () => {
      expect(new Cookies).to.have.lengthOf([...getNativeCookies().entries()].length);
    });

    it('should return the number of cookies associated with the current document', () => {
      const count = [...getNativeCookies().entries()].length;
      document.cookie = 'length1=foo';
      document.cookie = 'length2=bar';
      expect(new Cookies).to.have.lengthOf(count + 2);
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('should return a done iterator if the current document has no associated cookie', () => {
      const cookies = new Cookies;
      cookies.clear();

      const iterator = cookies[Symbol.iterator]();
      expect(iterator.next().done).to.be.true;
    });

    it('should return a value iterator if the current document has associated cookies', () => {
      const cookies = new Cookies;
      cookies.clear();

      const iterator = cookies[Symbol.iterator]();
      document.cookie = 'iterator1=foo';
      document.cookie = 'iterator2=bar';

      let next = iterator.next();
      expect(next.done).to.be.false;
      expect(next.value).to.be.an('array');
      expect(next.value[0]).to.equal('iterator1');
      expect(next.value[1]).to.equal('foo');

      next = iterator.next();
      expect(next.done).to.be.false;
      expect(next.value[0]).to.equal('iterator2');
      expect(next.value[1]).to.equal('bar');
      expect(iterator.next().done).to.be.true;
    });

    it('should allow the "iterable" protocol', () => {
      const cookies = new Cookies;
      cookies.clear();
      document.cookie = 'iterator1=foo';
      document.cookie = 'iterator2=bar';

      let index = 0;
      for (const [key, value] of cookies) {
        if (index == 0) {
          expect(key).to.equal('iterator1');
          expect(value).to.equal('foo');
        }
        else if (index == 1) {
          expect(key).to.equal('iterator2');
          expect(value).to.equal('bar');
        }
        else expect.fail('More than two iteration rounds.');
        index++;
      }
    });
  });

  describe('#addEventListener("changes")', () => {
    it('should trigger an event when a cookie is added', done => {
      document.cookie = 'onChanges=; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      const listener = event => {
        const changes = event.detail;
        expect([...changes.entries()]).to.have.lengthOf(1);
        expect([...changes.keys()][0]).to.equal('onChanges');

        const [record] = [...changes.values()];
        expect(record.currentValue).to.equal('foo');
        expect(record.previousValue).to.be.undefined;

        done();
      };

      const cookies = new Cookies;
      cookies.addEventListener(Cookies.eventChanges, listener);
      cookies.set('onChanges', 'foo');
      cookies.removeEventListener(Cookies.eventChanges, listener);
    });

    it('should trigger an event when a cookie is updated', done => {
      document.cookie = 'onChanges=foo';

      const listener = event => {
        const changes = event.detail;
        expect([...changes.entries()]).to.have.lengthOf(1);
        expect([...changes.keys()][0]).to.equal('onChanges');

        const [record] = [...changes.values()];
        expect(record.currentValue).to.equal('bar');
        expect(record.previousValue).to.equal('foo');

        done();
      };

      const cookies = new Cookies;
      cookies.addEventListener(Cookies.eventChanges, listener);
      cookies.set('onChanges', 'bar');
      cookies.removeEventListener(Cookies.eventChanges, listener);
    });

    it('should trigger an event when a cookie is removed', done => {
      document.cookie = 'onChanges=bar';

      const listener = event => {
        const changes = event.detail;
        expect([...changes.entries()]).to.have.lengthOf(1);
        expect([...changes.keys()][0]).to.equal('onChanges');

        const [record] = [...changes.values()];
        expect(record.currentValue).to.be.undefined;
        expect(record.previousValue).to.equal('bar');

        done();
      };

      const cookies = new Cookies;
      cookies.addEventListener(Cookies.eventChanges, listener);
      cookies.remove('onChanges');
      cookies.removeEventListener(Cookies.eventChanges, listener);
    });

    it('should trigger an event when all the cookies are removed', done => {
      document.cookie = 'onChanges1=foo';
      document.cookie = 'onChanges2=bar';

      const listener = event => {
        const changes = event.detail;
        const entries = [...changes.entries()];
        expect(entries).to.have.lengthOf.at.least(2);

        let records = entries.filter(entry => entry[0] == 'onChanges1').map(entry => entry[1]);
        expect(records).to.have.lengthOf(1);
        expect(records[0].currentValue).to.be.undefined;
        expect(records[0].previousValue).to.equal('foo');

        records = entries.filter(entry => entry[0] == 'onChanges2').map(entry => entry[1]);
        expect(records).to.have.lengthOf(1);
        expect(records[0].currentValue).to.be.undefined;
        expect(records[0].previousValue).to.equal('bar');

        done();
      };

      const cookies = new Cookies;
      cookies.addEventListener(Cookies.eventChanges, listener);
      cookies.clear();
      cookies.removeEventListener(Cookies.eventChanges, listener);
    });
  });

  describe('#clear()', () => {
    it('should remove all the cookies associated with the current document', () => {
      document.cookie = 'clear1=foo';
      document.cookie = 'clear2=bar';

      new Cookies().clear();
      expect(document.cookie).to.not.contain('clear1');
      expect(document.cookie).to.not.contain('clear2');
    });
  });

  describe('#get()', () => {
    it('should properly get the cookies associated with the current document', () => {
      const cookies = new Cookies;
      expect(cookies.get('foo')).to.be.undefined;
      expect(cookies.get('foo', '123')).to.equal('123');

      document.cookie = 'get1=foo';
      expect(cookies.get('get1')).to.equal('foo');

      document.cookie = 'get2=123';
      expect(cookies.get('get2')).to.equal('123');
    });
  });

  describe('#getObject()', () => {
    it('should properly get the deserialized cookies associated with the current document', () => {
      const cookies = new Cookies;
      expect(cookies.getObject('foo')).to.be.undefined;
      expect(cookies.getObject('foo', {key: 'value'})).to.deep.equal({key: 'value'});

      document.cookie = 'getObject1=123';
      expect(cookies.getObject('getObject1')).to.equal(123);

      document.cookie = 'getObject2=%22bar%22';
      expect(cookies.getObject('getObject2')).to.equal('bar');

      document.cookie = 'getObject3=%7B%22key%22%3A%22value%22%7D';
      expect(cookies.getObject('getObject3')).to.be.an('object')
        .and.have.property('key').that.equal('value');
    });

    it('should return the default value if the value can\'t be deserialized', () => {
      document.cookie = 'getObject4=bar';
      expect(new Cookies().getObject('getObject4', 'defaultValue')).to.equal('defaultValue');
    });
  });

  describe('#has()', () => {
    it('should return `false` if the current document has an associated cookie with the specified key', () => {
      expect(new Cookies().has('foo')).to.be.false;
    });

    it('should return `true` if the current document does not have an associated cookie with the specified key', () => {
      document.cookie = 'has1=foo';
      document.cookie = 'has2=bar';

      const cookies = new Cookies;
      expect(cookies.has('has1')).to.be.true;
      expect(cookies.has('has2')).to.be.true;
      expect(cookies.has('foo')).to.be.false;
      expect(cookies.has('bar')).to.be.false;
    });
  });

  describe('#putIfAbsent()', () => {
    it('should add a new entry if it does not exist', () => {
      const cookies = new Cookies;
      expect(document.cookie).to.not.contain('putIfAbsent1');
      expect(cookies.putIfAbsent('putIfAbsent1', () => 'foo')).to.equal('foo');
      expect(document.cookie).to.contain('putIfAbsent1=foo');
    });

    it('should not add a new entry if it already exists', () => {
      const cookies = new Cookies;
      document.cookie = 'putIfAbsent2=foo';
      expect(cookies.putIfAbsent('putIfAbsent2', () => 'bar')).to.equal('foo');
      expect(document.cookie).to.contain('putIfAbsent2=foo');
    });
  });

  describe('#putObjectIfAbsent()', () => {
    it('should add a new entry if it does not exist', () => {
      const cookies = new Cookies;
      expect(document.cookie).to.not.contain('putObjectIfAbsent1');
      expect(cookies.putObjectIfAbsent('putObjectIfAbsent1', () => 123)).to.equal(123);
      expect(document.cookie).to.contain('putObjectIfAbsent1=123');
    });

    it('should not add a new entry if it already exists', () => {
      const cookies = new Cookies;
      document.cookie = 'putObjectIfAbsent2=123';
      expect(cookies.putObjectIfAbsent('putObjectIfAbsent2', () => 456)).to.equal(123);
      expect(document.cookie).to.contain('putObjectIfAbsent2=123');
    });
  });

  describe('#remove()', () => {
    it('should properly remove the cookies associated with the current document', () => {
      document.cookie = 'remove1=foo';
      document.cookie = 'remove2=bar';

      const cookies = new Cookies;
      cookies.remove('remove1');
      expect(document.cookie).to.not.contain('remove1');
      expect(document.cookie).to.contain('remove2=bar');

      cookies.remove('remove2');
      expect(document.cookie).to.not.contain('remove2');
    });
  });

  describe('#set()', () => {
    it('should properly set the cookies associated with the current document', () => {
      const cookies = new Cookies;
      expect(document.cookie).to.not.contain('set1');
      expect(document.cookie).to.not.contain('set2');

      cookies.set('set1', 'foo');
      expect(document.cookie).to.contain('set1=foo');
      expect(document.cookie).to.not.contain('set2');

      cookies.set('set2', 'bar');
      expect(document.cookie).to.contain('set1=foo');
      expect(document.cookie).to.contain('set2=bar');

      cookies.set('set1', '123');
      expect(document.cookie).to.contain('set1=123');
      expect(document.cookie).to.contain('set2=bar');
    });

    it('should throw an error if the specified key is empty', () => {
      expect(() => new Cookies().set('', 'foo')).to.throw(TypeError);
    });
  });

  describe('#setObject()', () => {
    it('should properly serialize and set the cookies associated with the current document', () => {
      const cookies = new Cookies;
      expect(document.cookie).to.not.contain('setObject1');
      expect(document.cookie).to.not.contain('setObject2');

      cookies.setObject('setObject1', 123);
      expect(document.cookie).to.contain('setObject1=123');
      expect(document.cookie).to.not.contain('setObject2');

      cookies.setObject('setObject2', 'foo');
      expect(document.cookie).to.contain('setObject1=123');
      expect(document.cookie).to.contain('setObject2=%22foo%22');

      cookies.setObject('setObject1', {key: 'value'});
      expect(document.cookie).to.contain('setObject1=%7B%22key%22%3A%22value%22%7D');
      expect(document.cookie).to.contain('setObject2=%22foo%22');
    });

    it('should throw an error if the specified key is empty', () => {
      expect(() => new Cookies().setObject('', 'foo')).to.throw(TypeError);
    });
  });

  describe('#toJSON()', () => {
    it('should return an empty map if the current document has no associated cookie', () => {
      const cookies = new Cookies;
      cookies.clear();
      expect(cookies.toJSON()).to.be.an('object').that.is.empty;
    });

    it('should return a non-empty map if the current document has associated cookies', () => {
      const cookies = new Cookies;
      cookies.clear();
      cookies.set('toJSON1', 'foo').set('toJSON2', 'bar');
      expect(cookies.toJSON()).to.be.an('object').that.deep.equal({toJSON1: 'foo', toJSON2: 'bar'});
    });
  });

  describe('#toString()', () => {
    it('should be the same value as `document.cookie` global property', () => {
      expect(String(new Cookies)).to.equal(document.cookie);
    });
  });
});
