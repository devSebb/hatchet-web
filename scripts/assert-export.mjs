/**
 * Post-build gate on `out/`. Runs as part of `pnpm build` — see package.json.
 *
 * These are the failures that a static export produces *silently*: the build
 * goes green, a local smoke test passes, and the site is broken only once it is
 * behind CloudFront. Each check here corresponds to one of them.
 *
 * Exits non-zero on the first category that fails, with the offending files.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "out";
const failures = [];

function fail(check, detail) {
  failures.push({ check, detail });
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

if (!existsSync(OUT)) {
  console.error(
    `✗ ${OUT}/ does not exist — did next build run with output: "export"?`,
  );
  process.exit(1);
}

const files = walk(OUT);

/* ------------------------------------------------------------------------ *
 * 1. No /_next/image references.
 *
 * THE landmine of this migration. Without a custom loader the export still
 * succeeds and emits ~1,034 /_next/image?url=… URLs — an endpoint that does
 * not exist in out/, so every one 404s on S3. There is no build warning.
 *
 * Only files a browser resolves URLs from are checked. The framework's own
 * JS chunk contains `path: "/_next/image/"` as an inert config constant even
 * when loader: "custom" is active; matching on that would fail every build
 * forever and teach everyone to ignore this check.
 * ------------------------------------------------------------------------ */
const URL_BEARING = /\.(html|txt|css|xml|json)$/;
const imageRefs = files
  .filter((f) => URL_BEARING.test(f))
  .filter((f) => readFileSync(f, "utf8").includes("/_next/image"));

if (imageRefs.length) {
  fail(
    "/_next/image references",
    `${imageRefs.length} file(s) reference /_next/image, which does not exist in a static export.\n` +
      `    Every one is a broken image in production. Check images.loader in next.config.ts.\n` +
      imageRefs
        .slice(0, 10)
        .map((f) => `      ${relative(OUT, f)}`)
        .join("\n"),
  );
}

/* ------------------------------------------------------------------------ *
 * 2. The 404 page exists.
 * CloudFront's custom error responses point at /404.html for both 403 and 404.
 * ------------------------------------------------------------------------ */
if (!existsSync(join(OUT, "404.html"))) {
  fail(
    "404 page",
    "out/404.html is missing — CloudFront's error responses would 403.",
  );
}

/* ------------------------------------------------------------------------ *
 * 3. trailingSlash URL shape.
 * `out/pricing/index.html`, never `out/pricing.html`. The viewer-request
 * function resolves directories; a flat sibling would never be served.
 * ------------------------------------------------------------------------ */
const flat = files.filter(
  (f) =>
    f.endsWith(".html") &&
    !f.endsWith("index.html") &&
    relative(OUT, f) !== "404.html",
);
if (flat.length) {
  fail(
    "URL shape",
    `${flat.length} flat .html file(s) — expected directory/index.html under trailingSlash: true.\n` +
      flat
        .slice(0, 10)
        .map((f) => `      ${relative(OUT, f)}`)
        .join("\n"),
  );
}

/* ------------------------------------------------------------------------ *
 * 4. robots.txt and sitemap.xml exist, and carry a real origin.
 * NEXT_PUBLIC_SITE_URL is inlined at build time and then cached by CloudFront.
 * ------------------------------------------------------------------------ */
for (const name of ["robots.txt", "sitemap.xml"]) {
  if (!existsSync(join(OUT, name)))
    fail("metadata routes", `out/${name} is missing.`);
}

const sitemapPath = join(OUT, "sitemap.xml");
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (!locs.length) fail("sitemap", "sitemap.xml contains no <loc> entries.");

  const wrongOrigin = locs.filter(
    (u) => u.includes("hatchet.com") || u.includes("localhost"),
  );
  if (wrongOrigin.length) {
    fail(
      "sitemap origin",
      `${wrongOrigin.length} sitemap URL(s) point at a domain the site does not occupy.\n` +
        `    Set NEXT_PUBLIC_SITE_URL. First: ${wrongOrigin[0]}`,
    );
  }

  /* A canonical that disagrees with the served URL is worse than no canonical,
   * so every sitemap entry must resolve to a file that was actually emitted. */
  const unserved = locs
    .map((u) => new URL(u).pathname)
    .filter((p) => !p.endsWith("/") || !existsSync(join(OUT, p, "index.html")));
  if (unserved.length) {
    fail(
      "sitemap vs output",
      `${unserved.length} sitemap URL(s) have no emitted page.\n` +
        unserved
          .slice(0, 10)
          .map((p) => `      ${p}`)
          .join("\n"),
    );
  }
}

/* ------------------------------------------------------------------------ */
const pages = files.filter((f) => f.endsWith(".html")).length;

if (failures.length) {
  console.error("\n✗ export assertions failed\n");
  for (const { check, detail } of failures)
    console.error(`  ${check}: ${detail}\n`);
  process.exit(1);
}

console.log(
  `✓ export assertions passed — ${pages} HTML pages, ${files.length} files, ` +
    `0 /_next/image references`,
);
