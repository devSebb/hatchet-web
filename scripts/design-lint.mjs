#!/usr/bin/env node
/**
 * Design-system lint. Runs in /publish and in CI.
 *
 *   node scripts/design-lint.mjs            # working tree vs HEAD
 *
 * Every rule here passes against the site as it stands today. That was a
 * design constraint, not a coincidence: a guardrail that fails the finished
 * site gets ignored within a week, and then it protects nothing.
 *
 * Rules 1 and 7 are DIFF-BASED rather than absolute — they judge what a change
 * does, not what a file already contains. Rule 1 in particular cannot be
 * absolute: the codebase legitimately uses 150+ spacing utilities whose numbers
 * have no design token (7, 9, 11, 14, 18, 28 ...), so a rule banning those
 * would fail on its first run and teach everyone to skip it.
 *
 * The output is read by a non-technical person. Say what is wrong, which file,
 * and what to do instead.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const findings = [];
const report = (f) => findings.push(f);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === "_unmounted") continue;
      walk(p, acc);
    } else acc.push(p);
  }
  return acc;
}

const SOURCE = walk(join(ROOT, "app"))
  .concat(walk(join(ROOT, "components")))
  .concat(walk(join(ROOT, "lib")))
  .filter((f) => /\.(tsx|ts)$/.test(f));

const rel = (f) => relative(ROOT, f);

/** Added and removed lines in the working tree, against HEAD. */
function changedLines() {
  let diff = "";
  try {
    diff = execFileSync("git", ["diff", "HEAD", "--unified=0"], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return [];
  }
  const out = [];
  let file = null;
  let lineNo = 0;
  for (const l of diff.split("\n")) {
    if (l.startsWith("+++ b/")) file = l.slice(6);
    else if (l.startsWith("@@")) {
      const m = l.match(/\+(\d+)/);
      lineNo = m ? Number(m[1]) : 0;
    } else if (l.startsWith("+") && !l.startsWith("+++")) {
      out.push({ file, line: lineNo++, text: l.slice(1), added: true });
    } else if (l.startsWith("-") && !l.startsWith("---")) {
      out.push({ file, line: lineNo, text: l.slice(1), added: false });
    }
  }
  return out.filter((d) => d.file && /\.(tsx|ts)$/.test(d.file));
}

/* -- RULE 1 : never step a numeric spacing utility by one ----------------- *
 * The spacing scale is roughly double stock Tailwind, WITH HOLES. Tokens
 * exist for 1-6, 8, 10, 12, 16, 20, 24 and nothing else. A number with a token
 * uses it; a number without falls straight through to stock Tailwind.
 * Measured from the built stylesheet:
 *     h-7  -> 1.75rem = 28px (stock)      h-8  -> 4rem = 64px (token)
 *     h-11 -> 2.75rem = 44px (stock)      h-12 -> 6rem = 96px (token)
 * So "a bit bigger" answered by h-7 -> h-8 multiplies it by 2.3, and
 * h-12 -> h-11 asked for as "slightly smaller" more than halves it.        */
const PREFIX =
  "(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|w|h|size|space-x|space-y|inset|top|bottom|left|right)";
const SPACING_RE = new RegExp("\\b(" + PREFIX + ")-(\\d+)\\b", "g");
const TOKENS = new Set([1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]);
const pxFor = (n) =>
  TOKENS.has(n) ? `${n * 8}px (design token)` : `${n * 4}px (plain default)`;

function ruleSpacingStep(diff) {
  const removed = diff.filter((d) => !d.added);
  for (const a of diff.filter((d) => d.added)) {
    for (const r of removed.filter((x) => x.file === a.file)) {
      for (const x of [...r.text.matchAll(SPACING_RE)]) {
        for (const y of [...a.text.matchAll(SPACING_RE)]) {
          if (x[1] !== y[1]) continue;
          const from = Number(x[2]);
          const to = Number(y[2]);
          if (Math.abs(from - to) !== 1) continue;
          if (TOKENS.has(from) === TOKENS.has(to)) continue;
          report({
            file: a.file,
            line: a.line,
            problem:
              `\`${x[1]}-${from}\` was changed to \`${y[1]}-${to}\`. On this site those are\n` +
              `   not one step apart:\n` +
              `       ${x[1]}-${from} is ${pxFor(from)}\n` +
              `       ${y[1]}-${to} is ${pxFor(to)}`,
            fix:
              `These numbers are not a smooth scale. Some have a design size behind\n` +
              `   them and some fall back to a much smaller default, so changing one by 1\n` +
              `   can make a thing half the size or twice the size. Use one of\n` +
              `   1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 — or ask Seb.`,
          });
        }
      }
    }
  }
}

/* -- RULE 2 : no arbitrary colour values outside globals.css -------------- */
const COLOUR_RE =
  /(?:bg-\[#|text-\[#|border-\[#|fill-\[#|stroke-\[#|#[0-9a-fA-F]{6}\b|\brgb\(|\bhsl\()/;
/**
 * Measured exemptions. Every one predates this lint, and every one is a case
 * where a token genuinely cannot be used — not a case of "we did it wrong once".
 * A new file is never added here without the same standard of reason.
 */
const COLOUR_EXEMPT = [
  // Renders only when the root layout itself throws, so globals.css may never
  // have loaded. It must carry its own inline styles and a system font stack,
  // and Next requires it to emit its own <html>/<body>.
  "app/global-error.tsx",
  // The styleguide monitor bezel is an illustration of a physical object, not
  // brand surface. Explicitly out of scope in the Phase 5 brief.
  "components/sections/MonitorMockup.tsx",
  "app/styleguide/monitor/page.tsx",
  // Generated icon path data.
  "components/icons/iso-icons.tsx",
  // OTHER COMPANIES' brand colours, as SVG fill on their logos (SoundCloud
  // #FF5500 and so on). Not ours to tokenise, and wrong to change.
  "lib/brand/logos.ts",
  // HTML email. Email clients do not support CSS custom properties, so the
  // colours must be literal. Unmounted server code besides — see
  // lib/booking/server/README.md.
  "lib/booking/server/",
];

/**
 * Decorative silkscreen labels on the fake circuit-board artwork use a
 * monospace SYSTEM stack (ui-monospace, SF Mono, Menlo...). No webfont is
 * loaded and the brand typeface is untouched, so this is not a new font
 * family in the sense the rule means. A new one anywhere else still fails.
 */
const FONT_EXEMPT = [
  "app/global-error.tsx",
  "components/sections/CircuitDivider.tsx",
  "components/sections/CircuitField.tsx",
  "lib/booking/server/",
];
const exempt = (r) => COLOUR_EXEMPT.some((e) => r === e || r.startsWith(e));

function ruleNoArbitraryColour() {
  for (const f of SOURCE) {
    const r = rel(f);
    if (exempt(r)) continue;
    readFileSync(f, "utf8")
      .split("\n")
      .forEach((text, i) => {
        if (!COLOUR_RE.test(text)) return;
        if (/\bd="|viewBox=/.test(text)) return;
        report({
          file: r,
          line: i + 1,
          problem:
            "A colour is written out here instead of using a brand token.",
          fix:
            `Use a token: text-brand, bg-brand, border-brand, text-signal,\n` +
            `   bg-muted-surface, text-muted, bg-card. The full list is in the\n` +
            `   design-system skill. A new colour is never a copy change — ask Seb.`,
        });
      });
  }
}

/* -- RULE 3 : no new font families ---------------------------------------- *
 * There is exactly one: Golos Text, loaded in app/layout.tsx as --font-brand.
 * Every font token on the site (display, heading, body, sans, mono) points
 * at it.                                                                    */
function ruleNoNewFonts() {
  for (const f of SOURCE) {
    const r = rel(f);
    if (r === "app/layout.tsx") continue;
    if (FONT_EXEMPT.some((e) => r === e || r.startsWith(e))) continue;
    readFileSync(f, "utf8")
      .split("\n")
      .forEach((text, i) => {
        if (!/from "next\/font|font-family|fontFamily/.test(text)) return;
        report({
          file: r,
          line: i + 1,
          problem: "This introduces a font.",
          fix:
            `The site uses one typeface everywhere — Golos Text. Use the existing\n` +
            `   classes (font-display, font-heading, font-body). Adding a font changes\n` +
            `   the whole brand, so that one needs Seb.`,
        });
      });
  }
}

/* -- RULE 4 : Signal primitives stay where they are ----------------------- *
 * The styleguide names three sanctioned primitives — Sparkline, LiveDot and
 * CircuitDivider — and CircuitField is the same visual family. Their current
 * homes were measured, not guessed (docs/handoff-audit.md 5.3).            */
const SIGNAL_SITES = {
  Sparkline: [
    "app/styleguide/page.tsx",
    "components/sections/StatCounters.tsx",
  ],
  LiveDot: ["app/styleguide/page.tsx"],
  CircuitDivider: [
    "app/page.tsx",
    "app/about/contact/page.tsx",
    "app/solutions/[solution]/page.tsx",
    "app/who-we-serve/[vertical]/page.tsx",
    "components/sections/CircuitDivider.tsx",
  ],
  CircuitField: [
    "app/page.tsx",
    "components/sections/Hero.tsx",
    "components/sections/StatCounters.tsx",
    "components/sections/CircuitField.tsx",
  ],
};

function ruleSignalPlacement() {
  for (const f of SOURCE) {
    const r = rel(f);
    const src = readFileSync(f, "utf8");
    for (const [name, sites] of Object.entries(SIGNAL_SITES)) {
      if (sites.includes(r)) continue;
      const re = new RegExp("<" + name + "[\\s/>]");
      if (!re.test(src)) continue;
      report({
        file: r,
        line: src.split("\n").findIndex((l) => re.test(l)) + 1,
        problem: `\`<${name}>\` is used somewhere it has never appeared before.`,
        fix:
          `The live-signal graphics (sparkline, live dot, circuit divider, circuit\n` +
          `   field) appear in specific places by design. Putting one somewhere new\n` +
          `   is a design decision — ask Seb.`,
      });
    }
  }
}

/* -- RULE 5 : no raw <img> ------------------------------------------------ */
function ruleNoRawImg() {
  for (const f of SOURCE) {
    const r = rel(f);
    readFileSync(f, "utf8")
      .split("\n")
      .forEach((text, i) => {
        if (!/<img[\s/>]/.test(text)) return;
        report({
          file: r,
          line: i + 1,
          problem: "A plain <img> tag is used here.",
          fix:
            `Use next/image instead — it makes the smaller versions phones need.\n` +
            `   Ask Claude to "use next/image for this picture", and give it the\n` +
            `   image's real width and height in pixels.`,
        });
      });
  }
}

/* -- RULE 6 : no colour inside an inline style block ---------------------- */
function insideStyleBlock(lines, i) {
  for (let j = i; j >= 0 && j > i - 6; j--) {
    if (/style=\{\{/.test(lines[j])) return true;
  }
  return false;
}

function ruleNoInlineStyleColour() {
  for (const f of SOURCE) {
    const r = rel(f);
    if (exempt(r)) continue;
    const lines = readFileSync(f, "utf8").split("\n");
    lines.forEach((text, i) => {
      if (!/\b(color|backgroundColor|borderColor)\s*:/.test(text)) return;
      if (!/style=\{\{/.test(text) && !insideStyleBlock(lines, i)) return;
      if (/var\(--/.test(text)) return;
      report({
        file: r,
        line: i + 1,
        problem: "A colour is set directly in a style block here.",
        fix:
          `Use a brand token instead — a class like text-brand, or var(--brand)\n` +
          `   inside the style. See the design-system skill.`,
      });
    });
  }
}

/* -- RULE 7 : editor-created pages live under /lp/ only ------------------- *
 * Diff-based, so the 21 existing routes are not retroactively illegal.
 * /lp/ was verified free across all 2,935 legacy streamhatchet.com URLs
 * (docs/seo-namespace.md 5.1); the site root is the most collision-prone
 * space there is, with 96 legacy URLs sitting directly on it.              */
function ruleNewPagesUnderLp() {
  let added = [];
  try {
    added = execFileSync(
      "git",
      ["diff", "HEAD", "--name-only", "--diff-filter=A"],
      { cwd: ROOT, encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);
  } catch {
    return;
  }
  for (const f of added) {
    if (!/^app\/.*\/page\.tsx$/.test(f)) continue;
    if (f.startsWith("app/lp/") || f.startsWith("app/_")) continue;
    const slug = f.replace(/^app\//, "").replace(/\/page\.tsx$/, "");
    report({
      file: f,
      line: 1,
      problem: "A new page was created outside /lp/.",
      fix:
        `New pages belong at /lp/<name> — for this one, app/lp/${slug}/page.tsx.\n` +
        `   The rest of the site's addresses are reserved for links from the old\n` +
        `   site, and a clash there breaks them. Use /new-page, which gets this right.`,
    });
  }
}

const diff = changedLines();
ruleSpacingStep(diff);
ruleNoArbitraryColour();
ruleNoNewFonts();
ruleSignalPlacement();
ruleNoRawImg();
ruleNoInlineStyleColour();
ruleNewPagesUnderLp();

if (!findings.length) {
  console.log("✓ design check passed");
  process.exit(0);
}

console.log("");
console.log("✗ DESIGN CHECK FAILED");
console.log("");
console.log(
  `Found ${findings.length} thing${findings.length === 1 ? "" : "s"} that would change how the site looks.`,
);
console.log("Nothing has been published. Each one is below.");
console.log("");
findings.forEach((f, i) => {
  console.log(`${i + 1}. ${f.file}${f.line ? `, line ${f.line}` : ""}`);
  console.log(`   ${f.problem}`);
  console.log("");
  console.log(`   What to do: ${f.fix}`);
  console.log("");
});
console.log(
  "If you think one of these is wrong, message Seb rather than working",
);
console.log("around it — these rules exist because the design is finished.");
process.exit(1);
