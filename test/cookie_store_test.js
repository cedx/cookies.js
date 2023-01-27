/* eslint-disable max-lines-per-function */
import {expect} from "@esm-bundle/chai";
import {CookieEvent, CookieStore} from "#cookies";

/**
 * Gets the value of the cookie with the specified name.
 * @param {string} name The cookie name.
 * @returns {string|undefined} The cookie value.
 */
function getCookie(name) {
	return CookieStore.all.get(name);
}

/**
 * Removes the cookie with the specified name.
 * @param {string} name The cookie name.
 */
function removeCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
}

/**
 * Sets a cookie with the specified name and value.
 * @param {string} name The cookie name.
 * @param {string} value The cookie value.
 */
function setCookie(name, value) {
	document.cookie = `${name}=${encodeURIComponent(value)}`;
}

/**
 * Tests the features of the {@link CookieStore} class.
 */
describe("CookieStore", () => {
	beforeEach(() => [...CookieStore.all.keys()].forEach(key => removeCookie(key)));

	describe(".keys", () => {
		it("should return an empty array for an empty cookie store", () => {
			expect(new CookieStore().keys).to.be.empty;
		});

		it("should return the list of keys for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(new CookieStore().keys).to.have.members(["foo", "prefix:baz"]);
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(new CookieStore({keyPrefix: "prefix:"}).keys).to.have.members(["baz"]);
		});
	});

	describe(".length", () => {
		it("should return zero for an empty cookie store", () => {
			expect(new CookieStore).to.have.lengthOf(0);
		});

		it("should return the number of entries for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(new CookieStore).to.have.lengthOf(2);
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(new CookieStore({keyPrefix: "prefix:"})).to.have.lengthOf(1);
		});
	});

	describe(".[Symbol.iterator]()", () => {
		it("should end iteration immediately if the cookie store is empty", () => {
			const iterator = new CookieStore()[Symbol.iterator]();
			expect(iterator.next().done).to.be.true;
		});

		it("should iterate over the values if the cookie store is not empty", () => {
			const iterator = new CookieStore()[Symbol.iterator]();
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			let next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.have.ordered.members(["foo", "bar"]);
			next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.have.ordered.members(["prefix:baz", "qux"]);
			expect(iterator.next().done).to.be.true;
		});

		it("should handle the key prefix", () => {
			const iterator = new CookieStore({keyPrefix: "prefix:"})[Symbol.iterator]();
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.have.ordered.members(["baz", "qux"]);
			expect(iterator.next().done).to.be.true;
		});
	});

	describe(".clear()", () => {
		it("should remove all cookies", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore().clear();
			expect(document.cookie).to.be.empty;
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore({keyPrefix: "prefix:"}).clear();
			expect(document.cookie).to.equal("foo=bar");
		});
	});

	describe(".get()", () => {
		it("should properly get the cookies", () => {
			const service = new CookieStore;
			expect(service.get("foo")).to.be.null;

			setCookie("foo", "bar");
			expect(service.get("foo")).to.equal("bar");

			setCookie("foo", "123");
			expect(service.get("foo")).to.equal("123");

			removeCookie("foo");
			expect(service.get("foo")).to.be.null;
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			expect(service.get("baz")).to.be.null;

			setCookie("prefix:baz", "qux");
			expect(service.get("baz")).to.equal("qux");

			setCookie("prefix:baz", "456");
			expect(service.get("baz")).to.equal("456");

			removeCookie("prefix:baz");
			expect(service.get("baz")).to.be.null;
		});
	});

	describe(".getObject()", () => {
		it("should properly get the deserialized cookies", () => {
			const service = new CookieStore;
			expect(service.getObject("foo")).to.be.null;

			setCookie("foo", '"bar"');
			expect(service.getObject("foo")).to.equal("bar");

			setCookie("foo", "123");
			expect(service.getObject("foo")).to.equal(123);

			setCookie("foo", '{"key": "value"}');
			expect(service.getObject("foo")).to.deep.equal({key: "value"});

			setCookie("foo", "{bar[123]}");
			expect(service.getObject("foo")).to.be.null;

			removeCookie("foo");
			expect(service.getObject("foo")).to.be.null;
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			expect(service.getObject("baz")).to.be.null;

			setCookie("prefix:baz", '"qux"');
			expect(service.getObject("baz")).to.equal("qux");

			setCookie("prefix:baz", "456");
			expect(service.getObject("baz")).to.equal(456);

			setCookie("prefix:baz", '{"key": "value"}');
			expect(service.getObject("baz")).to.deep.equal({key: "value"});

			setCookie("prefix:baz", "{qux[456]}");
			expect(service.getObject("baz")).to.be.null;

			removeCookie("prefix:baz");
			expect(service.getObject("baz")).to.be.null;
		});
	});

	describe(".has()", () => {
		it("should return `false` if the specified key is not contained", () => {
			expect(new CookieStore().has("foo")).to.be.false;
		});

		it("should return `true` if the specified key is contained", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const service = new CookieStore;
			expect(service.has("foo:bar")).to.be.false;
			expect(service.has("foo")).to.be.true;
			expect(service.has("prefix:baz")).to.be.true;
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const service = new CookieStore({keyPrefix: "prefix:"});
			expect(service.has("foo")).to.be.false;
			expect(service.has("baz")).to.be.true;
		});
	});

	describe(".onChange()", () => {
		it("should trigger an event when a cookie is added", done => {
			const listener = (/** @type {CookieEvent} */ event) => {
				expect(event.key).to.equal("foo");
				expect(event.oldValue).to.be.null;
				expect(event.newValue).to.equal("bar");
			};

			const service = new CookieStore;
			service.onChange(listener);
			service.set("foo", "bar").removeEventListener(CookieEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is updated", done => {
			setCookie("foo", "bar");
			const listener = (/** @type {CookieEvent} */ event) => {
				expect(event.key).to.equal("foo");
				expect(event.oldValue).to.equal("bar");
				expect(event.newValue).to.equal("baz");
			};

			const service = new CookieStore;
			service.onChange(listener);
			service.set("foo", "baz").removeEventListener(CookieEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is removed", done => {
			setCookie("foo", "bar");
			const listener = (/** @type {CookieEvent} */ event) => {
				expect(event.key).to.equal("foo");
				expect(event.oldValue).to.equal("bar");
				expect(event.newValue).to.be.null;
			};

			const service = new CookieStore;
			service.onChange(listener);
			service.remove("foo");
			service.removeEventListener(CookieEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should handle the key prefix", done => {
			const listener = (/** @type {CookieEvent} */ event) => {
				expect(event.key).to.equal("baz");
				expect(event.oldValue).to.be.null;
				expect(event.newValue).to.equal("qux");
			};

			const service = new CookieStore({keyPrefix: "prefix:"});
			service.onChange(listener);
			service.set("baz", "qux").removeEventListener(CookieEvent.type, /** @type {EventListener} */ (listener));
			done();
		});
	});

	describe(".putIfAbsent()", () => {
		it("should add a new entry if it does not exis", () => {
			expect(getCookie("foo")).to.be.undefined;
			expect(new CookieStore().putIfAbsent("foo", () => "bar")).to.equal("bar");
			expect(getCookie("foo")).to.equal("bar");
		});

		it("should not add a new entry if it already exists", () => {
			setCookie("foo", "123");
			expect(new CookieStore().putIfAbsent("foo", () => "XYZ")).to.equal("123");
			expect(getCookie("foo")).to.equal("123");
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});

			expect(getCookie("prefix:baz")).to.be.undefined;
			expect(service.putIfAbsent("baz", () => "qux")).to.equal("qux");
			expect(getCookie("prefix:baz")).to.equal("qux");

			setCookie("prefix:baz", "456");
			expect(service.putIfAbsent("baz", () => "XYZ")).to.equal("456");
			expect(getCookie("prefix:baz"), "456");
		});
	});

	describe(".putObjectIfAbsent()", () => {
		it("should add a new entry if it does not exist", () => {
			expect(getCookie("foo")).to.be.undefined;
			expect(new CookieStore().putObjectIfAbsent("foo", () => "bar")).to.equal("bar");
			expect(getCookie("foo")).to.equal('"bar"');
		});

		it("should not add a new entry if it already exists", () => {
			setCookie("foo", "123");
			expect(new CookieStore().putObjectIfAbsent("foo", () => 999)).to.equal(123);
			expect(getCookie("foo")).to.equal("123");
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});

			expect(getCookie("prefix:baz")).to.be.undefined;
			expect(service.putObjectIfAbsent("baz", () => "qux")).to.equal("qux");
			expect(getCookie("prefix:baz")).to.equal('"qux"');

			setCookie("prefix:baz", "456");
			expect(service.putObjectIfAbsent("baz", () => 999)).to.equal(456);
			expect(getCookie("prefix:baz")).to.equal("456");
		});
	});

	describe(".remove()", () => {
		it("should properly remove the cookies", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore().remove("foo");
			expect(document.cookie).to.equal("prefix:baz=qux");
			expect(getCookie("foo")).to.be.undefined;
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore({keyPrefix: "prefix:"}).remove("baz");
			expect(document.cookie).to.equal("foo=bar");
			expect(getCookie("prefix:baz")).to.be.undefined;
		});
	});

	describe(".set()", () => {
		it("should properly set the cookies", () => {
			const service = new CookieStore;
			expect(getCookie("foo")).to.be.undefined;

			service.set("foo", "bar");
			expect(getCookie("foo")).to.equal("bar");

			service.set("foo", "123");
			expect(getCookie("foo")).to.equal("123");
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			expect(getCookie("prefix:baz")).to.be.undefined;

			service.set("baz", "qux");
			expect(getCookie("prefix:baz")).to.equal("qux");

			service.set("baz", "456");
			expect(getCookie("prefix:baz")).to.equal("456");
		});
	});

	describe(".setObject()", () => {
		it("should properly serialize and set the cookies", () => {
			const service = new CookieStore;
			expect(getCookie("foo")).to.be.undefined;

			service.setObject("foo", "bar");
			expect(getCookie("foo")).to.equal('"bar"');

			service.setObject("foo", 123);
			expect(getCookie("foo")).to.equal("123");

			service.setObject("foo", {key: "value"});
			expect(getCookie("foo")).to.equal('{"key":"value"}');
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			expect(getCookie("prefix:baz")).to.be.undefined;

			service.setObject("baz", "qux");
			expect(getCookie("prefix:baz")).to.equal('"qux"');

			service.setObject("baz", 456);
			expect(getCookie("prefix:baz")).to.equal("456");

			service.setObject("baz", {key: "value"});
			expect(getCookie("prefix:baz")).to.equal('{"key":"value"}');
		});
	});

	describe(".toJSON()", () => {
		it("should return an empty array for an empty cookie store", () => {
			expect(JSON.stringify(new CookieStore)).to.equal("[]");
		});

		it("should return a non-empty array for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const json = JSON.stringify(new CookieStore);
			expect(json).to.include('["foo","bar"]');
			expect(json).to.include('["prefix:baz","qux"]');
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const json = JSON.stringify(new CookieStore({keyPrefix: "prefix:"}));
			expect(json).to.not.include('["foo","bar"]');
			expect(json).to.include('["baz","qux"]');
		});
	});

	describe(".toString()", () => {
		it("should return an empty string for an empty cookie store", () => {
			expect(String(new CookieStore)).to.be.empty;
		});

		it("should return a non-empty string for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(String(new CookieStore)).to.equal("foo=bar; prefix:baz=qux");
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(String(new CookieStore({keyPrefix: "prefix:"}))).to.equal("baz=qux");
		});
	});
});
