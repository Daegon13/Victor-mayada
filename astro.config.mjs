import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
const settings = JSON.parse(readFileSync(new URL('./public/site-config.json', import.meta.url), 'utf8'));
export default defineConfig({
  output: 'static',
  site: settings.siteUrl || 'http://localhost:4321',
  trailingSlash: 'never',
  build: { inlineStylesheets: 'auto' }
});
