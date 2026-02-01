# yourwebsquad-boilerplate

Lean Astro 5 starter with quality scripts, CMS, and deploy-ready tooling. Brand/content stripped to placeholders so you can fork and ship fast.

## Quick start
- Prereqs: Node ≥18.17, npm.
- Install: `npm ci`
- Dev server: `npm run dev`
- Format: `npm run format`
- Build: `npm run build`

## Configure before first deploy
- Set your domain: edit `SITE_URL` and `allowOrigins` in `astro.config.mjs`.
- CMS backend: update repo/branch/auth URLs in `public/admin/config.yml`.
- Branding: replace placeholder assets in `public/images/`, favicons in `public/`, and OG image `public/assets/og/default.png`; adjust `public/site.webmanifest`.
- Content: edit JSON under `public/content/en/` (home, menu, FAQ, etc.) and company info under `public/content/company/`.
- Forms: update the sample form `src/content/forms/example.json` (id must match filename) or add more in the same folder; endpoints are generated under `build/api/`.

## Single language vs. multilingual
- English-only (default): nothing to change. `astro.config.mjs` is set to a single locale (`en`) without URL prefixes, so pages live at `/`, `/admin/`, etc.
- Add more locales: in `astro.config.mjs`, set `defaultLocale` and `locales` (e.g., `["en", "fr"]`) and flip `routing.prefixDefaultLocale` to `true` if you want `/en/` and `/fr/` prefixes. Duplicate content files under `public/content/<locale>/`, and enable the `LocaleSwitch` in `src/components/layout/Header.astro` by adding the locale codes. Keep locale keys in `public/admin/config.yml` in sync.

## Create a new page
Use the generator script (writes page + content stubs):
```
npm run newpage
```
It will prompt for path/segment and create files using `scripts/templates/`. Edit the generated page and add its content JSON under `public/content/en/`.

## Quality checks
- All checks: `npm test` (runs Lighthouse, Pa11y, SEO, link check, JSON-LD; prompts for which tests to run)
- Accessibility only: `npm run test:a11y`
- SEO audit: `npm run test:seo`
- Link check: `npm run test:links`
- JSON-LD validation: `npm run jsonld:check`
- Clean build artifacts: `npm run clean`

Reports land in `reports/` (ignored by git). CI template lives in `.github/workflows/main.yml` (FTP deploy placeholders).

## Structure snapshot
- `src/` — layouts (`components/layout`), helpers, styles, pages (`index`, `admin`, `robots.txt`).
- `public/` — static assets, CMS config, localized JSON content (`en`), company info.
- `scripts/` — page generator, QA/a11y/SEO/link/jsonld, components updater, cleaners.

## When forking
1) Search/replace `example.com` with your domain.
2) Swap placeholder imagery and copy.
3) Wire secrets for CI deploy (FTP_* in GitHub repo secrets) or replace the workflow with your pipeline.
