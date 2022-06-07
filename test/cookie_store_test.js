import {CookieStore} from "../lib/index.js";

/**
 * Gets the value of the cookie with the specified name.
 * @param {string} name The cookie name.
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
	beforeEach(() => {
		for (const key of CookieStore.all.keys()) removeCookie(key);
	});

	describe(".keys", () => {
		it("should return an empty array for an empty cookie store", () => {
			expect(new CookieStore().keys).to.be.an("array").and.be.empty;
		});

		it("should return the list of keys for a non-empty cookie store", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(new CookieStore().keys).to.be.an("array").and.have.members(["foo", "prefix:baz"]);
		});

		it("should handle the key prefix", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");
			expect(new CookieStore({keyPrefix: "prefix:"}).keys).to.be.an("array").and.have.members(["baz"]);
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
			expect(next.value).to.be.an("array").and.have.ordered.members(["foo", "bar"]);
			next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.be.an("array").and.have.ordered.members(["prefix:baz", "qux"]);
			expect(iterator.next().done).to.be.true;
		});

		it("should handle the key prefix", () => {
			const iterator = new CookieStore()[Symbol.iterator]();
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			const next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.be.an("array").and.have.ordered.members(["baz", "qux"]);
			expect(iterator.next().done).to.be.true;
		});
	});

	describe(".addEventListener('changes')", () => {
		it("should trigger an event when a cookie is added", function(done) {
			document.cookie = "onChanges=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

			const listener = event => {
				const entries = [...event.detail.entries()];
				expect(entries).to.have.lengthOf(1);

				const [key, record] = entries[0];
				expect(key).to.equal("onChanges");
				expect(record.currentValue).to.equal("foo");
				expect(record.previousValue).to.be.undefined;

				done();
			};

			const service = new CookieStore;
			service.addEventListener(Cookies.eventChanges, listener);
			service.set("onChanges", "foo");
			service.removeEventListener(Cookies.eventChanges, listener);
		});

		it("should trigger an event when a cookie is updated", function(done) {
			document.cookie = "onChanges=foo";

			const listener = event => {
				const entries = [...event.detail.entries()];
				expect(entries).to.have.lengthOf(1);

				const [key, record] = entries[0];
				expect(key).to.equal("onChanges");
				expect(record.currentValue).to.equal("bar");
				expect(record.previousValue).to.equal("foo");

				done();
			};

			const service = new CookieStore;
			service.addEventListener(Cookies.eventChanges, listener);
			service.set("onChanges", "bar");
			service.removeEventListener(Cookies.eventChanges, listener);
		});

		it("should trigger an event when a cookie is removed", function(done) {
			document.cookie = "onChanges=bar";

			const listener = event => {
				const entries = [...event.detail.entries()];
				expect(entries).to.have.lengthOf(1);

				const [key, record] = entries[0];
				expect(key).to.equal("onChanges");
				expect(record.currentValue).to.be.undefined;
				expect(record.previousValue).to.equal("bar");

				done();
			};

			const service = new CookieStore;
			service.addEventListener(Cookies.eventChanges, listener);
			service.remove("onChanges");
			service.removeEventListener(Cookies.eventChanges, listener);
		});

		it("should trigger an event when all the cookies are removed", function(done) {
			document.cookie = "onChanges1=foo";
			document.cookie = "onChanges2=bar";

			const listener = event => {
				const entries = [...event.detail.entries()];
				expect(entries).to.have.lengthOf.at.least(2);

				let records = entries.filter(entry => entry[0] == "onChanges1").map(entry => entry[1]);
				expect(records).to.have.lengthOf(1);
				expect(records[0].currentValue).to.be.undefined;
				expect(records[0].previousValue).to.equal("foo");

				records = entries.filter(entry => entry[0] == "onChanges2").map(entry => entry[1]);
				expect(records).to.have.lengthOf(1);
				expect(records[0].currentValue).to.be.undefined;
				expect(records[0].previousValue).to.equal("bar");

				done();
			};

			const service = new CookieStore;
			service.addEventListener(Cookies.eventChanges, listener);
			service.clear();
			service.removeEventListener(Cookies.eventChanges, listener);
		});
	});

	describe(".clear()", () => {
		it("should remove all cookies", () => {
			setCookie("foo", "bar");
			setCookie("prefix:baz", "qux");

			new CookieStore().clear();
			expect(document.cookie).to.have.lengthOf(0);
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
			// TODO
		});
	});

	describe(".getObject()", () => {
		it("should properly get the deserialized cookies associated with the current document", () => {
			const service = new CookieStore;
			expect(service.getObject("foo")).to.be.undefined;
			expect(service.getObject("foo", {key: "value"})).to.deep.equal({key: "value"});

			document.cookie = "getObject1=123";
			expect(service.getObject("getObject1")).to.equal(123);

			document.cookie = "getObject2=%22bar%22";
			expect(service.getObject("getObject2")).to.equal("bar");

			document.cookie = "getObject3=%7B%22key%22%3A%22value%22%7D";
			expect(service.getObject("getObject3")).to.be.an("object").that.deep.equal({key: "value"});
		});

		it("should return the default value if the value can't be deserialized", () => {
			document.cookie = "getObject4=bar";
			expect(new CookieStore().getObject("getObject4", "defaultValue")).to.equal("defaultValue");
		});
	});

	describe(".has()", () => {
		it("should return `false` if the current document has an associated cookie with the specified key", () => {
			expect(new CookieStore().has("foo")).to.be.false;
		});

		it("should return `true` if the current document does not have an associated cookie with the specified key", () => {
			document.cookie = "has1=foo";
			document.cookie = "has2=bar";

			const service = new CookieStore;
			expect(service.has("has1")).to.be.true;
			expect(service.has("has2")).to.be.true;
			expect(service.has("foo")).to.be.false;
			expect(service.has("bar")).to.be.false;
		});
	});

	describe(".putIfAbsent()", () => {
		it("should add a new entry if it does not exist", () => {
			const service = new CookieStore;
			expect(document.cookie).to.not.contain("putIfAbsent1");
			expect(service.putIfAbsent("putIfAbsent1", () => "foo")).to.equal("foo");
			expect(document.cookie).to.contain("putIfAbsent1=foo");
		});

		it("should not add a new entry if it already exists", () => {
			const service = new CookieStore;
			document.cookie = "putIfAbsent2=foo";
			expect(service.putIfAbsent("putIfAbsent2", () => "bar")).to.equal("foo");
			expect(document.cookie).to.contain("putIfAbsent2=foo");
		});
	});

	describe(".putObjectIfAbsent()", () => {
		it("should add a new entry if it does not exist", () => {
			const service = new CookieStore;
			expect(document.cookie).to.not.contain("putObjectIfAbsent1");
			expect(service.putObjectIfAbsent("putObjectIfAbsent1", () => 123)).to.equal(123);
			expect(document.cookie).to.contain("putObjectIfAbsent1=123");
		});

		it("should not add a new entry if it already exists", () => {
			const service = new CookieStore;
			document.cookie = "putObjectIfAbsent2=123";
			expect(service.putObjectIfAbsent("putObjectIfAbsent2", () => 456)).to.equal(123);
			expect(document.cookie).to.contain("putObjectIfAbsent2=123");
		});
	});

	describe(".remove()", () => {
		it("should properly remove the cookies associated with the current document", () => {
			const service = new CookieStore;
			document.cookie = "remove1=foo";
			document.cookie = "remove2=bar";

			service.remove("remove1");
			expect(document.cookie).to.not.contain("remove1");
			expect(document.cookie).to.contain("remove2=bar");

			service.remove("remove2");
			expect(document.cookie).to.not.contain("remove2");
		});
	});

	describe(".set()", () => {
		it("should properly set the cookies associated with the current document", () => {
			const service = new CookieStore;
			expect(document.cookie).to.not.contain("set1");
			expect(document.cookie).to.not.contain("set2");

			service.set("set1", "foo");
			expect(document.cookie).to.contain("set1=foo");
			expect(document.cookie).to.not.contain("set2");

			service.set("set2", "bar");
			expect(document.cookie).to.contain("set1=foo");
			expect(document.cookie).to.contain("set2=bar");

			service.set("set1", "123");
			expect(document.cookie).to.contain("set1=123");
			expect(document.cookie).to.contain("set2=bar");
		});

		it("should throw an error if the specified key is empty", () => {
			expect(() => new CookieStore().set("", "foo")).to.throw(TypeError);
		});
	});

	describe(".setObject()", () => {
		it("should properly serialize and set the cookies associated with the current document", () => {
			const service = new CookieStore;
			expect(document.cookie).to.not.contain("setObject1");
			expect(document.cookie).to.not.contain("setObject2");

			service.setObject("setObject1", 123);
			expect(document.cookie).to.contain("setObject1=123");
			expect(document.cookie).to.not.contain("setObject2");

			service.setObject("setObject2", "foo");
			expect(document.cookie).to.contain("setObject1=123");
			expect(document.cookie).to.contain("setObject2=%22foo%22");

			service.setObject("setObject1", {key: "value"});
			expect(document.cookie).to.contain("setObject1=%7B%22key%22%3A%22value%22%7D");
			expect(document.cookie).to.contain("setObject2=%22foo%22");
		});

		it("should throw an error if the specified key is empty", () => {
			expect(() => new CookieStore().setObject("", "foo")).to.throw(TypeError);
		});
	});

	describe(".toJSON()", () => {
		it("should return an empty map if the current document has no associated cookie", () => {
			const service = new CookieStore;
			service.clear();
			expect(service.toJSON()).to.be.an("object").that.is.empty;
		});

		it("should return a non-empty map if the current document has associated cookies", () => {
			const service = new CookieStore;
			service.clear();
			service.set("toJSON1", "foo").set("toJSON2", "bar");
			expect(service.toJSON()).to.deep.equal({toJSON1: "foo", toJSON2: "bar"});
		});
	});

	describe(".toString()", () => {
		it("should be the same value as `document.cookie` global property", () => {
			expect(String(new CookieStore)).to.equal(document.cookie);
		});
	});
});
