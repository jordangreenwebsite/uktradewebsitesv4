import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://uktradewebsites.co.uk',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (url) => !new URL(url).pathname.startsWith('/concept-websites/') && !url.endsWith('/thank-you/') && !url.endsWith('/404/') && !url.endsWith('/404.html') })],
});
