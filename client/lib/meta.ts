export type MetaResult = {
  title: string | null;
  description: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
  warnings: string[];
  image: string | null;
  urlDisplay: string | null;
};

const getDomain = (url: string | null): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, "");
  } catch {
    return null;
  }
};

export function parseMetaFromHtml(html: string): MetaResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const head = doc.querySelector("head") || doc;

  const getMetaByName = (name: string) =>
    head.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || null;
  const getMetaByProp = (prop: string) =>
    head.querySelector(`meta[property="${prop}"]`)?.getAttribute("content") || null;

  const title = head.querySelector("title")?.textContent?.trim() || null;
  const description = getMetaByName("description") || getMetaByProp("og:description");
  const keywordsRaw = getMetaByName("keywords");
  const keywords = keywordsRaw ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean) : [];
  const canonicalUrl = head.querySelector('link[rel="canonical"]')?.getAttribute("href") || getMetaByProp("og:url") || null;

  const og: Record<string, string> = {};
  head.querySelectorAll("meta[property^='og:']").forEach((el) => {
    const prop = el.getAttribute("property");
    const content = el.getAttribute("content");
    if (prop && content) og[prop] = content;
  });

  const twitter: Record<string, string> = {};
  head.querySelectorAll("meta[name^='twitter:']").forEach((el) => {
    const name = el.getAttribute("name");
    const content = el.getAttribute("content");
    if (name && content) twitter[name] = content;
  });

  const image = og["og:image"] || twitter["twitter:image"] || null;
  const urlDisplay = getDomain(canonicalUrl);

  const warnings: string[] = [];
  if (!title) warnings.push("No <title> tag found");
  if (!description) warnings.push("No description meta tag found");
  if (!canonicalUrl) warnings.push("No canonical URL found");
  if (!og["og:title"]) warnings.push("Missing Open Graph title (og:title)");
  if (!og["og:description"]) warnings.push("Missing Open Graph description (og:description)");
  if (!og["og:image"]) warnings.push("Missing Open Graph image (og:image)");
  if (!twitter["twitter:card"]) warnings.push("Missing Twitter card type (twitter:card)");

  return { title, description, keywords, canonicalUrl, og, twitter, warnings, image, urlDisplay };
}

export function toJson(result: MetaResult) {
  return JSON.stringify(result, null, 2);
}

export function toMarkdown(result: MetaResult) {
  const lines: string[] = [];
  lines.push(`# MetaTag Report`);
  if (result.title) lines.push(`\n**Title:** ${result.title}`);
  if (result.description) lines.push(`\n**Description:** ${result.description}`);
  if (result.canonicalUrl) lines.push(`\n**Canonical:** ${result.canonicalUrl}`);
  if (result.keywords.length) lines.push(`\n**Keywords:** ${result.keywords.join(", ")}`);
  lines.push("\n## Open Graph");
  Object.entries(result.og).forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
  lines.push("\n## Twitter");
  Object.entries(result.twitter).forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
  if (result.warnings.length) {
    lines.push("\n## Warnings");
    result.warnings.forEach((w) => lines.push(`- ${w}`));
  }
  return lines.join("\n");
}

export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const t = text.slice(0, max - 1).trimEnd();
  const lastSpace = t.lastIndexOf(" ");
  return (lastSpace > 0 ? t.slice(0, lastSpace) : t) + "…";
}
