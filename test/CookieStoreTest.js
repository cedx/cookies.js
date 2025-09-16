/* eslint-disable max-lines-per-function */
import {CookieEvent, CookieStore} from "@cedx/cookies";
import {assert} from "chai";

/**
 * Tests the features of the {@link CookieStore} class.
 */
describe("CookieStore", () => {
	beforeEach(() => { for (const key of CookieStore.all.keys()) deleteCookie(key); });

	describe("keys", () => {
		it("should return an empty array for an empty cookie store", () =>
			assert.isEmpty(new CookieStore().keys));

		it("should return the list of keys for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			assert.sameMembers(Array.from(new CookieStore().keys), ["foo", "prefix:baz"]);
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			assert.sameMembers(Array.from(new CookieStore({keyPrefix: "prefix:"}).keys), ["baz"]);
		});
	});

	describe("length", () => {
		it("should return zero for an empty cookie store", () =>
			assert.lengthOf(new CookieStore, 0));

		it("should return the number of entries for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			assert.lengthOf(new CookieStore, 2);
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			assert.lengthOf(new CookieStore({keyPrefix: "prefix:"}), 1);
		});
	});

	describe("[Symbol.iterator]()", () => {
		it("should end iteration immediately if the cookie store is empty", () => {
			const iterator = new CookieStore()[Symbol.iterator]();
			assert.isTrue(iterator.next().done);
		});

		it("should iterate over the values if the cookie store is not empty", () => {
			const iterator = new CookieStore()[Symbol.iterator]();
			setCookie("foo", '"bar"');
			setCookie("prefix:baz", '"qux"');

			let next = iterator.next();
			assert.isFalse(next.done);
			assert.sameOrderedMembers(next.value, ["foo", "bar"]);
			next = iterator.next();
			assert.isFalse(next.done);
			assert.sameOrderedMembers(next.value, ["prefix:baz", "qux"]);
			assert.isTrue(iterator.next().done);
		});

		it("should handle the key prefix", () => {
			const iterator = new CookieStore({keyPrefix: "prefix:"})[Symbol.iterator]();
			setCookie("foo", '"bar"');
			setCookie("prefix:baz", '"qux"');

			const next = iterator.next();
			assert.isFalse(next.done);
			assert.sameOrderedMembers(next.value, ["baz", "qux"]);
			assert.isTrue(iterator.next().done);
		});
	});

	describe("clear()", () => {
		it("should remove all cookies", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore().clear();
			assert.isEmpty(document.cookie);
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore({keyPrefix: "prefix:"}).clear();
			assert.equal(document.cookie, "foo=bar");
		});
	});

	describe("delete()", () => {
		it("should properly remove the cookies", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore().delete("foo");
			assert.equal(document.cookie, "prefix:baz=qux");
			assert.isNull(getCookie("foo"));
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore({keyPrefix: "prefix:"}).delete("baz");
			assert.equal(document.cookie, "foo=bar");
			assert.isNull(getCookie("prefix:baz"));
		});
	});

	describe("get()", () => {
		it("should properly get the deserialized cookies", () => {
			const service = new CookieStore;
			assert.isNull(service.get("foo"));

			setCookie("foo", '"bar"');
			assert.equal(service.get("foo"), "bar");

			setCookie("foo", "123");
			assert.equal(service.get("foo"), 123);

			setCookie("foo", '{"key": "value"}');
			assert.deepEqual(service.get("foo"), {key: "value"});

			setCookie("foo", "{bar[123]}");
			assert.isNull(service.get("foo"));

			deleteCookie("foo");
			assert.isNull(service.get("foo"));
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			assert.isNull(service.get("baz"));

			setCookie("prefix:baz", '"qux"');
			assert.equal(service.get("baz"), "qux");

			setCookie("prefix:baz", "456");
			assert.equal(service.get("baz"), 456);

			setCookie("prefix:baz", '{"key": "value"}');
			assert.deepEqual(service.get("baz"), {key: "value"});

			setCookie("prefix:baz", "{qux[456]}");
			assert.isNull(service.get("baz"));

			deleteCookie("prefix:baz");
			assert.isNull(service.get("baz"));
		});
	});

	describe("has()", () => {
		it("should return `false` if the specified key is not contained", () =>
			assert.isFalse(new CookieStore().has("foo")));

		it("should return `true` if the specified key is contained", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const service = new CookieStore;
			assert.isFalse(service.has("foo:bar"));
			assert.isTrue(service.has("foo"));
			assert.isTrue(service.has("prefix:baz"));
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const service = new CookieStore({keyPrefix: "prefix:"});
			assert.isFalse(service.has("foo"));
			assert.isTrue(service.has("baz"));
		});
	});

	describe("onChange()", () => {
		it("should trigger an event when a cookie is added", done => {
			const listener = (/** @type {CookieEvent} */ event) => {
				assert.equal(event.key, "foo");
				assert.isNull(event.oldValue);
				assert.equal(event.newValue, "bar");
			};

			const service = new CookieStore;
			service.onChange(listener);
			service.set("foo", "bar").removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is updated", done => {
			setCookie("foo", "bar");
			const listener = (/** @type {CookieEvent} */ event) => {
				assert.equal(event.key, "foo");
				assert.equal(event.oldValue, "bar");
				assert.equal(event.newValue, "baz");
			};

			const service = new CookieStore;
			service.onChange(listener);
			service.set("foo", "baz").removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is removed", done => {
			setCookie("foo", "bar");
			const listener = (/** @type {CookieEvent} */ event) => {
				assert.equal(event.key, "foo");
				assert.equal(event.oldValue, "bar");
				assert.isNull(event.newValue);
			};

			const service = new CookieStore;
			service.onChange(listener);
			service.delete("foo");
			service.removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
			done();
		});

		it("should handle the key prefix", done => {
			const listener = (/** @type {CookieEvent} */ event) => {
				assert.equal(event.key, "baz");
				assert.isNull(event.oldValue);
				assert.equal(event.newValue, "qux");
			};

			const service = new CookieStore({keyPrefix: "prefix:"});
			service.onChange(listener);
			service.set("baz", "qux").removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
			done();
		});
	});

	describe("set()", () => {
		it("should properly serialize and set the cookies", () => {
			const service = new CookieStore;
			assert.isNull(getCookie("foo"));

			service.set("foo", "bar");
			assert.equal(getCookie("foo"), '"bar"');

			service.set("foo", 123);
			assert.equal(getCookie("foo"), "123");

			service.set("foo", {key: "value"});
			assert.equal(getCookie("foo"), '{"key":"value"}');
		});

		it("should handle the key prefix", () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			assert.isNull(getCookie("prefix:baz"));

			service.set("baz", "qux");
			assert.equal(getCookie("prefix:baz"), '"qux"');

			service.set("baz", 456);
			assert.equal(getCookie("prefix:baz"), "456");

			service.set("baz", {key: "value"});
			assert.equal(getCookie("prefix:baz"), '{"key":"value"}');
		});
	});

	describe("toJSON()", () => {
		it("should return an empty array for an empty cookie store", () =>
			assert.equal(JSON.stringify(new CookieStore), "[]"));

		it("should return a non-empty array for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const json = JSON.stringify(new CookieStore);
			assert.include(json, '["foo","bar"]');
			assert.include(json, '["prefix:baz","qux"]');
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const json = JSON.stringify(new CookieStore({keyPrefix: "prefix:"}));
			assert.notInclude(json, '["foo","bar"]');
			assert.include(json, '["baz","qux"]');
		});
	});

	describe("toString()", () => {
		it("should return an empty string for an empty cookie store", () =>
			assert.isEmpty(String(new CookieStore)));

		it("should return a non-empty string for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			assert.equal(String(new CookieStore), "foo=bar; prefix:baz=qux");
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			assert.equal(String(new CookieStore({keyPrefix: "prefix:"})), "baz=qux");
		});
	});
});

/**
 * Removes the cookie with the specified name.
 * @param {string} name The cookie name.
 */
function deleteCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
}

/**
 * Gets the value of the cookie with the specified name.
 * @param {string} name The cookie name.
 * @returns {string|null} The cookie value.
 */
function getCookie(name) {
	return CookieStore.all.get(name) ?? null;
}

/**
 * Sets a cookie with the specified name and value.
 * @param {string} name The cookie name.
 * @param {string} value The cookie value.
 */
function setCookie(name, value) {
	document.cookie = `${name}=${encodeURIComponent(value)}`;
}
