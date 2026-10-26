import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { assertApprovedLinks, loadContent, renderHomepage, root, validateContent } from './content.mjs';

const content = await loadContent();
const html = await readFile(new URL('index.html', root), 'utf8');
const clone = () => structuredClone(content);

test('a newly discovered repository cannot enter an approved project slot', () => {
  const changed = clone();
  changed.secondaryProjects[0].repository = 'unapproved-example';
  assert.throws(() => validateContent(changed), /outside the explicit allowlist/);
  changed.approvedRepositories.push('unapproved-example');
  assert.throws(() => validateContent(changed), /Exactly six/);
});

test('duplicate selections cannot disguise an extra or missing project', () => {
  const changed = clone();
  changed.secondaryProjects[0].repository = changed.featuredProjects[0].repository;
  assert.throws(() => validateContent(changed), /selections must be unique/);
});

test('unverified publication and deployment URLs never become public links', () => {
  const changed = clone();
  changed.research[1].url = 'https://example.com/unverified-paper';
  changed.secondaryProjects[0].deploymentUrl = 'https://example.com/unverified-demo';
  const rendered = renderHomepage(html, changed);
  assert(!rendered.includes('example.com'));
  assert(!rendered.includes('OPEN LIVE DEMO'));
  changed.research[1].urlVerified = true;
  assert(renderHomepage(html, changed).includes('href="https://example.com/unverified-paper"'));
});

test('patent placeholders do not publish unknown titles, numbers, dates, or links', () => {
  const changed = clone();
  changed.patents.applications[0] = { title: 'Unverified draft', applicationNumber: 'DRAFT-NUMBER', filingDate: 'DRAFT-DATE', url: 'https://example.com/draft', urlVerified: false };
  const rendered = renderHomepage(html, changed);
  for (const token of ['Unverified draft', 'DRAFT-NUMBER', 'DRAFT-DATE', 'example.com']) assert(!rendered.includes(token));
  assert(rendered.includes('two patent applications'));
  changed.patents.status = 'Granted';
  assert.throws(() => validateContent(changed), /Do not imply patent grants/);
});

test('the configured six cards render as static HTML with no inventory', () => {
  const rendered = renderHomepage(html, content);
  const ids = [...rendered.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 6);
  assert.deepEqual(new Set(ids), new Set([...content.featuredProjects, ...content.secondaryProjects].map(project => project.id)));
  assert.equal((rendered.match(/class="project-card /g) || []).length, 3);
  assert.equal((rendered.match(/class="mini-project reveal"/g) || []).length, 3);
  assert(!/repoDrawer|repoCount|toggleRepos|BROWSE ALL REPOSITORIES|[?&](?:amp;)?tab=repositories/.test(rendered));
  assert(!/\d+\s*(?:public\s+)?repositories/i.test(rendered));
  assert(!/minikafka/i.test(rendered));
  assert.equal(rendered, html, 'The checked-in static source must be synchronized with the configuration');
});

test('contact and resume actions use the approved configuration', () => {
  const changed = clone();
  changed.professional.email = 'contact@example.com';
  const rendered = renderHomepage(html, changed);
  assert(!rendered.includes(content.professional.email));
  assert(rendered.includes('mailto:contact@example.com'));
  assert(rendered.includes('data-email="contact@example.com"'));
  assert(rendered.includes(`href="${content.professional.resume}" download=`));
  const script = readFile(new URL('script.js', root), 'utf8');
  return script.then(source => {
    assert(!/\bfetch\s*\(|XMLHttpRequest|api\.github\.com|const repositories|renderRepositories/.test(source));
    assert(source.includes('copyButton.dataset.email'));
  });
});

test('the public build excludes configuration/tools and every unapproved source URL', async () => {
  const directory = new URL('dist/', root);
  const files = await readdir(directory, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (!file.isFile()) continue;
    assert(!['portfolio.content.json', 'content.mjs', 'content.test.mjs'].includes(file.name));
    if (!/\.(?:html|js|json|xml|txt)$/.test(file.name)) continue;
    const source = await readFile(`${file.parentPath}/${file.name}`, 'utf8');
    assertApprovedLinks(source, content);
    assert(!source.includes('unapproved-example'));
  }
});
