import variants from "@/lib/image-variants.json";
import remoteSizes from "@/lib/remote-image-sizes.json";

/**
 * Custom next/image loader.
 *
 * Next's built-in optimizer is a server route (/_next/image) that does not
 * exist in a static export. This loader points at pre-generated renditions
 * instead, which keeps `srcSet` intact — the thing `images.unoptimized: true`
 * throws away. Two sources:
 *
 *   local  — WebP variants built by `node scripts/optimize-images.mjs`
 *   remote — the renditions WordPress already published, recorded by
 *            `pnpm sync:wp` (nothing is downloaded; these stay on the media
 *            library)
 *
 * Anything with no recorded rendition falls through to the original URL
 * untouched, so SVGs and any newly-added file keep working; a missing rendition
 * degrades to the original rather than 404ing.
 */

const availableWidths = variants as Record<string, number[]>;

const remotePrefix = remoteSizes.prefix;

/** `[width, pathRelativeToPrefix]` pairs, narrowest first. Typed loosely because
 *  TypeScript infers `(string | number)[][]` from the JSON rather than a tuple. */
type RemoteLadder = readonly (readonly (number | string)[])[];
const remoteLadders: Record<string, RemoteLadder> = remoteSizes.images;

/** Must stay in lockstep with variantRelPath() in scripts/optimize-images.mjs. */
function variantPath(src: string, width: number): string {
  const noExt = src.replace(/^\//, "").replace(/\.(png|jpe?g)$/i, "");
  return `/_img/${noExt}-${width}.webp`;
}

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Remote images live on the WordPress media library. WordPress already
  // generates a ladder of renditions per upload; `pnpm sync:wp` records the
  // same-aspect-ratio ones so a phone can fetch a 300px cover instead of the
  // 1536px file. Anything not in that map passes through untouched.
  if (!src.startsWith("/") || src.startsWith("//")) {
    if (!src.startsWith(remotePrefix)) {
      return src;
    }

    const ladder = remoteLadders[src.slice(remotePrefix.length)];
    if (!ladder?.length) {
      return src;
    }

    const match =
      ladder.find((entry) => Number(entry[0]) >= width) ??
      ladder[ladder.length - 1];
    return remotePrefix + String(match[1]);
  }

  // SVGs are resolution-independent; resizing them would be pointless and, for
  // the isometric icon set, destructive. Never rewritten.
  if (/\.svg($|\?)/i.test(src)) {
    return src;
  }

  const widths = availableWidths[src];
  if (!widths || widths.length === 0) {
    return src;
  }

  // Smallest variant that still covers the requested width; if the request
  // exceeds everything we generated (the manifest caps at 2x the real rendered
  // size), serve the largest variant we have. That is the same behaviour as
  // Next's own optimizer when a source is smaller than the requested width.
  const chosen = widths.find((w) => w >= width) ?? widths[widths.length - 1];

  return variantPath(src, chosen);
}
