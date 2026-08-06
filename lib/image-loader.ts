import variants from "@/lib/image-variants.json";

/**
 * Custom next/image loader.
 *
 * Next's built-in optimizer is a server route (/_next/image) that does not
 * exist in a static export. This loader points at the WebP variants generated
 * by `node scripts/optimize-images.mjs` instead, which keeps `srcSet` intact —
 * the thing `images.unoptimized: true` throws away.
 *
 * Anything without a generated variant falls through to the original URL
 * untouched, so SVGs, remote WordPress media and any newly-added file all keep
 * working; a missing variant degrades to the original rather than 404ing.
 */

const availableWidths = variants as Record<string, number[]>;

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
  // Remote images (the WordPress media library) and anything not rooted in
  // public/ have no local variants. Pass through — next/image still renders
  // them, they just aren't resized by us.
  if (!src.startsWith("/") || src.startsWith("//")) {
    return src;
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
