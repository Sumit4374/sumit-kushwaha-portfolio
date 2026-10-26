/** Build-time-only content rendering. No GitHub requests, credentials, or browser data. */
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const root = new URL('../', import.meta.url);
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const icon = name => `<svg aria-hidden="true" focusable="false"><use href="#icon-${name}"/></svg>`;

export function validateContent(content) {
  assert.equal(content.professional.domain, 'https://sumit-kushwaha.dev', 'Keep the official canonical origin');
  const approved = new Set(content.approvedRepositories);
  assert.equal(approved.size, 6, 'Exactly six explicitly approved repositories are required');
  assert.equal(content.featuredProjects.length, 3, 'Keep three featured cards');
  assert.equal(content.secondaryProjects.length, 3, 'Keep three secondary cards');
  const projects = [...content.featuredProjects, ...content.secondaryProjects];
  assert.equal(new Set(projects.map(project => project.id)).size, 6, 'Project IDs must be unique');
  assert.equal(new Set(projects.map(project => project.repository)).size, 6, 'Repository selections must be unique');
  for (const project of projects) {
    assert(approved.has(project.repository), 'A displayed project is outside the explicit allowlist');
    assert(/^[\w.-]+$/.test(project.repository), 'Repository must be a single name, not a URL or query');
    assert(/^[a-z0-9-]+$/.test(project.id), 'Project IDs must be stable URL-safe names');
    if (project.detailPath) assert.equal(project.detailPath, `/projects/${project.id}/`, 'Detail path must match approved project');
    if (project.titleLines) assert.equal(project.titleLines.join(' '), project.title);
    if (project.deploymentUrl) assert.equal(new URL(project.deploymentUrl).protocol, 'https:');
  }
  assert.equal(content.featuredProjects.find(project => project.repository === 'Concurrent-Message-Broker')?.title, 'Concurrent Message Broker');
  assert.equal(content.research.length, 2, 'Keep the two verified paper summaries');
  assert.equal(content.patents.count, 2);
  assert.equal(content.patents.status, 'Applications filed', 'Do not imply patent grants');
  assert.equal(content.patents.applications.length, content.patents.count);
  for (const record of [...content.research, ...content.patents.applications]) {
    if (record.urlVerified) assert(record.url && new URL(record.url).protocol === 'https:', 'Verified public records require a real HTTPS URL');
  }
  assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.professional.email));
  return content;
}

export async function loadContent() {
  return validateContent(JSON.parse(await readFile(new URL('portfolio.content.json', root), 'utf8')));
}

function region(html, key, replacement) {
  const pattern = new RegExp(`(<!-- content:${escapeRegex(key)} -->)[\\s\\S]*?(<!-- /content:${escapeRegex(key)} -->)`, 'g');
  let count = 0;
  const result = html.replace(pattern, (_, start, end) => { count++; return `${start}${replacement}${end}`; });
  assert.equal(count, 1, `Expected exactly one content slot: ${key}`);
  return result;
}

function verifiedTitle(record) {
  const title = escapeHtml(record.title);
  return record.urlVerified ? `<a href="${escapeHtml(record.url)}" target="_blank" rel="noopener noreferrer">${title}</a>` : title;
}

export function assertApprovedLinks(html, content) {
  const base = content.professional.social.github + '/';
  const repositories = [...html.matchAll(new RegExp(`${escapeRegex(base)}([^\\s"<>?#/]+)`, 'g'))].map(match => match[1]);
  for (const repository of repositories) assert(content.approvedRepositories.includes(repository), 'Public output contains an unapproved repository URL');
  assert(!/[?&](?:amp;)?tab=repositories/.test(html), 'Do not publish repository-inventory links');
}

export function renderHomepage(html, content) {
  validateContent(content);
  const e = escapeHtml;
  const person = content.professional;
  const projects = [...content.featuredProjects, ...content.secondaryProjects];
  const byId = new Map(projects.map(project => [project.id, project]));
  html = region(html, 'title', `<title>${e(content.seo.title)}</title>`);
  html = region(html, 'description', `<meta name="description" content="${e(content.seo.description)}" />`);
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Person', '@id': `${person.domain}/#person`, name: person.name, url: `${person.domain}/`, jobTitle: person.primaryRole,
        sameAs: Object.values(person.social), alumniOf: { '@type': 'CollegeOrUniversity', name: person.education.institution }, knowsAbout: person.expertise },
      { '@type': 'WebSite', '@id': `${person.domain}/#website`, name: `${person.name} | Portfolio`, url: `${person.domain}/`, publisher: { '@id': `${person.domain}/#person` } }
    ]
  };
  html = region(html, 'identity-schema', `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`);
  html = region(html, 'hero-identity', `<h1 id="hero-heading" class="hero-identity">${e(person.name)} <span>${e(person.primaryRole)} | ${e(person.specialization)}</span></h1>`);
  html = html.replace(/(<div class="hero-eyebrow"><span class="signal-dot"><\/span> )[^<]+/, '$1JAVA BACKEND DEVELOPER ');
  const highlight = content.engineeringHighlight;
  html = region(html, 'engineering-highlight', `<div class="metric"><span class="metric-number">${e(highlight.value)}<span>${e(highlight.suffix)}</span></span><span class="metric-label">${highlight.lines.map(e).join('<br/>')}</span></div>`);
  for (const project of content.featuredProjects) {
    const title = (project.titleLines || [project.title]).map(e).join('<br/>');
    const story = `<h3>${title}<span class="dot">.</span></h3><p>${e(project.description)}</p><div class="project-highlights">${project.highlights.map(value => `<span>${e(value)}</span>`).join('')}</div>`;
    const links = `<a class="project-link" data-repository-project="${project.id}" href="${person.social.github}/${project.repository}" target="_blank" rel="noopener noreferrer"><span class="sr-only">${e(project.title)}: </span>EXPLORE REPOSITORY ${icon('arrow-up-right')}</a><a class="project-link project-detail-link" href="${project.detailPath}">READ ENGINEERING NOTES <span class="sr-only">for ${e(project.title)}</span> ${icon('arrow-right')}</a>`;
    const body = project.id === 'ai-engineering-agent-platform'
      ? `<div class="project-topline"><span class="project-index">01 / FEATURED PROJECT</span><span class="project-category">AI ENGINEERING</span></div><div><span class="project-mini-title">${e(project.eyebrow)}</span>${story}</div>${links}`
      : `<p class="project-mini-title">${e(project.eyebrow)}</p>${story}${links}`;
    html = region(html, `project-${project.id}`, body);
  }
  for (const project of content.secondaryProjects) {
    const footer = project.deploymentVerified && project.deploymentUrl
      ? `<a class="mini-demo" href="${e(project.deploymentUrl)}" target="_blank" rel="noopener noreferrer">OPEN LIVE DEMO ↗</a>`
      : project.footer ? `<span class="mini-demo">${e(project.footer)}</span>` : '';
    html = region(html, `secondary-${project.id}`, `<span class="mini-number">${e(project.category)}</span><h3>${e(project.title)}</h3><p>${e(project.description)}</p><span class="mini-tech">${e(project.technologies)}</span>${footer}`);
  }
  html = html.replace(/<a\b[^>]*data-repository-project="([^"]+)"[^>]*>/g, (tag, id) => {
    const project = byId.get(id);
    assert(project, 'Source link points outside approved project slots');
    tag = tag.replace(/href="[^"]*"/, `href="${person.social.github}/${project.repository}"`);
    if (tag.includes('aria-label=')) tag = tag.replace(/aria-label="[^"]*"/, `aria-label="${e(project.title)} source code"`);
    return tag;
  });
  const papers = content.research.map(paper => `<div><span>${e(paper.label)}</span><p>${e(paper.status)} <strong>${verifiedTitle(paper)}</strong> at ${e(paper.conference)} ${paper.year}.${paper.researchArea ? ` Research area: ${e(paper.researchArea)}.` : ''}</p></div>`).join('');
  const patentLinks = content.patents.applications.filter(application => application.urlVerified).map((application, index) => ` <a href="${e(application.url)}" target="_blank" rel="noopener noreferrer">${e(application.title || `Public application ${index + 1}`)}</a>.`).join('');
  html = region(html, 'research', `<div class="research-list">${papers}<div><span>03 / INTELLECTUAL PROPERTY</span><p>Filed <strong>two patent applications</strong> in ${e(content.patents.researchAreas.join(' and '))}.${patentLinks}</p></div></div>`);
  html = html.replace(/<a\b[^>]*data-profile="([^"]+)"[^>]*>/g, (tag, profile) => {
    assert(person.social[profile]);
    return tag.replace(/href="[^"]*"/, `href="${e(person.social[profile])}"`);
  });
  html = html.replace(/<a\b[^>]*data-contact="email"[^>]*>/g, tag => {
    const subject = tag.match(/href="mailto:[^"?]+(\?[^\"]*)"/)?.[1] || '';
    return tag.replace(/href="[^"]*"/, `href="mailto:${e(person.email)}${subject}"`);
  });
  html = html.replace(/(<a\b[^>]*class="contact-email"[^>]*>)[^<]+/, (_, start) => start + e(person.email));
  html = html.replace(/<a\b[^>]*data-contact="resume"[^>]*>/g, tag => tag.replace(/href="[^"]*"/, `href="${e(person.resume)}"`));
  html = html.replace(/<button\b[^>]*data-contact="email-copy"[^>]*>/g, tag => tag.replace(/ data-email="[^"]*"/, '').replace('data-contact="email-copy"', `data-contact="email-copy" data-email="${e(person.email)}"`));
  html = html.replace(/(<meta name="author" content=")[^"]+/, (_, start) => start + e(person.name));
  for (const [attribute, value] of [['og:title', content.seo.socialTitle], ['og:description', content.seo.socialDescription], ['twitter:title', content.seo.socialTitle], ['twitter:description', content.seo.socialDescription]]) {
    html = html.replace(new RegExp(`(<meta (?:property|name)="${attribute}" content=")[^"]*`), (_, start) => start + e(value));
  }
  html = html.replace(/B\.Tech · Expected [^<]+/, `B.Tech · Expected ${e(person.education.expectedGraduation)}`);
  html = html.replace(/Expected graduation: [^<]+\.<\/p>/, `Expected graduation: ${e(person.education.expectedGraduation)}.</p>`);
  assert(!html.includes('{{'), 'Unresolved content placeholder');
  assertApprovedLinks(html, content);
  return html;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv[2], '--write', 'Use node scripts/content.mjs --write to synchronize static content');
  const content = await loadContent();
  const file = new URL('index.html', root);
  await writeFile(file, renderHomepage(await readFile(file, 'utf8'), content));
  console.log('Synchronized the six approved project cards and verified identity/research content.');
}
