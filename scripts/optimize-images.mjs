#!/usr/bin/env node
/**
 * Generates responsive WebP variants for the raster images in public/.
 *
 * Why this exists: under `output: "export"` Next's image optimizer does not
 * run, so `next/image` either emits dead /_next/image URLs or (with
 * `unoptimized: true`) drops srcSet entirely and ships full-resolution
 * originals to phones. Generating variants at build time and serving them
 * through a custom loader (lib/image-loader.ts) keeps srcSet intact and works
 * on static hosting.
 *
 * Source of truth is scripts/image-manifest.json. Originals are never touched
 * and never deleted — they are the input for every regeneration.
 *
 *   node scripts/optimize-images.mjs           # incremental (skips unchanged)
 *   node scripts/optimize-images.mjs --force   # rebuild everything
 *
 * Writes:
 *   public/_img/**            the variants
 *   lib/image-variants.json   { "/src/path.png": [widths] } consumed by the loader
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST = path.join(ROOT, "scripts/image-manifest.json");
const CACHE = path.join(ROOT, "public/_img/.build-cache.json");
const VARIANT_MAP = path.join(ROOT, "lib/image-variants.json");

const force = process.argv.includes("--force");
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const outDir = path.join(ROOT, manifest.outputDir);

/** Variant path for a source URL at a width, relative to public/. Must stay in
 *  lockstep with variantPath() in lib/image-loader.ts. */
function variantRelPath(srcUrl, width) {
  const noExt = srcUrl.replace(/^\//, "").replace(/\.(png|jpe?g)$/i, "");
  return `_img/${noExt}-${width}.webp`;
}

/** Cheap change detector: source bytes + mtime + the settings that affect output. */
function sourceKey(absSrc, quality, widths) {
  const st = statSync(absSrc);
  return createHash("sha1")
    .update(`${st.size}:${st.mtimeMs}:${quality}:${widths.join(",")}`)
    .digest("hex");
}

const cache =
  !force && existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};

const rows = [];
const variantMap = {};
let srcTotal = 0;
let outTotal = 0;
let generated = 0;
let skipped = 0;

for (const [srcUrl, cfg] of Object.entries(manifest.images)) {
  const absSrc = path.join(ROOT, "public", srcUrl);
  if (!existsSync(absSrc)) {
    console.error(`  ! missing source, skipped: ${srcUrl}`);
    continue;
  }

  const key = sourceKey(absSrc, cfg.quality, cfg.widths);
  const fresh = cache[srcUrl] === key;
  const srcBytes = statSync(absSrc).size;
  srcTotal += srcBytes;
  variantMap[srcUrl] = cfg.widths;

  for (const width of cfg.widths) {
    const rel = variantRelPath(srcUrl, width);
    const abs = path.join(ROOT, "public", rel);

    // Never upscale: the manifest already clamps to the source width, but a
    // hand-edited manifest could ask for more.
    if (width > cfg.source.width) {
      console.error(
        `  ! ${srcUrl} @${width} exceeds source width ${cfg.source.width} — skipped (no upscaling)`,
      );
      continue;
    }

    if (fresh && existsSync(abs)) {
      outTotal += statSync(abs).size;
      skipped += 1;
      continue;
    }

    mkdirSync(path.dirname(abs), { recursive: true });
    await sharp(absSrc)
      .resize({
        width,
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
        fit: "inside",
      })
      // keepIccProfile: dropping the profile shifts colour, which would be a
      // visible design change. Everything else (EXIF, XMP) goes.
      .keepIccProfile()
      // Flat brand marks are hurt by lossy WebP's chroma subsampling on hard
      // edges (measured: raising quality 92 -> 95 moved PSNR by 0.1 dB, so the
      // quality factor was not the constraint). For that art lossless is
      // perceptually exact and usually *smaller*; for photographs and rendered
      // artwork it costs 3x, so it is opt-in per image via the manifest.
      .webp(
        cfg.lossless
          ? { lossless: true, effort: 6 }
          : {
              quality: cfg.quality,
              alphaQuality: 100,
              effort: 6,
              smartSubsample: true,
            },
      )
      .toFile(abs);

    const meta = await sharp(abs).metadata();
    const outBytes = statSync(abs).size;
    outTotal += outBytes;
    generated += 1;
    rows.push({
      src: srcUrl,
      variant: `/${rel}`,
      dims: `${meta.width}x${meta.height}`,
      alpha: meta.hasAlpha ? "a" : "-",
      before: srcBytes,
      after: outBytes,
      saved: (100 - (outBytes / srcBytes) * 100).toFixed(1),
    });
  }

  cache[srcUrl] = key;
}

// Prune variants that are no longer in the manifest.
const wanted = new Set(
  Object.entries(manifest.images).flatMap(([u, c]) =>
    c.widths.map((w) => path.join(ROOT, "public", variantRelPath(u, w))),
  ),
);
function prune(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) prune(p);
    else if (p.endsWith(".webp") && !wanted.has(p)) {
      rmSync(p);
      console.log(`  pruned stale variant ${path.relative(ROOT, p)}`);
    }
  }
}
prune(outDir);

mkdirSync(path.dirname(CACHE), { recursive: true });
writeFileSync(CACHE, JSON.stringify(cache, null, 2));
writeFileSync(VARIANT_MAP, `${JSON.stringify(variantMap, null, 2)}\n`);

const kb = (b) => `${(b / 1024).toFixed(0)}`;
if (rows.length) {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    `\n${pad("source", 44)}${pad("variant", 50)}${pad("dims", 12)}${pad("a", 2)}${pad("src KB", 8)}${pad("out KB", 8)}saved`,
  );
  console.log("-".repeat(132));
  for (const r of rows) {
    console.log(
      pad(r.src, 44) +
        pad(r.variant, 50) +
        pad(r.dims, 12) +
        pad(r.alpha, 2) +
        pad(kb(r.before), 8) +
        pad(kb(r.after), 8) +
        `${r.saved}%`,
    );
  }
}

console.log(
  `\n${generated} generated, ${skipped} unchanged (skipped).` +
    `\nsource originals: ${(srcTotal / 1048576).toFixed(2)} MB` +
    `\nall variants:     ${(outTotal / 1048576).toFixed(2)} MB` +
    `\nvariant map:      lib/image-variants.json (${Object.keys(variantMap).length} images)`,
);
