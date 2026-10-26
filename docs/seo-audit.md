# Production and SEO audit — October 26, 2026

Historical SEO results from before the subsequent content-curation task. Current project selection, publication evidence, and validation limits are in [the content audit](content-audit.md). The old repository inventory was removed; its names and metadata are no longer retained in this report.

## Result and scope

Implemented directly in the existing static portfolio. No framework migration, runtime dependency, deployment, push, DNS update, account change, or Google submission was performed. Vercel was identified by the already-open project domain dashboard, not assumed from the GitHub remote. The preferred origin in all new source is `https://sumit-kushwaha.dev`.

## Findings and fixes

| Finding | Implemented correction |
| --- | --- |
| No homepage canonical; JSON-LD URL pointed to GitHub | Self-referencing apex canonicals; stable Person/WebSite identifiers and publisher connection |
| Generic title/description; hero H1 did not identify the developer | Requested title and description; visible name/specialization H1, original typographic hero artwork preserved |
| Relative SVG-only OG image; missing OG URL/Twitter metadata | Absolute OG/Twitter URLs, descriptive image alt, actual PNG 1200 × 630, existing visual identity retained |
| No root robots or sitemap | Allow-all public crawler policy and generated four-page canonical sitemap; no invented dates |
| Flagship projects linked only externally | Three substantive static notes pages, source-backed architecture/trade-offs, contextual internal links, SoftwareSourceCode markup |
| Below-fold reveal content could disappear if JS failed after the head class was added | Apply the reveal class only when observers are initialized; content visible by default |
| Continuous animation had no pause control | Pause/resume button and full reduced-motion CSS, including transitions and scroll behavior |
| Decorative icons exposed as unnamed images | Decorative SVGs hidden from assistive technology; unique project source link names |
| Some heading levels skipped; menu Escape did not restore focus | Project heading corrections and focus restoration to menu toggle |
| Logo accessible-name mismatch; desktop nav numbers slightly below contrast threshold | Natural logo accessible name and brighter nav-number color; these final edits have static validation but no browser rerun |
| Education omitted graduation month | Expected June 2028 visible in education/about content |
| Unknown routes had no branded missing-page artifact | Custom `404.html`, noindex, no misleading homepage fallback |
| Deploying the entire repository could expose non-public source files | Explicit public-only `dist/` build; Vercel output points there |
| Cache invalidation and host configuration undocumented | Content-versioned CSS/JS URLs, revalidation/short asset cache, Vercel configuration and release instructions |
| Repository inventory and old demo destinations | Superseded by strict six-project curation; no inventory, profile searches, count, or dead demo link remains |

The source already had correct language/encoding/viewport, useful semantic sections, a favicon, a valid PDF resume, verified social/email references, reduced-motion support, no external font requests, and lightweight CSS/SVG illustrations. Those features were preserved and extended.

## Content evidence

- Existing resume: `assets/Sumit_Kushwaha_Resume.pdf`, extracted locally with `pdftotext`. Internship, education, GPA, research, patents, and the AI platform test-count claim were checked against it. The PDF was not modified.
- [Concurrent Message Broker README](https://github.com/Sumit4374/Concurrent-Message-Broker/blob/main/README.md): partition ordering, bounded producer/network concurrency, framing, CRC checks, append-only storage, recovery, offsets/replay, and explicit educational/replication limits. The old name appearing upstream is not used as the public portfolio title.
- [FlashScale README](https://github.com/Sumit4374/FlashScale/blob/master/README.md): per-key ownership locks, double-check, bounded waits, errors, fixed-window fail-open limiting, metrics, tests, and limitations. No benchmark values were invented.
- The AI repository has no root README. Its public repository and tree were retrieved, followed by [ingestion service](https://github.com/Sumit4374/AI-Engineering-Agent-Platform/blob/master/ai_engineering/src/main/java/sumit/ai/ai_engineering/rag/ingestion/DocumentIngestionServiceImpl.java), [event consumer](https://github.com/Sumit4374/AI-Engineering-Agent-Platform/blob/master/ai_engineering/src/main/java/sumit/ai/ai_engineering/events/consumer/DocumentIngestionConsumer.java), and [retrieval implementation](https://github.com/Sumit4374/AI-Engineering-Agent-Platform/blob/master/ai_engineering/src/main/java/sumit/ai/ai_engineering/rag/retrieval/RagRetrievalServiceImpl.java). Visible page content stays within that source and the supplied resume. Its own Java tests were not executed as part of this portfolio task.

## Validation performed

| Check | Result |
| --- | --- |
| `node scripts/build.mjs` | Passed; four canonical pages, generated sitemap, public-only output |
| `python3 scripts/check.py` | Passed; titles/descriptions/H1s/heading order, canonical/social tags, local links/fragments, JSON-LD identity references, robots/sitemap, PNG dimensions and PDF signature |
| `node --check script.js`, `node --check scripts/build.mjs` | Passed |
| `git diff --check` | Passed |
| `python3 scripts/check.py --url http://127.0.0.1:8001` | Passed before the final logo-label/color edits; all indexable pages static and HTTP 200, correct MIME types, noindex custom HTTP 404 |
| Schema.org vocabulary check | Passed: nine typed entities across four pages; types, property domains, typed-object ranges; syntax/reference assertions also passed |
| Hosted Schema Markup Validator / Google Rich Results Test | Not run; documented as release checks |
| Browser console | No warnings or errors in the captured homepage logs |
| Browser interactions | Mobile menu, Escape focus restoration, repository search, language filters, no-results state, pause button, and internal broker-page navigation passed |
| Resume | Valid retained PDF; HTTP 200 and `application/pdf` verified. Browser download was canceled, so a completed browser download is not claimed |
| Responsive review | 390px homepage screenshot reviewed; 320px homepage viewport measured without document horizontal overflow; broker-page navigation passed at 320px |

Further browser inspection was stopped when the local-origin permission gate reported that access had been declined. No alternate browser mechanism was used to bypass that decision. The temporary viewport override was reset. Further project screenshots, tablet layouts, reduced-motion emulation, a completed browser resume download, and post-fix Lighthouse remain manual checks.

### Measured Lighthouse 13.5.0 results

These are **local lab results**, collected before the final small logo-label and navigation-color edits. They are not scores from the deployed domain. The local Python server does not provide Vercel’s compression/cache headers.

| Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 100 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms |
| Desktop | 100 | 96 | 100 | 100 | 0.3 s | 0 | 0 ms |

Desktop contrast findings were limited to the tiny navigation numbers. Their color was corrected after the report. A logo visible-text/accessibility-name finding was also corrected. Browser access ended before a new report could measure those final edits. The initial separate mobile Lighthouse pass also scored 100 in all four categories.

Lighthouse cannot establish real-user INP; field Core Web Vitals and Vercel network behavior need post-deployment measurement. Render-blocking CSS is intentionally retained for a stable first paint rather than introducing an unstyled-content flash to chase a lab insight.

Raw local reports, when still present in this session: `/tmp/portfolio-mobile-final.report.html`, `/tmp/portfolio-desktop-final.report.html` and matching `.json` files. Persistent concise evidence is in `docs/validation-results.json`.

## Public link and infrastructure observations

The current content audit validates only the explicitly selected repositories and profile/publication links. Previous inventory metadata has been removed from the persisted results. GitHub discovery and all-repository API calls are not part of the build or runtime.

At the previous hosting inspection, Vercel showed apex → `www` using 308 while `www` served Production. That remote state was not changed or rechecked during content curation. Follow the README’s manual domain-verification steps before making any hosting change. No deployment, DNS change, or indexing success is claimed.

## Remaining work, ordered by impact

1. **Correct domain routing and verify DNS/TLS.** Serve Production on the apex, then redirect `www` permanently to the apex. Current dashboard routing conflicts with every requested canonical. Follow README steps in that order to avoid loops. Keep mail/TXT records intact.
2. **Deploy the reviewed build to the existing Vercel project.** Verify the actual output root, response codes, duplicate-origin/index-file redirects, and public sitemap/robots/PDF/PNG. Prevent accidental preview indexing using Vercel Preview Deployment Protection.
3. **Complete Search Console ownership and indexing checks.** Use the real DNS TXT token, submit the sitemap, inspect all four pages, and confirm Google-selected canonicals. No ranking or indexing outcome is guaranteed.
4. **Finish browser/live validation.** Repeat mobile/desktop Lighthouse after the two final accessibility edits; check tablet widths, reduced-motion behavior, project-page layouts, browser downloads, social caches, and the hosted schema validator. Measure field Core Web Vitals once traffic supplies data.
5. **Restore public evidence where appropriate.** Add a deployment URL only after it is verified for an approved project. Keep the official apex portfolio linked consistently in GitHub, LinkedIn, and LeetCode profiles through manual profile edits; no external profile was changed.
6. **Maintain factual content.** Refresh the curated selection, resume, project details, and expected-graduation wording as real changes occur. Add no unsupported metrics, credentials, or thin pages.

Exact deployment, Name.com DNS/HTTPS, Search Console steps, and the release checklist are in [README](../README.md).
