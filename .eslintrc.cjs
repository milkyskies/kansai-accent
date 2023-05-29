module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
	plugins: ["svelte3", "@typescript-eslint"],
	ignorePatterns: ["*.cjs", "gcf/"],
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
			env: { browser: true, node: false },
			rules: {
				"no-inner-declarations": "off",
				"no-unused-vars": "off",
				"no-self-assign": "off",
			},
		},
	],
	settings: {
		"svelte3/typescript": () => require("typescript"),
	},
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		"prettier/prettier": "warn",
		"arrow-body-style": "off",
		"prefer-arrow-callback": "off",
		semi: ["error", "always"],
		"no-var": ["error"],
		"no-console": ["off"],
		"no-unused-vars": ["warn"],
		"no-mixed-spaces-and-tabs": ["warn"],
		"node/no-unpublished-require": ["off"],
		"@typescript-eslint/ban-ts-comment": "off",
	},
};
