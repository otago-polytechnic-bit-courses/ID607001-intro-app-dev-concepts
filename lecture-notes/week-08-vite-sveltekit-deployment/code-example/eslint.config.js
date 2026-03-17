import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	[
		includeIgnoreFile(gitignorePath),
		js.configs.recommended,
		svelte.configs.recommended,
		{
			languageOptions: { globals: { ...globals.browser, ...globals.node } }
		},

		{
			files: ['**/*.svelte', '**/*.svelte.js'],
			languageOptions: { parserOptions: { svelteConfig } }
		}
	],
	prettier,
	svelte.configs.prettier
);
