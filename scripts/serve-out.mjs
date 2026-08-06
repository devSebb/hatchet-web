/**
 * Serves out/ the way CloudFront + S3(OAC) will:
 *   - /pricing/          -> /pricing/index.html
 *   - /                  -> /index.html
 *   - /pricing           -> 301 /pricing/
 *   - the four redirects -> 301
 *   - anything missing   -> 404 with out/404.html   (S3+OAC returns 403; the
 *                          distribution maps 403 and 404 to /404.html, code 404)
 * Deliberately mirrors rules 2 and 3 of infra/cloudfront-viewer-request.js, so
 * a URL that works here should work in front of CloudFront. It does NOT
 * implement the staging basic auth — that is distribution state, not routing.
 *
 *   node scripts/serve-out.mjs            # serves ./out on :8788
 *   node scripts/serve-out.mjs out 9000
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = process.argv[2] ?? "out";
const PORT = Number(process.argv[3] ?? 8788);

const REDIRECTS = {
  "/solutions/web-dashboard/": "/solutions/intelligence/",
  "/solutions/custom-reports/": "/solutions/reporting/",
  "/solutions/api-data-integrations/": "/solutions/reporting/",
  "/who-we-serve/esports-teams/": "/who-we-serve/esports-organizers/",
};

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let p = decodeURIComponent(url.pathname);

  const norm = p.endsWith("/") ? p : `${p}/`;
  if (REDIRECTS[norm]) {
    res.writeHead(301, { Location: REDIRECTS[norm] });
    return res.end();
  }

  const hasExt = /\.[^/]+$/.test(p);
  if (!hasExt && !p.endsWith("/")) {
    res.writeHead(301, { Location: `${p}/${url.search}` });
    return res.end();
  }
  if (!hasExt) p = `${p}index.html`;

  const file = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ""));
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error("not a file");
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    const body = await readFile(join(ROOT, "404.html")).catch(() => "404");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(body);
  }
}).listen(PORT, () => console.log(`serving ${ROOT} on ${PORT}`));
