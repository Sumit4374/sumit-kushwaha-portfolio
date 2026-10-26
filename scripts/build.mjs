/** Build a public-only static directory with no third-party dependencies. */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://sumit-kushwaha.dev';
const pages = ['index.html'];
async function collect(directory) {
  for (const item of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.posix.join(directory, item.name);
    if (item.isDirectory()) await collect(relative);
    else if (item.name === 'index.html') pages.push(relative);
  }
}
await collect('projects');
const locations = [];
for (const page of pages.sort()) {
  const html = await readFile(path.join(root, page), 'utf8');
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
for (const item of ['index.html', '404.html', 'styles.css', 'script.js', 'assets', 'projects', 'sitemap.xml', 'robots.txt']) {
  await cp(path.join(root, item), path.join(output, item), { recursive: true });
}
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
