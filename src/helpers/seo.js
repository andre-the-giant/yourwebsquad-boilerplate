const hreflangMap = {
  fr: "fr-FR",
  en: "en"
};
const defaultLang = "en";

const SITE_URL = (process.env.SITE_URL || "").replace(/\/+$/, "");

const defaultSeo = {
  title: "Your Web Squad | Astro Boilerplate",
  description: "Starter template for fast, accessible, multi-tenant Astro sites.",
  image: "/assets/og/default.png",
  imageAlt: "Open Graph placeholder",
  siteName: "Your Web Squad",
  twitterSite: SITE_URL,
  twitterCreator: SITE_URL
};

export function buildSeo({
  site = SITE_URL,
  locale = "en",
  path = "/",
  overrides = {},
  alternates
} = {}) {
  const base = site.endsWith("/") ? site : `${site}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const canonical = new URL(cleanPath, base).toString();
  const frPath = cleanPath.replace(/^en\//, "fr/");
  const enPath = cleanPath.replace(/^fr\//, "en/");
  const defaultPath = cleanPath.replace(/^en\//, "fr/");
  const xDefaultUrl = new URL(defaultPath, base).toString();

  const hrefLangs = (
    alternates && alternates.length
      ? alternates
      : [
          { lang: "fr", path: frPath },
          { lang: "en", path: enPath }
        ]
  )
    .map(({ lang, path: hrefPath, url }) => {
      const mappedLang = hreflangMap[lang] || lang;
      const target = url || new URL(hrefPath, base).toString();
      return { lang: mappedLang, url: target };
    })
    .reduce((acc, curr) => {
      if (!acc.some((item) => item.lang === curr.lang && item.url === curr.url)) {
        acc.push(curr);
      }
      return acc;
    }, [])
    .concat(
      // Add x-default pointing to the default locale version.
      [
        {
          lang: "x-default",
          url: xDefaultUrl
        }
      ]
    )
    .reduce((acc, curr) => {
      if (!acc.some((item) => item.lang === curr.lang && item.url === curr.url)) {
        acc.push(curr);
      }
      return acc;
    }, []);
  const title = overrides.title || defaultSeo.title;
  const description = overrides.description || defaultSeo.description;
  const image = overrides.image || defaultSeo.image;
  const imageAlt = overrides.imageAlt || defaultSeo.imageAlt;
  const siteName = overrides.siteName || defaultSeo.siteName;
  const twitterSite = overrides.twitterSite || defaultSeo.twitterSite;
  const twitterCreator = overrides.twitterCreator || defaultSeo.twitterCreator;
  const mappedLocale = hreflangMap[locale] || locale || defaultLang;
  const ogLocale = locale.startsWith("fr") ? "fr_FR" : "en_US";
  return {
    title,
    description,
    image,
    imageAlt,
    siteName,
    twitterSite,
    twitterCreator,
    canonical,
    locale: mappedLocale,
    ogLocale,
    hrefLangs
  };
}

export function buildJsonLd({
  locale = "en",
  path = "/",
  org = {},
  sameAs = [],
  openingHours = [],
  image,
  breadcrumbs = [],
  extras = []
} = {}) {
  const {
    name = "Your Business",
    url = `${SITE_URL}/`,
    telephone = "+00 0 00 00 00 00",
    streetAddress = "123 Placeholder St.",
    addressLocality = "City",
    postalCode = "00000",
    addressCountry = "XX",
    geo = { latitude: 0, longitude: 0 }
  } = org;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url
  };

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url: new URL(cleanPath, url).toString(),
    inLanguage: locale
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name,
    url,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      postalCode,
      addressCountry
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude
    }
  };

  if (sameAs?.length) {
    localBusiness.sameAs = sameAs;
  }
  if (openingHours?.length) {
    localBusiness.openingHours = openingHours;
  }
  if (image) {
    localBusiness.image = image;
  }

  const structured = [website, webpage, localBusiness];

  if (breadcrumbs?.length) {
    structured.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        item: item.url
      }))
    });
  }

  if (extras?.length) {
    structured.push(...extras);
  }

  return structured;
}
