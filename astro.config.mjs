import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tsconfigPaths from "vite-tsconfig-paths";
import yourwebsquadForms from "yourwebsquad-components/forms-integration";
import htaccessIntegration from "astro-htaccess";

// Boilerplate defaults — override via SITE_URL env when scaffolding a new project.
const SITE_URL = process.env.SITE_URL || "https://example.com";
const defaultLocale = "en";
const locales = ["en"];
const hreflang = { en: "en" };

const htaccessRules = [
  "# Redirect to HTTPS and strip www",
  "<IfModule mod_rewrite.c>",
  "  RewriteEngine On",
  "  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]",
  "  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301,NE]",
  "  RewriteCond %{HTTPS} !=on",
  "  RewriteCond %{HTTP:X-Forwarded-Proto} !https",
  "  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301,NE]",
  "</IfModule>",
  "",
  "# Caching for static assets",
  "<IfModule mod_expires.c>",
  "  ExpiresActive On",
  '  ExpiresDefault "access plus 1 month"',
  '  ExpiresByType image/webp "access plus 1 year"',
  '  ExpiresByType image/jpeg "access plus 1 year"',
  '  ExpiresByType image/png  "access plus 1 year"',
  '  ExpiresByType image/gif  "access plus 1 year"',
  '  ExpiresByType image/svg+xml "access plus 1 year"',
  '  ExpiresByType text/css "access plus 1 year"',
  '  ExpiresByType application/javascript "access plus 1 year"',
  '  ExpiresByType text/html "access plus 0 seconds"',
  "</IfModule>",
  "",
  "<IfModule mod_headers.c>",
  '  <FilesMatch "\\\\.(js|css|png|jpe?g|gif|svg|webp)$">',
  '    Header set Cache-Control "public, max-age=31536000, immutable"',
  "  </FilesMatch>",
  '  <FilesMatch "\\\\.(html|htm)$">',
  '    Header set Cache-Control "public, max-age=0, must-revalidate"',
  "  </FilesMatch>",
  '  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"',
  '  Header set X-Content-Type-Options "nosniff"',
  '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
  '  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"',
  '  Header set Cross-Origin-Opener-Policy "same-origin-allow-popups"',
  '  Header set X-Frame-Options "SAMEORIGIN"',
  "  Header set Content-Security-Policy \"default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'\"",
  "</IfModule>",
  "",
  "# Compression",
  "<IfModule mod_deflate.c>",
  "  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json image/svg+xml",
  "</IfModule>",
  "<IfModule mod_brotli.c>",
  "  AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css application/javascript application/json image/svg+xml",
  "</IfModule>",
  "",
  "# Disable directory browsing",
  "Options -Indexes"
];

export default defineConfig({
  site: SITE_URL,
  outDir: "build",
  trailingSlash: "always",
  compressHTML: true,
  build: {
    inlineStylesheets: "always"
  },
  integrations: [
    yourwebsquadForms({
      allowOrigins: ["example.com"]
    }),
    sitemap({
      filter: (page) => !page.includes("/admin/"),
      i18n: {
        defaultLocale,
        locales: hreflang
      }
    }),
    htaccessIntegration({
      customRules: htaccessRules
    })
  ],
  i18n: {
    defaultLocale,
    locales,
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tsconfigPaths({ projects: ["jsconfig.json"] })],
    resolve: {
      alias: {
        "@yws": "yourwebsquad-components"
      }
    }
  }
});
