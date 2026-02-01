const segments = {};

const normalizeLocale = (locale = "en") => (locale === "fr" ? "fr" : "en");

export function getSegment(locale = "en", key = "artist") {
  const loc = normalizeLocale(locale);
  const map = segments[key];
  if (!map) return null;
  return map[loc] || map.fr || null;
}

export function assertSegmentMatch(locale, key, value) {
  const expected = getSegment(locale, key);
  if (expected && value !== expected) {
    throw new Error(`Segment mismatch for ${key}: expected ${expected} got ${value}`);
  }
  return true;
}

export function getSegmentKey(segmentValue) {
  if (!segmentValue) return null;
  return (
    Object.entries(segments).find(([, locales]) =>
      Object.values(locales).includes(segmentValue)
    )?.[0] || null
  );
}

export function mapSegmentToLocale(segmentValue, targetLocale = "en") {
  const key = getSegmentKey(segmentValue);
  if (!key) return segmentValue;
  return getSegment(targetLocale, key) || segmentValue;
}

export function pathFor(locale = "en", key = "artist", slug) {
  const loc = normalizeLocale(locale);
  const segment = getSegment(loc, key);
  if (!segment) return null;
  const suffix = slug ? `${slug}/` : "";
  return `/${loc}/${segment}/${suffix}`;
}

export function alternatesFor(key = "artist", slug) {
  const map = segments[key] || {};
  return Object.keys(map).map((loc) => ({ lang: loc, path: pathFor(loc, key, slug) }));
}

export { segments };
