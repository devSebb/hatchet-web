/**
 * Tests infra/cloudfront-viewer-request.js. No dependencies:
 *
 *   node infra/cloudfront-viewer-request.test.mjs
 *
 * It also parses the function as strict ES5, which is the check that actually
 * matters — the CloudFront Functions runtime is ES5.1 and rejects anything
 * newer at PUBLISH time, long after it looked fine locally.
 *
 * The credential below is a stand-in for the test only. The real one is
 * substituted at publish time and is not in this repository — see the
 * "Publishing" section of infra/README.md.
 */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const CRED = Buffer.from("test-user:test-password").toString("base64");
const src = readFileSync("infra/cloudfront-viewer-request.js", "utf8").replace(
  "__STAGING_BASIC_AUTH_B64__",
  CRED,
);
const ctx = vm.createContext({ console });
vm.runInContext(src + "\n;globalThis.__handler = handler;", ctx);
const handler = ctx.__handler;

const PROD = "d1yuwj4wngr61o.cloudfront.net";
const STAGE = "d316fu3le8ds9x.cloudfront.net";

function call(uri, { host = PROD, auth, qs = {} } = {}) {
  const headers = { host: { value: host } };
  if (auth) headers.authorization = { value: auth };
  const res = handler({
    request: { uri, headers, querystring: qs, method: "GET" },
  });
  if (res.statusCode)
    return `${res.statusCode} ${res.headers?.location?.value ?? ""}`.trim();
  return `PASS -> ${res.uri}`;
}

const cases = [
  ["trailing slash", () => call("/pricing/"), "PASS -> /pricing/index.html"],
  ["no trailing slash", () => call("/pricing"), "301 /pricing/"],
  ["root", () => call("/"), "PASS -> /index.html"],
  [
    "nested trailing slash",
    () => call("/solutions/discovery/"),
    "PASS -> /solutions/discovery/index.html",
  ],
  [
    "404 path",
    () => call("/does-not-exist/"),
    "PASS -> /does-not-exist/index.html",
  ],
  [
    "static asset (webp)",
    () => call("/_img/images/hero-dashboard-2000.webp"),
    "PASS -> /_img/images/hero-dashboard-2000.webp",
  ],
  [
    "static asset (js chunk)",
    () => call("/_next/static/chunks/abc.js"),
    "PASS -> /_next/static/chunks/abc.js",
  ],
  ["sitemap.xml", () => call("/sitemap.xml"), "PASS -> /sitemap.xml"],
  ["robots.txt", () => call("/robots.txt"), "PASS -> /robots.txt"],
  [
    "RSC payload .txt",
    () => call("/pricing/index.txt"),
    "PASS -> /pricing/index.txt",
  ],
  [
    "redirect 1 (slashed)",
    () => call("/solutions/web-dashboard/"),
    "301 /solutions/intelligence/",
  ],
  [
    "redirect 1 (unslashed)",
    () => call("/solutions/web-dashboard"),
    "301 /solutions/intelligence/",
  ],
  [
    "redirect 2",
    () => call("/solutions/custom-reports/"),
    "301 /solutions/reporting/",
  ],
  [
    "redirect 3",
    () => call("/solutions/api-data-integrations/"),
    "301 /solutions/reporting/",
  ],
  [
    "redirect 4",
    () => call("/who-we-serve/esports-teams/"),
    "301 /who-we-serve/esports-organizers/",
  ],
  [
    "query preserved on 301",
    () => call("/pricing", { qs: { page: { value: "2" } } }),
    "301 /pricing/?page=2",
  ],
  [
    "query preserved on press",
    () => call("/resources/press", { qs: { page: { value: "2" } } }),
    "301 /resources/press/?page=2",
  ],
  [
    "prod: no auth needed",
    () => call("/pricing/"),
    "PASS -> /pricing/index.html",
  ],
  ["staging: no creds -> 401", () => call("/pricing/", { host: STAGE }), "401"],
  [
    "staging: wrong creds",
    () => call("/pricing/", { host: STAGE, auth: "Basic bogus" }),
    "401",
  ],
  [
    "staging: old hatchet26",
    () =>
      call("/pricing/", {
        host: STAGE,
        auth: "Basic " + Buffer.from("admin:hatchet26").toString("base64"),
      }),
    "401",
  ],
  [
    "staging: correct creds",
    () => call("/pricing/", { host: STAGE, auth: "Basic " + CRED }),
    "PASS -> /pricing/index.html",
  ],
  [
    "staging: asset also gated",
    () => call("/sitemap.xml", { host: STAGE }),
    "401",
  ],
  [
    "staging: redirect gated",
    () => call("/solutions/web-dashboard/", { host: STAGE }),
    "401",
  ],
];

// The ES5 gate. A parse error here is a function that will not publish.
let fail = 0;
try {
  const { parse } =
    await import("../node_modules/.pnpm/acorn@8.17.0/node_modules/acorn/dist/acorn.mjs");
  parse(readFileSync("infra/cloudfront-viewer-request.js", "utf8"), {
    ecmaVersion: 5,
    sourceType: "script",
  });
  console.log("\u2713 parses as strict ES5");
} catch (e) {
  fail++;
  console.log("\u2717 ES5 parse FAILED:", e.message);
}
const bytes = Buffer.byteLength(
  readFileSync("infra/cloudfront-viewer-request.js"),
);
console.log(
  `${bytes <= 10240 ? "\u2713" : "\u2717"} source is ${bytes} bytes of the 10240 limit`,
);
if (bytes > 10240) fail++;
console.log("");

for (const [name, fn, want] of cases) {
  let got;
  try {
    got = fn();
  } catch (e) {
    got = "THREW: " + e.message;
  }
  const ok = got === want;
  if (!ok) fail++;
  console.log(
    `${ok ? "✓" : "✗"} ${name.padEnd(28)} ${got}${ok ? "" : `   (expected: ${want})`}`,
  );
}
console.log(fail ? `\n${fail} FAILED` : `\nall ${cases.length} passed`);
process.exit(fail ? 1 : 0);
