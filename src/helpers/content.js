import fs from "node:fs/promises";
import path from "node:path";

const contentRoot = path.resolve(process.cwd(), "public", "content");
const cache = new Map();

async function readJson(file) {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

export async function getContent(locale = "en", slug) {
  const key = `${locale}:${slug}`;
  if (cache.has(key)) return cache.get(key);

  const file = path.join(contentRoot, locale, `${slug}.json`);
  const data = await readJson(file);
  cache.set(key, data);
  return data;
}

export async function getCompany(slug) {
  const key = `company:${slug}`;
  if (cache.has(key)) return cache.get(key);

  const file = path.join(contentRoot, "company", `${slug}.json`);
  const data = await readJson(file);
  cache.set(key, data);
  return data;
}
