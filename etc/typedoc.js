/**
 * @type {Partial<import("typedoc").TypeDocOptions>}
 */
export default {
	entryPoints: ["../src/index.js"],
	excludePrivate: true,
	gitRevision: "main",
	hideGenerator: true,
	name: "Cookies for JS",
	out: "../docs/api",
	readme: "none",
	tsconfig: "../src/jsconfig.json"
};
