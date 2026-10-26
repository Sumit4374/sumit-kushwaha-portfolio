/** Build a public-only static directory with no third-party dependencies. */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { assertApprovedLinks, loadContent, renderHomepage } from './content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://sumit-kushwaha.dev';
const content = await loadContent();
// Only explicitly selected project pages are eligible for publication.
const pages = ['index.html', ...content.featuredProjects.filter(project => project.detailPath).map(project => project.detailPath.slice(1) + 'index.html')];
const homepage = renderHomepage(await readFile(path.join(root, 'index.html'), 'utf8'), content);
await writeFile(path.join(root, 'index.html'), homepage);
const locations = [];
for (const page of pages.sort()) {
  const html = await readFile(path.join(root, page), 'utf8');
  assertApprovedLinks(html, content);
  if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) continue;
  const url = origin + '/' + page.replace(/index\.html$/, '');
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  if (canonicals.length !== 1 || canonicals[0][1] !== url) {
    throw new Error(`Expected one self-referencing canonical for ${page}: ${url}`);
  }
  locations.push(url);
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  locations.map(url => `  <url><loc>${url}</loc></url>`).join('\n') + '\n</urlset>\n';
await writeFile(path.join(root, 'sitemap.xml'), sitemap);
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const item of ['index.html', '404.html', 'styles.css', 'script.js', 'assets', 'sitemap.xml', 'robots.txt']) {
  await cp(path.join(root, item), path.join(output, item), { recursive: true });
}
for (const page of pages.filter(page => page !== 'index.html')) {
  const target = path.join(output, page);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(path.join(root, page), target);
}
assertApprovedLinks(await readFile(path.join(root, 'script.js'), 'utf8'), content);
// Content-versioned queries invalidate browser/CDN caches when CSS or JS changes.
const versions = {};
for (const asset of ['styles.css', 'script.js']) {
  versions[asset] = createHash('sha256').update(await readFile(path.join(root, asset))).digest('hex').slice(0, 12);
}
for (const page of [...pages, '404.html']) {
  const target = path.join(output, page);
  const html = (await readFile(target, 'utf8')).replace(/\/(styles\.css|script\.js)(?:\?v=[a-z0-9]+)?/g,
    (_, asset) => `/${asset}?v=${versions[asset]}`);
  await writeFile(target, html);
}
console.log(`Built dist/: ${locations.length} canonical pages; sitemap generated without speculative dates.`);
