# yourwebsquad-boilerplate

## Introduction

- Framework: [Astro 5](https://astro.build/)
- Component library: [`yourwebsquad-components`](https://amc.yourwebsquad.com) (GitHub: https://github.com/andre-the-giant/yourwebsquad-components)
- CMS: [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (config in `public/admin/`)
- Tooling: Prettier + `prettier-plugin-astro`, `@astrojs/sitemap`, `astro-htaccess`, QA scripts (Lighthouse, Pa11y, SEO, link checker, JSON-LD), FTP deploy GitHub Action template

## Set up

1. Install & env (required)

```bash
npm ci
cp .env.example .env
```

Set in `.env`:

- `SITE_URL` (required). Example prod: `https://acme.com`
- `STAGING_URL` (optional). Example staging: `https://staging.acme.com`
- `ALLOW_ORIGINS` (comma list). Example: `acme.com,staging.acme.com`
- `DEPLOY_ENV` (`development|staging|production`)
- `DISALLOW_ROBOTS` (`1` to block indexing; set for staging)

2. Domains & locales (examples)

- `astro.config.mjs` reads env; build fails if `SITE_URL` missing.
- Single-locale (default): `locales = ["en"]`, `prefixDefaultLocale: false` → URLs at `/`.
- Multi-locale example: set `locales = ["en", "fr"]`, `defaultLocale = "en"`, `prefixDefaultLocale: true` → `/en/...` and `/fr/...`. Duplicate content under `public/content/fr/` and add `fr` to `i18n.locales` in `public/admin/config.yml`. In `src/components/layout/Header.astro`, add `fr` to the locale list for the switcher.

3. Branding & tokens

- Replace images in `public/images/`, favicons in `public/`, OG image `public/assets/og/default.png`.
- Update `public/site.webmanifest` colors (`theme_color`, `background_color`).
- Design tokens: edit `src/styles/tokens.css` (`--color-*`, `--font-body`, `--font-display`, `--size-*`). Changes cascade through layouts/components.

4. Fonts (precise steps)

- Place font files in `public/fonts/` (e.g., `myfont-regular.woff2`).
- In `src/styles/tokens.css`, set:
  ```css
  --font-body: "My Font", sans-serif;
  --font-display: "My Font", sans-serif;
  ```
- In `src/layouts/Main.astro`, update preload links to match filenames:
  ```html
  <link rel="preload" as="font" type="font/woff2" href="/fonts/myfont-regular.woff2" crossorigin />
  ```
- If using external fonts, include the `<link>` to the provider and keep tokens in sync.

5. CMS wiring

- Config file: `public/admin/config.yml`.
- Set `backend.repo`, `branch`, and auth proxy (`base_url`, `auth_endpoint`) to your repo/service.
- Set `site_url` / `display_url`.
- Collections provided:
  - Menu (`public/content/en/menu.json`, i18n-ready).
  - Company/contact/social (`public/content/company/*.json`).
- To add collections, extend this file; keep `locales` aligned with `astro.config.mjs`.

6. Content

- Menu: `public/content/en/menu.json` (duplicate per locale if needed).
- Company info: `public/content/company/company.json`, `contact.json`, `social.json`.
- Add locales: duplicate `public/content/en/` to `public/content/<locale>/`, translate values.

7. Forms

- Files: `src/content/forms/*.json` (id == filename).
- Allowed origins come from env (`ALLOW_ORIGINS`).
- Component usage docs: https://amc.yourwebsquad.com/components/form/

8. htaccess

- Rules/redirects live in `scripts/htaccess-rules.mjs` (`{ redirects, customRules }`). Imported by `astro.config.mjs`.

9. CI (optional)

- `.github/workflows/main.yml`: manual `workflow_dispatch` only. Uncomment push/PR triggers and prod job to automate.
- Where to set values:
  - GitHub repo → Settings → Secrets and variables → Actions:
    - _Secrets_ (encrypted): `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
    - _Variables_ (plain): `SITE_URL`, `STAGING_URL`, `ALLOW_ORIGINS`, `DISALLOW_ROBOTS`, `DEPLOY_ENV` (and any others you need).
  - You can also override/add `env:` blocks in the YAML if you prefer in-file defaults.

10. Run

```bash
# start developing
npm run dev
# check if build doesn't
npm run build
```

## CMS set-up and usage

- Visit `/admin/`.
- Ensure `public/admin/config.yml` points to your GitHub repo/branch/auth proxy and has the correct `site_url`/`display_url`.
- Collections:
  - Menu: list of nav items with header/footer visibility.
  - Company/contact/social: surfaced in footer/layout; update these JSONs via CMS or directly in `public/content/company/`.
- For new locales, add them to `i18n.locales` in this file and duplicate content folders.

## How to add content and pages

1. Content

- Menu: edit `public/content/en/menu.json`.
- Company/contact/social: edit `public/content/company/*.json`.
- More locales: copy `public/content/en` to `public/content/<locale>` and translate.

2. Pages

- Generate: `npm run newpage` (templates in `scripts/templates/`).
- Add matching content JSON under `public/content/<locale>/` if the page consumes content.
- Existing routes: `/`, `/admin/`, `/robots.txt`.

## Testing

- All prompts (LH, Pa11y, SEO, links, JSON-LD): `npm test`
- A11y: `npm run test:a11y`
- SEO: `npm run test:seo`
- Links: `npm run test:links`
- JSON-LD: `npm run jsonld:check`
- Clean: `npm run clean`
  Reports land in `reports/` (gitignored).

## Improving / keeping in sync

- Component library: in the lib repo, run `npm run bumpitup` to publish/tag; in a project using this boilerplate, run `npm run updatecomponents` to pull latest `yourwebsquad-components`.
- Fixes/enhancements: apply to this boilerplate first, tag a release, then pull/cherry-pick into projects to avoid drift.
- Keep scripts/helpers centralized here; reapply to projects when updated.

## Checklist before cloning for a new site

- `.env` filled (SITE_URL, etc.).
- Branding assets and manifest colors replaced.
- Tokens updated (colors/fonts/spacing).
- CMS config pointed to your repo/auth URLs; site/display URLs set.
- Menu/company/social JSON set.
- Locales decided and content duplicated if needed.
- CI env/secrets ready if deploying.
