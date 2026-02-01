import company from "../../public/content/company/company.json";

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
  const site = normalizeUrl(company?.url) || "https://example.com";
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${site}/sitemap-index.xml`].join("\n");

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
