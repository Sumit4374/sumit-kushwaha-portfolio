# Content curation — October 26, 2026

## What changed

This was a content and selection update. `styles.css` is byte-for-byte unchanged. The same hero, featured-card arrangement, architecture diagrams, secondary-card shells and SVGs, research panel, header, footer, and contact layout remain. Content can wrap differently where the text changed; no typography, spacing rules, colors, hover effects, transitions, animation, breakpoint, or scrolling rules were changed.

- Removed the entire all-repository inventory, explorer, archive filters, source-availability placeholders, repository count, and profile-inventory links. Runtime JavaScript now handles only existing navigation, clipboard, and motion behavior.
- Added `portfolio.content.json` as a build-time source for identity, explicit repository approval, card descriptions, research, patent placeholders, and contact/social data. It is not published or embedded in a browser bundle.
- Added validation that requires exactly three featured and three secondary projects, unique selections, and explicit allowlist membership. The build makes no GitHub requests and publishes only configured flagship detail pages. Newly created GitHub repositories or unrelated local project directories cannot become portfolio content automatically.
- Replaced the unselected secondary card with GetSocial Microservices using the same icon/card markup. Updated E-Commerce to describe its actual catalog backend. Removed the dead demo notice; its existing text slot now states a verified engineering feature.
- Replaced the inventory statistic with the broker’s durable I/O/crash-recovery accomplishment, keeping the metric component arrangement. Resume-backed automated-test and filed-patent-application highlights remain.
- Corrected the research title to **HealtHub**. Added the verified ESP32 DOI as a title link, without a new button or a new visual component. Unverified links remain absent.

## Retained project selection

| Area | Project | Evidence |
| --- | --- | --- |
| Featured | Concurrent Message Broker | Existing source-backed ordering/storage/TCP/replay detail page and resume |
| Featured | FlashScale | Existing source-backed cache/Redis/rate-limit/observability detail page and resume |
| Featured | AI Engineering Agent Platform | Existing source-backed ingestion/retrieval/agent detail page and resume |
| Secondary | SecureNet NIDS | [README](https://github.com/Sumit4374/SecureNet-and-NIDS/blob/master/README.md) and `backend/ml_service.py` |
| Secondary | GetSocial Microservices | [ReadMe.md](https://github.com/Sumit4374/GetSocial--MicroServices-/blob/main/ReadMe.md), Spring Boot auth-service POM, notification event DTO |
| Secondary | E-Commerce | [README](https://github.com/Sumit4374/E-Commerce/blob/master/README.md), `Server/package.json`, product service/controller |

All other repositories are excluded. Their names, descriptions, links, and metadata were removed from the runtime inventory and previous stored audit results. No authenticated account-wide repository endpoint was queried. Only the explicitly approved public project repositories were inspected.

SecureNet uses an autoencoder/XGBoost pipeline with FastAPI; the code has a mock fallback when model artifacts are unavailable. No accuracy or live-packet-capture claim was introduced. GetSocial’s documented architecture uses Java services, an API gateway, Eureka, PostgreSQL and Kafka in local Docker Compose. E-Commerce implements keyset/cursor pagination using `updatedAt` and `id`, with category filters, PostgreSQL/Prisma, JWT authentication and validation. No production deployment or performance result is claimed for any of these projects.

The AI hero, FlashScale left card, and broker right card keep their existing arrangement. The three secondary cards remain in their existing positions, with GetSocial occupying the replaced content slot.

## Research and patent verification

**ESP32-Based Smart Environmental Monitoring System with Dual Display** — presentation at IEEE CCGE 2026 is retained. IEEE-deposited [Crossref metadata](https://api.crossref.org/works/10.1109/CCGE67142.2026.11581900) matches the exact title, lists Sumit Kushwaha as an author, identifies IEEE as publisher and the record as a proceedings article, and identifies the CCGE 2026 proceedings. The [verified DOI](https://doi.org/10.1109/ccge67142.2026.11581900) redirects to [IEEE Xplore record 11581900](https://ieeexplore.ieee.org/document/11581900/). The public DOI redirect was checked; IEEE returned HTTP 202 to the automated request. Full-text access is not claimed. The visible summary conservatively says “Presented”; it makes no indexed-journal claim.

**HealtHub** — co-authored and presented at AIHW 2025, as supplied by the user/resume. Public searches and a Crossref query did not establish an official record matching this work and authorship. No DOI, proceedings URL, extended paper title, or digital-library publication claim was invented. A similarly named social post is not treated as proof of an official publication link.

**Patents** — only two filed applications in IoT and machine learning are stated. Exact titles, numbers, filing dates and URLs remain null in the configuration. No public patent-database link, grant, confidential claim, or speculative title was added. Future URLs require `urlVerified: true` before rendering.

Missing information: HealtHub’s official paper/proceedings/presentation URL or DOI, and confirmed public patent titles/application numbers/filing dates/record URLs. The configuration is ready to accept them when verified.

## Validation and limitations

- `node scripts/build.mjs`: passed; four canonical pages, only approved source links, no configuration/tool files in `dist/`.
- `node --test scripts/content.test.mjs`: seven tests passed, including rejection of unapproved/duplicate selections, unverified-link suppression, patent privacy, exactly six static cards, and configured contact actions.
- `python3 scripts/check.py`: passed existing static metadata, identity, heading, local-link, sitemap, robots, PNG, PDF and public-output checks.
- `python3 scripts/validate_schema.py`: nine entities across four pages passed against the official Schema.org vocabulary.
- JavaScript syntax and `git diff --check`: passed.
- Source comparison: stylesheet SHA-256 `d54260ef54846a0589a29e5255486c2d686d98a26c65815fd12709c1efe92bbf` unchanged; hero and all flagship diagrams, all three secondary SVG icons, header/footer/contact component structures unchanged; generated HTML is balanced.
- Resume SHA-256 `1b7141b7f811e0ee2bb79a23c76d5e16ac4b443585ea639d7a6cfead8a283032` unchanged; PDF signature, target file and download attribute passed static validation. The existing mailto/LinkedIn/GitHub/LeetCode actions remain. There is no contact form and no fake form-success state.
- Public external-link results are recorded in `validation-results.json`. Anti-bot responses are reported as verification limits rather than automatically treated as broken profiles.

Desktop, tablet and mobile **browser screenshots and interaction/download checks could not be completed**: the saved local-origin permission denied navigation to the existing preview origin. No alternate browser surface, port, headless browser or direct browser-control mechanism was used to bypass it. Unchanged CSS and component/diagram source comparisons verify that no design rules or visual assets were changed, but do not substitute for a rendered cross-viewport review.

No deployment, push, DNS change, hosting modification or account/profile edit was performed. The earlier Lighthouse figures remain historical results in `seo-audit.md`; no new browser performance score is claimed.

## Files changed

- `index.html`: curated static content, six existing card slots, research link, metric replacement, configuration markers.
- `script.js`: removed inventory logic; clipboard reads the configured email already rendered in HTML.
- `portfolio.content.json` (new): approved identity, project, research, patent, and contact configuration.
- `scripts/content.mjs` (new): build-time rendering and allowlist/link-verification gates.
- `scripts/content.test.mjs` (new): curation and public-output regression tests.
- `scripts/build.mjs`: content synchronization and publication restricted to configured flagship pages.
- `scripts/check.py`: configured primary role and non-public-configuration assertion.
- `README.md`: content-editing instructions and current selection/validation scope.
- `docs/seo-audit.md`: marked prior results historical and removed obsolete inventory metadata.
- `docs/validation-results.json`: current selected-link and preservation results, with no discarded repository inventory.
- `docs/content-audit.md` (new): this evidence and limitation report.

The stylesheet, resume, favicon, social artwork, existing project-detail pages, hosting configuration, robots and canonical sitemap contents were not changed.
