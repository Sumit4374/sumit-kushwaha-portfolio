#!/usr/bin/env python3
"""Dependency-free regression checks for the generated, crawlable public site."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct
from urllib.parse import urlsplit, unquote
from urllib.request import urlopen
from urllib.error import HTTPError
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'dist'
ORIGIN = 'https://sumit-kushwaha.dev'
PROFILES = {'https://github.com/Sumit4374', 'https://www.linkedin.com/in/sumit-kushwaha-a97238331', 'https://leetcode.com/u/SumitKush1323/'}

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.headings = []
        self.schema = []
        self.in_schema = False
        self.schema_text = ''
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if re.fullmatch(r'h[1-6]', tag): self.headings.append(int(tag[1]))
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_schema = True
            self.schema_text = ''
    def handle_data(self, data):
        if self.in_schema: self.schema_text += data
    def handle_endtag(self, tag):
        if tag == 'script' and self.in_schema:
            self.schema.append(json.loads(self.schema_text))
            self.in_schema = False
    def find(self, tag, **attrs):
        return [a for t, a in self.tags if t == tag and all(a.get(k) == v for k, v in attrs.items())]

parser = argparse.ArgumentParser()
parser.add_argument('--url', help='Also test server-delivered HTML, public files, and HTTP 404 behavior.')
args = parser.parse_args()
assert ROOT.is_dir(), 'Run node scripts/build.mjs first'
pages = sorted([ROOT / 'index.html', *ROOT.glob('projects/**/index.html')])
expected = {ORIGIN + '/' + p.relative_to(ROOT).as_posix().removesuffix('index.html') for p in pages}
metadata = {'title': set(), 'description': set()}
for page in pages + [ROOT / '404.html']:
    doc = Document(page.read_text())
    relative = page.relative_to(ROOT).as_posix()
    assert len(doc.find('title')) == 1, relative
    assert len(doc.find('h1')) == 1, relative
    assert doc.find('html', lang='en'), relative
    assert len(doc.find('meta', charset='UTF-8')) == 1, relative
    assert len(doc.find('meta', name='viewport')) == 1, relative
    descriptions = doc.find('meta', name='description')
    assert len(descriptions) == 1 and descriptions[0]['content'], relative
    assert descriptions[0]['content'] not in metadata['description'], relative
    metadata['description'].add(descriptions[0]['content'])
    title = re.search(r'<title>(.*?)</title>', page.read_text(), re.S)[1]
    assert title not in metadata['title'], relative
    metadata['title'].add(title)
    for previous, current in zip(doc.headings, doc.headings[1:]):
        assert current <= previous + 1, f'{relative}: heading jumps from {previous} to {current}'
    ids = [a['id'] for _, a in doc.tags if 'id' in a]
    assert len(ids) == len(set(ids)), f'Duplicate IDs in {relative}'
    for tag, attrs in doc.tags:
        for attribute in ('href', 'src'):
            value = attrs.get(attribute, '')
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not value: continue
            target = ROOT / unquote(parsed.path.lstrip('/')) if parsed.path.startswith('/') else page.parent / unquote(parsed.path)
            if not parsed.path: target = page
            if target.is_dir(): target /= 'index.html'
            assert target.is_file(), f'{relative}: missing {value}'
            if parsed.fragment and target.suffix == '.html':
                assert parsed.fragment in [a.get('id') for _, a in Document(target.read_text()).tags], f'{relative}: missing anchor {value}'
        if tag == 'a' and attrs.get('target') == '_blank':
            assert {'noopener', 'noreferrer'} <= set(attrs.get('rel', '').split()), relative
        if tag == 'svg': assert attrs.get('aria-hidden') == 'true', f'{relative}: decorative SVG announced'
    if relative == '404.html':
        assert doc.find('meta', name='robots', content='noindex')
        assert not doc.find('link', rel='canonical')
        continue
    url = ORIGIN + '/' + relative.removesuffix('index.html')
    assert doc.find('link', rel='canonical') == [{'rel': 'canonical', 'href': url}], relative
    assert not any('noindex' in a.get('content', '') for a in doc.find('meta', name='robots')), relative
    for prop in ['og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']:
        assert len(doc.find('meta', property=prop)) == 1, f'{relative}: {prop}'
    assert doc.find('meta', property='og:url')[0]['content'] == url
    assert doc.find('meta', property='og:image')[0]['content'] == ORIGIN + '/assets/og-cover.png'
    assert doc.find('meta', name='twitter:card')[0]['content'] == 'summary_large_image'
    assert doc.find('meta', name='twitter:image')[0]['content'] == ORIGIN + '/assets/og-cover.png'
    assert doc.find('meta', name='twitter:image:alt')[0]['content']
    assert len(doc.schema) == 1 and doc.schema[0]['@context'] == 'https://schema.org', relative
    graph = doc.schema[0]['@graph']
    graph_ids = {node['@id'] for node in graph}
    assert len(graph_ids) == len(graph), relative
    for node in graph:
        assert node['@id'].startswith(ORIGIN), relative
        for prop in ('author', 'publisher'):
            if prop in node: assert node[prop]['@id'] in graph_ids, relative
    if relative == 'index.html':
        person = next(n for n in graph if n['@type'] == 'Person')
        assert person['name'] == 'Sumit Kushwaha' and person['url'] == ORIGIN + '/'
        assert person['jobTitle'] == 'Java / Spring Boot Backend Developer' and set(person['sameAs']) == PROFILES
        assert next(n for n in graph if n['@type'] == 'WebSite')['publisher']['@id'] == person['@id']
        for profile in PROFILES: assert doc.find('a', href=profile), profile
        assert 'Concurrent Message Broker' in page.read_text()
        assert not re.search('minikafka', page.read_text(), re.I)
    else:
        code = next(n for n in graph if n['@type'] == 'SoftwareSourceCode')
        assert code['url'] == url and code['programmingLanguage'] == 'Java'
        assert doc.find('a', href=code['codeRepository'])

sitemap = ET.parse(ROOT / 'sitemap.xml')
assert sitemap.getroot().tag == '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset'
locations = [n.text for n in sitemap.findall('.//{*}loc')]
assert len(locations) == len(set(locations)) and set(locations) == expected
assert not sitemap.findall('.//{*}lastmod'), 'Add dates only with verified page modification dates'
robots = RobotFileParser()
robots.parse((ROOT / 'robots.txt').read_text().splitlines())
assert robots.site_maps() == [ORIGIN + '/sitemap.xml']
for path in ['/', '/styles.css', '/script.js', '/assets/og-cover.png', *[url.removeprefix(ORIGIN) for url in locations]]:
    assert robots.can_fetch('Googlebot', ORIGIN + path), path
png = (ROOT / 'assets/og-cover.png').read_bytes()
assert png[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II', png[16:24]) == (1200, 630)
assert (ROOT / 'assets/Sumit_Kushwaha_Resume.pdf').read_bytes().startswith(b'%PDF-')
assert not any((ROOT / path).exists() for path in ['.git', '.codex', 'README.md', 'scripts', 'docs', 'vercel.json', 'portfolio.content.json'])
print(f'PASS: {len(pages)} canonical pages, headings, metadata, local links/fragments, JSON-LD identity references, robots, sitemap, social image, resume, and public-only output.')
if args.url:
    base = args.url.rstrip('/')
    for url in sorted(expected):
        path = url.removeprefix(ORIGIN)
        with urlopen(base + path) as response:
            assert response.status == 200
            doc = Document(response.read().decode())
            assert doc.find('link', rel='canonical')[0]['href'] == url
            if '/projects/' in path: assert len(doc.headings) >= 5, path
    for path, mime in [('/robots.txt', 'text/plain'), ('/sitemap.xml', 'xml'), ('/assets/og-cover.png', 'image/png'), ('/assets/Sumit_Kushwaha_Resume.pdf', 'application/pdf')]:
        with urlopen(base + path) as response:
            assert response.status == 200 and mime in response.headers['Content-Type'], path
    try:
        urlopen(base + '/this-page-does-not-exist/')
        raise AssertionError('Missing page incorrectly returns HTTP 200')
    except HTTPError as error:
        assert error.code == 404
        assert Document(error.read().decode()).find('meta', name='robots', content='noindex')
    print('PASS: server-delivered canonical HTML, static project content, robots/sitemap, PNG/PDF MIME types, and custom HTTP 404.')
