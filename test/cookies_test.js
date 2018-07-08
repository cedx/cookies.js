import {expect} from 'chai';
import {Cookies, SimpleChange} from '../lib/index.js';

/**
 * @test {Cookies}
 */
describe('Cookies', () => {
  function getNativeCookies() { // eslint-disable-line require-jsdoc
    let nativeCookies = new Map;
    if (document.cookie.length) for (let value of document.cookie.split(';')) {
      let index = value.indexOf('=');
      nativeCookies.set(value.substring(0, index), value.substring(index + 1));
    }

    return nativeCookies;
  }

  /**
   * @test {Cookies#keys}
   */
  describe('#keys', () => {
    it('should return an empty array if the current document has no associated cookie', () => {
      expect(new Cookies().keys).to.be.an('array').and.have.lengthOf(Array.from(getNativeCookies().keys()).length);
    });

    it('should return the keys of the cookies associated with the current document', () => {
      document.cookie = 'key1=foo';
      document.cookie = 'key2=bar';
      expect(new Cookies().keys).to.be.an('array').and.include.members(['key1', 'key2']);
    });
  });

  /**
   * @test {Cookies#length}
   */
  describe('#length', () => {
    it('should return zero if the current document has no associated cookie', () => {
      expect(new Cookies).to.have.lengthOf(Array.from(getNativeCookies().entries()).length);
    });

    it('should return the number of cookies associated with the current document', () => {
      let count = Array.from(getNativeCookies().entries()).length;
      document.cookie = 'length1=foo';
      document.cookie = 'length2=bar';
      expect(new Cookies).to.have.length.within(count, count + 2);
    });
  });

  /**
   * @test {Cookies#Symbol.iterator}
   * TODO: not implemented !!!
   */
  describe.skip('#[Symbol.iterator]()', () => {
    it('should return a done iterator if the current document has no associated cookie', () => {
      let iterator = (new Cookies)[Symbol.iterator]();
      expect(iterator.next().done).to.be.true;
    });

    it('should return a value iterator if the current document has associated cookies', () => {
      document.cookie = 'iterator1=foo';
      document.cookie = 'iterator2=bar';

      let cookies = new Cookies;
      let iterator = cookies[Symbol.iterator]();

      let next = iterator.next();
      expect(next.done).to.be.false;
      expect(next.value).to.be.an('array');
      expect(next.value[0]).to.equal('iterator1');
      expect(next.value[1]).to.equal('iterator2');

      next = iterator.next();
      expect(next.done).to.be.false;
      expect(next.value[0]).to.equal('foo');
      expect(next.value[1]).to.equal('bar');
      expect(iterator.next().done).to.be.true;
    });
  });

  /**
   * @test {Cookies#clear}
   */
  describe('#clear()', () => {
    it('should remove all the cookies associated with the current document', () => {
      document.cookie = 'clear1=foo';
      document.cookie = 'clear2=bar';

      new Cookies().clear();
      expect(document.cookie).to.not.contain('clear1');
      expect(document.cookie).to.not.contain('clear2');
    });
  });

  /**
   * @test {Cookies#get}
   */
  describe('#get()', () => {
    it('should properly get the cookies associated with the current document', () => {
      let cookies = new Cookies;
      expect(cookies.get('foo')).to.be.null;
      expect(cookies.get('foo', '123')).to.equal('123');

      document.cookie = 'get1=foo';
      expect(cookies.get('get1')).to.equal('foo');

      document.cookie = 'get2=123';
      expect(cookies.get('get2')).to.equal('123');
    });
  });

  /**
   * @test {Cookies#getObject}
   */
  describe('#getObject()', () => {
    it('should properly get the deserialized cookies associated with the current document', () => {
      let cookies = new Cookies;
      expect(cookies.getObject('foo')).to.be.null;
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

  /**
   * @test {Cookies#has}
   */
  describe('#has()', () => {
    it('should return `false` if the current document has an associated cookie with the specified key', () => {
      expect(new Cookies().has('foo')).to.be.false;
    });

    it('should return `true` if the current document does not have an associated cookie with the specified key', () => {
      document.cookie = 'has1=foo';
      document.cookie = 'has2=bar';

      let cookies = new Cookies;
      expect(cookies.has('has1')).to.be.true;
      expect(cookies.has('has2')).to.be.true;
      expect(cookies.has('foo')).to.be.false;
      expect(cookies.has('bar')).to.be.false;
    });
  });

  /**
   * @test {Cookies#on}
   */
  describe('#on("changes")', () => {
    it('should trigger an event when a cookie is added', done => {
      document.cookie = 'onChanges=; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      let cookies = new Cookies;
      cookies.on('changes', changes => {
        expect(changes).to.be.an.instanceof(Map);
        expect(Array.from(changes.entries())).to.have.lengthOf(1);

        let record = Array.from(changes.values())[0];
        expect(Array.from(changes.keys())[0]).to.equal('onChanges');
        expect(record).to.be.instanceof(SimpleChange);
        expect(record.currentValue).to.equal('foo');
        expect(record.previousValue).to.be.null;

        done();
      });

      cookies.set('onChanges', 'foo');
    });

    it('should trigger an event when a cookie is updated', done => {
      document.cookie = 'onChanges=foo';

      let cookies = new Cookies;
      cookies.on('changes', changes => {
        expect(changes).to.be.an.instanceof(Map);
        expect(Array.from(changes.entries())).to.have.lengthOf(1);

        let record = Array.from(changes.values())[0];
        expect(Array.from(changes.keys())[0]).to.equal('onChanges');
        expect(record).to.be.instanceof(SimpleChange);
        expect(record.currentValue).to.equal('bar');
        expect(record.previousValue).to.equal('foo');

        done();
      });

      cookies.set('onChanges', 'bar');
    });

    it('should trigger an event when a cookie is removed', done => {
      document.cookie = 'onChanges=bar';

      let cookies = new Cookies;
      cookies.on('changes', changes => {
        expect(changes).to.be.an.instanceof(Map);
        expect(Array.from(changes.entries())).to.have.lengthOf(1);

        let record = Array.from(changes.values())[0];
        expect(Array.from(changes.keys())[0]).to.equal('onChanges');
        expect(record).to.be.instanceof(SimpleChange);
        expect(record.currentValue).to.be.null;
        expect(record.previousValue).to.equal('bar');

        done();
      });

      cookies.remove('onChanges');
    });

    it('should trigger an event when all the cookies are removed', done => {
      document.cookie = 'onChanges1=foo';
      document.cookie = 'onChanges2=bar';

      let cookies = new Cookies;
      cookies.on('changes', changes => {
        expect(changes).to.be.an.instanceof(Map);

        let entries = Array.from(changes.entries());
        expect(entries).to.have.lengthOf.at.least(2);

        let records = entries.filter(entry => entry[0] == 'onChanges1').map(entry => entry[1]);
        expect(records).to.have.lengthOf(1);
        expect(records[0]).to.be.instanceof(SimpleChange);
        expect(records[0].currentValue).to.be.null;
        expect(records[0].previousValue).to.equal('foo');

        records = entries.filter(entry => entry[0] == 'onChanges2').map(entry => entry[1]);
        expect(records).to.have.lengthOf(1);
        expect(records[0]).to.be.instanceof(SimpleChange);
        expect(records[0].currentValue).to.be.null;
        expect(records[0].previousValue).to.equal('bar');

        done();
      });

      cookies.clear();
    });
  });

  /**
   * @test {Cookies#remove}
   */
  describe('#remove()', () => {
    it('should properly remove the cookies associated with the current document', () => {
      document.cookie = 'remove1=foo';
      document.cookie = 'remove2=bar';

      let cookies = new Cookies;
      cookies.remove('remove1');
      expect(document.cookie).to.not.contain('remove1');
      expect(document.cookie).to.contain('remove2=bar');

      cookies.remove('remove2');
      expect(document.cookie).to.not.contain('remove2');
    });
  });

  /**
   * @test {Cookies#set}
   */
  describe('#set()', () => {
    it('should properly set the cookies associated with the current document', () => {
      let cookies = new Cookies;
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

    it('should throw an error if the specified key is a reserved word', () => {
      let cookies = new Cookies;
      expect(() => cookies.set('domain', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('expires', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('max-age', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('path', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('secure', 'foo')).to.throw(TypeError);
    });
  });

  /**
   * @test {Cookies#setObject}
   */
  describe('#setObject()', () => {
    it('should properly serialize and set the cookies associated with the current document', () => {
      let cookies = new Cookies;
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

    it('should throw an error if the specified key is a reserved word', () => {
      let cookies = new Cookies;
      expect(() => cookies.setObject('domain', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('expires', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('max-age', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('path', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('secure', 'foo')).to.throw(TypeError);
    });
  });

  /**
   * @test {Cookies#toJSON}
   */
  describe.skip('#toJSON()', () => {
    // TODO test toJSON
  });

  /**
   * @test {Cookies#toString}
   */
  describe('#toString()', () => {
    it('should be the same value as `document.cookie` global property', () => {
      expect(String(new Cookies)).to.equal(document.cookie);
    });
  });
});