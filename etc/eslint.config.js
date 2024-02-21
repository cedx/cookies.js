import {join} from "node:path";
import eslint from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
	eslint.configs.recommended,
	...tsEslint.configs.strictTypeChecked,
	...tsEslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.mocha
			},
			parserOptions: {
				project: join(import.meta.dirname, "../tsconfig.json")
			}
		},
		rules: {
			"array-callback-return": "error",
			"no-await-in-loop": "off",
			"no-constant-binary-expression": "off",
			"no-constructor-return": "error",
			"no-duplicate-imports": "error",
			"no-new-native-nonconstructor": "error",
			"no-promise-executor-return": "off",
			"no-self-compare": "error",
			"no-template-curly-in-string": "error",
			"no-unmodified-loop-condition": "error",
			"no-unreachable-loop": "error",
			"no-unused-private-class-members": "error",
			"no-use-before-define": "off",
			"require-atomic-updates": ["error", {allowProperties: true}],

			"accessor-pairs": "error",
			"arrow-body-style": "error",
			"block-scoped-var": "error",
			"camelcase": "off",
			"capitalized-comments": "error",
			"class-methods-use-this": "off",
			"complexity": "error",
			"consistent-return": "off",
			"consistent-this": "error",
			"curly": ["error", "multi"],
			"default-case": "error",
			"default-case-last": "error",
			"default-param-last": "error",
			"dot-notation": "error",
			"eqeqeq": "off",
			"func-name-matching": "error",
			"func-names": "off",
			"func-style": ["error", "declaration", {allowArrowFunctions: true}],
			"grouped-accessor-pairs": "error",
			"guard-for-in": "error",
			"id-denylist": "off",
			"id-length": ["error", {exceptions: ["_", "x", "y"]}],
			"id-match": "error",
			"init-declarations": "off",
			"max-classes-per-file": "off",
			"max-depth": "error",
			"max-lines": ["error", {max: 500}],
			"max-lines-per-function": ["error", {max: 100}],
			"max-nested-callbacks": "error",
			"max-params": "off",
			"max-statements": ["error", {max: 25}],
			"multiline-comment-style": ["error", "separate-lines"],
			"new-cap": ["error", {capIsNewExceptions: ["RangeError", "SyntaxError", "TypeError"]}],
			"no-alert": "error",
			"no-array-constructor": "error",
			"no-caller": "error",
			"no-confusing-arrow": "off",
			"no-console": "off",
			"no-continue": "off",
			"no-div-regex": "error",
			"no-else-return": "error",
			"no-empty-function": "error",
			"no-empty-static-block": "error",
			"no-eq-null": "off",
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-extra-label": "error",
			"no-implicit-coercion": "error",
			"no-implicit-globals": "error",
			"no-implied-eval": "error",
			"no-inline-comments": "off",
			"no-invalid-this": "off",
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-lonely-if": "error",
			"no-loop-func": "error",
			"no-magic-numbers": "off",
			"no-multi-assign": ["error", {ignoreNonDeclaration: true}],
			"no-multi-str": "error",
			"no-negated-condition": "off",
			"no-nested-ternary": "off",
			"no-new": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "off",
			"no-plusplus": "off",
			"no-proto": "error",
			"no-restricted-exports": "off",
			"no-restricted-globals": "off",
			"no-restricted-imports": "off",
			"no-restricted-properties": "off",
			"no-restricted-syntax": "off",
			"no-return-assign": "off",
			"no-script-url": "error",
			"no-sequences": "error",
			"no-shadow": "off",
			"no-ternary": "off",
			"no-throw-literal": "error",
			"no-undef-init": "error",
			"no-undefined": "error",
			"no-underscore-dangle": "error",
			"no-unneeded-ternary": "error",
			"no-unused-expressions": "off",
			"no-useless-call": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			"no-useless-constructor": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-void": ["error", {allowAsStatement: true}],
			"no-warning-comments": "warn",
			"object-shorthand": "error",
			"one-var": ["error", "never"],
			"operator-assignment": "error",
			"prefer-arrow-callback": "error",
			"prefer-destructuring": "off",
			"prefer-exponentiation-operator": "error",
			"prefer-named-capture-group": "off",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error",
			"prefer-object-spread": "error",
			"prefer-promise-reject-errors": "error",
			"prefer-regex-literals": "error",
			"prefer-template": "error",
			"radix": ["error", "as-needed"],
			"require-await": "off",
			"require-unicode-regexp": "off",
			"sort-imports": "off",
			"sort-keys": "off",
			"sort-vars": "error",
			"strict": ["error", "global"],
			"symbol-description": "error",
			"vars-on-top": "error",
			"yoda": "error",

			"line-comment-position": "error",
			"unicode-bom": "error",

			"@typescript-eslint/class-literal-property-style": "off",
			"@typescript-eslint/class-methods-use-this": "off",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/default-param-last": "error",
			"@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
			"@typescript-eslint/explicit-member-accessibility": ["error", {accessibility: "no-public"}],
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/init-declarations": "error",
			"@typescript-eslint/max-params": ["error", {max: 4}],
			"@typescript-eslint/member-ordering": "error",
			"@typescript-eslint/method-signature-style": "error",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-confusing-void-expression": "off",
			"@typescript-eslint/no-dupe-class-members": "error",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/no-invalid-this": "error",
			"@typescript-eslint/no-loop-func": "error",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-redeclare": "error",
			"@typescript-eslint/no-require-imports": "error",
			"@typescript-eslint/no-restricted-imports": "error",
			"@typescript-eslint/no-shadow": "error",
			"@typescript-eslint/no-unnecessary-qualifier": "error",
			"@typescript-eslint/no-unsafe-unary-minus": "error",
			"@typescript-eslint/no-unused-expressions": ["error", {allowTaggedTemplates: true, allowTernary: true}],
			"@typescript-eslint/no-use-before-define": ["error", {functions: false}],
			"@typescript-eslint/no-useless-empty-export": "error",
			"@typescript-eslint/parameter-properties": "error",
			"@typescript-eslint/prefer-destructuring": "error",
			"@typescript-eslint/prefer-enum-initializers": "off",
			"@typescript-eslint/prefer-readonly": "error",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
			"@typescript-eslint/prefer-regexp-exec": "error",
			"@typescript-eslint/promise-function-async": "off",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/return-await": "error",
			"@typescript-eslint/sort-type-constituents": "error",
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/typedef": "error"
		}
	},
	{
		files: ["test/**/*.js"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-floating-promises": "off"
		}
	}
);
