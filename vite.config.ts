import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const config = defineConfig({
	plugins: [
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		devtools(),
		tsconfigPaths({ projects: ['./tsconfig.json'] }),
		tailwindcss(),
		viteReact()
	],
	server: {
		port: 3000,
		host: true
	}
});

export default config;
