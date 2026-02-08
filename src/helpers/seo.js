import {
  buildJsonLd as buildJsonLdFromToolkit,
  buildSeo as buildSeoFromToolkit
} from "yourwebsquad-toolkit/helpers/seo";
import { defaultLang, defaultSeoValues, hreflangMapDefault } from "../../seo.config.mjs";

const SITE_URL = (process.env.SITE_URL || "").replace(/\/+$/, "");

const helperConfig = {
  siteUrl: SITE_URL,
  hreflangMap: hreflangMapDefault,
  defaultLang,
  seoDefaults: defaultSeoValues
};

export function buildSeo(options = {}) {
  return buildSeoFromToolkit(options, helperConfig);
}

export function buildJsonLd(options = {}) {
  return buildJsonLdFromToolkit(options, helperConfig);
}
