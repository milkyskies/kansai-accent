/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	content: ["./src/**/*.svelte", "./src/**/*.html"],
	theme: {
		extend: {
			colors: {
				ws: "#7D69AC",
			},
			fontFamily: {
				sans: ["open-sans", ...defaultTheme.fontFamily.sans],
			},
			screens: {
				"2xs": "350px",
				xs: "410px",
				"2xl": "1536px",
			},
		},
	},
	variants: {},
	plugins: [],
};
