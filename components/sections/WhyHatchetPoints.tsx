"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Globe as GlobeIcon, Plus } from "@phosphor-icons/react/ssr";

import {
  ChartLine,
  FileText,
  type IsoIcon,
  TrendUp,
} from "@/components/icons/iso-icons";
import { CreatorLifecycleOrbital } from "@/components/sections/CreatorLifecycleOrbital";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type PointVisual =
  | { kind: "platforms" }
  | { kind: "history" }
  | { kind: "logos" }
  | { kind: "intelligence" }
  | { kind: "lifecycle" };

type Point = {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  visual: PointVisual;
};

const POINTS: Point[] = [
  {
    id: "01",
    eyebrow: "Platform coverage",
    headline: "Name a Platform, Any Platform...",
    body: "Twitch, YouTube, TikTok, Instagram, and many more. That's socials and streaming all connected without a single gap in coverage.",
    visual: { kind: "platforms" },
  },
  {
    id: "02",
    eyebrow: "Verified data, longest history",
    headline: "Solid bedrock of vetted viewership over 10+ years.",
    body: "Build your benchmarks based on real data. Hatchet flags fake and suspicious channels so you can safely navigate past inflated audiences and botted viewership.",
    visual: { kind: "history" },
  },
  {
    id: "03",
    eyebrow: "Experience with global gaming brands",
    headline: "The teams running gaming depend on Hatchet's guidance.",
    body: "Riot, EA, Ubisoft, Capcom and dozens more use Hatchet's insights to make campaign decisions with confidence, from game launches to esports tournaments.",
    visual: { kind: "logos" },
  },
  {
    id: "04",
    eyebrow: "Stay ahead of the industry",
    headline:
      "Get the inside track on emerging trends in gaming & online culture.",
    body: "Analyst-written reports, expert insights, and market intelligence parse public sentiment so you can act before competitors.",
    visual: { kind: "intelligence" },
  },
  {
    id: "05",
    eyebrow: "One platform, built for you",
    headline: "Everything your team needs in one place.",
    body: "Find, analyze, execute, report: Do it all from a single, customized space that fits seamlessly into your style and workflow.",
    visual: { kind: "lifecycle" },
  },
];

// ── 01 · Platform coverage ─────────────────────────────────────────────────

type PlatformCategory = "live" | "social";

type Platform = {
  /** Canonical name. Doubles as the PLATFORM_ICONS lookup key. */
  name: string;
  categories: PlatformCategory[];
  /**
   * Per-tab display override, for platforms the industry names differently
   * depending on the surface: TikTok and Facebook are "TikTok Live" and
   * "Facebook Live" under Live Streaming, but keep their plain names under Social.
   */
  labels?: Partial<Record<PlatformCategory, string>>;
  /**
   * Borrow another entry's glyph, for platforms that share a brand mark with a
   * sibling: the retired global SOOP is the same brand as SOOP Korea.
   */
  icon?: string;
  /**
   * Archived: Hatchet still holds this platform's history and it stays queryable,
   * but no new data is collected. Rendered in a muted grey and sorted to the end
   * of whichever list it appears in.
   */
  legacy?: boolean;
};

const PLATFORM_CATEGORIES: { id: "all" | PlatformCategory; label: string }[] = [
  { id: "all", label: "All Platforms" },
  { id: "live", label: "Live Streaming" },
  { id: "social", label: "Social" },
];

const PLATFORMS: Platform[] = [
  { name: "Twitch", categories: ["live", "social"] },
  { name: "YouTube Gaming", categories: ["live"] },
  { name: "YouTube", categories: ["live", "social"] },
  {
    name: "TikTok",
    categories: ["live", "social"],
    labels: { live: "TikTok Live" },
  },
  { name: "Kick", categories: ["live", "social"] },
  { name: "Instagram", categories: ["social"] },
  {
    name: "Facebook",
    categories: ["live", "social"],
    labels: { live: "Facebook Live" },
  },
  { name: "X", categories: ["social"] },
  { name: "Discord", categories: ["social"] },
  { name: "Reddit", categories: ["social"] },
  { name: "Snapchat", categories: ["social"] },
  { name: "LinkedIn", categories: ["social"] },
  { name: "Steam", categories: ["live"] },
  { name: "Bilibili", categories: ["live"] },
  { name: "Huya", categories: ["live"] },
  { name: "Douyu", categories: ["live"] },
  { name: "SOOP Korea", categories: ["live"] },
  { name: "SOOP", categories: ["live"], icon: "SOOP Korea", legacy: true },
  { name: "Chzzk", categories: ["live"] },
  { name: "NimoTV", categories: ["live"] },
  { name: "Zhanqi", categories: ["live"] },
  { name: "Bigo Live", categories: ["live"] },
  { name: "Rumble", categories: ["live"] },
  { name: "Trovo", categories: ["live"], legacy: true },
  { name: "DLive", categories: ["live"], legacy: true },
  { name: "KakaoTV", categories: ["live"], legacy: true },
  { name: "NaverTV", categories: ["live"], legacy: true },
  { name: "Loco", categories: ["live"], legacy: true },
  { name: "Rooter", categories: ["live"] },
  { name: "VK", categories: ["live"] },
  { name: "Mildom", categories: ["live"], legacy: true },
  { name: "Nonolive", categories: ["live"], legacy: true },
  { name: "Booyah", categories: ["live"], legacy: true },
  { name: "Smashcast", categories: ["live"], legacy: true },
  { name: "Garena LIVE", categories: ["live"], legacy: true },
  { name: "Mixer", categories: ["live"], legacy: true },
  { name: "CubeTV", categories: ["live"], legacy: true },
  { name: "Openrec", categories: ["live"] },
  { name: "Spotify", categories: ["social"] },
  { name: "SoundCloud", categories: ["social"] },
  { name: "Pinterest", categories: ["social"] },
  { name: "Tumblr", categories: ["social"] },
  { name: "Medium", categories: ["social"] },
  { name: "Patreon", categories: ["social"] },
  { name: "Website", categories: ["social"] },
  { name: "Blog", categories: ["social"] },
  { name: "Yelp", categories: ["social"] },
  { name: "Foursquare", categories: ["social"] },
  { name: "Hudl", categories: ["social"] },
  { name: "MLG", categories: ["social"] },
  { name: "Flickr", categories: ["social"] },
  { name: "Dribbble", categories: ["social"] },
  { name: "500px", categories: ["social"] },
  { name: "VSCO", categories: ["social"] },
  { name: "Reverb Nation", categories: ["social"] },
  { name: "about.me", categories: ["social"] },
];

// Rounded down to the nearest ten so the headline figure stays honest as the
// roster shifts, rather than drifting away from a hardcoded string.
const TRACKED_PLATFORM_COUNT = PLATFORMS.filter((p) => !p.legacy).length;
const TRACKED_PLATFORM_STAT = `${Math.floor(TRACKED_PLATFORM_COUNT / 10) * 10}+`;

// Brand glyphs as inline SVG paths (simple-icons), matching the pattern used
// by FooterSocials. Platforms without a verified glyph fall back to the
// monogram tile in PlatformIcon rather than guessing at a logo.
// SOOP Korea (the AfreecaTV rebrand), NimoTV, Openrec and Rooter are not in any
// open icon library. SOOP/NimoTV were extracted from the official logo SVGs on
// Wikipedia/Wikimedia Commons; Openrec was reconstructed analytically from the
// official raster mark (donut R=12/r=7.212, a 46deg notch closing on the inner
// circle, a symmetric play triangle) and verified at 98% pixel overlap against
// the source -- its corners are sharp where the original rounds them at ~0.5px
// of the rendered size. Rooter is a deliberate simplification: its true mark is
// two diagonally-offset, interlocking three-colour hooks that neither reduce to
// clean primitives (best two-ring IoU ~0.45) nor survive flattening to one
// colour at 18px, where the weave and colour split vanish. It is rendered as
// two symmetric interlocking ring outlines, which read as the same "chain-link"
// silhouette at grid size. All are renormalized to single 24x24 currentColor
// paths. YouTube Gaming and YouTube share YouTube-family marks; the
// live variants of TikTok and Facebook reuse the parent mark, since the icon is
// keyed on the canonical platform name rather than the per-tab label. Chzzk and
// Bigo Live were traced from their official
// raster marks -- Chzzk's lightning-"Z" wordmark and the Bigo Live mascot -- each
// contour flattened to a single 24x24 currentColor silhouette to match the grid.
//
// Later additions, and where each came from:
//   * Yelp, Flickr, Dribbble, VSCO, Reverb Nation -- straight out of the
//     installed `simple-icons` package.
//   * NaverTV -- the Naver parent mark, which is how the service brands itself;
//     simple-icons carries no sub-brand glyph.
//   * Blog -- the RSS mark, the conventional stand-in for a feed.
//   * Mixer -- simple-icons drops brands once they shut down, so this was pulled
//     from simple-icons v3, the last release that still carried it.
//   * Hudl -- normalized from Hudl's own safari-pinned-tab.svg (a potrace mask on
//     a 700x700 canvas, flipped by the usual translate/scale group transform).
//     Re-fitted to the content bbox and rounded to 1dp; verified identical to the
//     3dp trace at both 88px and 22px.
//
//   * Medium -- the circular three-ellipse mark, NOT the simple-icons entry
//     (that one is the wordmark, which smudges at 22px and overruns the 24x24
//     box). Reconstructed analytically from the official raster: the disc and
//     all three ellipses measured off the alpha channel -- note the source is a
//     transparent PNG whose RGB is black throughout, so coverage is in alpha,
//     not luminance. Every hole fits a true ellipse to within 1% of its pixel
//     area, and all three share ry and sit on the centre line. Drawn as one
//     nonzero-fill path: disc clockwise, ellipses counter-clockwise so they
//     knock through. Verified at 99.64% IoU against the source (0.19% of pixels
//     mismatched), and legible down to 22px.
//
//   * Huya, Foursquare, 500px -- traced from official high-res rasters with the
//     pixel-boundary tracer described below. Foursquare and 500px are the icon
//     marks, NOT the simple-icons entries (those are wordmarks that smudge at
//     22px). IoU against source: Huya 98.92%, Foursquare 99.34%, 500px 96.31%
//     (500px is simplified harder on purpose -- its inner detail is lost at grid
//     size regardless, and the looser tolerance cuts the path from 4.3KB to 1.6KB
//     with no visible difference at 96px or 22px).
//
//   * Trovo, DLive, Booyah -- same tracer, from official rasters. IoU: Trovo
//     99.43%, DLive 98.66%, Booyah 95.90%. Trovo's white spiral tail is already
//     transparent in the source, so it falls out as a hole with no colour work.
//     DLive and Booyah ship with a background baked in and no alpha at all, so
//     ink is keyed on darkness instead: DLive keeps only the black ninja head
//     (its yellow disc is simply non-ink and drops away, the visor becomes a
//     hole, the brows and eyes return as ink inside it), and Booyah keeps only
//     the black burst so the orange "B!" knocks through it. Booyah scores lowest
//     of the set because of the drop shadow fringing its edge.
//
//   * Smashcast, CubeTV -- same tracer, both keyed on darkness (white bg, no
//     alpha). IoU: Smashcast 97.16%, CubeTV 98.45%. Smashcast's red/blue split is
//     decorative -- the radiating arrangement is the mark, so it flattens with no
//     loss. CubeTV keeps only the dark linework, which is what preserves the eyes:
//     the yellow face and the white eye interiors drop out as holes, and the play
//     triangles inside the eyes return as ink. Filling the whole silhouette was
//     tried and loses them. Note both sources are ~170px, so tracing at 512
//     interpolates rather than adding detail; the RDP tolerance is set higher here
//     (2.0) to stop that upscaling from over-sampling smooth curves, which cut
//     these from 5.4KB/4.5KB to 1.1KB/1.4KB with no visible change at 96px or 22px.
//
//   * Garena LIVE, Nonolive -- same tracer. IoU: Garena 97.98%, Nonolive 98.68%.
//     Garena's two reds are a gradient, not a distinction, so it flattens whole;
//     the white gaps between the flame tips and inside the swirl are what carry
//     the shape, and they are already transparent. Nonolive drops BOTH white and
//     red: keeping everything-but-white leaves the yellow ears invisible against
//     the red tile, reducing the mark to a generic play badge. Dropping the red
//     container as well lets the ears, the yellow ring and the play disc survive
//     as distinct shapes -- the same "the container is not the mark" call as DLive.
//
//   * Zhanqi, Douyu, about.me -- the last three, each needing a different trick.
//     Zhanqi's source is a lockup: its characters sit ON the flag, and knocked out
//     they turn to noise at 22px, so the tracer's fillHoles drops interior cutouts
//     and keeps a solid flag (the "TV" survives, being a separate shape, not a
//     hole). Its 76.73% IoU is measured against the unfilled mask and is the
//     dropped characters by design, not error -- the other scores are like-for-like.
//     Douyu is the reversal of an earlier wrong call: flattening its mascot by
//     alpha gives a blob, but keeping only the dark LINEWORK preserves the eye,
//     smile and fin, exactly as with Huya. Cropping off the "DOUYU" wordmark first
//     leaves the shark square. 93.04% at eps 1.4 -- thin strokes lose IoU faster
//     than solid shapes, and eps 1.0 costs 2.5x the bytes for 1.2 points.
//     about.me is a pure wordmark with no icon mark in existence; shipped at the
//     owner's explicit request, accepting that it is illegible at 22px. Ink is the
//     white letterforms, not the black plate, so it does not render as a big solid
//     slab against the dark grid.
//
//   * KakaoTV, Mildom, Loco -- IoU: KakaoTV 99.03%, Mildom 92.80%, Loco 99.72%.
//     KakaoTV and Loco are both "drop the tile, keep the mark": the black speech
//     bubble with "tv" knocking out of it, and the orange LOCO letterforms, with
//     their yellow and near-black containers discarded. Mildom keeps only the dark
//     linework, which is what preserves the pupils -- taking the whole creature
//     (everything but the cyan) fills the eyes into featureless blobs. Its lower
//     score is the usual thin-stroke penalty, same as Douyu.
//
// The tracer: potrace is not available here, so boundaries are walked directly.
// Each ink/non-ink pixel edge becomes a directed unit segment with ink kept on
// one side; chaining them gives closed loops whose winding is already correct for
// nonzero fill at any nesting depth, then Ramer-Douglas-Peucker simplifies. That
// nesting is what makes Huya work: "orange head and brown linework are ink" makes
// the white face patch fall out as a hole, and the brown play triangle floating
// inside that hole returns as ink one level deeper -- so the mark keeps the shape
// that identifies it instead of collapsing to a silhouette. Detached blobs under
// a size threshold are dropped, which is how MLG's (R) glyph was excluded.
//
// Still on the monogram fallback -- MLG, and only MLG:
// both framings were tried and neither survives. The parallelogram with the
// figure knocked out fragments into disconnected shards, and the figure alone is
// an unreadable blob; the mark depends on its blue/red/white split, so no single
// colour reading of it works at 22px. The brand is also absorbed into Blizzard
// now, with no live logo source. It can still be added later by handing the
// tracer a flat, geometric source -- the constraint throughout has been the mark
// itself, never the file format or the resolution.
const PLATFORM_ICONS: Record<string, string> = {
  KakaoTV:
    "M10.5 0L13.57 0L15.85 0.5L18.2 1.57L18.48 1.85L18.84 1.99L18.98 2.21L19.26 2.28L19.62 2.71L19.76 2.71L20.97 3.92L20.97 4.06L21.47 4.56L21.76 5.13L21.97 5.27L21.97 5.48L22.26 5.77L22.26 5.98L22.47 6.2L22.82 7.34L22.97 7.48L23.32 9.26L23.25 12.25L22.97 13.39L22.75 13.74L22.75 14.03L22.61 14.1L22.47 14.67L22.33 14.74L22.33 14.96L22.11 15.17L22.11 15.38L21.83 15.67L21.61 16.17L21.33 16.38L21.33 16.52L20.76 17.09L20.76 17.23L20.62 17.23L20.62 17.38L20.26 17.73L20.12 17.73L20.12 17.88L19.98 17.88L19.55 18.37L19.41 18.37L19.26 18.59L19.12 18.59L18.98 18.8L18.84 18.8L18.34 19.23L16.49 20.15L14.21 20.8L13.71 20.8L13.28 20.94L10.65 20.94L9.65 20.72L9.15 21.15L8.8 21.29L8.3 21.79L7.66 22.15L7.51 22.36L7.37 22.36L7.16 22.65L7.01 22.65L6.37 23.22L6.23 23.22L6.09 23.43L5.95 23.43L5.8 23.64L5.66 23.64L5.52 23.86L5.09 24L4.95 23.93L4.88 23.72L4.95 18.8L4.88 18.59L4.74 18.59L4.24 18.09L4.09 18.09L2.53 16.52L2.53 16.38L2.24 16.17L1.39 14.67L1.18 13.89L1.03 13.74L0.89 12.82L0.75 12.61L0.75 8.62L0.89 8.4L0.89 8.05L1.25 6.91L1.39 6.77L1.53 6.2L1.74 5.98L1.74 5.77L2.03 5.48L2.03 5.27L2.24 5.13L2.24 4.99L2.74 4.42L2.74 4.27L3.03 4.06L3.03 3.92L4.24 2.71L4.38 2.71L4.74 2.28L5.02 2.21L5.23 1.92L5.52 1.85L5.8 1.57L7.23 0.85L9.22 0.21L10.5 0.07ZM5.95 5.27L5.88 7.62L4.52 7.69L4.52 10.11L5.88 10.18L5.88 13.53L6.09 14.24L6.45 14.6L6.45 14.74L6.59 14.74L6.59 14.88L6.73 14.88L6.94 15.17L7.73 15.53L10.58 15.6L10.79 15.45L10.79 13.18L10.58 13.03L8.72 13.1L8.58 12.96L8.58 10.18L10.65 10.11L10.79 9.97L10.79 7.76L10.5 7.62L8.58 7.62L8.58 5.27L6.02 5.27ZM11.86 7.62L11.64 7.69L11.57 7.91L12 8.97L12 9.26L12.36 10.11L12.36 10.4L12.5 10.54L12.5 10.82L13 12.11L13 12.39L13.35 13.25L13.35 13.53L13.5 13.67L13.5 13.96L13.64 14.1L13.64 14.39L13.99 15.45L14.21 15.6L17.48 15.6L17.77 15.1L17.77 14.74L17.91 14.6L17.91 14.31L18.05 14.17L18.05 13.89L18.41 13.1L18.48 12.53L18.62 12.39L18.62 12.11L18.91 11.54L18.98 10.97L19.12 10.82L19.19 10.33L19.41 9.97L19.41 9.69L19.62 9.26L19.76 8.55L19.91 8.4L20.05 7.69L17.34 7.69L16.77 9.4L16.77 9.69L16.56 10.04L16.56 10.4L16.42 10.54L16.2 11.54L16.06 11.68L16.06 12.04L15.92 12.25L15.7 12.25L15.56 12.04L15.56 11.68L15.35 11.32L15.35 11.04L15.06 10.4L15.06 10.11L14.56 8.76L14.35 7.76L14.07 7.62L11.86 7.69Z",
  Mildom:
    "M10.19 2.99L10.84 2.99L11.38 3.16L12.24 3.64L13.05 4.56L13.43 5.37L14.72 5.1L15.37 4.83L15.91 4.83L16.45 6.23L16.88 7.9L20.82 6.5L22.11 5.91L22.81 5.74L22.98 5.58L23.35 5.58L23.95 8.33L23.95 13.89L23.62 15.88L23.19 17.5L21.95 20.52L21.2 20.36L16.45 18.31L16.13 18.42L15.96 19.01L14.83 21.01L14.4 20.95L10.84 19.6L10.68 19.44L9.06 18.96L8.68 18.69L6.26 17.88L5.82 17.61L0.76 18.63L0 18.63L1.73 16.31L1.73 16.1L0.32 15.56L1.35 13.83L1.83 12.27L1.67 10.38L1.19 8.76L2.16 8.39L3.13 8.22L3.34 8.06L3.4 7.15L3.67 6.28L3.99 5.69L4.53 5.15L5.29 4.83L6.09 4.83L7.5 5.58L7.98 4.56L8.68 3.75L9.28 3.32L10.19 3.05ZM10.03 3.69L9.11 4.07L8.47 4.77L7.71 6.39L7.6 7.25L7.23 6.93L6.9 6.28L6.2 5.64L5.45 5.42L4.8 5.47L4.31 5.85L3.83 6.77L3.67 7.79L3.72 8.44L2.75 8.82L2.1 8.87L1.89 9.03L2.16 10.22L2.16 12.76L1.83 13.73L1.19 14.91L2.53 15.56L1.02 17.72L1.73 17.72L6.09 16.8L8.58 17.82L9.01 17.88L9.11 18.04L9.82 18.2L10.25 18.47L13.75 19.71L14.56 18.47L15.16 17.02L15.37 16.91L20.98 19.28L21.47 18.42L22.06 16.8L22.54 14.86L22.54 14.27L22.71 13.94L22.81 9.36L22.54 7.36L22.22 6.28L21.9 6.28L20.49 6.82L20.39 6.98L20.06 6.98L15.8 8.66L15.48 6.98L14.89 5.69L12.78 6.23L12.13 4.83L11.43 4.07L10.84 3.75L10.09 3.69ZM10.79 5.85L11.16 5.91L11.33 6.07L11.33 6.23L11.06 6.39L10.95 6.66L11.06 7.74L11.54 8.28L11.97 8.17L11.97 9.14L11.81 9.73L11.49 10.44L11.06 10.81L10.62 10.81L10.3 10.54L9.82 9.52L9.76 9.09L9.82 7.2L10.14 6.34L10.46 5.96L10.79 5.91ZM5.82 7.31L6.31 7.52L6.04 7.96L6.2 8.82L6.53 9.09L6.8 8.93L6.96 9.03L6.9 10.38L6.47 10.81L6.26 10.81L5.88 10.49L5.39 9.36L5.39 7.85L5.82 7.36ZM13.75 7.74L14.4 7.79L14.89 9.2L14.94 10.27L15.1 10.76L18.44 9.73L18.93 9.47L19.47 9.41L19.96 9.14L20.71 9.03L20.87 10.22L20.87 12.32L20.71 14.05L19.9 16.64L17.42 15.72L16.61 15.29L16.34 15.29L16.23 15.13L15.53 14.97L15.16 14.7L14.72 14.64L14.13 16.42L13.27 18.04L13.05 18.04L12.94 17.88L12.46 17.88L11.97 17.61L10.52 17.18L10.95 17.12L11.43 17.39L11.81 17.39L13.11 17.82L14.08 16.04L14.62 14.37L15.59 14.64L19.47 16.31L19.74 16.31L19.9 16.1L20.55 13.62L20.66 11.3L20.49 9.79L20.28 9.73L15.75 11.3L14.89 11.46L14.72 9.84L14.13 8.22L13.7 8.22L13.54 8.39L13.48 9.3L13.05 10.92L12.4 12.11L11.38 13.13L10.52 13.46L10.03 13.46L9.17 13.13L8.31 12.32L8.2 12.05L8.04 12.05L7.82 12.38L7.12 12.81L6.47 12.86L5.77 12.7L4.64 11.78L3.99 10.81L3.67 9.95L3.29 9.95L3.4 12.7L3.24 13.56L2.75 14.48L2.75 14.64L2.97 14.8L2.32 14.64L2.75 13.67L3.07 12.05L2.86 9.63L3.83 9.47L4.15 10.44L4.8 11.51L5.77 12.32L6.85 12.38L7.07 12.27L7.55 11.78L7.93 10.98L8.31 11.73L8.84 12.38L9.49 12.81L10.3 12.97L11.11 12.7L11.97 11.89L12.62 10.65L12.89 9.68L13 7.96L13.75 7.79ZM10.41 8.87L10.19 9.09L10.19 9.36L10.36 9.57L10.68 9.57L10.84 9.14L10.68 8.87L10.46 8.87ZM5.99 9.47L5.82 9.79L5.99 10L6.15 10L6.26 9.68L6.04 9.47ZM14.13 12.32L14.24 12.32L14.13 12.81L13.38 14.16L12.57 14.97L11.43 15.72L10.84 15.94L9.87 14.86L9.87 14.64L10.3 14.64L10.25 14.86L10.73 15.4L11.33 15.24L12.4 14.53L13.38 13.62L13.81 13.02L13.7 12.7L14.13 12.38ZM3.67 14.97L4.31 15.13L3.72 16.26L5.93 15.88L6.2 15.72L6.47 15.78L6.47 15.88L6.26 16.04L2.8 16.64L3.72 15.29L3.67 15.02Z",
  Loco: "M0.4 9.57L2.4 9.57L2.4 13.63L2.53 13.83L3.07 13.9L3.27 13.63L3.27 12.03L5.67 12.03L5.67 14.1L5.6 14.23L5.4 14.3L5.33 14.43L0 14.43L0 9.97L0.13 9.7L0.4 9.63ZM6.47 9.57L11.73 9.57L11.73 14.17L11.4 14.43L6.13 14.43L6.07 14.37L6.13 14.3L6.13 9.83L6.33 9.63L6.47 9.63ZM12.2 9.57L17.47 9.57L17.47 9.63L17.67 9.63L17.87 9.9L17.87 11.17L15.47 11.17L15.4 10.23L15.2 10.1L14.87 10.1L14.67 10.23L14.6 10.37L14.6 13.63L14.87 13.9L15.27 13.9L15.47 13.7L15.47 12.83L17.87 12.83L17.87 14.1L17.8 14.23L17.53 14.43L12.2 14.43L12.2 9.63ZM18.73 9.57L24 9.57L24 14.03L23.87 14.3L23.6 14.43L18.33 14.43L18.33 9.9L18.53 9.63L18.73 9.63ZM7.4 10.1L7.07 10.43L7.07 13.57L7.2 13.83L7.73 13.9L7.93 13.7L7.93 10.3L7.73 10.1L7.47 10.1ZM19.67 10.1L19.33 10.3L19.33 13.7L19.53 13.9L19.93 13.9L20.2 13.63L20.2 10.37L19.93 10.1L19.73 10.1Z",
  Zhanqi:
    "M23.9 4.6L24 4.6L24 4.7L23.34 5.62L22.31 7.56L21.34 10.06L20.63 13.17L20.53 14.76L19.76 15.06L18.54 15.32L16.14 15.37L15.32 17.16L14.5 19.4L12.92 19.4L12.51 19.2L11.95 19.4L5.62 19.4L5.06 19.15L4.8 18.64L4.44 19.1L3.78 19.4L0 19.35L1.79 14.45L2.3 14.45L3.11 12.1L3.78 12.05L5.46 7.66L7.61 7.05L9.04 6.84L10.52 6.84L11.18 6.94L11.64 7.15L9.14 9.14L9.14 9.24L8.17 10.01L8.17 10.11L6.18 12L6.23 12.1L7.71 12.05L9.04 10.57L10.57 9.24L10.72 8.99L14.3 6.03L15.37 6.54L16.54 6.89L17.21 7L19.35 6.94L20.89 6.54L21.96 6.03L22.88 5.46L23.9 4.65ZM16.34 15.68L19.51 15.73L18.94 16.54L18.03 16.6L17.31 18.74L16.44 19.05L16.24 19.05L16.19 18.94L17.11 16.54L16.03 16.54L15.98 16.39L16.24 15.73L16.34 15.73ZM19.81 15.73L20.89 15.78L21.04 17.67L21.19 17.62L22.57 15.78L23.69 15.78L23.69 15.88L21.45 18.59L21.34 18.84L21.24 18.84L21.24 19L20.99 19.15L20.99 19.05L19.97 19L19.71 15.88L19.81 15.78Z",
  Douyu:
    "M12.39 4.84L14.31 5.06L16.07 5.72L16.4 5.72L16.46 5.61L17.01 5.45L17.89 5.39L19.6 5.56L21.03 6.11L21.63 6.5L22.4 7.21L22.68 7.65L22.62 7.87L22.13 8.09L21.14 8.92L20.48 10.07L20.37 10.68L20.37 13.71L19.93 15.41L20.97 15.08L21.69 15.08L22.46 15.3L23.28 15.85L23.67 16.35L24 17.28L23.94 18.5L23.67 19.1L22.79 19.16L23.17 18.61L23.34 18.11L23.34 17.34L22.9 16.46L22.46 16.07L21.85 15.8L20.81 15.8L20.2 16.07L19.82 16.4L19.32 17.39L19.32 18.11L19.87 19.16L18.99 19.1L18.72 18.5L18.66 17.72L18.5 17.72L17.83 18.5L17.01 19.05L17.01 19.16L15.3 19.16L15.3 19.05L16.51 18.28L17.45 17.39L17.94 16.73L18.06 16.73L18.99 15.41L19.6 13.98L19.71 12.55L19.49 11.06L19.1 9.91L18.72 9.14L18.28 8.59L18.44 8.59L19.16 9.41L19.32 9.41L19.71 8.92L20.37 8.42L22.13 7.76L22.18 7.54L22.02 7.27L21.03 6.5L19.93 6.11L18.88 6L17.78 6.11L16.84 6.44L16.68 6.61L16.73 6.94L16.57 6.94L15.63 6.33L14.48 5.83L13.21 5.56L12.06 5.5L10.68 5.72L11.61 6.22L12.06 6.72L12.28 7.21L12.28 8.26L11.72 9.14L11.17 9.52L10.68 9.69L9.63 9.69L9.14 9.52L8.48 9.03L8.09 8.42L7.98 7.93L8.09 6.99L7.93 6.99L6.99 7.76L5.61 9.19L4.24 11.12L3.85 12.06L3.96 12.28L4.46 12.66L5.61 13.16L6.77 13.38L8.04 13.27L9.91 12.5L11.89 11.23L12.83 10.29L13.32 9.19L13.65 8.92L13.93 9.19L14.09 10.02L14.09 11.17L13.71 12.39L12.77 13.27L10.84 13.71L11.01 14.04L11.28 14.15L11.89 14.7L12.22 14.7L12.72 14.15L12.88 14.2L12.88 14.42L12.5 14.81L11.61 15.3L9.74 15.85L9.58 15.96L9.52 16.24L10.18 16.62L11.39 16.84L13.49 16.57L14.64 15.96L15.36 15.14L15.63 14.31L15.8 14.31L15.85 14.97L15.47 15.74L14.42 16.57L13.6 16.84L13.43 17.01L13.43 17.34L13.05 18.22L12.28 19.16L7.93 19.16L7.98 19.05L8.64 18.88L8.64 18.77L8.15 18.39L5.5 18.39L5.5 18.5L6 18.77L6.28 19.16L5.61 19.16L5.17 18.77L4.29 18.5L0.77 18.5L0.61 19.16L0 19.16L0.11 18.39L0.44 18.11L3.74 18.11L3.19 17.83L2.7 17.23L2.7 16.73L2.97 16.18L3.58 15.69L3.58 15.58L4.95 14.81L6.22 14.42L7.32 14.37L7.71 14.15L7.65 13.98L6.22 13.87L4.68 13.38L3.85 12.88L3.36 12.28L3.47 11.5L3.96 10.4L5.28 8.53L6.66 7.21L8.48 5.94L10.68 5.06L12.39 4.9ZM10.07 5.94L9.14 6.22L8.53 6.77L8.31 7.16L8.26 7.98L8.42 8.53L9.08 9.19L9.85 9.47L10.51 9.47L11.28 9.19L11.78 8.75L12.06 8.26L12.11 7.54L11.94 6.94L11.39 6.33L10.84 6.06L10.13 5.94ZM18.83 6.28L19.71 6.33L20.2 6.55L18.88 6.5L18.11 6.72L17.67 6.99L17.39 7.38L17.06 7.27L17.12 6.88L17.39 6.66L18.17 6.39L18.83 6.33ZM9.91 6.5L10.35 6.5L9.96 6.94L9.96 7.49L10.18 7.76L10.79 7.93L11.39 7.49L11.34 8.26L11.06 8.64L10.57 8.92L9.8 8.92L9.63 8.81L9.63 8.7L9.85 8.59L9.91 8.26L9.58 7.87L9.36 7.87L8.97 8.15L8.97 7.27L9.41 6.72L9.91 6.55ZM13.65 9.69L12.99 10.57L13.05 10.9L13.54 11.23L13.54 11.34L13.82 11.28L13.93 10.73L13.87 10.07L13.65 9.74ZM12.83 10.84L12.06 11.5L12 11.78L11.78 11.72L11.17 12.22L9.91 12.72L9.3 13.1L9.63 13.27L10.57 13.32L10.9 13.27L10.79 12.72L11.28 13.16L12.33 12.77L12.39 12.55L12.06 11.83L12.77 12.44L13.1 12.22L13.49 11.72L13.1 11.01L12.88 10.84ZM8.42 14.04L7.65 14.42L7.65 14.64L8.42 14.81L8.92 15.08L9.41 15.08L10.24 14.59L10.57 14.59L10.62 14.81L9.63 15.3L8.48 16.18L8.04 16.68L7.71 16.84L7.71 17.06L8.04 17.5L8.75 18.17L9.74 18.66L10.84 18.66L11.94 18.06L12.55 17.34L12.55 17.12L11.67 17.17L10.68 17.06L9.96 16.84L9.36 16.35L9.36 15.91L9.58 15.69L9.96 15.47L11.28 15.08L11.34 14.97L10.57 14.42L9.63 14.04L8.48 14.04ZM7.49 14.7L7.32 14.75L7.05 15.14L7.05 15.85L7.43 16.68L7.65 16.68L7.71 16.51L8.75 15.58L8.75 15.3L7.54 14.7ZM6.39 14.75L4.95 15.19L3.69 15.96L3.19 16.62L3.25 17.28L3.8 17.72L4.79 18L6.39 18.11L7.65 18.06L7.71 17.89L6.72 17.61L6.33 17.17L6.44 16.68L6.77 16.4L6.66 15.3L6.88 14.97L6.88 14.75L6.44 14.75ZM6.88 16.68L6.66 16.84L6.66 17.17L6.94 17.34L7.27 17.34L7.16 17.01L6.88 16.73ZM20.86 17.01L22.13 17.61L22.13 17.83L20.92 18.5L20.86 17.06Z",
  "about.me":
    "M3.29 9.89L3.84 9.95L3.84 11.26L4.27 10.99L5.04 10.93L5.81 11.42L6.08 12.08L6.08 12.96L5.86 13.51L5.42 13.95L4.6 14.11L4 13.89L3.89 13.73L3.84 14L3.34 14L3.23 13.89L3.29 9.95ZM13.42 10.22L14.03 10.22L14.03 10.99L14.63 11.04L14.63 11.53L14.03 11.53L14.03 13.4L14.19 13.56L14.63 13.4L14.74 13.89L14.52 14.05L13.81 14.05L13.48 13.73L13.42 11.53L12.93 11.42L12.99 10.99L13.42 10.99L13.42 10.27ZM0.99 10.93L1.86 10.99L2.41 11.42L2.52 11.75L2.52 14L1.92 14L1.92 13.84L1.81 13.84L1.48 14.05L0.93 14.11L0.44 13.95L0.05 13.56L0 12.68L0.33 12.25L1.21 12.03L1.92 12.3L1.92 11.81L1.53 11.48L0.93 11.48L0.44 11.86L0.27 11.81L0.11 11.42L0.33 11.21L0.99 10.99ZM7.67 10.93L8.33 10.93L8.77 11.1L9.21 11.48L9.48 12.14L9.48 12.9L9.26 13.45L8.82 13.89L8.44 14.05L7.4 14L6.9 13.67L6.58 13.12L6.52 12.14L6.68 11.64L7.07 11.21L7.67 10.99ZM17.7 10.93L18.3 10.99L18.68 11.37L19.4 10.93L19.89 10.93L20.33 11.15L20.49 11.48L20.49 14L19.95 14L19.95 11.81L19.67 11.48L19.23 11.48L18.79 11.81L18.79 14L18.19 14L18.19 11.75L17.97 11.48L17.53 11.48L17.1 11.75L17.04 14L16.55 14L16.44 13.89L16.44 11.04L17.04 11.04L17.04 11.26L17.15 11.26L17.37 11.04L17.7 10.99ZM22.3 10.93L23.34 11.1L23.78 11.53L24 12.03L24 12.74L21.75 12.74L21.81 13.12L22.36 13.56L23.01 13.56L23.62 13.18L23.84 13.62L23.12 14.05L22.03 14L21.37 13.51L21.15 13.07L21.1 12.19L21.26 11.7L21.75 11.15L22.3 10.99ZM10.08 10.99L10.68 11.04L10.68 13.29L11.07 13.56L11.56 13.51L12 13.23L12 11.04L12.6 10.99L12.6 14L12 14L11.95 13.73L11.62 14L10.9 14.11L10.25 13.78L10.08 13.4L10.08 11.04ZM22.47 11.42L21.92 11.7L21.7 12.25L23.45 12.25L23.29 11.75L23.07 11.53L22.52 11.42ZM4.44 11.48L3.84 11.86L3.84 13.18L4.27 13.51L4.77 13.56L5.32 13.23L5.48 12.85L5.48 12.19L5.37 11.86L5.04 11.53L4.49 11.48ZM7.78 11.48L7.29 11.81L7.12 12.19L7.12 12.79L7.45 13.4L8.16 13.56L8.55 13.4L8.77 13.12L8.88 12.25L8.49 11.59L7.84 11.48ZM1.04 12.52L0.6 12.79L0.6 13.34L0.93 13.62L1.75 13.51L1.92 13.34L1.92 12.79L1.64 12.58L1.1 12.52ZM15.23 13.29L15.73 13.4L15.78 13.84L15.67 14L15.23 14.05L15.07 13.95L15.01 13.51L15.23 13.34Z",
  "Garena LIVE":
    "M14.92 2.58L15.07 2.63L13.64 3.12L11.83 4L9.96 5.13L8.54 6.16L11.09 5.72L12.61 5.72L13.25 5.82L15.12 6.45L18.55 8.42L19.98 8.86L21.45 8.71L23.9 7.83L24 7.88L23.21 8.71L22.23 9.45L21.25 9.94L20.07 10.28L18.94 10.43L17.62 10.43L12.71 9.89L11.39 9.94L9.03 10.43L7.41 11.21L6.72 11.75L6.04 12.54L5.6 13.33L5.25 14.45L5.25 16.91L5.64 18.23L6.04 18.87L6.67 19.51L7.66 20.05L8.88 20.34L9.87 20.39L11.68 20.2L12.71 19.9L13.84 19.26L14.53 18.48L14.77 17.99L15.07 16.86L15.12 15.29L14.97 14.6L14.28 13.42L13.6 12.83L13.01 12.59L11.53 12.54L11.04 12.64L10.11 13.08L9.57 13.67L9.42 14.11L9.47 14.99L10.26 15.83L10.45 16.27L10.4 16.96L10.01 17.5L9.47 17.74L8.64 17.74L8.15 17.55L7.66 17.1L7.36 16.56L7.26 16.12L7.26 15.39L7.51 14.36L7.85 13.67L8.44 12.88L9.13 12.29L10.06 11.8L11.58 11.46L13.01 11.51L13.89 11.66L15.41 12.25L17.08 13.42L17.67 13.57L19.39 13.52L21.4 13.13L22.33 13.08L21.89 13.33L21.3 13.91L20.42 15.14L19.58 16.02L18.55 16.61L17.72 16.71L17.67 17.4L17.23 18.48L16.49 19.56L15.66 20.34L16.69 20.29L18.16 19.9L17.18 20.44L15.46 20.93L13.6 21.23L10.8 21.42L8.39 21.42L5.99 21.03L4.22 20.29L3.48 19.75L2.9 19.12L2.4 18.28L2.06 17.1L2.01 15.63L2.21 14.31L2.6 13.18L3.14 12.25L4.12 11.17L4.76 10.67L6.58 9.74L9.28 9.06L12.47 8.81L10.75 8.17L8.93 7.83L7.85 7.83L7.12 7.98L5.74 8.47L4.52 9.06L2.85 9.4L1.13 9.35L0.25 9.06L0.05 8.96L0 8.81L0.98 8.56L2.06 7.98L3.19 6.94L3.93 6.01L5.2 4.74L6.23 4L7.51 3.36L8.29 3.12L7.46 3.75L6.33 4.88L5.79 5.67L7.46 4.79L9.96 3.75L12.71 2.97L14.92 2.63Z",
  Nonolive:
    "M2.16 0L7.95 1.78L8.59 2L8.59 2.11L7.14 2.59L5.84 3.3L4.86 4L3.78 5.03L2.86 6.16L2.11 7.35L0.86 10.05L2.16 0.05ZM21.62 0L21.73 0.16L23.03 10.22L22.92 10.16L22.49 8.86L21.62 7.14L20.22 5.19L19.24 4.22L17.73 3.14L16.11 2.38L15.14 2.11L21.62 0.05ZM11.14 2.81L13.41 2.86L15.03 3.19L16.43 3.68L18.32 4.7L19.57 5.68L21.24 7.57L22.27 9.35L22.86 10.97L23.24 13.03L23.24 15.08L22.86 17.14L22.32 18.65L21.68 19.89L20.49 21.51L18.86 23.03L17.35 24L6.65 24L4.59 22.59L3.24 21.19L2.16 19.62L1.19 17.35L0.76 15.14L0.76 12.97L0.86 12.16L1.24 10.59L1.68 9.46L2.76 7.57L3.57 6.54L4.49 5.62L5.68 4.7L6.76 4.05L8.97 3.19L10.22 2.92L11.14 2.86ZM11.57 5.89L10.05 6.11L8.76 6.54L7.14 7.46L5.84 8.65L4.81 10.11L4.16 11.68L3.89 12.86L3.84 14.76L4.11 16.27L4.81 18L5.51 19.08L6.65 20.27L8.05 21.24L9.62 21.89L11.3 22.22L12.7 22.22L14.38 21.89L15.95 21.24L17.08 20.49L18.22 19.41L19.19 18L19.84 16.43L20.11 15.19L20.16 13.46L19.84 11.68L19.35 10.43L18.59 9.19L17.46 7.95L16.38 7.14L14.97 6.43L13.41 6L11.62 5.89ZM11.3 8.59L12.76 8.59L13.51 8.76L14.27 9.03L15.35 9.68L16.11 10.38L16.81 11.35L17.14 12.05L17.46 13.3L17.41 15.19L17.08 16.22L16.49 17.24L15.51 18.27L14.92 18.7L13.84 19.24L12.76 19.51L11.78 19.57L10.7 19.41L9.78 19.08L8.7 18.43L7.84 17.62L7.35 16.97L6.81 15.89L6.54 14.86L6.49 13.78L6.7 12.54L7.24 11.3L7.73 10.59L8.54 9.78L9.24 9.3L10.49 8.76L11.3 8.65ZM10.92 11.46L10.86 16.59L14.97 14.05L10.97 11.46Z",
  Smashcast:
    "M6.98 0L7.85 0.12L8.54 0.81L10.41 5.55L10.35 6.73L9.85 7.29L9.29 7.54L8.35 7.36L7.85 6.86L5.8 1.75L5.98 0.69L6.55 0.12L6.98 0.06ZM14.4 2.68L15.58 2.93L16.02 3.55L16.02 4.61L14.9 7.11L14.21 7.54L13.53 7.54L13.09 7.36L12.59 6.79L12.53 5.61L13.53 3.24L14.09 2.74L14.4 2.74ZM21.69 6.3L22.5 6.48L23.13 7.17L23.19 8.23L22.75 8.85L17.45 11.1L16.77 11.03L16.08 10.54L15.77 9.41L16.33 8.48L21.69 6.36ZM1.68 6.67L2.68 6.67L6.23 8.17L6.98 9.04L6.98 9.91L6.79 10.29L6.36 10.72L5.36 10.91L1.31 9.16L0.87 8.54L0.81 7.73L1.06 7.17L1.68 6.73ZM5.36 12.9L6.17 13.03L6.86 13.71L6.98 14.65L6.42 15.52L2.56 17.08L1.81 16.89L1.43 16.58L1.12 16.08L1.06 15.4L1.68 14.4L5.36 12.97ZM16.83 13.09L17.95 13.28L21.44 14.96L21.82 15.58L21.82 16.46L21.44 17.02L21.13 17.27L20.26 17.45L16.21 15.58L15.77 14.96L15.77 14.09L16.15 13.46L16.83 13.15ZM8.85 16.39L9.35 16.46L9.97 16.89L10.22 17.27L10.22 18.39L8.29 23L7.48 23.81L6.61 23.88L6.17 23.69L5.61 23L5.61 21.94L7.67 17.08L8.23 16.58L8.85 16.46ZM13.46 16.46L14.28 16.58L14.9 17.08L16.96 22.25L16.77 23.31L15.9 24L15.15 24L14.28 23.25L12.34 18.45L12.41 17.27L12.97 16.64L13.46 16.52Z",
  CubeTV:
    "M11.76 2.26L12.67 2.37L13.09 2.69L13.41 3.22L13.41 4.02L13.09 4.6L12.61 4.92L12.61 5.51L19.85 5.56L20.33 5.72L21.29 6.47L21.76 7.48L21.76 10.3L22.88 10.03L23.41 10.08L24 10.72L23.84 11.63L21.76 15.09L21.76 18.44L21.45 19.24L20.81 19.93L19.9 20.35L17.4 20.41L17.19 21.37L16.5 21.74L15.8 21.58L15.54 21.31L15.38 20.41L15.17 20.35L8.67 20.35L8.46 20.41L8.41 21.1L8.04 21.58L7.61 21.74L7.13 21.69L6.55 21.21L6.44 20.41L4.15 20.35L3.03 19.77L2.61 19.24L2.24 18.17L2.24 16.15L0.75 16.36L0.32 16.15L0 15.67L0.16 14.82L2.24 11.41L2.24 7.74L2.55 6.73L2.87 6.31L4.1 5.56L11.33 5.56L11.49 5.4L11.49 5.03L10.75 4.34L10.64 3.27L11.07 2.58L11.76 2.31ZM5 7.05L4.42 7.32L3.88 8.06L3.88 17.8L4.04 18.23L4.52 18.71L5.11 18.92L18.94 18.92L19.42 18.76L19.96 18.28L20.17 17.75L20.17 8.17L19.96 7.69L19.48 7.21L19.1 7.05L5.06 7.05ZM7.4 8.27L8.25 8.27L9.21 8.59L10.06 9.34L10.54 10.3L10.54 11.57L10.22 12.37L9.42 13.22L8.57 13.6L7.45 13.65L6.65 13.44L5.59 12.53L5.22 11.73L5.11 10.78L5.43 9.66L6.33 8.7L7.4 8.33ZM15.86 8.27L17.29 8.43L17.99 8.86L18.57 9.5L19 10.72L18.84 11.89L18.31 12.8L17.72 13.28L16.71 13.65L15.75 13.65L14.85 13.33L14.05 12.64L13.57 11.63L13.57 10.35L13.89 9.55L14.63 8.75L15.38 8.38L15.86 8.33ZM7.34 9.76L7.02 10.14L7.02 11.73L7.29 12.21L7.66 12.21L8.78 11.47L9.1 10.94L8.89 10.56L7.77 9.82L7.4 9.76ZM15.75 9.76L15.43 10.14L15.43 11.84L15.7 12.21L16.07 12.21L17.19 11.47L17.51 10.88L16.44 9.98L15.8 9.76Z",
  Trovo:
    "M14.03 0.94L14.55 0.94L14.88 1.09L15.07 1.28L15.5 2.17L15.59 2.55L15.73 2.74L15.83 3.12L15.97 3.31L15.97 3.45L16.11 3.64L16.11 3.78L16.87 5.2L17.1 5.29L23.72 6.19L24 6.38L24 6.66L23.72 7.28L23.57 7.8L23.48 7.89L23.34 8.41L23.24 8.5L23.1 9.02L23.01 9.12L23.01 9.26L22.91 9.35L22.87 9.64L22.58 10.2L22.39 10.87L22.11 11.29L21.59 11.43L17.06 11.67L15.17 11.95L15.02 12.05L14.69 12.09L14.13 12.38L13.89 12.61L13.8 12.61L13.13 13.28L13.13 13.37L12.8 13.75L12.43 14.5L12.19 15.5L12.19 16.63L12.28 17.15L12.52 17.86L12.76 18.28L12.85 18.33L12.85 18.43L13.46 19.04L13.56 19.04L13.61 19.13L14.03 19.37L14.98 19.61L15.73 19.56L16.2 19.42L16.58 19.23L17.06 18.85L17.06 18.76L17.34 18.47L17.57 17.91L17.62 17.1L17.53 16.72L17.29 16.3L16.72 15.92L15.92 15.97L15.54 16.35L15.54 16.87L16.02 17.34L16.06 17.48L16.02 17.76L15.78 18L15.26 18.05L14.93 17.95L14.79 17.81L14.69 17.81L14.27 17.34L14.03 16.68L14.03 15.97L14.17 15.45L14.46 14.93L14.88 14.5L15.54 14.13L16.35 13.94L17.15 13.94L18.09 14.17L18.38 14.31L18.43 14.41L18.61 14.46L19.28 15.07L19.28 15.17L19.56 15.5L19.94 16.39L20.08 17.1L20.08 18.19L19.75 19.46L19.23 20.41L18.19 21.54L18.09 21.54L17.95 21.73L17.86 21.73L17.39 22.11L16.54 22.54L16.39 22.54L15.87 22.77L14.74 23.01L13.32 23.06L12.24 22.91L11.48 22.72L10.68 22.44L10.58 22.35L10.44 22.35L9.69 21.97L9.64 21.87L9.45 21.83L9.4 21.73L9.21 21.69L9.17 21.59L8.79 21.4L8.22 20.88L8.13 20.88L7.04 19.75L7.04 19.65L6.9 19.56L6.9 19.46L6.76 19.37L6.61 19.04L6.43 18.85L5.81 17.57L5.53 16.72L5.15 14.79L5.15 12.28L2.6 12.43L1.89 12.43L1.51 12.28L1.28 11.76L1.09 10.68L1.09 10.35L0.9 9.5L0.9 9.17L0.05 4.06L0 3.12L0.14 2.98L0.38 2.93L1.09 2.98L8.79 4.06L9.31 3.59L9.59 3.45L9.73 3.26L9.83 3.26L10.06 3.02L10.3 2.93L10.39 2.79L10.49 2.79L10.96 2.41L11.15 2.36L11.34 2.17L11.53 2.13L11.57 2.03L13.13 1.23L13.84 0.99L14.03 0.99Z",
  DLive:
    "M8.67 2.01L19.41 2.01L20.2 2.15L21.42 2.65L21.92 3.08L22.07 3.08L23.14 4.23L23.71 5.37L24 6.66L24 17.34L23.86 18.2L23.36 19.41L22.85 19.99L22.85 20.13L21.85 21.06L20.78 21.64L19.27 21.99L8.81 21.99L7.88 21.85L6.73 21.42L6.66 21.28L5.87 20.85L5.09 20.06L4.37 18.84L4.01 17.48L4.01 9.89L2.72 11.1L2.58 11.1L2.44 11.32L1.5 11.82L1.43 11.96L1.15 12.04L0.72 10.75L0.43 10.32L0.29 9.81L0.14 9.74L0.14 9.53L0 9.46L0 9.31L0.14 9.24L2.01 8.96L3.51 8.53L3.65 8.38L2.08 7.81L0.14 7.52L0 7.45L0 7.31L0.64 6.16L1.15 4.66L2.72 5.66L4.01 6.88L4.08 6.09L4.37 5.16L5.09 3.94L5.95 3.08L6.09 3.08L6.59 2.65L7.81 2.15L8.67 2.08ZM8.53 5.66L7.52 5.87L6.66 6.38L5.87 7.24L5.44 8.38L5.52 13.04L5.87 13.83L6.3 14.26L6.3 14.4L7.16 15.04L8.38 15.4L9.24 15.4L10.32 15.19L11.82 14.4L12.9 13.4L13.68 13.11L14.33 13.11L15.26 13.47L15.98 14.19L17.12 14.9L18.41 15.33L19.41 15.4L20.27 15.26L21.06 14.9L21.85 14.19L21.85 14.04L22.14 13.76L22.57 12.47L22.57 8.6L22.14 7.31L21.78 6.95L21.78 6.81L20.92 6.09L19.56 5.66L8.6 5.66ZM9.03 7.59L10.03 7.59L12.54 7.88L12.75 8.1L12.75 8.6L12.61 8.74L11.46 8.74L9.03 8.45L8.81 8.1L8.81 7.88L9.03 7.67ZM17.91 7.59L19.06 7.67L19.13 8.24L18.91 8.45L18.56 8.53L16.48 8.74L15.4 8.74L15.19 8.45L15.19 8.17L15.4 7.88L17.91 7.67ZM10.39 9.17L11.39 9.24L11.75 9.46L12.11 9.96L12.11 11.1L11.82 11.39L11.82 11.53L11.68 11.53L11.39 11.82L10.39 11.89L9.96 11.68L9.46 10.96L9.53 9.89L9.96 9.39L10.39 9.24ZM16.76 9.17L17.77 9.24L18.48 9.96L18.48 11.03L18.34 11.32L17.77 11.82L16.62 11.82L16.33 11.68L15.9 11.18L15.76 10.67L15.83 10.03L16.33 9.39L16.76 9.24Z",
  Booyah:
    "M22.42 0L23.82 0.12L17.39 19.43L11.06 19.67L10.48 20.14L10.01 20.25L9.89 20.49L7.79 21.54L7.67 21.78L7.2 21.89L7.08 22.13L5.8 22.71L5.68 22.95L3.57 24L4.16 22.71L4.39 22.6L4.51 22.13L5.09 21.42L5.44 20.49L5.68 20.37L5.8 19.79L0.76 20.02L2.28 10.3L2.28 9.72L0.18 9.72L1.35 3.04L10.95 2.81L10.95 0.82L22.42 0.12ZM18.67 2.22L15.51 2.46L14.22 10.3L13.87 11.59L13.87 12.53L16.45 12.53L16.68 12.18L18.91 5.5L18.91 5.03L19.14 4.8L19.26 3.98L19.84 2.58L19.84 2.22L18.79 2.22ZM8.6 4.8L4.04 5.03L3.57 8.08L5.21 8.08L5.21 8.66L4.86 10.19L3.8 17.91L9.42 17.68L10.95 16.98L12.12 15.8L12.47 16.74L12.94 17.21L13.4 17.44L14.93 17.33L15.75 16.62L16.21 15.8L16.45 14.99L16.33 13.81L15.75 13.11L15.28 12.88L14.58 12.88L13.4 13.46L13.4 11.47L12.94 10.42L12.47 9.95L12.23 9.95L12.23 9.6L12.59 9.13L12.82 8.31L12.82 7.14L12.47 6.2L12 5.62L11.77 5.62L11.53 5.27L11.06 5.03L10.13 4.8L8.72 4.8ZM8.49 11.82L9.78 11.82L10.48 12.29L10.6 13.35L10.01 14.05L9.54 14.28L7.43 14.28L7.79 11.94L8.49 11.94Z",
  Huya: "M14.78 1.13L15.17 1.13L15.84 1.37L16.66 1.8L17.76 2.62L19.15 4.1L20.02 5.5L21.5 7.08L22.61 8.76L23.57 11.06L23.95 12.94L23.95 15.1L23.71 16.34L23.38 17.3L22.85 18.31L22.18 19.22L20.69 20.57L18.72 21.67L16.13 22.49L13.82 22.82L10.46 22.82L7.97 22.44L5.38 21.58L4.18 20.95L3.07 20.18L1.63 18.74L1.01 17.83L0.43 16.58L0 14.52L0 12.84L0.38 10.87L1.25 8.76L2.02 7.51L2.64 6.79L3.02 4.54L3.74 2.66L4.51 1.32L5.52 1.42L6.86 1.75L8.21 2.28L8.83 2.66L9.12 2.66L11.14 2.28L12.96 2.33L13.82 1.56L14.78 1.18ZM11.86 4.44L10.03 4.78L8.11 5.59L6.91 6.41L5.62 7.75L4.75 9.24L4.27 11.02L4.27 12.7L4.51 13.51L4.8 13.99L5.42 14.57L6.48 15L8.83 15.19L17.52 14.47L19.34 13.99L20.4 13.37L21.02 12.5L21.22 11.78L21.22 10.92L20.74 9.1L19.63 7.37L18.1 6.02L16.37 5.11L14.3 4.54L11.9 4.44ZM11.18 6.79L12.34 6.89L14.11 7.66L15.46 8.57L16.08 9.38L15.84 10.1L14.78 11.11L13.2 12.12L11.95 12.6L11.33 12.6L10.99 12.31L10.66 11.5L10.51 10.73L10.46 8.62L10.56 7.9L10.85 7.08L11.18 6.84ZM17.52 17.26L16.9 17.69L15.79 18.07L15.79 18.17L16.42 18.65L17.18 18.94L17.47 18.17L17.57 17.26ZM9.02 18.02L9.17 18.7L9.74 19.7L10.27 19.42L10.99 18.6L10.94 18.5L9.84 18.36L9.02 18.07Z",
  Foursquare:
    "M5.28 0L18.93 0L19.63 0.16L20 0.37L20.27 0.64L20.27 0.75L20.43 0.91L20.59 1.49L20.59 2.45L19.09 9.92L18.99 10.13L18.67 11.95L18.19 13.92L18.13 14.45L17.92 15.09L17.65 15.57L17.01 16.11L16.43 16.27L11.95 16.32L11.73 16.53L11.73 16.64L11.41 16.91L11.41 17.01L11.09 17.28L11.09 17.39L10.77 17.65L10.77 17.76L10.45 18.03L10.45 18.13L10.13 18.4L10.13 18.51L9.81 18.77L9.81 18.88L9.49 19.15L9.49 19.25L9.17 19.52L9.17 19.63L8.85 19.89L8.85 20L8.53 20.27L8.53 20.37L8.21 20.64L8.21 20.75L7.89 21.01L7.89 21.12L7.57 21.39L7.57 21.49L7.25 21.76L7.25 21.87L6.93 22.13L6.93 22.24L6.61 22.51L6.61 22.61L6.29 22.88L6.29 22.99L5.97 23.25L5.97 23.36L5.55 23.79L5.33 23.89L4.96 24L4.43 24L4 23.84L3.68 23.57L3.41 22.88L3.41 1.81L3.79 0.85L4.27 0.37L5.01 0.05L5.28 0.05ZM6.83 2.61L6.45 2.67L6.4 2.77L6.29 2.77L6.08 3.09L6.03 3.36L6.03 19.41L6.13 19.41L6.35 19.2L6.35 19.09L6.56 18.93L6.56 18.83L6.77 18.67L6.77 18.56L6.99 18.4L6.99 18.29L7.2 18.13L7.2 18.03L7.41 17.87L7.41 17.76L7.63 17.6L7.63 17.49L7.84 17.33L7.84 17.23L8.05 17.07L8.05 16.96L8.27 16.8L8.27 16.69L8.48 16.53L8.48 16.43L8.69 16.27L8.69 16.16L8.91 16L8.91 15.89L9.12 15.73L9.12 15.63L9.33 15.47L9.33 15.36L9.55 15.2L9.55 15.09L9.76 14.93L9.76 14.83L9.97 14.67L9.97 14.56L10.19 14.4L10.19 14.29L10.45 14.08L10.45 13.97L10.61 13.81L10.93 13.65L11.41 13.6L15.31 13.6L15.63 13.39L15.79 13.07L16.32 10.4L16.32 9.87L16.16 9.71L16.16 9.6L15.84 9.44L11.09 9.39L10.88 9.28L10.51 8.8L10.45 7.57L10.67 7.15L11.2 6.83L16.75 6.77L17.07 6.51L17.17 6.24L17.6 3.95L17.76 3.47L17.65 2.93L17.44 2.72L17.07 2.61L6.88 2.61Z",
  "500px":
    "M6.42 0L18.42 0L18.61 0.14L18.71 1.08L18.47 1.46L7.46 1.46L7.46 7.91L8.92 6.73L10.52 5.88L12.16 5.46L14.19 5.41L15.93 5.79L17.67 6.64L19.13 7.86L20.26 9.41L21.15 12L21.25 13.46L21.01 15.2L20.59 16.42L19.51 18.21L18.33 19.39L17.29 20.09L15.51 20.85L14.28 21.08L13.01 21.13L11.22 20.85L8.59 19.53L7.55 18.59L6.47 17.08L5.91 15.58L6.28 15.25L7.13 15.11L7.93 16.71L8.59 17.55L8.64 12.42L8.87 11.53L9.44 10.49L10.33 9.55L12.12 8.66L14.38 8.61L15.27 8.89L16.54 9.69L17.29 10.54L17.86 11.62L18.09 12.56L18.05 14.21L17.34 15.91L15.79 17.36L14.05 17.98L12.59 17.98L11.74 17.74L11.65 17.08L11.98 16.42L14 16.52L15.36 15.91L16.31 14.78L16.64 13.6L16.45 12.09L15.93 11.2L15.13 10.49L13.81 10.02L12.82 10.02L11.74 10.4L10.71 11.34L10.09 12.85L10.09 18.78L10.28 18.92L12.12 19.58L13.76 19.67L15.13 19.44L16.82 18.68L18.28 17.41L18.94 16.47L19.65 14.64L19.79 12.99L19.41 11.06L18.38 9.22L16.73 7.76L14.94 7.01L13.11 6.82L10.99 7.25L9.06 8.42L7.46 10.21L6.33 10.07L6.05 9.74L6.05 0.38L6.42 0.05ZM12.59 2.59L15.13 2.68L17.15 3.2L19.84 4.61L20.92 5.55L20.92 5.88L20.4 6.49L20.02 6.59L17.72 4.94L14.94 4.05L12.31 4L9.86 4.66L9.39 4.33L9.29 3.39L10.99 2.82L12.59 2.64ZM12.07 11.67L12.35 11.67L13.2 12.56L14.19 11.67L14.89 12L14.94 12.52L14.05 13.36L14.99 14.35L14.94 14.73L14.61 15.06L14.14 15.06L13.29 14.16L12.31 15.11L11.93 15.06L11.55 14.68L11.55 14.31L12.49 13.41L11.55 12.47L11.6 12.09L12.07 11.72ZM3.36 14.31L4.02 14.45L4.78 17.08L6.24 19.34L7.88 20.85L9.95 21.98L12.12 22.54L14.75 22.54L16.26 22.21L17.95 21.51L20.45 19.62L21.2 20.14L21.34 20.61L18.99 22.54L16.12 23.72L14.42 24L12.45 24L9.58 23.34L6.66 21.69L4.45 19.34L3.51 17.69L2.75 15.44L2.66 14.64L3.36 14.35Z",
  Medium:
    "M12 0A12 12 0 1 1 12 24A12 12 0 1 1 12 0ZM2.43 12A5.13 5.14 0 1 0 12.69 12A5.13 5.14 0 1 0 2.43 12ZM13.58 12A2.64 5.14 0 1 0 18.86 12A2.64 5.14 0 1 0 13.58 12ZM19.71 12A0.93 5.14 0 1 0 21.57 12A0.93 5.14 0 1 0 19.71 12Z",
  Yelp: "m7.6885 15.1415-3.6715.8483c-.3769.0871-.755.183-1.1452.155-.2611-.0188-.5122-.0414-.7606-.213a1.179 1.179 0 0 1-.331-.3594c-.3486-.5519-.3656-1.3661-.3697-2.0004a6.2874 6.2874 0 0 1 .3314-2.0642 1.857 1.857 0 0 1 .1073-.2474 2.3426 2.3426 0 0 1 .1255-.2165 2.4572 2.4572 0 0 1 .1563-.1975 1.1736 1.1736 0 0 1 .399-.2831 1.082 1.082 0 0 1 .4592-.0837c.2355.0016.5139.052.91.1734.0555.0191.1237.0382.1856.0572.3277.1013.7048.2404 1.1499.3987.6863.2404 1.3663.487 2.0463.7397l1.2117.4423c.2217.0807.4363.18.6412.297.174.0984.3273.2298.4512.387a1.217 1.217 0 0 1 .192.4309 1.2205 1.2205 0 0 1-.872 1.4522c-.0468.0151-.0852.0239-.1085.0293l-1.105.2553-.0031-.001zM18.8208 7.565a1.8506 1.8506 0 0 0-.2042-.1754 2.4082 2.4082 0 0 0-.2077-.1394 2.3607 2.3607 0 0 0-.2269-.109 1.1705 1.1705 0 0 0-.482-.0796 1.0862 1.0862 0 0 0-.4498.1263c-.2107.1048-.4388.2732-.742.5551-.042.0417-.0947.0886-.142.133-.2502.2351-.5286.5252-.8599.863a114.6363 114.6363 0 0 0-1.5166 1.5629l-.8962.9293a4.1897 4.1897 0 0 0-.4466.5483 1.541 1.541 0 0 0-.2364.5459 1.2199 1.2199 0 0 0 .0107.4518l.0046.02a1.218 1.218 0 0 0 1.4184.923 1.162 1.162 0 0 0 .1105-.0213l4.7781-1.104c.3766-.087.7587-.1667 1.097-.3631.2269-.1316.4428-.262.5909-.5252a1.1793 1.1793 0 0 0 .1405-.4683c.0733-.6512-.2668-1.3908-.5403-1.963a6.2792 6.2792 0 0 0-1.2001-1.7103zM8.9703.0754a8.6724 8.6724 0 0 0-.83.1564c-.2754.066-.548.1383-.8146.2236-.868.2844-2.0884.8063-2.295 1.8065-.1165.5655.1595 1.1439.3737 1.66.2595.6254.614 1.1889.9373 1.7777.8543 1.5545 1.7245 3.0993 2.5922 4.6457.259.4617.5416 1.0464 1.043 1.2856a1.058 1.058 0 0 0 .1013.0383c.2248.0851.4699.1016.7041.0471a4.3015 4.3015 0 0 0 .0418-.0097 1.2136 1.2136 0 0 0 .5658-.3397 1.1033 1.1033 0 0 0 .079-.0822c.3463-.435.3454-1.0833.3764-1.6134.1042-1.771.2139-3.5423.3009-5.3142.0332-.6712.1055-1.3333.0655-2.0096-.0328-.5579-.0368-1.1984-.3891-1.6563-.6218-.8073-1.9476-.741-2.8523-.6158zm2.084 15.9505a1.1053 1.1053 0 0 0-1.2306-.4145 1.1398 1.1398 0 0 0-.1526.0633 1.4806 1.4806 0 0 0-.2171.1354c-.1992.1475-.3668.3392-.5196.5315-.0386.049-.074.1143-.12.1562l-.7686 1.0573a113.9168 113.9168 0 0 0-1.2913 1.789c-.278.3895-.5184.7184-.7083 1.0094-.036.0547-.0734.116-.1075.1647-.2277.3522-.3566.6092-.4228.8381a1.0945 1.0945 0 0 0-.046.4721c.0211.1655.0768.3246.1635.467.046.0715.0957.1406.1487.207a2.334 2.334 0 0 0 .1754.1825 1.843 1.843 0 0 0 .2108.1732c.5304.369 1.1112.6342 1.722.8391a6.0958 6.0958 0 0 0 1.5716.3004c.091.0046.1821.0025.2728-.006a2.3878 2.3878 0 0 0 .2506-.0351 2.3862 2.3862 0 0 0 .2447-.071 1.1927 1.1927 0 0 0 .4175-.2658c.1127-.113.1994-.249.2541-.3989.0889-.2214.1473-.5026.1857-.92.0034-.0593.0118-.1305.0177-.1958.0304-.3463.0443-.7531.0666-1.2315.0375-.7357.067-1.4681.0903-2.2026 0 0 .0495-1.3053.0494-1.306.0113-.3008.002-.6342-.0814-.9336a1.396 1.396 0 0 0-.1756-.4054zm8.6754 2.0439c-.1605-.176-.3878-.3514-.7462-.5682-.0518-.0288-.1124-.0674-.1684-.1009-.2985-.1795-.658-.3684-1.078-.5965a120.7615 120.7615 0 0 0-1.9427-1.042l-1.1515-.6107c-.0597-.0175-.1203-.0607-.1766-.0878-.2212-.1058-.4558-.2045-.6992-.2498a1.4915 1.4915 0 0 0-.2545-.0265 1.1527 1.1527 0 0 0-.1648.01 1.1077 1.1077 0 0 0-.9227.9133 1.4186 1.4186 0 0 0 .0159.439c.0563.3065.1932.6096.3346.875l.615 1.1526c.3422.65.6884 1.2963 1.0435 1.9406.229.4202.4196.7799.5982 1.078.0338.056.0721.1163.1011.1682.2173.3584.392.584.569.7458.1146.1107.252.195.4026.247.1583.0525.326.071.4919.0546a2.368 2.368 0 0 0 .251-.0435c.0817-.022.1622-.048.241-.0784a1.863 1.863 0 0 0 .2475-.1143 6.1018 6.1018 0 0 0 1.2818-.9597c.4596-.4522.8659-.9454 1.182-1.51.044-.08.0819-.163.1138-.2483a2.49 2.49 0 0 0 .0773-.2411c.0186-.083.033-.1669.0429-.2513a1.188 1.188 0 0 0-.0565-.491 1.0933 1.0933 0 0 0-.248-.4041zm2.86 3.742a.8523.8523 0 0 1-.111.4236c-.074.132-.178.2377-.3115.3172a.8428.8428 0 0 1-.4385.119.847.847 0 0 1-.4373-.1179.8526.8526 0 0 1-.3125-.3171.8548.8548 0 0 1-.111-.4248c0-.1526.038-.2958.1143-.4294a.8405.8405 0 0 1 .315-.3159.849.849 0 0 1 .4315-.1156.8514.8514 0 0 1 .4294.1144.84.84 0 0 1 .316.3148.8494.8494 0 0 1 .1156.4317zm-.1202 0c0-.1328-.0332-.256-.0996-.3698s-.1564-.2038-.2702-.2702a.7125.7125 0 0 0-.371-.1007.7204.7204 0 0 0-.3698.0996.7487.7487 0 0 0-.2713.2702.7181.7181 0 0 0-.0996.3709c0 .132.0332.2557.0996.371a.7355.7355 0 0 0 .2713.2713.7354.7354 0 0 0 .3698.0985.7205.7205 0 0 0 .3698-.0996.7423.7423 0 0 0 .2702-.2691.7186.7186 0 0 0 .1008-.3721zm-.577.0584.2724.4522h-.1922l-.237-.4052h-.1546v.4052h-.1695v-1.02h.2988c.1268 0 .2195.0247.2783.0744.0595.0496.0892.1252.0892.2267a.2785.2785 0 0 1-.0492.1625c-.032.0466-.0775.0813-.1362.1042zm-.0412-.1408a.1532.1532 0 0 0 .056-.1214c0-.0573-.0164-.0981-.0491-.1225-.0329-.0251-.0847-.0377-.1557-.0377h-.1214v.3285h.1237c.061 0 .1098-.0157.1465-.047z",
  Flickr:
    "M5.334 6.666C2.3884 6.666 0 9.055 0 12c0 2.9456 2.3884 5.334 5.334 5.334 2.9456 0 5.332-2.3884 5.332-5.334 0-2.945-2.3864-5.334-5.332-5.334zm13.332 0c-2.9456 0-5.332 2.389-5.332 5.334 0 2.9456 2.3864 5.334 5.332 5.334C21.6116 17.334 24 14.9456 24 12c0-2.945-2.3884-5.334-5.334-5.334Z",
  Dribbble:
    "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z",
  VSCO: "M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm11.52 12c0 .408-.023.792-.072 1.176l-2.04-.24c.024-.312.05-.624.05-.936 0-.288-.025-.6-.05-.888l2.04-.24c.072.384.072.744.072 1.128zM.479 12c0-.384.024-.769.049-1.152l2.04.24c-.024.312-.047.6-.047.912s.023.6.047.912l-2.04.24C.479 12.769.479 12.384.479 12zm20.472-3.096l1.921-.72c.264.72.433 1.464.552 2.232l-2.04.24c-.097-.6-.24-1.2-.433-1.752zM21 12c0 .6-.072 1.176-.167 1.752l-2.017-.455c.071-.409.119-.841.119-1.297s-.048-.912-.119-1.344l2.017-.457c.118.577.167 1.177.167 1.801zm-9 6.456C8.435 18.455 5.545 15.565 5.544 12 5.545 8.435 8.435 5.545 12 5.544c3.565.001 6.455 2.891 6.456 6.456.008 3.559-2.871 6.448-6.429 6.456H12zM12.216 21v-2.064c.885-.029 1.756-.224 2.568-.575l.888 1.872c-1.09.482-2.264.742-3.456.767zm-3.936-.791l.912-1.873c.792.359 1.656.575 2.568.6V21c-1.202-.023-2.386-.293-3.48-.791zM3 12c0-.624.072-1.224.192-1.824l2.016.456c-.098.45-.146.908-.144 1.368 0 .432.048.864.12 1.272l-2.016.455C3.051 13.159 2.994 12.58 3 12zm8.76-9v2.064c-.877.029-1.74.224-2.544.576l-.888-1.871C9.411 3.291 10.577 3.03 11.76 3zm3.935.792l-.911 1.872c-.809-.363-1.682-.559-2.568-.576V3.024c1.248 0 2.424.288 3.479.768zm5.088 4.656c-.231-.56-.513-1.098-.84-1.608l1.681-1.152c.407.648.768 1.32 1.056 2.04l-1.897.72zm-.07 1.296l-2.018.456c-.23-.85-.621-1.648-1.151-2.352l1.632-1.295c.72.959 1.248 2.015 1.537 3.191zm-3.457-2.256c-.572-.667-1.264-1.22-2.04-1.633l.912-1.871c1.056.549 1.993 1.299 2.76 2.208l-1.632 1.296zm-.6-3.744l.96-1.824c.672.384 1.295.816 1.896 1.32L18.145 4.8c-.461-.401-.959-.754-1.489-1.056zm-.408-.216c-.54-.266-1.102-.483-1.68-.648l.504-1.992c.744.216 1.464.48 2.159.84l-.983 1.8zm-2.16-.768c-.6-.144-1.2-.216-1.824-.239V.479c.793.024 1.584.12 2.328.289l-.504 1.992zm-2.28-.239c-.605.021-1.207.094-1.8.216L9.528.744c.72-.168 1.487-.265 2.28-.265v2.042zm-2.28.334c-.586.167-1.156.384-1.704.649l-.96-1.824c.691-.343 1.415-.616 2.16-.816l.504 1.991zm-2.112.865c-.529.294-1.027.64-1.488 1.032L4.56 3.216c.6-.504 1.224-.936 1.896-1.319l.96 1.823zm.48.264l.888 1.871c-.792.408-1.464.96-2.04 1.608L5.136 6.168c.775-.895 1.711-1.636 2.76-2.184zM4.848 6.552l1.608 1.295c-.53.705-.921 1.503-1.152 2.353l-2.016-.456c.312-1.2.84-2.28 1.56-3.192zM3.24 8.4l-1.92-.72c.287-.72.648-1.416 1.08-2.04l1.68 1.176c-.341.494-.623 1.025-.84 1.584zm-.168.455c-.192.577-.36 1.152-.432 1.776L.6 10.393c.12-.769.288-1.537.553-2.257l1.919.719zm-.456 4.513c.096.6.239 1.2.432 1.776l-1.92.72c-.271-.728-.456-1.485-.552-2.257l2.04-.239zm.624 2.208c.239.576.528 1.104.84 1.607L2.4 18.336c-.435-.629-.797-1.306-1.08-2.016l1.92-.744zm.024-1.392l2.017-.456c.216.864.624 1.681 1.128 2.376L4.8 17.4c-.725-.957-1.247-2.051-1.536-3.216zm3.432 2.28c.577.672 1.272 1.248 2.064 1.656l-.912 1.872c-1.063-.557-2.009-1.315-2.784-2.232l1.632-1.296zm.72 3.815l-.96 1.825c-.674-.376-1.31-.819-1.896-1.321l1.368-1.535c.456.407.936.744 1.488 1.031zm.408.217c.528.264 1.104.48 1.705.647l-.504 1.992c-.747-.196-1.471-.469-2.16-.815l.959-1.824zm2.16.768c.576.12 1.176.193 1.8.217v2.039c-.774-.026-1.544-.114-2.305-.264l.505-1.992zm2.28.216c.605-.021 1.207-.094 1.801-.217l.479 1.992c-.749.168-1.513.264-2.28.287V21.48zm2.257-.336c.586-.165 1.155-.382 1.703-.647l.96 1.824c-.688.35-1.412.623-2.159.815l-.504-1.992zm2.086-.865c.528-.287 1.032-.647 1.488-1.031l1.369 1.535c-.588.502-1.223.945-1.896 1.321l-.961-1.825zm-.479-.263l-.888-1.871c.788-.414 1.489-.977 2.064-1.656l1.606 1.296c-.778.91-1.722 1.668-2.782 2.231zm3.071-2.592l-1.607-1.296c.532-.708.916-1.517 1.128-2.376l2.017.456c-.311 1.157-.831 2.248-1.538 3.216zM20.76 15.6l1.92.721c-.288.72-.648 1.392-1.079 2.04l-1.682-1.177c.337-.504.624-1.032.841-1.584zm.168-.455c.192-.553.336-1.152.433-1.752l2.039.239c-.11.761-.294 1.508-.551 2.232l-1.921-.719zm.456-9.841l-1.681 1.152c-.358-.49-.76-.947-1.199-1.368l1.368-1.536c.552.552 1.056 1.128 1.512 1.752zM4.2 3.528l1.368 1.536c-.456.408-.84.864-1.2 1.368l-1.68-1.176c.431-.636.94-1.216 1.512-1.728zM2.664 18.744l1.68-1.152c.36.48.769.937 1.2 1.369l-1.368 1.535c-.548-.545-1.054-1.131-1.512-1.752zm17.16 1.729l-1.368-1.537c.432-.407.841-.863 1.199-1.344l1.682 1.176c-.457.6-.961 1.175-1.513 1.705z",
  "Reverb Nation":
    "M24 9.324l-9.143-.03L11.971.57 9.143 9.294 0 9.324h.031l7.367 5.355-2.855 8.749h.029l7.459-5.386 7.396 5.386-2.855-8.73L24 9.315",
  NaverTV:
    "M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z",
  Blog: "M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z",
  Mixer:
    "M2.456 1.375a2.461 2.461 0 0 0-1.65.642C-.134 2.884-.21 4.348.553 5.38l4.917 6.59-4.946 6.65c-.762 1.032-.702 2.496.254 3.363a2.45 2.45 0 0 0 3.617-.344l6.904-9.28a.65.65 0 0 0 0-.763L4.423 2.361a2.432 2.432 0 0 0-1.967-.986zm19.089 0a2.432 2.432 0 0 0-1.968.986l-6.86 9.22a.65.65 0 0 0 0 .762l6.89 9.296a2.45 2.45 0 0 0 3.617.344c.956-.867 1.016-2.331.254-3.363l-4.947-6.65 4.917-6.59c.762-1.032.687-2.496-.254-3.363a2.459 2.459 0 0 0-1.65-.641z",
  Hudl: "M11.5 0C11.5 0 11.3 0 11.2 0C10.7 0.1 10.7 0.1 10.3 0.1C9.9 0.2 9.4 0.3 9.4 0.4C9.3 0.4 9.5 0.5 9.9 0.6C12 1.1 13.9 2.3 15.4 4C15.7 4.3 15.9 4.6 15.9 4.7C15.9 4.7 15.9 4.8 15.8 5C15.7 5.5 15.6 6.3 15.7 6.9C15.8 7.7 16.2 8.6 16.9 9.2C17.1 9.5 17.6 9.9 17.8 10C17.9 10 18 10.1 18 10.2C18 10.4 18 12.2 17.9 12.7C17.9 12.9 17.9 13 17.9 13.1C17.9 13.1 17.8 13.2 17.8 13.3C17.8 13.4 17.8 13.6 17.7 13.8C17.6 14.2 17.6 14.2 17.6 14.3C17.5 14.5 17.5 14.5 17.6 14.5C17.8 14.5 18.9 14 19.5 13.6C19.9 13.4 20.7 12.8 21 12.5C21.3 12.2 21.8 11.7 22 11.5C22.1 11.3 22.2 11.2 22.3 11.2C22.3 11.2 22.3 11.1 22.3 11.1C22.4 10.9 22.4 10.2 22.3 9.5C22.3 9.3 22.3 9.3 22.4 9.2C22.5 9.1 22.6 9 22.6 9C22.7 8.9 22.9 8.5 23.1 8.3C23.2 8 23.4 7.4 23.5 7.2C23.5 6.8 23.6 6.6 23.6 6.3C23.6 5.9 23.5 5.6 23.4 5.2C23.4 4.9 23.1 4.3 22.8 3.9C22.3 3.1 21.3 2.4 20.3 2.2C20.3 2.2 20.2 2.2 20.1 2.2C20 2.2 19.2 2.2 19.1 2.2C19 2.2 18.8 2.2 18.7 2.3L18.4 2.3L18.1 2.1C16.7 1 15 0.3 13.2 0.1C13.2 0.1 13 0 12.9 0C12.7 0 11.5 0 11.5 0ZM6.7 1.5C6.5 1.7 6.1 1.9 5.9 2L5.6 2.3L5.3 2.3C3.9 2 2.6 2.3 1.7 3.3C1 4 0.7 4.7 0.5 5.6C0.4 5.9 0.4 6.6 0.5 6.9C0.6 7.8 1 8.6 1.6 9.2C1.7 9.3 1.7 9.4 1.7 9.8C1.6 10.1 1.6 11.7 1.7 11.9C1.7 12 1.7 12.1 1.7 12.2C1.8 12.6 1.8 12.7 1.9 13.1C2.1 14.2 2.5 15.3 3.1 16.4C3.2 16.6 3.5 16.9 3.5 16.9C3.5 16.9 3.5 17 3.5 17C3.5 17 3.9 17.5 3.9 17.6C4 17.6 4 17.7 4.1 17.8C4.3 18 4.6 18.4 4.6 18.4C4.7 18.4 4.7 18.2 4.6 18.1C4.6 17.9 4.3 16.9 4.3 16.7C4.3 16.6 4.3 16.5 4.3 16.5C4.1 15.8 4.1 15.4 4.1 14.6C4.1 14 4.2 13.2 4.2 13.2C4.2 13.2 4.2 13.1 4.2 12.9C4.3 12.7 4.4 12 4.5 11.6C4.6 11.2 4.9 10.4 4.9 10.4C4.9 10.4 5.1 10.3 5.2 10.3C5.4 10.3 5.6 10.2 5.8 10.2C6 10.1 6.5 9.8 6.6 9.7C7.1 9.3 7.4 9 7.7 8.6C8.1 7.9 8.4 7.2 8.4 6.3C8.4 5.9 8.4 5.8 8.4 5.8C8.6 5.6 9.7 4.9 10.2 4.7C10.9 4.4 11.1 4.3 11.8 4.1C12 4 12.1 4 12.2 4C12.4 3.9 12.3 3.8 11.7 3.4C11.1 2.9 10.1 2.3 9.5 2C9.4 2 9.3 1.9 9.2 1.9C8.8 1.8 8.1 1.5 7.6 1.4C7 1.3 7 1.3 6.7 1.5ZM21.7 13.9C21 14.6 20.3 15.2 19.5 15.8C19 16.1 18.1 16.5 17.8 16.7C17.7 16.7 17.6 16.7 17.6 16.8C17.5 16.8 16.1 17.2 15.7 17.3C15.7 17.3 15.5 17.3 15.4 17.3C15.3 17.4 15.2 17.4 15.2 17.4C15.2 17.4 15.1 17.2 14.9 17.1C14.8 17 14.6 16.8 14.5 16.7C14.4 16.6 14.2 16.5 14.2 16.4C14.2 16.4 14.2 16.4 14.1 16.4C14.1 16.4 14 16.3 14 16.3C13.7 16.1 13.3 16 13 15.9C11.9 15.6 10.8 15.8 9.9 16.4C9.8 16.5 9.7 16.5 9.6 16.5C9.5 16.5 8.7 16 8.3 15.8C7.6 15.3 7.1 14.9 6.5 14.3C6.3 14.1 6.1 14 6.1 14C6.1 14 6 14.1 6 14.4C6 14.5 6 14.6 6 14.6C5.9 14.7 5.9 15.5 5.9 16.1C5.9 16.9 6 17.5 6.1 18.2C6.1 18.3 6.1 18.4 6.2 18.5C6.2 18.9 6.6 20 6.7 20C6.7 20 6.7 20.1 6.8 20.1C6.9 20.2 7.2 20.3 7.5 20.5L8.2 20.8L8.3 21.2C8.6 22.1 9.1 22.9 9.9 23.4C10.5 23.8 11.2 24 11.9 24C13 24 14 23.6 14.7 22.9C15.3 22.4 15.6 21.7 15.9 21C15.9 20.9 15.9 20.8 15.9 20.8C16 20.8 16.7 20.4 16.9 20.3C18.2 19.6 19.5 18.4 20.4 17.1C20.8 16.5 21.2 15.7 21.5 15.2C21.5 15.1 21.6 14.9 21.6 14.8C21.7 14.7 21.9 13.9 22 13.7C22 13.5 21.9 13.6 21.7 13.9Z",
  Twitch:
    "M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z",
  TikTok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  Instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  Kick: "M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z",
  Facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  Discord:
    "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
  Bilibili:
    "M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z",
  Snapchat:
    "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z",
  Reddit:
    "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  Steam:
    "M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z",
  Pinterest:
    "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  VK: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z",
  Rumble:
    "M14.4528 13.5458c.8064-.6542.9297-1.8381.2756-2.6445a1.8802 1.8802 0 0 0-.2756-.2756 21.2127 21.2127 0 0 0-4.3121-2.776c-1.066-.51-2.256.2-2.4261 1.414a23.5226 23.5226 0 0 0-.14 5.5021c.116 1.23 1.292 1.964 2.372 1.492a19.6285 19.6285 0 0 0 4.5062-2.704v-.008zm6.9322-5.4002c2.0335 2.228 2.0396 5.637.014 7.8723A26.1487 26.1487 0 0 1 8.2946 23.846c-2.6848.6713-5.4168-.914-6.1662-3.5781-1.524-5.2002-1.3-11.0803.17-16.3045.772-2.744 3.3521-4.4661 6.0102-3.832 4.9242 1.174 9.5443 4.196 13.0764 8.0121v.002z",
  "SOOP Korea":
    "M17.182 5.182C15.162 5.182 13.348 6.06 12.1 7.455 12.046 7.515 11.954 7.515 11.9 7.455 10.652 6.06 8.838 5.182 6.818 5.182 3.052 5.182 0 8.234 0 12 0 15.766 3.052 18.818 6.818 18.818 8.838 18.818 10.652 17.94 11.9 16.545 11.954 16.485 12.046 16.485 12.1 16.545 13.348 17.94 15.162 18.818 17.182 18.818 20.948 18.818 24 15.766 24 12 24 8.234 20.948 5.182 17.182 5.182ZM17.182 15.545C16.091 15.545 15.179 15.02 14.62 14.426 14.442 14.236 14.221 13.977 13.979 13.756 13.863 13.651 13.748 13.557 13.637 13.473 13.181 13.148 12.615 12.955 12.001 12.955 11.386 12.955 10.82 13.148 10.364 13.473 10.253 13.557 10.139 13.651 10.023 13.756 9.779 13.977 9.559 14.236 9.381 14.426 8.822 15.02 7.91 15.545 6.82 15.545 6.792 15.545 6.764 15.544 6.736 15.543 6.689 15.542 6.642 15.541 6.596 15.538 6.564 15.536 6.532 15.533 6.5 15.53 6.481 15.529 6.462 15.527 6.444 15.526 4.662 15.338 3.274 13.831 3.274 12V12.015C3.274 12.005 3.274 11.995 3.274 11.985V12C3.274 10.169 4.662 8.663 6.443 8.474 6.463 8.472 6.483 8.471 6.503 8.469 6.534 8.466 6.565 8.464 6.595 8.462 6.642 8.459 6.689 8.458 6.737 8.457 6.764 8.457 6.792 8.455 6.819 8.455 7.91 8.455 8.821 8.98 9.38 9.574 9.558 9.764 9.779 10.023 10.022 10.244 10.138 10.349 10.253 10.443 10.364 10.527 10.82 10.853 11.386 11.045 12 11.045 12.614 11.045 13.18 10.853 13.636 10.527 13.748 10.443 13.862 10.349 13.978 10.244 14.221 10.023 14.442 9.764 14.62 9.574 15.179 8.98 16.09 8.455 17.181 8.455 17.208 8.455 17.235 8.456 17.262 8.457 17.31 8.458 17.358 8.459 17.405 8.462 17.435 8.464 17.465 8.466 17.495 8.469 17.516 8.47 17.537 8.472 17.558 8.474 19.271 8.656 20.62 10.056 20.72 11.792 20.72 11.804 20.721 11.815 20.722 11.825 20.723 11.858 20.724 11.89 20.725 11.922 20.725 11.971 20.726 12.018 20.725 12.067 20.724 12.103 20.724 12.14 20.722 12.176 20.722 12.183 20.72 12.191 20.72 12.198 20.624 13.938 19.274 15.343 17.558 15.524 17.536 15.526 17.515 15.528 17.493 15.53 17.464 15.533 17.435 15.535 17.405 15.537 17.358 15.539 17.31 15.541 17.262 15.542 17.235 15.542 17.208 15.544 17.181 15.544L17.182 15.545Z",
  NimoTV:
    "M23.991 18.325C23.925 20.565 22.197 22.568 19.968 22.999 19.601 23.069 19.228 23.105 18.854 23.105 14.226 23.105 9.599 23.131 4.971 23.092 1.794 23.066 0 20.326 0.04 18.19 0.086 15.174 0.051 12.157 0.051 9.139 0.04 6.822 1.859 4.696 4.162 4.347 5.084 4.207 6.018 4.226 6.947 4.215 7.716 4.213 8.475 4.043 9.171 3.717 11.123 2.807 13.093 1.934 15.054 1.044 15.322 0.923 15.588 0.869 15.855 1.044 15.915 1.11 15.979 1.173 16.046 1.232 16.222 1.408 16.176 1.628 16.15 1.835 16.074 2.414 15.974 2.989 15.904 3.57 15.85 4.035 16.016 4.201 16.478 4.21 17.388 4.228 18.298 4.244 19.208 4.27 21.577 4.37 23.567 6.138 23.944 8.479 23.97 8.655 23.981 8.84 24 9.021 23.964 9.105 23.954 9.198 23.97 9.288L23.97 18.057C23.951 18.147 23.958 18.24 23.991 18.325ZM8.068 9.651C6.53 9.963 7.161 12.443 8.662 12.008 10.286 11.743 9.615 9.133 8.068 9.651ZM15.266 9.989C14.91 10.27 14.061 10.68 14.594 11.212 15.241 11.608 16.036 12.701 16.82 12.066 17.084 11.438 16.318 11.18 15.967 10.856 16.343 10.542 17.002 10.328 16.844 9.71 16.376 9.044 15.741 9.721 15.266 9.989ZM10.853 12.49C10.776 12.594 10.621 12.795 10.543 12.908 10.418 14.216 10.479 15.535 10.504 16.847 10.488 17.582 11.439 18.132 12.067 17.782 13.175 17.212 14.268 16.608 15.32 15.937 15.639 15.75 15.835 15.407 15.835 15.038 15.835 14.729 15.698 14.437 15.462 14.239 14.492 13.544 13.401 13.03 12.37 12.434 11.924 12.07 11.271 12.094 10.853 12.49Z",
  "YouTube Gaming":
    "M24 13.2v-6l-6-3.6-6 3.6-6-3.6-6 3.6v6l12 7.2zM8.4 10.8H6v2.4H4.8v-2.4H2.4V9.6h2.4V7.2H6v2.4h2.4zm7.2 2.4a1.2 1.2 0 01-1.2-1.2c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2 0 .66-.54 1.2-1.2 1.2zm3.6-2.4A1.2 1.2 0 0118 9.6c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2 0 .66-.54 1.2-1.2 1.2Z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  X: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  Tumblr:
    "M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z",
  Patreon:
    "M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46 3.765.047 4.326-4.804 6.068-7.141 1.24-1.662 2.836-2.132 4.801-2.618 3.376-.836 5.678-3.501 5.673-7.031Z",
  SoundCloud:
    "M23.999 14.165c-.052 1.796-1.612 3.169-3.4 3.169h-8.18a.68.68 0 0 1-.675-.683V7.862a.747.747 0 0 1 .452-.724s.75-.513 2.333-.513a5.364 5.364 0 0 1 2.763.755 5.433 5.433 0 0 1 2.57 3.54c.282-.08.574-.121.868-.12.884 0 1.73.358 2.347.992s.948 1.49.922 2.373ZM10.721 8.421c.247 2.98.427 5.697 0 8.672a.264.264 0 0 1-.53 0c-.395-2.946-.22-5.718 0-8.672a.264.264 0 0 1 .53 0ZM9.072 9.448c.285 2.659.37 4.986-.006 7.655a.277.277 0 0 1-.55 0c-.331-2.63-.256-5.02 0-7.655a.277.277 0 0 1 .556 0Zm-1.663-.257c.27 2.726.39 5.171 0 7.904a.266.266 0 0 1-.532 0c-.38-2.69-.257-5.21 0-7.904a.266.266 0 0 1 .532 0Zm-1.647.77a26.108 26.108 0 0 1-.008 7.147.272.272 0 0 1-.542 0 27.955 27.955 0 0 1 0-7.147.275.275 0 0 1 .55 0Zm-1.67 1.769c.421 1.865.228 3.5-.029 5.388a.257.257 0 0 1-.514 0c-.21-1.858-.398-3.549 0-5.389a.272.272 0 0 1 .543 0Zm-1.655-.273c.388 1.897.26 3.508-.01 5.412-.026.28-.514.283-.54 0-.244-1.878-.347-3.54-.01-5.412a.283.283 0 0 1 .56 0Zm-1.668.911c.4 1.268.257 2.292-.026 3.572a.257.257 0 0 1-.514 0c-.241-1.262-.354-2.312-.023-3.572a.283.283 0 0 1 .563 0Z",
  Spotify:
    "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  Openrec:
    "M12 0A12 12 0 1 1 8.116.646L12 4.789ZM12 4.789A7.212 7.212 0 0 0 12 19.212A7.212 7.212 0 0 0 12 4.789ZM9.231 8.517L15.328 11.996L9.231 15.475Z",
  Rooter:
    "M0 11.954A8.631 8.631 0 1 1 17.262 11.954A8.631 8.631 0 1 1 0 11.954ZM2.631 11.954A6 6 0 1 0 14.631 11.954A6 6 0 1 0 2.631 11.954ZM6.738 11.954A8.631 8.631 0 1 1 24 11.954A8.631 8.631 0 1 1 6.738 11.954ZM9.369 11.954A6 6 0 1 0 21.369 11.954A6 6 0 1 0 9.369 11.954Z",
  Chzzk:
    "M9.399 0L17.622 0L15.273 3.524L23.497 3.524L13.259 17.455L22.49 17.79L22.49 24L0.503 24L10.741 9.734L2.517 9.399L9.231 0.168Z",
  "Bigo Live":
    "M9.722 0L11.544 0L13.063 1.215L15.797 2.127L18.228 4.557L19.747 9.418L18.835 11.544L17.013 13.063L18.835 14.582L21.266 14.582L21.57 17.013L20.354 19.443L18.835 20.658L17.013 20.354L14.582 21.57L12.456 24L10.937 24L10.025 23.089L6.684 22.177L2.43 18.532L2.43 16.101L4.253 16.101L4.861 14.582L3.646 13.063L3.949 11.241L2.734 9.418L2.734 8.203L4.253 6.38L3.949 3.949L5.468 2.127L7.595 2.127L9.418 0.304Z",
};

function PlatformIcon({ name }: { name: string }) {
  // "Website" is a link type, not a brand, so there is no logo to source. The
  // filled globe is the universal convention for it, and fill weight keeps it at
  // the same visual weight as the flat brand silhouettes around it. (Blog is a
  // link type too, but RSS is a real brand glyph, so it sits in PLATFORM_ICONS.)
  if (name === "Website") {
    return (
      <GlobeIcon
        aria-hidden="true"
        className="size-[22px] shrink-0"
        weight="fill"
      />
    );
  }
  const path = PLATFORM_ICONS[name];
  // Platforms without a verified glyph get a muted monogram tile that fills the
  // same slot as a real logo, so every cell reads as intentional and aligned
  // rather than a loud dot floating next to the brand marks.
  if (!path) {
    return (
      <span
        aria-hidden="true"
        className="bg-elevated text-muted/80 flex size-[22px] shrink-0 items-center justify-center rounded-[3px] text-[0.72rem] leading-none font-semibold"
      >
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="size-[22px] shrink-0"
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  );
}

function VisualCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-card/70 cta-panel-frame rounded-2xl border p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatLine({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex shrink-0 items-baseline gap-2 text-white">
      <span className="font-display text-5xl font-bold tracking-tight tabular-nums">
        {value}
      </span>
      <span className="text-sm">{label}</span>
    </p>
  );
}

// Under "All Platforms" there is no single context to name the platform in, so
// the canonical name wins; inside a tab the platform takes that tab's name.
function platformLabel(platform: Platform, category: "all" | PlatformCategory) {
  if (category === "all") return platform.name;
  return platform.labels?.[category] ?? platform.name;
}

function PlatformExplorer() {
  const [category, setCategory] = useState<"all" | PlatformCategory>("all");

  const matching =
    category === "all"
      ? PLATFORMS
      : PLATFORMS.filter((platform) => platform.categories.includes(category));

  // Archived platforms sink to the bottom of every view so the grey reads as one
  // deliberate block below the live roster instead of speckling through it.
  const visible = [
    ...matching.filter((platform) => !platform.legacy),
    ...matching.filter((platform) => platform.legacy),
  ];
  const hasLegacy = matching.some((platform) => platform.legacy);

  return (
    <div className="mt-8">
      <div
        aria-label="Filter platforms by category"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {PLATFORM_CATEGORIES.map((item) => {
          const isActive = category === item.id;
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "focus-visible:ring-ring/60 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-card/60 text-muted hover:text-foreground",
              )}
              key={item.id}
              onClick={() => setCategory(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visible.map((platform) => (
          <li className="flex" key={platform.name}>
            <span
              className={cn(
                "flex min-h-[3.5rem] w-full items-center gap-2.5 rounded-lg border py-2 pr-2.5 pl-3.5 text-left text-[14px] leading-tight font-medium transition-all",
                platform.legacy
                  ? // Archived: recedes rather than invites. Muted ink on a
                    // flatter surface, and the brand hover is dropped so the
                    // tile never reads as a live, clickable capability.
                    "border-border/60 bg-card/25 text-muted/70"
                  : "border-border bg-card/60 text-foreground hover:text-brand hover:border-[color-mix(in_oklch,var(--brand)_40%,var(--border))] hover:bg-[color-mix(in_oklch,var(--paper),var(--brand)_4%)] hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--brand)_20%,transparent),0_8px_26px_-8px_color-mix(in_oklch,var(--brand)_38%,transparent)]",
              )}
              title={
                platform.legacy
                  ? "Historical data available — no longer actively tracked"
                  : undefined
              }
            >
              <PlatformIcon name={platform.icon ?? platform.name} />
              <span className="min-w-0">
                {platformLabel(platform, category)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {hasLegacy ? (
        <p className="text-muted/70 mt-3 flex items-center gap-2 text-xs">
          <span
            aria-hidden="true"
            className="border-border/60 bg-card/25 size-3 shrink-0 rounded-[3px] border"
          />
          Greyed platforms are archived: we still hold their history, but no
          longer collect new data.
        </p>
      ) : null}
    </div>
  );
}

// ── 02 · Verified data, longest history ────────────────────────────────────

function HistoryVisual() {
  return (
    <div className="border-border bg-card/70 cta-panel-frame overflow-hidden rounded-2xl border">
      <Image
        alt="Hatchet creator profile dashboard showing verified follower counts, engagement, and growth history across platforms"
        className="h-auto w-full"
        height={1170}
        sizes="(min-width: 1024px) 34rem, 100vw"
        src="/images/product-mockup.png"
        width={2048}
      />
    </div>
  );
}

// ── 03 · Industry leader ───────────────────────────────────────────────────

// Each logo is sized by HEIGHT with an intrinsic width (w-auto) — never a fixed
// box. Fixed-width slots + object-contain used to leave the square (Blizzard)
// and tall (Kings League) marks floating in ~56px of dead air per side, while
// the wide wordmarks filled theirs; since Kings League ends the track, its dead
// air landed on the wrap seam and read as a ~137px hole in the loop.
//
// `height` is optical, not uniform: a square mark must be taller than a wide
// wordmark to carry the same visual weight. Derived from h = 67 / sqrt(aspect)
// (equal rendered area), clamped to 48px so the square/tall marks don't tower.
// `width`/`heightPx` are the real file dimensions — keep in sync if re-exported.
const TRUST_LOGOS: {
  name: string;
  src: string;
  width: number;
  height: number;
  size: string;
}[] = [
  {
    name: "Riot Games",
    src: "/images/logos/riot-games.png",
    width: 300,
    height: 95,
    size: "h-[46px]",
  },
  {
    name: "EA",
    src: "/images/logos/ea.png",
    width: 444,
    height: 66,
    size: "h-[32px]",
  },
  {
    name: "Blizzard",
    src: "/images/logos/blizzard.png",
    width: 1500,
    height: 1500,
    size: "h-[58px]",
  },
  {
    name: "PlayStation",
    src: "/images/logos/sony.png",
    width: 555,
    height: 165,
    size: "h-[44px]",
  },
  {
    name: "BLAST",
    src: "/images/logos/BLAST.png",
    width: 966,
    height: 201,
    size: "h-[30px]",
  },
  {
    name: "Kings League",
    src: "/images/logos/Kingsleague_logo.png",
    width: 277,
    height: 361,
    size: "h-[58px]",
  },
];

// gap-[56px] between logos plus a matching pr-[56px] tail: the trailing padding
// is what makes the gap across the wrap seam identical to every other gap, so
// the loop reads as continuous rather than restarting.
function TrustLogosTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-[56px] pr-[56px]"
    >
      {TRUST_LOGOS.map(({ name, src, width, height, size }) => (
        <Image
          alt={`${name} logo`}
          className={cn("w-auto shrink-0", size)}
          height={height}
          key={`${ariaHidden ? "dup-" : ""}${name}`}
          src={src}
          width={width}
        />
      ))}
    </div>
  );
}

function TrustLogosVisual() {
  return (
    // One unified light panel: the whole card is white (surface-paper flips the
    // tokens so the border resolves light) rather than a pale inset floating in
    // a dark frame. These full-colour brand marks are built for light surfaces,
    // so they sit directly on it; the marquee's edge mask dissolves them
    // left/right so it doesn't read as a hard-edged slab.
    <VisualCard className="surface-paper bg-paper border-paper-border overflow-hidden">
      <p className="eyebrow text-brand text-[0.65rem]">Trusted by</p>
      <div className="logo-marquee-mask-soft group mt-3 overflow-hidden">
        <div className="animate-logo-marquee flex w-max group-hover:[animation-play-state:paused]">
          <TrustLogosTrack />
          <TrustLogosTrack ariaHidden />
        </div>
      </div>
    </VisualCard>
  );
}

// ── 04 · Stay ahead of the industry ────────────────────────────────────────

const INTELLIGENCE_ITEMS: { label: string; Icon: IsoIcon }[] = [
  { label: "Quarterly industry trend reports", Icon: FileText },
  { label: "Game launch benchmark trackers", Icon: TrendUp },
  { label: "Competitor campaign watch", Icon: ChartLine },
];

function IntelligenceVisual() {
  return (
    <VisualCard>
      <p className="eyebrow text-muted text-[0.65rem]">Market intelligence</p>
      <ul className="mt-4 grid gap-2">
        {INTELLIGENCE_ITEMS.map(({ label, Icon }) => (
          <li
            className="border-border bg-elevated/60 flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
            key={label}
          >
            <Icon aria-hidden="true" className="text-brand size-6 shrink-0" />
            <span className="text-foreground text-sm font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </VisualCard>
  );
}

// ── Visual router ──────────────────────────────────────────────────────────
//    Point 05 ("lifecycle") is rendered separately as the full orbital widget;
//    it has no card here.

function PointVisualBlock({ visual }: { visual: PointVisual }) {
  switch (visual.kind) {
    case "platforms":
      return null;
    case "history":
      return <HistoryVisual />;
    case "logos":
      return <TrustLogosVisual />;
    case "intelligence":
      return <IntelligenceVisual />;
    case "lifecycle":
      return null;
  }
}

// ── Section ────────────────────────────────────────────────────────────────

export function WhyHatchetPoints({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-background text-foreground px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        <AccordionPrimitive.Root
          className="border-border border-t"
          collapsible
          defaultValue="01"
          type="single"
        >
          {POINTS.map((point) => (
            <AccordionPrimitive.Item
              className="border-border border-b"
              key={point.id}
              value={point.id}
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group/point focus-visible:ring-ring/60 flex w-full items-center gap-5 rounded-lg py-6 text-left outline-none focus-visible:ring-3 sm:gap-8">
                  <span className="text-muted/80 font-mono text-xs font-semibold tracking-[0.18em] tabular-nums">
                    {point.id}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="eyebrow text-brand text-[0.65rem]">
                      {point.eyebrow}
                    </span>
                    <span className="text-foreground text-lg font-semibold sm:text-xl">
                      {point.headline}
                    </span>
                  </span>
                  <span className="border-border text-muted group-aria-expanded/point:border-brand group-aria-expanded/point:text-brand flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors">
                    <Plus
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-aria-expanded/point:rotate-45"
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden">
                {/* Mirrors the trigger's number column + gap with an invisible
                    copy of the id, so the panel's left edge lands exactly on the
                    eyebrow/headline at every breakpoint. A fixed pl- can't: the
                    number's width is font-dependent and the gap is responsive. */}
                <div className="flex gap-5 pb-8 sm:gap-8 lg:pb-10">
                  <span
                    aria-hidden="true"
                    className="invisible font-mono text-xs font-semibold tracking-[0.18em] tabular-nums"
                  >
                    {point.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    {point.visual.kind === "lifecycle" ? (
                      <CreatorLifecycleOrbital />
                    ) : point.visual.kind === "platforms" ? (
                      /* No visual card here — the stat sits opposite the body
                         copy and the full platform roster carries the section. */
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
                        <p className="body text-foreground/90 max-w-xl">
                          {point.body}
                        </p>
                        <StatLine
                          label="platforms"
                          value={TRACKED_PLATFORM_STAT}
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "grid gap-8 lg:gap-12",
                          point.visual.kind === "logos"
                            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]"
                            : point.visual.kind === "history"
                              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]"
                              : "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]",
                        )}
                      >
                        <div className="max-w-xl">
                          <p className="body text-foreground/90">
                            {point.body}
                          </p>
                        </div>
                        <PointVisualBlock visual={point.visual} />
                      </div>
                    )}
                    {point.visual.kind === "platforms" ? (
                      <PlatformExplorer />
                    ) : null}
                  </div>
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href={siteConfig.bookDemoUrl}>Book a Demo</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href="#comparison">See How We Compare</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
