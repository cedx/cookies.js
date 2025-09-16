/* eslint-disable max-lines-per-function */
import {CookieStore} from "@cedx/cookies";
import {assert} from "chai";

/**
 * Tests the features of the {@link CookieStore} class.
 */
describe("CookieStore", () => {
	beforeEach(async () => {
		for (const cookie of await cookieStore.getAll()) await cookieStore.delete(/** @type {string} */ (cookie.name));
	});

	describe("keys", () => {
		it("should return an empty array for an empty cookie store", async () =>
			assert.isEmpty(await new CookieStore().keys));

		it("should return the list of keys for a non-empty cookie store", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');
			assert.sameMembers(Array.from(await new CookieStore().keys), ["foo", "prefix:baz"]);
		});

		it("should handle the key prefix", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');
			assert.sameMembers(Array.from(await new CookieStore({keyPrefix: "prefix:"}).keys), ["baz"]);
		});
	});

	describe("length", () => {
		it("should return zero for an empty cookie store", async () =>
			assert.equal(await new CookieStore().length, 0));

		it("should return the number of entries for a non-empty cookie store", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');
			assert.equal(await new CookieStore().length, 2);
		});

		it("should handle the key prefix", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');
			assert.equal(await new CookieStore({keyPrefix: "prefix:"}).length, 1);
		});
	});

	describe("[Symbol.asyncIterator]()", () => {
		it("should end iteration immediately if the cookie store is empty", async () => {
			const iterator = new CookieStore()[Symbol.asyncIterator]();
			assert.isTrue((await iterator.next()).done);
		});

		it("should iterate over the values if the cookie store is not empty", async () => {
			const iterator = new CookieStore()[Symbol.asyncIterator]();
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			let next = await iterator.next();
			assert.isFalse(next.done);
			assert.sameOrderedMembers(next.value, ["foo", "bar"]);
			next = await iterator.next();
			assert.isFalse(next.done);
			assert.sameOrderedMembers(next.value, ["prefix:baz", "qux"]);
			assert.isTrue((await iterator.next()).done);
		});

		it("should handle the key prefix", async () => {
			const iterator = new CookieStore({keyPrefix: "prefix:"})[Symbol.asyncIterator]();
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			const next = await iterator.next();
			assert.isFalse(next.done);
			assert.sameOrderedMembers(next.value, ["baz", "qux"]);
			assert.isTrue((await iterator.next()).done);
		});
	});

	describe("clear()", () => {
		it("should remove all cookies", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			await new CookieStore().clear();
			assert.isEmpty(document.cookie);
		});

		it("should handle the key prefix", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			await new CookieStore({keyPrefix: "prefix:"}).clear();
			assert.equal(document.cookie, 'foo="bar"');
		});
	});

	describe("delete()", () => {
		it("should properly remove the cookies", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			await new CookieStore().delete("foo");
			assert.equal(document.cookie, 'prefix:baz="qux"');
			assert.isNull(await cookieStore.get("foo"));
		});

		it("should handle the key prefix", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			await new CookieStore({keyPrefix: "prefix:"}).delete("baz");
			assert.equal(document.cookie, 'foo="bar"');
			assert.isNull(await cookieStore.get("prefix:baz"));
		});
	});

	describe("get()", () => {
		it("should properly get the deserialized cookies", async () => {
			const service = new CookieStore;
			assert.isNull(await service.get("foo"));

			await cookieStore.set("foo", '"bar"');
			assert.equal(await service.get("foo"), "bar");

			await cookieStore.set("foo", "123");
			assert.equal(await service.get("foo"), 123);

			await cookieStore.set("foo", '{"key": "value"}');
			assert.deepEqual(await service.get("foo"), {key: "value"});

			await cookieStore.set("foo", "{bar[123]}");
			assert.isNull(await service.get("foo"));

			await cookieStore.delete("foo");
			assert.isNull(await service.get("foo"));
		});

		it("should handle the key prefix", async () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			assert.isNull(await service.get("baz"));

			await cookieStore.set("prefix:baz", '"qux"');
			assert.equal(await service.get("baz"), "qux");

			await cookieStore.set("prefix:baz", "456");
			assert.equal(await service.get("baz"), 456);

			await cookieStore.set("prefix:baz", '{"key": "value"}');
			assert.deepEqual(await service.get("baz"), {key: "value"});

			await cookieStore.set("prefix:baz", "{qux[456]}");
			assert.isNull(await service.get("baz"));

			await cookieStore.delete("prefix:baz");
			assert.isNull(await service.get("baz"));
		});
	});

	describe("has()", () => {
		it("should return `false` if the specified key is not contained", async () =>
			assert.isFalse(await new CookieStore().has("foo")));

		it("should return `true` if the specified key is contained", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			const service = new CookieStore;
			assert.isFalse(await service.has("foo:bar"));
			assert.isTrue(await service.has("foo"));
			assert.isTrue(await service.has("prefix:baz"));
		});

		it("should handle the key prefix", async () => {
			await cookieStore.set("foo", '"bar"');
			await cookieStore.set("prefix:baz", '"qux"');

			const service = new CookieStore({keyPrefix: "prefix:"});
			assert.isFalse(await service.has("foo"));
			assert.isTrue(await service.has("baz"));
		});
	});

	describe("onChange()", () => {
		it("should trigger an event when a cookie is added", async () => {
			const listener = (/** @type {import("@cedx/cookies").CookieEvent} */ event) => {
				assert.equal(event.key, "foo");
				assert.isNull(event.oldValue);
				assert.equal(event.newValue, "bar");
			};

			const service = new CookieStore;
			service.onChange(listener);
			await service.set("foo", "bar");
			service.removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
		});

		it("should trigger an event when a cookie is updated", async () => {
			await cookieStore.set("foo", '"bar"');
			const listener = (/** @type {import("@cedx/cookies").CookieEvent} */ event) => {
				assert.equal(event.key, "foo");
				assert.equal(event.oldValue, "bar");
				assert.equal(event.newValue, "baz");
			};

			const service = new CookieStore;
			service.onChange(listener);
			await service.set("foo", "baz");
			service.removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
		});

		it("should trigger an event when a cookie is removed", async () => {
			await cookieStore.set("foo", '"bar"');
			const listener = (/** @type {import("@cedx/cookies").CookieEvent} */ event) => {
				assert.equal(event.key, "foo");
				assert.equal(event.oldValue, "bar");
				assert.isNull(event.newValue);
			};

			const service = new CookieStore;
			service.onChange(listener);
			await service.delete("foo");
			service.removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
		});

		it("should handle the key prefix", async () => {
			const listener = (/** @type {import("@cedx/cookies").CookieEvent} */ event) => {
				assert.equal(event.key, "baz");
				assert.isNull(event.oldValue);
				assert.equal(event.newValue, "qux");
			};

			const service = new CookieStore({keyPrefix: "prefix:"});
			service.onChange(listener);
			await service.set("baz", "qux");
			service.removeEventListener(CookieStore.changeEvent, /** @type {EventListener} */ (listener));
		});
	});

	describe("set()", () => {
		it("should properly serialize and set the cookies", async () => {
			const service = new CookieStore;
			assert.isNull(await cookieStore.get("foo"));

			await service.set("foo", "bar");
			assert.equal((await cookieStore.get("foo"))?.value, '"bar"');

			await service.set("foo", 123);
			assert.equal((await cookieStore.get("foo"))?.value, "123");

			await service.set("foo", {key: "value"});
			assert.equal((await cookieStore.get("foo"))?.value, '{"key":"value"}');
		});

		it("should handle the key prefix", async () => {
			const service = new CookieStore({keyPrefix: "prefix:"});
			assert.isNull(await cookieStore.get("prefix:baz"));

			await service.set("baz", "qux");
			assert.equal((await cookieStore.get("prefix:baz"))?.value, '"qux"');

			await service.set("baz", 456);
			assert.equal((await cookieStore.get("prefix:baz"))?.value, "456");

			await service.set("baz", {key: "value"});
			assert.equal((await cookieStore.get("prefix:baz"))?.value, '{"key":"value"}');
		});
	});
});
