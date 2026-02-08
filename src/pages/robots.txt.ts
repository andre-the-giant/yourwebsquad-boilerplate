import company from "../../public/content/company/company.json";

const DEPLOY_ENV = import.meta.env.DEPLOY_ENV || "development";
const DISALLOW = import.meta.env.DISALLOW_ROBOTS === "1" || DEPLOY_ENV === "staging";
const ENV_SITE =
  DEPLOY_ENV === "staging" ? import.meta.env.STAGING_URL || import.meta.env.SITE_URL : import.meta.env.SITE_URL;

export const prerender = true;

const normalizeUrl = (url: string | undefined) => {
  if (!url) return "";
  const trimmed = url.trim().replace(/\/+$/, "");
  try {
    return new URL(trimmed).toString().replace(/\/+$/, "");
  } catch {
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }
};

export async function GET() {
  const preferred = normalizeUrl(ENV_SITE);
  const companyUrl = normalizeUrl(company?.url);
  const site = preferred || companyUrl || "";
  const lines = ["User-agent: *"];
  if (DISALLOW) {
    lines.push("Disallow: /");
  } else {
    lines.push("Allow: /");
    if (site) lines.push("", `Sitemap: ${site}/sitemap-index.xml`);
  }
  const body = lines.join("\n");

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
