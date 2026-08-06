# `infra/` — CloudFront edge configuration

The site is static HTML in S3, served through CloudFront. Everything that used
to be done by a Node server — basic auth, redirects, resolving `/pricing/` to a
file — now happens in one viewer-request function, or in distribution settings
that only exist in the AWS console.

| | S3 bucket | CloudFront ID | CloudFront domain |
|---|---|---|---|
| Production | `hatchet-website-prod` | `E2AT8DAYA74FI4` | `d1yuwj4wngr61o.cloudfront.net` |
| Staging | `hatchet-website-staging` | `E3UWU7EREIKJM8` | `d316fu3le8ds9x.cloudfront.net` |

Target domain: **`hatchet.gg`**.

---

## `cloudfront-viewer-request.js`

Runs on every request, before the cache, on both distributions. It does three
things in a fixed order:

1. **Basic auth**, staging only — keyed off the `Host` header, so one published
   function serves both distributions and production needs no edit.
2. **The four retired-slug redirects**, as 301s. Before the rewrite, so
   `/solutions/web-dashboard` reaches its destination in one hop instead of
   chaining through `/solutions/web-dashboard/`.
3. **The `trailingSlash: true` rewrite** — `/pricing/` → `/pricing/index.html`,
   `/` → `/index.html`, and `/pricing` → 301 `/pricing/`. Paths that already
   name a file are passed through untouched.

### ⚠️ ES5.1

The CloudFront Functions runtime is ECMAScript 5.1. No `const`, `let`, arrow
functions, template literals, `Array.includes`, `String.startsWith`/`endsWith`,
object spread, or `for...of`. **It fails at publish time, not at test time**, so
verify before you upload:

```bash
node infra/cloudfront-viewer-request.test.mjs
```

That parses the function in strict ES5, checks it against the 10 KB source
limit, and runs 24 behavioural cases. It has no dependencies.

There is also a ~1 ms CPU budget. The function currently uses ~7.4 KB of the
10 KB. **The ~380-entry legacy `streamhatchet.com` redirect table will not fit**
and must not be added inline — it needs CloudFront KeyValueStore. That is
Phase 7.

### Publishing

The credential is not in the repository. Substitute it on the way out:

```bash
# 1. Build the credential (do this once; store it in a password manager)
STAGING_B64=$(printf 'hatchet:THE-PASSWORD' | base64)

# 2. Substitute and publish
sed "s/__STAGING_BASIC_AUTH_B64__/$STAGING_B64/" \
  infra/cloudfront-viewer-request.js > /tmp/viewer-request.js

aws cloudfront create-function \
  --name hatchet-viewer-request \
  --function-config Comment="auth + redirects + trailing-slash rewrite",Runtime=cloudfront-js-2.0 \
  --function-code fileb:///tmp/viewer-request.js

# 3. Test it in the AWS test harness, then publish
aws cloudfront publish-function --name hatchet-viewer-request --if-match <ETAG>

# 4. Associate with BOTH distributions, viewer-request event, default behaviour
rm /tmp/viewer-request.js
```

On an update use `update-function` with the current `ETag`, then
`publish-function`, then invalidate.

If the deployed function still contains the literal
`__STAGING_BASIC_AUTH_B64__`, the substitution step was skipped: staging is
then gated by a string that is in git, and nothing will authenticate.

**The old `admin` / `hatchet26` credential from `proxy.ts` is burned.** It is in
git history permanently. Do not reuse it.

---

## Distribution settings — console/IaC only

None of this can live in the function. All of it is required.

### Custom error responses — the one that gets missed

| HTTP error code | Response page path | HTTP response code | TTL |
|---|---|---|---|
| **403** | `/404.html` | **404** | 0 |
| **404** | `/404.html` | **404** | 0 |

**403 must be mapped.** S3 behind Origin Access Control returns **403, not
404**, for a key that does not exist — a private bucket does not admit which
keys are missing. Without this mapping, a mistyped URL shows the visitor a raw
S3 `AccessDenied` XML document.

**The response code must be 404, never 200.** Returning `/index.html` with a
200 is the SPA pattern; here it would make every dead URL report success, and
Google indexes soft-404s as real pages.

### Origin

- S3 bucket as a **REST origin** (`bucket.s3.region.amazonaws.com`), **not** the
  website endpoint.
- **Origin Access Control (OAC)**, with the generated bucket policy applied.
- **Block Public Access: ON.** All four settings.
- **Static website hosting: DISABLED.** It is mutually exclusive with OAC, and
  the function already does the index-document resolution it would have
  provided.

### Certificate and domain

- ACM certificate in **`us-east-1`** — CloudFront reads certificates from that
  region only, regardless of where the bucket is.
- Alternate domain names: `hatchet.gg`, `www.hatchet.gg`.
- Viewer protocol policy: **Redirect HTTP to HTTPS**.

### Cache behaviour

- Default: `GET, HEAD`. Compress objects automatically: **on**.
- Cache policy `CachingOptimized`; the origin's `Cache-Control` headers are set
  by `scripts/deploy.sh` (immutable for hashed assets, `max-age=0,
  must-revalidate` for HTML).
- **Viewer-request function association on the default behaviour.** Without it
  every clean URL 403s.

### Not configured, and known

There is no response-headers policy — no CSP, HSTS, or `X-Frame-Options`. There
was none on the previous hosting either, so this is not a regression, but it is
the natural place to add them.

---

## Testing a deployment

Against staging, with credentials; against production, without.

```bash
BASE=https://d316fu3le8ds9x.cloudfront.net
AUTH='-u hatchet:THE-PASSWORD'

curl -sI $AUTH "$BASE/pricing/"                      # 200, text/html
curl -sI $AUTH "$BASE/pricing"                       # 301 -> /pricing/
curl -sI $AUTH "$BASE/"                              # 200
curl -sI $AUTH "$BASE/no-such-page/"                 # 404, and the styled page
curl -sI $AUTH "$BASE/solutions/web-dashboard"       # 301 -> /solutions/intelligence/
curl -sI $AUTH "$BASE/solutions/custom-reports/"     # 301 -> /solutions/reporting/
curl -sI $AUTH "$BASE/solutions/api-data-integrations/"  # 301 -> /solutions/reporting/
curl -sI $AUTH "$BASE/who-we-serve/esports-teams/"   # 301 -> /who-we-serve/esports-organizers/
curl -sI $AUTH "$BASE/_img/images/hero-dashboard-2000.webp"  # 200, image/webp, immutable
curl -sI      "$BASE/pricing/"                       # 401 — the gate works
curl -s  $AUTH "$BASE/robots.txt"                    # staging: Disallow: /
```

The last two are the ones worth repeating after every change: a staging bucket
that answers without credentials, or serves an indexable `robots.txt`, is the
failure this whole layer exists to prevent.

Locally, `scripts/serve-out.mjs` mirrors rules 2 and 3 of the function, so a URL
that works there should work here.
