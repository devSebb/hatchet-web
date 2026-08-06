/**
 * CloudFront viewer-request function for hatchet.gg.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │ ECMASCRIPT 5.1 ONLY.                                                   │
 * │                                                                        │
 * │ The CloudFront Functions runtime is ES5.1. No const, no let, no arrow  │
 * │ functions, no template literals, no object spread, no Array.includes,  │
 * │ no String.startsWith / endsWith / padStart, no Object.assign, no       │
 * │ for...of, no default or rest parameters. Anything newer fails to       │
 * │ publish — and it fails at publish time, not at test time.              │
 * │                                                                        │
 * │ There is also a hard 10 KB source limit and roughly 1 ms of CPU.       │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Runs on EVERY request, before the cache. It does three things, in this order,
 * and the order is load-bearing:
 *
 *   1. Basic auth   — staging only. Nothing else runs for an unauthenticated
 *                     viewer, so staging does not leak its redirect map or its
 *                     URL shape.
 *   2. Redirects    — the four retired slugs, as 301s. These must come BEFORE
 *                     the trailing-slash rewrite: `/solutions/web-dashboard`
 *                     would otherwise 301 to `/solutions/web-dashboard/` and
 *                     then 301 again to the destination, and a redirect chain
 *                     leaks link equity and is flagged by every audit tool.
 *   3. Rewrite      — `trailingSlash: true` means the site is built as
 *                     `/pricing/index.html`. S3 will not resolve `/pricing/` to
 *                     that on its own through an OAC origin, so this maps it.
 *
 * Deployment, testing and the accompanying distribution settings are in
 * infra/README.md. Read it before publishing — several required settings
 * (403 -> /404.html, OAC, us-east-1 certificate) are console-side and cannot
 * be expressed here.
 */

/**
 * Base64 of "user:password" for the staging gate.
 *
 * NOT the real value. It is substituted at publish time so the credential never
 * enters git — see "Publishing" in infra/README.md. If you are reading this
 * string in a deployed function, the substitution step was skipped and staging
 * is gated by a credential that is in the repository.
 */
var STAGING_CREDENTIAL = "__STAGING_BASIC_AUTH_B64__";

/**
 * Hosts that must be gated. Production is ungated once launched, so the check
 * is an allow-list of *staging* rather than a deny-list of production: a new
 * distribution or a typo'd host then defaults to ungated-production behaviour
 * only if it is genuinely not in this list.
 *
 * The apex and www hosts are deliberately absent.
 */
var STAGING_HOSTS = ["d316fu3le8ds9x.cloudfront.net"];

/**
 * Retired slugs on THIS site — not legacy streamhatchet.com URLs.
 *
 * Keys are stored in their trailing-slash form and looked up after
 * normalisation, so both `/solutions/custom-reports` and
 * `/solutions/custom-reports/` resolve in one hop. Values carry the trailing
 * slash because that is what the site now serves; pointing at the unslashed
 * form would produce a chain through rule 3.
 *
 * The ~380-entry legacy table is NOT here and must not be added inline — this
 * function is capped at 10 KB. It needs CloudFront KeyValueStore. Phase 7.
 */
var REDIRECTS = {
  "/solutions/web-dashboard/": "/solutions/intelligence/",
  "/solutions/custom-reports/": "/solutions/reporting/",
  "/solutions/api-data-integrations/": "/solutions/reporting/",
  "/who-we-serve/esports-teams/": "/who-we-serve/esports-organizers/",
};

function isStaging(host) {
  var i;
  for (i = 0; i < STAGING_HOSTS.length; i++) {
    if (STAGING_HOSTS[i] === host) {
      return true;
    }
  }
  return false;
}

/** True when the last path segment carries a file extension, e.g. `.webp`. */
function hasExtension(uri) {
  var lastSlash = uri.lastIndexOf("/");
  var segment = uri.substring(lastSlash + 1);
  return segment.indexOf(".") !== -1;
}

function endsWithSlash(uri) {
  return uri.charAt(uri.length - 1) === "/";
}

function unauthorized() {
  return {
    statusCode: 401,
    statusDescription: "Unauthorized",
    headers: {
      "www-authenticate": {
        value: 'Basic realm="Hatchet staging", charset="UTF-8"',
      },
      "cache-control": { value: "no-store" },
    },
  };
}

function movedPermanently(location) {
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: location },
      "cache-control": { value: "public, max-age=3600" },
    },
  };
}

/** `?a=1&b=2` rebuilt from the event's parsed querystring, or "" if empty. */
function queryString(request) {
  var qs = request.querystring;
  var parts = [];
  var name;
  var value;
  var i;

  for (name in qs) {
    if (Object.prototype.hasOwnProperty.call(qs, name)) {
      value = qs[name];
      if (value.multiValue) {
        for (i = 0; i < value.multiValue.length; i++) {
          parts.push(name + "=" + value.multiValue[i].value);
        }
      } else if (value.value === "") {
        parts.push(name);
      } else {
        parts.push(name + "=" + value.value);
      }
    }
  }

  return parts.length ? "?" + parts.join("&") : "";
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var headers = request.headers;
  var host = headers.host ? headers.host.value : "";
  var authHeader;
  var lookup;
  var destination;

  // ---- 1. Basic auth (staging only) --------------------------------------
  if (isStaging(host)) {
    authHeader = headers.authorization ? headers.authorization.value : "";
    if (authHeader !== "Basic " + STAGING_CREDENTIAL) {
      return unauthorized();
    }
  }

  // ---- 2. Retired slugs, as 301s -----------------------------------------
  // Normalised to the trailing-slash form first so both shapes redirect in a
  // single hop rather than chaining through rule 3.
  lookup = endsWithSlash(uri) ? uri : uri + "/";
  if (Object.prototype.hasOwnProperty.call(REDIRECTS, lookup)) {
    destination = REDIRECTS[lookup];
    return movedPermanently(destination + queryString(request));
  }

  // ---- 3. trailingSlash: true --------------------------------------------
  // A path that already names a file is left alone: /_img/... , /sitemap.xml,
  // /robots.txt, /favicon.ico and every hashed asset under /_next/static must
  // reach S3 untouched.
  if (hasExtension(uri)) {
    return request;
  }

  // `/pricing` -> 301 `/pricing/`. One canonical URL per page, and it is the
  // one the sitemap and the canonical tag both declare.
  if (!endsWithSlash(uri)) {
    return movedPermanently(uri + "/" + queryString(request));
  }

  // `/pricing/` -> `/pricing/index.html`, and `/` -> `/index.html`.
  // A rewrite, not a redirect: the viewer keeps the clean URL.
  request.uri = uri + "index.html";
  return request;
}
