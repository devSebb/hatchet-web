#!/usr/bin/env bash
#
# Build and deploy the static export to S3 + CloudFront.
#
#   ./scripts/deploy.sh staging
#   ./scripts/deploy.sh production
#
# No credentials live here. AWS auth comes from the environment the usual way —
# AWS_PROFILE, AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY, SSO, or an instance
# role. Set AWS_PROFILE if you use named profiles:
#
#   AWS_PROFILE=hatchet ./scripts/deploy.sh staging
#
set -euo pipefail

# ---------------------------------------------------------------------------
# Target
# ---------------------------------------------------------------------------
TARGET="${1:-}"

# Every value that differs between the two deployments lives here, keyed by
# target. This block is the single source of truth: nothing downstream infers
# an environment from anything else.
case "$TARGET" in
  staging)
    BUCKET="hatchet-website-staging"
    DISTRIBUTION_ID="E3UWU7EREIKJM8"
    SITE_URL="https://d316fu3le8ds9x.cloudfront.net"
    VERIFY_URL="https://d316fu3le8ds9x.cloudfront.net/"
    ;;
  production)
    BUCKET="hatchet-website-prod"
    DISTRIBUTION_ID="E2AT8DAYA74FI4"
    SITE_URL="https://hatchet.gg"
    VERIFY_URL="https://hatchet.gg/"
    ;;
  "")
    echo "ERROR: no target given." >&2
    echo "usage: $0 <staging|production>" >&2
    exit 64
    ;;
  *)
    echo "ERROR: unrecognised target '$TARGET'." >&2
    echo "usage: $0 <staging|production>" >&2
    exit 64
    ;;
esac

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> target: $TARGET  (bucket: $BUCKET, distribution: $DISTRIBUTION_ID)"

# ---------------------------------------------------------------------------
# 1. Preflight
#
# Everything that can be known before a two-minute build is checked before the
# build, so a failure costs seconds and names the fix.
# ---------------------------------------------------------------------------

for cmd in aws node pnpm; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "ERROR: $cmd is not on PATH." >&2
    exit 127
  }
done

# --- AWS credentials -------------------------------------------------------
# `command -v aws` only proves the binary exists. This proves the caller can
# actually authenticate, which is the thing that fails on a fresh machine or an
# expired SSO session. Identity is printed; no secret is ever read or echoed.
if ! CALLER_ARN="$(aws sts get-caller-identity --query Arn --output text 2>/dev/null)"; then
  echo "ERROR: no usable AWS credentials." >&2
  echo "       'aws sts get-caller-identity' failed, so the sync and the" >&2
  echo "       invalidation would both fail after a full build." >&2
  echo "       Set AWS_PROFILE, run 'aws sso login', or provide" >&2
  echo "       AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in the environment." >&2
  exit 77
fi
echo "==> aws identity: $CALLER_ARN"

# --- DEPLOY_ENV ------------------------------------------------------------
# Derived from the target rather than required from the caller, because two
# independent switches can disagree — and `deploy.sh staging` with a stray
# DEPLOY_ENV=production in the shell would upload an INDEXABLE staging site.
# An explicit disagreement is a hard failure rather than a silent precedence
# rule, so nobody has to remember which one wins.
if [ -n "${DEPLOY_ENV:-}" ] && [ "$DEPLOY_ENV" != "$TARGET" ]; then
  echo "ERROR: DEPLOY_ENV='$DEPLOY_ENV' contradicts the target '$TARGET'." >&2
  echo "       DEPLOY_ENV decides whether robots.txt allows indexing." >&2
  echo "       Unset it and let the target choose:  unset DEPLOY_ENV" >&2
  exit 78
fi
export DEPLOY_ENV="$TARGET"

# --- NEXT_PUBLIC_SITE_URL --------------------------------------------------
# Inlined at build time into every canonical, OG url and sitemap entry, then
# cached by CloudFront. There is no request-time chance to correct a miss.
#
# THIS IS WHY A STAGING ARTIFACT CAN NEVER BE PROMOTED TO PRODUCTION: the two
# differ in bytes that are baked into the HTML, not in configuration applied at
# serve time. Each environment must be built separately, from its own value.
#
# The script sets it from the target. A conflicting value in the environment is
# a hard failure — and note that exporting it here also overrides .env.local,
# which on a developer machine holds the PRODUCTION url and would otherwise
# have made a local `deploy.sh staging` publish production canonicals to the
# staging bucket.
if [ -n "${NEXT_PUBLIC_SITE_URL:-}" ] && [ "$NEXT_PUBLIC_SITE_URL" != "$SITE_URL" ]; then
  echo "ERROR: NEXT_PUBLIC_SITE_URL='$NEXT_PUBLIC_SITE_URL' contradicts the" >&2
  echo "       target '$TARGET', which builds with '$SITE_URL'." >&2
  echo "       It is baked into every canonical and sitemap entry, so the" >&2
  echo "       mismatch would ship. Unset it, or fix the variable in CI." >&2
  exit 78
fi
export NEXT_PUBLIC_SITE_URL="$SITE_URL"
echo "==> site url: $NEXT_PUBLIC_SITE_URL"

echo "==> building ($TARGET)"
rm -rf out
# DEPLOY_ENV and NEXT_PUBLIC_SITE_URL are exported above. app/robots.ts allows
# indexing only for the literal "production"; anything else, including a typo,
# emits a blanket disallow.
pnpm build

# ---------------------------------------------------------------------------
# The /_next/image gate, again.
#
# `pnpm build` already runs scripts/assert-export.mjs. This repeats the single
# most dangerous check right before upload, because it is the one failure that
# builds green, passes a local smoke test, and 404s every image in production.
# ---------------------------------------------------------------------------
if grep -rl "/_next/image" out --include="*.html" --include="*.txt" \
     --include="*.css" --include="*.xml" >/dev/null 2>&1; then
  echo "ERROR: out/ references /_next/image, which does not exist in a static export." >&2
  echo "       Every one of those is a broken image in production." >&2
  grep -rl "/_next/image" out --include="*.html" --include="*.txt" \
    --include="*.css" --include="*.xml" | head -10 >&2
  exit 65
fi

[ -f out/404.html ] || {
  echo "ERROR: out/404.html is missing." >&2
  echo "       CloudFront maps both 403 and 404 to it; without it every dead" >&2
  echo "       URL returns a raw S3 AccessDenied document." >&2
  exit 65
}

# --- page count ------------------------------------------------------------
# The build reports "Generating static pages (126/126)". That 126 is 124 HTML
# files (123 index.html + 404.html) plus robots.txt and sitemap.xml, which are
# routes that emit as .txt and .xml rather than HTML.
#
# A drop here means a route stopped generating — most likely a dynamic segment
# whose generateStaticParams returned nothing, which under `output: "export"`
# fails loudly, or a content sync that removed posts, which does not.
EXPECTED_PAGES=126
HTML_COUNT="$(find out -name '*.html' | wc -l | tr -d ' ')"
METADATA_COUNT=0
[ -f out/robots.txt ] && METADATA_COUNT=$((METADATA_COUNT + 1))
[ -f out/sitemap.xml ] && METADATA_COUNT=$((METADATA_COUNT + 1))
PAGE_COUNT=$((HTML_COUNT + METADATA_COUNT))

if [ "$PAGE_COUNT" -ne "$EXPECTED_PAGES" ]; then
  echo "ERROR: expected $EXPECTED_PAGES pages, built $PAGE_COUNT." >&2
  echo "       ($HTML_COUNT HTML + $METADATA_COUNT of robots.txt/sitemap.xml)" >&2
  echo "       A route stopped generating, or content was added or removed." >&2
  echo "       If the change is intended, update EXPECTED_PAGES in this file." >&2
  exit 65
fi

echo "==> out/: $PAGE_COUNT pages, $(find out -type f | wc -l | tr -d ' ') files, $(du -sh out | cut -f1)"

# ---------------------------------------------------------------------------
# 2. Immutable assets FIRST, and without --delete.
#
# Ordering is not cosmetic. A visitor mid-session is running the previous
# build's HTML, which references the previous build's chunk hashes. Upload the
# new assets before the new HTML and both builds' assets are present for the
# whole window: nobody's navigation breaks. Upload HTML first and there is a gap
# where a page references chunks that are not there yet.
#
# No --delete here for the same reason — see step 3.
#
# Content-hashed filenames, so a year and immutable: these bytes can never
# change under a given name.
# ---------------------------------------------------------------------------
echo "==> syncing immutable assets (no --delete)"

aws s3 sync out/_next/static/ "s3://$BUCKET/_next/static/" \
  --cache-control "public,max-age=31536000,immutable" \
  --only-show-errors

aws s3 sync out/_img/ "s3://$BUCKET/_img/" \
  --cache-control "public,max-age=31536000,immutable" \
  --only-show-errors

# ---------------------------------------------------------------------------
# 3. Everything else, WITH --delete.
#
# HTML, the RSC .txt payloads, sitemap.xml, robots.txt and the images that are
# not content-hashed. --delete belongs here and only here: it removes pages and
# payloads that no longer exist, which is what stops a deleted route serving
# forever and stops orphaned .txt payloads feeding stale client navigation.
#
# It must NOT touch _next/static or _img. Deleting the previous build's chunks
# while someone is mid-navigation on the previous build breaks their session —
# hence the excludes, which apply to the destination as well as the source.
#
# max-age=0,must-revalidate, not no-store: CloudFront and the browser may keep
# the bytes, but must revalidate before reusing them, so an invalidation is
# picked up immediately.
# ---------------------------------------------------------------------------
echo "==> syncing pages and payloads (with --delete)"

aws s3 sync out/ "s3://$BUCKET/" \
  --delete \
  --exclude "_next/static/*" \
  --exclude "_img/*" \
  --cache-control "public,max-age=0,must-revalidate" \
  --only-show-errors

# ---------------------------------------------------------------------------
# 4. Invalidate.
#
# One wildcard path, deliberately. CloudFront allows 1,000 free invalidation
# paths per month and charges beyond that; "/*" counts as ONE. Listing the
# ~1,370 objects individually would exhaust the free tier in a single deploy.
# ---------------------------------------------------------------------------
echo "==> invalidating CloudFront"

INVALIDATION_ID="$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)"

echo "    invalidation: $INVALIDATION_ID"
echo "==> waiting for the invalidation to complete (usually 1-3 minutes)"

# Waiting rather than firing and forgetting: without this the script exits
# "successful" while the edge is still serving the previous build, and whoever
# opens the verify URL sees the old site and reasonably concludes the deploy
# failed. For the editors' /publish command that difference is the whole
# experience.
if aws cloudfront wait invalidation-completed \
     --distribution-id "$DISTRIBUTION_ID" \
     --id "$INVALIDATION_ID"; then
  echo "    invalidation complete"
else
  echo "WARNING: the wait timed out or failed." >&2
  echo "         The upload SUCCEEDED — only the cache purge is unconfirmed." >&2
  echo "         Do not re-run the deploy. Check with:" >&2
  echo "           aws cloudfront get-invalidation \\" >&2
  echo "             --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID" >&2
fi

# ---------------------------------------------------------------------------
# 5. Done
# ---------------------------------------------------------------------------
cat <<EOF

==> deployed to $TARGET

    verify:  $VERIFY_URL

    Invalidation $INVALIDATION_ID has completed, so the URL above is
    already serving this build.

EOF

if [ "$TARGET" = "staging" ]; then
  cat <<'EOF'
    Staging is gated by the CloudFront viewer-request function and serves
    "Disallow: /". Check both — an open staging bucket, or an indexable one,
    is the failure that layer exists to prevent:

      curl -sI https://d316fu3le8ds9x.cloudfront.net/pricing/    # expect 401
      curl -s -u hatchet:PASSWORD https://d316fu3le8ds9x.cloudfront.net/robots.txt

EOF
fi
