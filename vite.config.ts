import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: {
				cssHash: ({ hash, css, name, filename }) => `${name.toLowerCase()}-${hash(css)}${hash(filename)}`
			},
			adapter: adapter()
		}),

		Icons({
			compiler: 'svelte',
			customCollections: {
				'custom': FileSystemIconLoader('./static/icons')
			}
		}),
		tailwindcss(),
	],
	server: {
		cors: {
			origin: '*'
		},
		watch: {
			ignored: ["node_modules/**", ".yarn/**", ".svelte-kit/**", "**.md", "static/**"],
			usePolling: true,
			interval: 2000, // Ogni 2 secondi
		}
	},
});
