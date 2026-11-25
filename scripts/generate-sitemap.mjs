// Writes public/sitemap.xml from the design catalogue (run: npm run sitemap).
// Bundles the TypeScript data files with esbuild, so the list never goes out of date.
import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';

const SITE = 'https://invitations.velouraone.in';
const result = await build({
  stdin: {
    contents: "export { WEDDING_TEMPLATES } from './src/app/data/wedding-templates.data'; export { WEDDING_WEBSITES } from './src/app/data/wedding-websites.data';",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  logLevel: 'silent',
});
const { WEDDING_TEMPLATES, WEDDING_WEBSITES } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));

const today = new Date().toISOString().slice(0, 10);
const url = (path, priority, freq = 'weekly') =>
  `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
const realistic = (d) => d.realistic || d.threeD;
const lines = [
  url('/', '1.0', 'daily'),
  url('/websites', '0.9', 'daily'),
  url('/templates', '0.9', 'daily'),
  ...WEDDING_WEBSITES.map((d) => url(`/websites/${d.slug}`, realistic(d) ? '0.8' : '0.7', 'monthly')),
  ...WEDDING_TEMPLATES.map((d) => url(`/templates/${d.slug}`, '0.6', 'monthly')),
];
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml: ${lines.length} URLs`);
