import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tsconfigPaths from "vite-tsconfig-paths";
import yourwebsquadForms from "yourwebsquad-components/forms-integration";
import htaccessIntegration from "astro-htaccess";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildHtaccessConfig } from "./htaccess.config.mjs";

const homepageComments = {
  name: "homepage-comments",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const outDir = fileURLToPath(dir);
      const targets = [
        {
          label: "/",
          file: path.join(outDir, "index.html"),
          banner: [
            "<!--",
            "  Built with yourwebsquad-boilerplate",
            "  Swap or remove this banner in astro.config.mjs (homepageComments).",
            "-->"
          ].join("\n")
        }
      ];

      await Promise.all(
        targets.map(async ({ label, file, banner }) => {
          try {
            const html = await fs.readFile(file, "utf8");
            await fs.writeFile(file, `${banner}\n${html}`);
            logger.info(`homepage-comments: injected banner into ${label}`);
          } catch (error) {
            logger.warn(
              `homepage-comments: failed to prepend banner for ${label} at ${file}: ${error}`
            );
          }
        })
      );
    }
  }
};

// Env-aware URLs
const DEPLOY_ENV = process.env.DEPLOY_ENV || "development"; // development | staging | production
if (!process.env.SITE_URL) {
  throw new Error("SITE_URL environment variable is required");
}
const SITE_URL = process.env.SITE_URL;
const STAGING_URL = process.env.STAGING_URL || SITE_URL;
const ACTIVE_SITE = DEPLOY_ENV === "staging" ? STAGING_URL : SITE_URL;
const defaultLocale = "en";
const locales = ["en"];
const hreflang = { en: "en" };

export default defineConfig({
  site: ACTIVE_SITE,
  outDir: "build",
  trailingSlash: "always",
  compressHTML: true,
  build: {
    inlineStylesheets: "always"
  },
  integrations: [
    yourwebsquadForms({
      allowOrigins: process.env.ALLOW_ORIGINS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [new URL(ACTIVE_SITE).hostname]
    }),
    sitemap({
      filter: (page) => !page.includes("/admin/"),
      i18n: {
        defaultLocale,
        locales: hreflang
      }
    }),
    homepageComments,
    htaccessIntegration(buildHtaccessConfig())
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
