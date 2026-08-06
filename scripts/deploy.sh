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

case "$TARGET" in
  staging)
    BUCKET="hatchet-website-staging"
    DISTRIBUTION_ID="E3UWU7EREIKJM8"
    VERIFY_URL="https://d316fu3le8ds9x.cloudfront.net/"
    ;;
  production)
    BUCKET="hatchet-website-prod"
    DISTRIBUTION_ID="E2AT8DAYA74FI4"
    VERIFY_URL="https://hatchet.gg/"
    ;;
  *)
    echo "usage: $0 <staging|production>" >&2
    exit 64
    ;;
esac

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> target: $TARGET  (bucket: $BUCKET, distribution: $DISTRIBUTION_ID)"

# ---------------------------------------------------------------------------
# 1. Preflight, then build
#
# NEXT_PUBLIC_SITE_URL is inlined at build time and then cached by CloudFront —
# there is no request-time chance to fix a miss, and the result is wrong
# canonicals, wrong OG URLs and a wrong sitemap on every page. lib/config/site.ts
# throws on a production build too; this check exists so the failure arrives
# before a two-minute build rather than after it.
# ---------------------------------------------------------------------------
if [ -z "${NEXT_PUBLIC_SITE_URL:-}" ]; then
  if [ -f .env.local ] && grep -q '^NEXT_PUBLIC_SITE_URL=.\+' .env.local; then
    echo "==> NEXT_PUBLIC_SITE_URL comes from .env.local"
  else
    echo "ERROR: NEXT_PUBLIC_SITE_URL is not set." >&2
    echo "       It decides every canonical, OG url and sitemap entry, is baked" >&2
    echo "       in at build time, and is then cached by CloudFront." >&2
    echo "       Set it to https://hatchet.gg (see .env.example)." >&2
    exit 78
  fi
fi

for cmd in aws node pnpm; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: $cmd not found on PATH" >&2; exit 127; }
done

echo "==> building"
rm -rf out
# DEPLOY_ENV drives app/robots.ts: only "production" emits an indexable
# robots.txt. Anything else — including a typo — disallows everything.
DEPLOY_ENV="$TARGET" pnpm build

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

[ -f out/404.html ] || { echo "ERROR: out/404.html missing" >&2; exit 65; }

echo "==> out/: $(find out -type f | wc -l | tr -d ' ') files, $(du -sh out | cut -f1)"

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

# ---------------------------------------------------------------------------
# 5. Done
# ---------------------------------------------------------------------------
cat <<EOF

==> deployed to $TARGET

    verify:  $VERIFY_URL

    Invalidation $INVALIDATION_ID is in progress — allow a minute or two
    before trusting what you see. Watch it with:

      aws cloudfront wait invalidation-completed \\
        --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID

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
