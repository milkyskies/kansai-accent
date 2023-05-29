import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import viteCompression from "vite-plugin-compression";

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		"process.env.VITE_BUILD_TIME": JSON.stringify(new Date().toISOString()),
	},
	plugins: [imagetools(), sveltekit(), viteCompression()],
};

export default config;
