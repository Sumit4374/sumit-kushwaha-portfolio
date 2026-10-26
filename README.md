# Sumit Kushwaha — Engineering Portfolio

A custom, responsive, single-page portfolio, tailored to the attached resume and public repositories of [Sumit4374](https://github.com/Sumit4374). Designed to highlight Java, Spring Boot, distributed systems, and AI engineering with custom CSS/SVG system diagrams.

## Run locally

No framework, package manager, API keys, or dependencies are required.

```bash
cd sumit-kushwaha-portfolio
python3 -m http.server 8000
```

Visit **http://localhost:8000**. You can also open `index.html` directly in a modern browser.

## Deploy

- **GitHub Pages:** Create a new public repository and upload `index.html`, `styles.css`, `script.js`, and the `assets/` directory to the repository root. Under Settings → Pages, select **Deploy from a branch**, branch `main`, folder `/ (root)`.
- **Netlify:** Drag-and-drop this entire folder into a new Netlify site.
- **Vercel:** Import a repository containing these files and set the framework preset to **Other**; no build command is needed.

## Edit content

- `index.html`: headline, featured projects, experience, education, social and contact links.
- `script.js`: the searchable **24-repository** archive and user interactions.
- `styles.css`: visual theme, layout, responsiveness, and illustrations.
- `assets/Sumit_Kushwaha_Resume.pdf`: download linked in the hero section. Replace this file as your resume changes.
- `assets/favicon.svg`, `assets/og-cover.svg`: website branding assets.

## Design details

- Mobile-first responsive breakpoints, accessible skip-link, keyboard navigation, descriptive labels, reduced-motion support, repository search and language filters, mobile menu, clipboard interaction, and subtle reveal animations.
- No third-party requests, analytics, cookies, or tracking scripts.
- All images/diagrams are self-contained vector markup/CSS, so the site looks polished without stock imagery.

## Verification & care

Resume details were extracted from the supplied 2026-10-25 resume. Selected project claims were checked against the supplied resume and relevant GitHub READMEs. Repository names and primary languages were checked against GitHub. Repository listings are a **snapshot**, not live-synced; update `script.js` when projects change.

Your original resume includes a phone number. This portfolio deliberately **does not display the phone number** on the public page, but the downloadable PDF does. Remove or redact the number from `assets/Sumit_Kushwaha_Resume.pdf` if you don't want it public.

The source and website are intended for your use; they have **not** been deployed or pushed to GitHub.
