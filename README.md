# Sumit Kushwaha — Engineering Portfolio

Static HTML, CSS, and JavaScript portfolio for **Sumit Kushwaha**, Java Backend Developer | Distributed Systems | AI Engineering. Official origin: **https://sumit-kushwaha.dev**. The existing design, CSS architecture illustrations, six curated project cards, animations, and contact actions are retained. The all-repository inventory has been removed.

## Build, preview, and validate

Node.js and Python 3 are the only local tools required. No package installation or framework is needed.

```bash
node scripts/build.mjs
python3 scripts/check.py
node --test scripts/content.test.mjs
node --check script.js
python3 scripts/serve.py --port 8001
```

Open http://127.0.0.1:8001. In another terminal:

```bash
python3 scripts/check.py --url http://127.0.0.1:8001
python3 scripts/validate_schema.py
```

The optional schema check downloads the official Schema.org vocabulary and validates entity types, property domains, and explicitly typed object ranges. `check.py` additionally checks JSON syntax and entity references. This is not the hosted Schema Markup Validator or a Google rich-result eligibility test.

The build creates **`dist/`**, generates `sitemap.xml` from canonical `index.html` pages, and versions stylesheet/script URLs using content hashes. Publish **only `dist/`**. Source, documentation, tools, and Git metadata are excluded. `dist/` is ignored by Git. The preview server supplies the custom HTTP 404; Vercel applies the production redirects, cache settings, and headers itself.

## Content and file map

| File | Purpose |
| --- | --- |
| `index.html` | Homepage, verified identity, experience, education, project cards, single H1, social metadata, Person/WebSite JSON-LD |
| `styles.css` | Existing visual theme plus identity heading, static project notes, accessibility refinements |
| `portfolio.content.json` | Single build-time source for identity, six approved repositories, card content, research, patents, and contact links; never shipped to the browser |
| `scripts/content.mjs` | Validates the allowlist and fills marked static content slots without changing card shells or diagrams |
| `scripts/content.test.mjs` | Regression tests for strict curation, unverified-link suppression, contact data, and public-output boundaries |
| `script.js` | Existing menu, clipboard, and animation controls; no repository inventory or GitHub requests |
| `projects/concurrent-message-broker/index.html` | Ordering, persistence, recovery, backpressure, TCP, and limitations |
| `projects/flashscale/index.html` | Cache-aside flow, Redis ownership locks, shared rate limits, observability, and trade-offs |
| `projects/ai-engineering-agent-platform/index.html` | Ingestion, RAG retrieval, agents, security, events/streaming, and testing scope |
| `assets/Sumit_Kushwaha_Resume.pdf` | Existing resume download, retained unchanged |
| `assets/favicon.svg` | Existing favicon, retained unchanged |
| `assets/og-cover.svg`, `assets/og-cover.png` | Editable branding source and compatible 1200 × 630 social cover |
| `robots.txt`, `sitemap.xml` | Root crawler instructions and generated canonical URL list |
| `404.html` | Non-indexable missing-page response |
| `vercel.json` | Detected hosting provider’s build/output, path redirects, trailing slashes, cache/security headers |
| `scripts/build.mjs` | Dependency-free build and sitemap generation |
| `scripts/check.py` | Static and optional HTTP regression checks |
| `scripts/validate_schema.py` | Optional network-backed Schema.org vocabulary checks |
| `scripts/serve.py` | Local production-output preview |
| `docs/seo-audit.md` | Historical SEO audit and remaining deployment work |
| `docs/content-audit.md` | Current content curation, evidence, verification limits, and missing information |

## Edit approved content

Edit **`portfolio.content.json`**, then run `node scripts/build.mjs`. The build synchronizes marked regions in the checked-in homepage and emits complete static HTML. No browser-side fetch or hydration is needed. Keep the marker comments intact; their card shells and SVG/CSS illustrations remain hand-authored. To synchronize the homepage without packaging, run `node scripts/content.mjs --write`.

The configuration requires exactly three featured and three secondary projects, six unique repositories, and membership in `approvedRepositories`. All other repositories are excluded by default. Adding a repository to GitHub, a file under `projects/`, or an unrelated source entry cannot make it visible. Only configured flagship detail pages are copied into `dist/` and included in the canonical sitemap. A deliberate selection change requires editing the allowlist, the selected project, and its existing HTML slot together.

The previous inventory, count badge, archive search/filter, unavailable-source profile searches, and dead demo notice are removed. The replacement metric describes the broker’s durable I/O and crash recovery; the existing resume-backed automated-test and filed-application accomplishments remain.

Research uses exact configured titles. A paper or patent link renders only with an HTTPS URL **and** `urlVerified: true`; unverified placeholder URLs never enter public HTML. No deployment link renders without `deploymentVerified: true`. Do not set those flags without checking the actual record or deployment. Patent titles, application numbers, dates, and URLs remain null until confirmed public. No patent grant is claimed.

Project claims use the supplied resume and inspected public source. **Concurrent Message Broker** is the public title throughout. The AI platform’s 169+ tests are resume-reported, not a suite executed during this portfolio update. No throughput benchmarks or production adoption figures were added. See [the content audit](docs/content-audit.md) for sources and the verified ESP32 paper DOI.

## Deploy to the detected Vercel project — manual action

The existing open Vercel dashboard identified project **`sumit-kushwaha-portfolio`** in **`sumit4374s-projects`**. No deployment, push, DNS update, or remote configuration change was performed.

1. Review the changes locally and run the build and validation commands above.
2. Open the [existing Vercel project](https://vercel.com/sumit4374s-projects/sumit-kushwaha-portfolio). Confirm Settings → Git points to `Sumit4374/sumit-kushwaha-portfolio`, and check the actual production branch. Do not assume a branch name.
3. Under Settings → Build and Deployment, use **Other** as the framework, repository root as Root Directory, `node scripts/build.mjs` as Build Command, and `dist` as Output Directory. `vercel.json` already declares these values. Clear stale conflicting dashboard overrides. No install command is required.
4. When ready to deploy, commit and push to the branch connected to Vercel, or deploy a review branch first and promote after checks. A connected production-branch push can deploy automatically, so perform it only when deployment is intended.
5. Confirm the deployment output includes the homepage, all three project directories, `404.html`, root sitemap/robots, PDF, and PNG cover. There must be no SPA catch-all rewriting unknown paths to the homepage.
6. Complete the domain correction below before submitting URLs to Google.
7. Verify the live responses and metadata using the release checklist below. Local preview does not prove Vercel edge behavior.

See [Vercel project configuration](https://vercel.com/docs/project-configuration) and [deploying and redirecting domains](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

## Correct the canonical domain, DNS, and HTTPS — manual action

**Finding from the previous SEO audit (recheck before changing hosting):** the inspected dashboard had `sumit-kushwaha.dev` permanently redirecting **to `www.sumit-kushwaha.dev`**, while `www` serves Production. This is opposite the required canonical origin. An apex HTTP request also followed that redirect and failed to resolve `www` from the audit machine. This is an observed resolver failure, not proof of a global outage.

Use [the project’s Domains settings](https://vercel.com/sumit4374s-projects/sumit-kushwaha-portfolio/settings/domains):

1. Edit **`sumit-kushwaha.dev`** and change it from “Redirect to” to **Connect to an environment → Production**; save. The apex must serve the site first.
2. Edit **`www.sumit-kushwaha.dev`** and set **Redirect to → `sumit-kushwaha.dev`**, using **308 Permanent Redirect**; save. Preserve request paths and query parameters.
3. If desired, redirect the stable `sumit-kushwaha-portfolio.vercel.app` production alias to the apex too. Do not redirect all ephemeral preview URLs through a blanket hostname rule; use Vercel Preview Deployment Protection to keep unpublished previews private.
4. At **Name.com**, open My Domains → `sumit-kushwaha.dev` → DNS Records. Compare the apex A/ALIAS and `www` CNAME with the **current project-specific values shown by Vercel**. Copy those exact values if a correction is needed; do not use guessed IPs or old generic targets. Remove conflicting web A/AAAA/CNAME records only after confirming the correct replacement. Preserve mail and verification TXT records.
5. Keep both hostnames configured and wait for Vercel domain validation and certificate provisioning. Confirm a valid TLS certificate for both apex and `www`, including the redirecting hostname. `.dev` requires HTTPS in browsers; do not rely on an HTTP-only origin.
6. Vercel supplies HTTP → HTTPS redirects. Check both HTTP hostnames and both HTTPS hostnames: every route must terminate at `https://sumit-kushwaha.dev/<path>` without loops. The ideal is one redirect; if Vercel applies HTTP → HTTPS and then the domain redirect, document that edge-owned two-hop path and consider a single edge redirect rule only if eliminating it is needed.

**No hostname redirect was added in `vercel.json`:** adding `www` → apex in code before removing the existing apex → `www` dashboard redirect would risk a loop. The file only normalizes `/index.html`, project index-file aliases, and trailing slashes. Domain redirects are managed in the already-existing Vercel domain settings.

Check each origin without following redirects first, then follow to inspect the final URL:

```bash
curl -I http://sumit-kushwaha.dev/
curl -I http://www.sumit-kushwaha.dev/
curl -I https://sumit-kushwaha.dev/
curl -I https://www.sumit-kushwaha.dev/
curl -IL https://www.sumit-kushwaha.dev/projects/flashscale/
curl -I https://sumit-kushwaha.dev/sitemap.xml
curl -I https://sumit-kushwaha.dev/robots.txt
curl -I https://sumit-kushwaha.dev/assets/og-cover.png
curl -I https://sumit-kushwaha.dev/assets/Sumit_Kushwaha_Resume.pdf
curl -I https://sumit-kushwaha.dev/this-page-does-not-exist/
```

The apex and real project pages should return 200, duplicate origins should redirect permanently, and the missing page must return 404. Verify the PNG is publicly fetchable as `image/png` at 1200 × 630 and no production response has an accidental `X-Robots-Tag: noindex`. Inspect View Source to confirm canonical/JSON-LD/social tags without executing JavaScript.

## Google Search Console — manual access required

DNS verification and Search Console actions require your Name.com and Google account access. No verification token was provided or invented. After deployment and domain correction:

1. Open [Google Search Console](https://search.google.com/search-console/), choose **Add property → Domain**, and enter **`sumit-kushwaha.dev`** without protocol or path.
2. Copy the **exact Google-provided TXT verification value**. In Name.com DNS, add a TXT record for the root hostname (`@` or blank, following its UI convention). Paste the complete value, save, allow DNS propagation, and click **Verify** in Search Console. Keep the TXT record after verification; do not replace existing TXT records.
3. Open **Sitemaps** and submit **`https://sumit-kushwaha.dev/sitemap.xml`**. Confirm it is fetched successfully and contains the four canonical pages.
4. Use **URL Inspection** for `https://sumit-kushwaha.dev/`. Run **Test live URL**, inspect the fetched HTML, and confirm crawling/indexing are allowed.
5. Click **Request indexing** after the live test passes. Inspect each flagship project URL and request indexing where appropriate. Requests and sitemap submission do not guarantee indexing or a ranking.
6. After Google processes the site, inspect **Page indexing** and URL Inspection. Compare **User-declared canonical** with **Google-selected canonical**; both should be the apex URL for each page. Investigate redirects, duplicate pages, exclusions, or unexpected `www` selection.
7. In **Performance → Search results**, filter queries containing **Sumit Kushwaha**. Review impressions, clicks, CTR, and position across homepage/project URLs. Use a custom regex such as `(?i)sumit\s+kushwaha` if helpful. Interpret trends over time, rather than expecting immediate changes.
8. Use the [Schema Markup Validator](https://validator.schema.org/) on deployed URLs or pasted page source. Use Google’s [Rich Results Test](https://search.google.com/test/rich-results) for supported rich-result types; Person/WebSite/SoftwareSourceCode markup does not by itself imply a supported rich result.
9. Validate sharing through [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) after the new cover is live. Social platforms can cache old previews.

Google references: [add a Search Console property](https://support.google.com/webmasters/answer/34592), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Performance and accessibility

The site uses no external fonts, analytics, or runtime dependencies. Critical hero content and project notes are static HTML; there are no raster images on the rendered homepage to lazy-load. CSS diagrams retain their visuals, and icon SVGs are hidden from assistive technology. Content stays visible if the main script fails. Reduced-motion preferences disable animations and transitions; a pause/resume control also stops continuous motion. Focus indicators, skip links, mobile navigation, and Escape focus restoration are retained. The obsolete repository-inventory controls were intentionally removed.

Vercel serves compressed static responses and the configuration makes unversioned HTML/CSS/JS revalidate. Assets have a short one-hour browser cache rather than an unsafe immutable cache on mutable filenames. Preview-server cache and compression findings must be rechecked on Vercel.

Lighthouse can be run without adding a project dependency:

```bash
npx lighthouse http://127.0.0.1:8001/ --chrome-flags="--headless" --output=html --output-path=/tmp/portfolio-mobile.html
npx lighthouse http://127.0.0.1:8001/ --preset=desktop --chrome-flags="--headless" --output=html --output-path=/tmp/portfolio-desktop.html
```

See `docs/seo-audit.md` for actual measured scores and testing limitations. Lab scores do not establish field Core Web Vitals or real-user INP. No Google indexing success or live deployment is claimed.

## Release and SEO readiness checklist

- [x] Existing visual identity, card shells, diagrams, animations, and contact/navigation behavior retained.
- [x] Exactly six approved projects; no repository inventory, count, or runtime GitHub requests.
- [x] Editable research/patent configuration; only verified public links render.
- [x] Verified name, specialization, internship, expected June 2028 graduation, and resume-backed research.
- [x] One H1 and unique title/description per indexable page; self-referencing apex canonicals.
- [x] Person/WebSite IDs connected; project SoftwareSourceCode markup supported by visible content.
- [x] Three substantive static project pages linked from the homepage and each other.
- [x] Valid root sitemap and robots; no invented modification dates or verification token.
- [x] Absolute social metadata and a real 1200 × 630 PNG in the build.
- [x] Resume PDF retained; email, GitHub, LinkedIn, and LeetCode references preserved.
- [x] Accessible controls, reduced motion, pause option, custom noindex 404, public-only build.
- [x] Local build, static regression checks, and server-response checks passed.
- [ ] Complete desktop/tablet/mobile browser checks when local-page access is available; saved browser permissions currently block visual testing.
- [ ] Deploy the reviewed output to the existing Vercel project.
- [ ] Reverse the dashboard domain redirect; verify DNS, both TLS certificates, redirect paths, and real HTTP 404s.
- [ ] Verify the live sitemap/robots/PDF/PNG, canonical tags, social previews, and hosted schema validation.
- [ ] Verify Search Console ownership, submit sitemap, inspect canonical selection, and monitor indexing/performance.
- [ ] Add HealtHub’s official public record and patent details only when confirmed; verify any deployment link before adding it.

## Resume privacy

The existing PDF includes personal contact information beyond the email displayed on the site. It was retained unchanged. Review/redact the PDF yourself before deployment if you want less information published; no additional personal details were introduced into the HTML.
