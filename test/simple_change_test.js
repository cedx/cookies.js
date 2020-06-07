import {SimpleChange} from "../lib/index.js";

/** Tests the features of the `SimpleChange` class. */
describe("SimpleChange", function() {
	describe(".fromJson()", function() {
		it("should return an empty instance with an empty map", function() {
			const change = SimpleChange.fromJson({});
			expect(change.currentValue).to.be.undefined;
			expect(change.previousValue).to.be.undefined;
		});

		it("should return a non-empty map for an initialized instance", function() {
			const change = SimpleChange.fromJson({currentValue: "foo", previousValue: "bar"});
			expect(change.currentValue).to.equal("foo");
			expect(change.previousValue).to.equal("bar");
		});
	});

	describe(".toJSON()", function() {
		it("should return a map with default values for a newly created instance", function() {
			expect(new SimpleChange().toJSON()).to.be.an("object").that.deep.equal({
				currentValue: null,
				previousValue: null
			});
		});

		it("should return a non-empty map for an initialized instance", function() {
			expect(new SimpleChange("baz", "bar").toJSON()).to.be.an("object").that.deep.equal({
				currentValue: "bar",
				previousValue: "baz"
			});
		});
	});
});
