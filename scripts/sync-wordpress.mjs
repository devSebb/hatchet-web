#!/usr/bin/env node
/**
 * Mirrors published content from the Stream Hatchet WordPress into this repo.
 *
 * Text is snapshotted, images are not. The JSON written to lib/content/generated/
 * is committed, so no page fetches WordPress at request time and a WordPress
 * outage can never break a build or a deploy. Images stay on the WordPress media
 * library and are referenced by URL: streamhatchet.com is staying online, and
 * committing ~37MB of binaries would pin every future revision of them into git
 * history permanently. Every URL is HEAD-checked during the sync, so a deleted
 * or renamed upload fails here rather than in production.
 *
 * `--images=local` copies the files into public/images/wp instead, for the day
 * that domain is retired. Nothing else about the pipeline changes.
 *
 *   node scripts/sync-wordpress.mjs                 # reports + stories + 60 posts
 *   node scripts/sync-wordpress.mjs --posts=all     # every one of the ~718 posts
 *   node scripts/sync-wordpress.mjs --only=reports  # one stream at a time
 *   node scripts/sync-wordpress.mjs --images=local  # copy images into the repo
 *
 * The REST API is public, so this needs no credentials. If WordPress is ever
 * locked down, add an Application Password (Users -> Profile) and set
 * WORDPRESS_BASIC_AUTH="user:apppassword" — never a real account password.
 */

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";

const WP = "https://streamhatchet.com/wp-json/wp/v2";
const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "lib/content/generated");
const IMAGE_DIR = path.join(ROOT, "public/images/wp");
const IMAGE_PUBLIC_PATH = "/images/wp";

/** Widest variant we keep. WordPress serves 1920px originals; nothing on the
 *  site renders a content image wider than ~900 CSS px. */
const MAX_IMAGE_WIDTH = 1024;

const DEFAULT_POST_LIMIT = 60;

// ---------------------------------------------------------------------------
// Page classification
//
// There are no custom post types — reports and case studies are ordinary
// Pages built in Elementor, so they have to be picked out by slug.
// ---------------------------------------------------------------------------

const REPORT_SLUG_PATTERN = /report|trends|download/i;

/** Pages that match the pattern but are marketing/solution pages, not reports. */
const NOT_A_REPORT = new Set([
  "reports", // "Industry Leading Reports" — the hub page
  "reporting", // solution page
  "custom-reports", // solution page
  "rankings",
  "new-blog",
  "new-test-page",
]);

/** Every press mention is a blockquote on this one Elementor page. */
const PRESS_PAGE_SLUG = "press-media";

const CASE_STUDY_SLUGS = new Set([
  "capcom-x-stream-hatchet-monster-hunter-case-study",
  "nyxl-with-stream-hatchet-and-sideqik",
]);

/** Localised duplicates of English reports — the marketing site is English-only. */
function isLocalisedDuplicate(slug) {
  return slug.includes("japan-version") || /%[0-9a-f]{2}/i.test(slug);
}

/** Elementor section headings that appear on every report template. */
const BOILERPLATE_HEADINGS = [
  /^what you'?ll discover$/i,
  /^how this report helps/i,
  /^more reports for you$/i,
  /^expert strategy/i,
  /^discover the data/i,
  /^ready to /i,
  /^get (the|your) /i,
  /^download/i,
  /^related/i,
];

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

const authHeader = process.env.WORDPRESS_BASIC_AUTH
  ? `Basic ${Buffer.from(process.env.WORDPRESS_BASIC_AUTH).toString("base64")}`
  : undefined;

async function request(url, { raw = false } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "hatchet-web content sync",
          ...(authHeader ? { authorization: authHeader } : {}),
        },
        signal: AbortSignal.timeout(60_000),
      });

      if (!response.ok) {
        const error = new Error(`${response.status} ${response.statusText}`);
        // A 404 is an answer, not a blip — probed image variants rely on it
        // failing fast rather than burning two backoffs first.
        if (response.status >= 400 && response.status < 500) {
          error.permanent = true;
        }
        throw error;
      }

      return raw
        ? Buffer.from(await response.arrayBuffer())
        : { body: await response.json(), headers: response.headers };
    } catch (error) {
      lastError = error;
      if (error.permanent) break;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      }
    }
  }

  throw new Error(`GET ${url} failed after 3 attempts: ${lastError.message}`);
}

/** Walks WordPress pagination via the X-WP-TotalPages header. */
async function collect(resource, params = {}, limit = Infinity) {
  const items = [];
  const perPage = Math.min(100, limit === Infinity ? 100 : limit);

  for (let page = 1; ; page += 1) {
    const query = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      ...params,
    });
    const { body, headers } = await request(`${WP}/${resource}?${query}`);

    items.push(...body);

    const totalPages = Number(headers.get("x-wp-totalpages") ?? "1");
    if (items.length >= limit || page >= totalPages) break;
  }

  return items.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#8217": "’",
  "#8216": "‘",
  "#8220": "“",
  "#8221": "”",
  "#8211": "–",
  "#8212": "—",
  "#038": "&",
  "#039": "'",
  "#8230": "…",
  hellip: "…",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  ndash: "–",
  mdash: "—",
};

function decodeEntities(value) {
  return value.replace(/&(#?\w+);/g, (match, name) => ENTITIES[name] ?? match);
}

function toText(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** The rebrand: every mirrored string reads as Hatchet, not Stream Hatchet. */
function normalizeBrand(value) {
  return value.replace(/Stream Hatchet/g, "Hatchet");
}

/** URL-safe slug from a headline, for items WordPress gives no slug of its own. */
function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .replace(/-$/, "");
}

function cleanTitle(html) {
  return normalizeBrand(
    toText(html)
      .replace(/\s*\|\s*(Stream Hatchet|Hatchet).*$/i, "")
      .trim(),
  );
}

// ---------------------------------------------------------------------------
// HTML sanitising
//
// Post bodies are rendered through <ArticleProse> with dangerouslySetInnerHTML,
// so everything WordPress ships that we do not explicitly allow is dropped —
// including the analytics <script> tags embedded in most post bodies.
// ---------------------------------------------------------------------------

const ALLOWED_TAGS = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "b",
  "i",
  "blockquote",
  "img",
  "figure",
  "figcaption",
  "br",
  "hr",
  "sup",
  "sub",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
]);

/** Tags whose *contents* are discarded, not just the tag itself. */
const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "noscript",
  "iframe",
  "form",
  "svg",
  "button",
  "select",
  "textarea",
]);

const VOID_TAGS = new Set(["img", "br", "hr"]);

const ALLOWED_ATTRIBUTES = {
  a: ["href"],
  img: ["src", "alt"],
};

function attributesFor(tag, source) {
  const allowed = ALLOWED_ATTRIBUTES[tag];
  if (!allowed) return "";

  const kept = [];

  for (const name of allowed) {
    const match = source.match(
      new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
    );
    if (!match) continue;

    let value = match[2] ?? match[3] ?? "";
    if (!value) continue;

    // Block javascript:/data: URLs regardless of source trust.
    if (name === "href" || name === "src") {
      const protocol = value.trim().toLowerCase();
      if (protocol.startsWith("javascript:") || protocol.startsWith("data:")) {
        continue;
      }
    }

    if (name === "href") {
      value = normalizeBrand(value.replace(/^http:\/\//, "https://"));
    }

    kept.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
  }

  return kept.length ? ` ${kept.join(" ")}` : "";
}

/**
 * Rewrites a body to the allowed tag set. Disallowed tags are unwrapped
 * (contents kept) unless they are in DROP_WITH_CONTENT.
 */
function sanitizeHtml(html, rewriteImage) {
  let output = "";
  let cursor = 0;
  let skipDepth = 0;
  let skipTag = null;

  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const [full, rawName] = match;
    const tag = rawName.toLowerCase();
    const isClosing = full.startsWith("</");

    if (skipTag) {
      // Inside a dropped subtree: consume until its matching close tag.
      if (tag === skipTag) {
        if (isClosing) {
          skipDepth -= 1;
          if (skipDepth === 0) skipTag = null;
        } else if (!full.endsWith("/>")) {
          skipDepth += 1;
        }
      }
      cursor = tagPattern.lastIndex;
      continue;
    }

    output += html.slice(cursor, match.index);
    cursor = tagPattern.lastIndex;

    if (DROP_WITH_CONTENT.has(tag)) {
      if (!isClosing && !full.endsWith("/>")) {
        skipTag = tag;
        skipDepth = 1;
      }
      continue;
    }

    if (!ALLOWED_TAGS.has(tag)) continue; // unwrap

    if (isClosing) {
      output += `</${tag}>`;
      continue;
    }

    if (tag === "img") {
      const source = full.match(/\bsrc\s*=\s*"([^"]*)"/i)?.[1] ?? "";
      const local = rewriteImage(source);
      if (!local) continue; // download failed — drop the image rather than hotlink
      const alt = full.match(/\balt\s*=\s*"([^"]*)"/i)?.[1] ?? "";
      output += `<img src="${local}" alt="${alt.replace(/"/g, "&quot;")}" />`;
      continue;
    }

    output += `<${tag}${attributesFor(tag, full)}${VOID_TAGS.has(tag) ? " /" : ""}>`;
  }

  output += html.slice(cursor);

  return tidy(output);
}

/**
 * Elementor pages are layout scaffolding, not documents — sanitising them
 * leaves loose text nodes and stray CTA buttons. For those, walk the block
 * elements in document order and re-emit only genuine prose.
 */
const PROSE_NOISE = [
  /^(start here|get started|learn more|read more|see more|download( now)?)$/i,
  /^(book|request) a demo$/i,
  /^contact (us|sales)$/i,
  /^(sign up|free trial|talk to sales|subscribe)$/i,
  /^powering thousands of brands$/i,
  /^[\d\s%.,+]+$/,
];

/** Skips logo strips and icons — anything WordPress resized below 600px wide. */
function isContentImage(url) {
  const dimensions = url.match(/-(\d+)x(\d+)\.(png|jpe?g|webp|gif)$/i);
  return !dimensions || Number(dimensions[1]) >= 600;
}

function inlineOnly(html) {
  return tidy(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<\/?(?!\/?(?:strong|em|b|i|a|sup|sub)\b)[a-z][^>]*>/gi, "")
      .replace(/<a\b([^>]*)>/gi, (match, attributes) => {
        const href = attributes.match(/\bhref\s*=\s*"([^"]*)"/i)?.[1];
        return href && !/^(javascript|data):/i.test(href.trim())
          ? `<a href="${normalizeBrand(href.replace(/^http:\/\//, "https://"))}">`
          : "<a>";
      }),
  );
}

function extractProse(html, rewriteImage) {
  const blocks = [];
  const seen = new Set();
  const pattern =
    /<img\b[^>]*>|<(p|h1|h2|h3|h4|h5|h6|li)\b[^>]*>([\s\S]*?)<\/\2>/gi;

  for (const match of html.matchAll(pattern)) {
    const [full, tag, inner] = match;

    if (!tag) {
      const source = full.match(/\bsrc\s*=\s*"([^"]*)"/i)?.[1] ?? "";
      if (!source.startsWith("http") || !isContentImage(source)) continue;
      const local = rewriteImage(source);
      if (!local || seen.has(local)) continue;
      seen.add(local);
      const alt = full.match(/\balt\s*=\s*"([^"]*)"/i)?.[1] ?? "";
      blocks.push(
        `<img src="${local}" alt="${alt.replace(/"/g, "&quot;")}" />`,
      );
      continue;
    }

    const text = toText(inner);
    if (text.length < 3) continue;
    if (PROSE_NOISE.some((pattern) => pattern.test(text))) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const body = inlineOnly(inner);
    if (!body) continue;

    const name = tag.toLowerCase();
    if (name === "li") blocks.push(`<li>${body}</li>`);
    else if (name === "p") blocks.push(`<p>${body}</p>`);
    else blocks.push(`<h3>${body}</h3>`);
  }

  // Wrap consecutive list items so the markup stays valid.
  return blocks
    .join("")
    .replace(/(?:<li>[\s\S]*?<\/li>)+/g, (run) => `<ul>${run}</ul>`);
}

function tidy(html) {
  return (
    normalizeBrand(html)
      // Collapse whitespace-only text between block tags.
      .replace(/>\s+</g, "><")
      // Drop elements left empty after unwrapping.
      .replace(/<(p|h2|h3|h4|li|figcaption|blockquote)>\s*<\/\1>/g, "")
      .replace(/(<br \/>\s*){3,}/g, "<br /><br />")
      .trim()
  );
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

const downloadCache = new Map();
const usedImageFiles = new Set();
const remoteImages = new Set();
let imageBytes = 0;

/**
 * "remote" (default) keeps images on the WordPress media library and stores
 * their URLs; "local" copies every file into public/images/wp. streamhatchet.com
 * is staying online, so remote keeps ~37MB of binaries — and every future
 * revision of them — out of git history. Switch with `--images=local`.
 */
let imageMode = "remote";

/** Routes to the active mode. `preferSmaller` only affects remote linking. */
function resolveImage(url, options = {}) {
  return imageMode === "local"
    ? downloadImage(url, options)
    : linkImage(url, options);
}

/** Prefers the widest WordPress-generated variant at or under MAX_IMAGE_WIDTH. */
function pickVariant(media) {
  // Remote covers cost no repo space and next/image downsizes them per
  // breakpoint, so take a retina-grade source; local mode stays lean.
  const cap = imageMode === "remote" ? 1536 : MAX_IMAGE_WIDTH;
  const sizes = Object.values(media?.media_details?.sizes ?? {});
  const candidates = sizes
    .filter((size) => size.source_url && size.width <= cap)
    .sort((a, b) => b.width - a.width);

  return candidates[0]?.source_url ?? media?.source_url ?? null;
}

/**
 * Body images arrive at whatever size the editor dropped in, often the 1024px
 * variant or the original. WordPress also generates a 768px-wide "medium_large"
 * sibling named `<file>-768x<proportional height>.<ext>`, which is ~40% of the
 * bytes at more than enough resolution for the widest column on the site.
 *
 * The height has to be derived from the variant already in the URL, so this only
 * applies to URLs that carry a size suffix; the caller falls back to the
 * original whenever the guessed sibling 404s.
 */
function smallerVariant(url) {
  const match = url.match(/-(\d+)x(\d+)\.(png|jpe?g|webp|gif)$/i);
  if (!match) return null;

  const [, rawWidth, rawHeight, extension] = match;
  const width = Number(rawWidth);
  if (width <= 768) return null;

  const height = Math.round((768 * Number(rawHeight)) / width);
  return url.replace(
    /-\d+x\d+\.(png|jpe?g|webp|gif)$/i,
    `-768x${height}.${extension}`,
  );
}

/**
 * Confirms a URL actually resolves before it is written into the snapshot.
 * In remote mode nothing is downloaded, so without this a renamed or deleted
 * upload would only surface as a broken image in production.
 */
async function urlResolves(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: { "user-agent": "hatchet-web content sync" },
      signal: AbortSignal.timeout(30_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Remote mode: keep the image on the WordPress media library and store its URL.
 * Covers go through next/image (which fetches, resizes, and caches them at the
 * edge), so they are pinned to the largest sensible rendition; body images are
 * plain <img> inside article HTML and get the lighter 768px sibling.
 */
async function linkImage(url, { fallbackUrl, preferSmaller = false } = {}) {
  if (!url) return null;
  if (downloadCache.has(url)) return downloadCache.get(url);

  const candidates = [
    preferSmaller ? smallerVariant(url) : null,
    url,
    fallbackUrl,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await urlResolves(candidate)) {
      const canonical = candidate.replace(/^http:\/\//, "https://");
      remoteImages.add(canonical);
      downloadCache.set(url, canonical);
      return canonical;
    }
  }

  console.warn(`  ! image unavailable: ${url}`);
  downloadCache.set(url, null);
  return null;
}

async function downloadImage(url, { fallbackUrl } = {}) {
  if (!url) return null;
  if (downloadCache.has(url)) return downloadCache.get(url);

  const extension = (url.match(/\.(png|jpe?g|webp|gif|svg)/i)?.[1] ?? "png")
    .toLowerCase()
    .replace("jpeg", "jpg");

  const base = decodeURIComponent(url.split("/").pop() ?? "image")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const digest = createHash("sha1").update(url).digest("hex").slice(0, 6);
  const filename = `${base || "image"}-${digest}.${extension}`;
  const publicPath = `${IMAGE_PUBLIC_PATH}/${filename}`;

  // Smallest acceptable rendition first, then the URL as given, then the
  // caller's fallback. Guessed variants 404 harmlessly.
  const candidates = [smallerVariant(url), url, fallbackUrl].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const buffer = await request(candidate, { raw: true });
      await writeFile(path.join(IMAGE_DIR, filename), buffer);
      imageBytes += buffer.byteLength;
      usedImageFiles.add(filename);
      downloadCache.set(url, publicPath);
      return publicPath;
    } catch {
      // fall through to the next candidate
    }
  }

  console.warn(`  ! image unavailable: ${url}`);
  downloadCache.set(url, null);
  return null;
}

/** Downloads every <img> in a body up front so sanitising can stay synchronous. */
async function buildImageMap(html) {
  const map = new Map();
  const sources = new Set();

  for (const match of html.matchAll(/<img\b[^>]*\bsrc\s*=\s*"([^"]+)"/gi)) {
    const source = match[1];
    if (source.startsWith("http")) sources.add(source);
  }

  for (const source of sources) {
    // Body images render as plain <img>, with no optimizer in front of them,
    // so they take the lighter 768px rendition in both modes.
    map.set(source, await resolveImage(source, { preferSmaller: true }));
  }

  return map;
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

/**
 * Some older pages point at attachments that are private on WordPress — the
 * REST API returns a 401 body in place of the media object. Detect that so the
 * caller can fall back rather than treating the error as a media record.
 */
function embeddedMedia(item) {
  const media = item?._embedded?.["wp:featuredmedia"]?.[0] ?? null;
  return media && !media.code ? media : null;
}

/** Public social image, used when the featured attachment is unreadable. */
function socialImage(item) {
  return item.yoast_head_json?.og_image?.[0]?.url ?? null;
}

/** Featured attachment first, then the page's own og:image. */
async function coverFor(item) {
  const media = embeddedMedia(item);

  if (media) {
    const cover = await resolveImage(pickVariant(media), {
      fallbackUrl: media.source_url,
    });
    if (cover) return cover;
  }

  return resolveImage(socialImage(item));
}

function yoastDescription(item) {
  const yoast = item.yoast_head_json ?? {};
  const description = yoast.description || yoast.og_description || "";
  return description ? normalizeBrand(decodeEntities(description)) : "";
}

/** Falls back to the auto-excerpt, stripped of the Elementor breadcrumb noise. */
function summaryFor(item) {
  const yoast = yoastDescription(item);
  if (yoast) return yoast;

  const excerpt = normalizeBrand(toText(item.excerpt?.rendered ?? ""))
    .replace(/\s*\[?…\]?\s*$/, "")
    .replace(/^Reports\s+/i, "");

  const title = cleanTitle(item.title?.rendered ?? "");
  return excerpt.startsWith(title)
    ? excerpt.slice(title.length).trim()
    : excerpt;
}

function headingsFrom(html) {
  const headings = [];

  for (const match of html.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = normalizeBrand(toText(match[2]));
    if (!text || text.length > 90) continue;
    if (BOILERPLATE_HEADINGS.some((pattern) => pattern.test(text))) continue;
    if (headings.includes(text)) continue;
    headings.push(text);
  }

  return headings;
}

function hubspotFormId(html) {
  return (
    html.match(/data-form-id="([0-9a-f-]{30,})"/i)?.[1] ??
    html.match(/formId:\s*["']([0-9a-f-]{30,})["']/i)?.[1] ??
    null
  );
}

// ---------------------------------------------------------------------------
// Streams
// ---------------------------------------------------------------------------

async function syncReports(pages) {
  const candidates = pages.filter(
    (page) =>
      REPORT_SLUG_PATTERN.test(page.slug) &&
      !NOT_A_REPORT.has(page.slug) &&
      !CASE_STUDY_SLUGS.has(page.slug) &&
      !isLocalisedDuplicate(page.slug),
  );

  console.log(`\nReports: ${candidates.length} pages`);
  const guides = [];

  for (const page of candidates) {
    const html = page.content?.rendered ?? "";
    const formId = hubspotFormId(html);
    const coverImage = await coverFor(page);

    const title = cleanTitle(page.title?.rendered ?? "");

    guides.push({
      slug: page.slug,
      title,
      summary: summaryFor(page),
      coverImage: coverImage ?? undefined,
      gated: Boolean(formId),
      hubspotFormId: formId ?? undefined,
      highlights: headingsFrom(html).slice(0, 6),
      publishedAt: page.date_gmt ? `${page.date_gmt}Z` : undefined,
      sourceUrl: page.link?.replace(/^http:/, "https:"),
    });

    console.log(
      `  ${formId ? "gated " : "open  "} ${coverImage ? "img" : "—  "}  ${title}`,
    );
  }

  guides.sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  return guides;
}

async function syncCaseStudies(pages) {
  const candidates = pages.filter((page) => CASE_STUDY_SLUGS.has(page.slug));

  console.log(`\nCase studies: ${candidates.length} pages`);
  const stories = [];

  for (const page of candidates) {
    const html = page.content?.rendered ?? "";
    const cover = await coverFor(page);

    const title = cleanTitle(page.title?.rendered ?? "");
    // "Capcom x Hatchet: Monster Hunter Case Study" -> "Capcom"
    // "NYXL with Hatchet and Sideqik"              -> "NYXL"
    const company = title.split(/\s+x\s+|\s+with\s+|:/i)[0].trim();

    // Only a genuine pull-quote counts. Falling back to the summary would print
    // the same sentence twice, since the page header already renders it.
    const quoteHtml =
      html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i)?.[1] ??
      html.match(
        /class="[^"]*testimonial[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      )?.[1] ??
      "";
    const quote = normalizeBrand(toText(quoteHtml)).slice(0, 320);

    const imageMap = await buildImageMap(html);
    const body = extractProse(html, (source) => imageMap.get(source) ?? null);

    // Both case-study pages are Elementor landing pages whose only prose is the
    // headline — the substance sits inside the gated PDF. Emitting the leftover
    // image run would mostly reproduce the page's "more reports" carousel, so a
    // body is only kept when the page genuinely has written content.
    const prose = body.replace(/<img[^>]*>/g, "");
    const contentHtml = prose.length > 200 ? body : "";

    stories.push({
      slug: page.slug,
      company,
      // Brand marks come from lib/brand/logos.ts at render time; WordPress
      // ships no usable logo asset on these pages.
      quote: quote || undefined,
      industry: "Games publisher",
      summary: summaryFor(page),
      contentHtml,
      coverImage: cover ?? undefined,
      hubspotFormId: hubspotFormId(html) ?? undefined,
      publishedAt: page.date_gmt ? `${page.date_gmt}Z` : undefined,
      sourceUrl: page.link?.replace(/^http:/, "https:"),
    });

    console.log(
      `  ${company} — body=${contentHtml ? `${contentHtml.length} chars` : "none (gated PDF)"}, quote=${quote ? "yes" : "none"}`,
    );
  }

  return stories;
}

/**
 * Press coverage lives entirely inside the "Press & Media" Elementor page —
 * there is no press post type — as a run of blockquote widgets shaped:
 *
 *   <blockquote class="elementor-blockquote">
 *     <h4><a href="…">headline</a></h4> <p><em>date</em></p>
 *     <cite class="elementor-blockquote__author">— outlet —</cite>
 *   </blockquote>
 *
 * Each one points at an article on someone else's site, so the mirrored items
 * carry an external `url` and no body of their own.
 */
function syncPress(pages) {
  const page = pages.find((item) => item.slug === PRESS_PAGE_SLUG);

  if (!page) {
    console.warn(`\nPress: "${PRESS_PAGE_SLUG}" page not found — skipping`);
    return [];
  }

  const html = page.content?.rendered ?? "";
  const blocks = html.match(
    /<blockquote class="elementor-blockquote">[\s\S]*?<\/blockquote>/g,
  );

  console.log(`\nPress: ${blocks?.length ?? 0} coverage items`);
  const items = [];
  const seen = new Set();

  for (const block of blocks ?? []) {
    const link = block.match(
      /<h4><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h4>/,
    );
    if (!link) continue;

    const [, url, rawTitle] = link;
    const title = normalizeBrand(toText(rawTitle));
    if (!title) continue;

    const rawDate = block.match(/<em>([^<]+)<\/em>/)?.[1]?.trim();
    const parsed = rawDate ? new Date(rawDate) : null;

    const outlet = block.match(/<cite[^>]*>([\s\S]*?)<\/cite>/)?.[1];

    const slug = slugify(title);
    if (seen.has(slug)) continue;
    seen.add(slug);

    items.push({
      slug,
      title,
      outlet: outlet
        ? toText(outlet).replace(/^[—\-\s]+|[—\-\s]+$/g, "")
        : undefined,
      date:
        parsed && !Number.isNaN(parsed.valueOf())
          ? parsed.toISOString()
          : new Date(0).toISOString(),
      url: url.replace(/^http:\/\//, "https://"),
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

  for (const item of items) {
    console.log(`  ${item.date.slice(0, 10)}  ${item.outlet ?? "—"}`);
  }

  return items;
}

async function syncPosts(limit) {
  console.log(`\nPosts: fetching ${limit === Infinity ? "all" : limit}`);

  const raw = await collect(
    "posts",
    { _embed: "1", orderby: "date", order: "desc", status: "publish" },
    limit,
  );

  const posts = [];

  for (const [index, post] of raw.entries()) {
    const html = post.content?.rendered ?? "";
    const coverImage = await coverFor(post);

    const imageMap = await buildImageMap(html);
    const contentHtml = sanitizeHtml(html, (source) => {
      const local = imageMap.get(source);
      return local ?? null;
    });

    const terms = post._embedded?.["wp:term"] ?? [];
    const categories = (terms[0] ?? []).filter(
      (term) => term.slug !== "uncategorized",
    );
    const tags = (terms[1] ?? []).map((term) => decodeEntities(term.name));

    posts.push({
      slug: post.slug,
      title: cleanTitle(post.title?.rendered ?? ""),
      excerpt:
        yoastDescription(post) ||
        normalizeBrand(toText(post.excerpt?.rendered ?? "")).replace(
          /\s*\[?…\]?\s*$/,
          "",
        ),
      contentHtml,
      category: categories[0] ? decodeEntities(categories[0].name) : "Insights",
      tags: tags.slice(0, 6),
      coverImage: coverImage ?? undefined,
      publishedAt: post.date_gmt
        ? `${post.date_gmt}Z`
        : new Date(0).toISOString(),
      author: post._embedded?.author?.[0]?.name
        ? {
            name: normalizeBrand(decodeEntities(post._embedded.author[0].name)),
          }
        : { name: "Hatchet" },
      sourceUrl: post.link?.replace(/^http:/, "https:"),
    });

    if ((index + 1) % 10 === 0) {
      console.log(`  ${index + 1}/${raw.length}`);
    }
  }

  return posts;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function parseArguments(argv) {
  const options = { posts: DEFAULT_POST_LIMIT, only: null, images: "remote" };

  for (const argument of argv) {
    const [key, value] = argument.replace(/^--/, "").split("=");
    if (key === "posts") {
      options.posts = value === "all" ? Infinity : Number(value);
    } else if (key === "only") {
      options.only = value.split(",");
    } else if (key === "images") {
      if (value !== "remote" && value !== "local") {
        throw new Error(`--images must be "remote" or "local", got "${value}"`);
      }
      options.images = value;
    }
  }

  return options;
}

async function writeJson(name, payload) {
  const file = path.join(DATA_DIR, `${name}.json`);
  await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `  wrote ${path.relative(ROOT, file)} (${payload.length} entries)`,
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const wants = (stream) => !options.only || options.only.includes(stream);

  imageMode = options.images;
  console.log(
    imageMode === "remote"
      ? "Images: linking to the WordPress media library (verified per URL)"
      : "Images: copying into public/images/wp",
  );

  await mkdir(DATA_DIR, { recursive: true });
  if (imageMode === "local") await mkdir(IMAGE_DIR, { recursive: true });

  const needsPages = wants("reports") || wants("stories") || wants("press");
  const pages = needsPages
    ? await collect("pages", { _embed: "1", status: "publish" })
    : [];

  if (needsPages) console.log(`Fetched ${pages.length} pages`);

  console.log("\n--- writing ---");

  if (wants("reports")) await writeJson("guides", await syncReports(pages));
  if (wants("stories")) {
    await writeJson("customer-stories", await syncCaseStudies(pages));
  }
  if (wants("press")) await writeJson("press", syncPress(pages));
  if (wants("posts")) await writeJson("posts", await syncPosts(options.posts));

  // Drop images no longer referenced by any stream we just rebuilt.
  if (!options.only && imageMode === "local") {
    const existing = await readdir(IMAGE_DIR);
    const stale = existing.filter((file) => !usedImageFiles.has(file));

    for (const file of stale) {
      await rm(path.join(IMAGE_DIR, file));
    }

    if (stale.length) console.log(`\nRemoved ${stale.length} stale images`);
  }

  console.log(
    imageMode === "remote"
      ? `\nDone. ${remoteImages.size} image URLs verified on streamhatchet.com, 0 bytes stored.`
      : `\nDone. ${usedImageFiles.size} images, ${(imageBytes / 1024 / 1024).toFixed(1)} MB.`,
  );
}

await main();
