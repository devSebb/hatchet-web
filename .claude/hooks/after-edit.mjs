#!/usr/bin/env node
/**
 * PostToolUse hook — runs after every Edit / Write / MultiEdit.
 *
 * Formats the edited file and type-checks the project, so a mistake surfaces
 * within seconds of the edit that caused it rather than at /publish, by which
 * point the editor has moved on and has no idea which change broke it.
 *
 * It never blocks. It prints, and Claude reads what it prints. A hook that
 * refuses an edit would leave an editor stuck with no way forward; a hook that
 * reports lets Claude fix it and say what it fixed.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

const payload = readStdin();
const file =
  payload?.tool_input?.file_path ?? payload?.tool_input?.filePath ?? null;

const FORMATTABLE = /\.(ts|tsx|js|jsx|mjs|css|json|md)$/;
const messages = [];

// 1. Format just the edited file. Cheap, and keeps `format:check` at baseline.
if (file && FORMATTABLE.test(file) && !file.includes("/node_modules/")) {
  try {
    execFileSync("npx", ["prettier", "--write", file], {
      stdio: "pipe",
      timeout: 30_000,
    });
    messages.push(`formatted ${file.replace(process.cwd() + "/", "")}`);
  } catch {
    // Prettier failing usually means the file does not parse yet — tsc below
    // will say so far more clearly than a prettier stack trace would.
  }
}

// 2. Type-check the project. This is the check that catches a typo in a prop
//    name or a deleted import, which are the two things most likely to go
//    wrong in a copy edit.
if (file && /\.(ts|tsx)$/.test(file)) {
  try {
    execFileSync("npx", ["tsc", "--noEmit"], {
      stdio: "pipe",
      timeout: 110_000,
    });
    messages.push("typecheck clean");
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
    const lines = out.split("\n").filter((l) => l.includes("error TS"));
    console.log(
      [
        "⚠️  This edit introduced a code error. The site will not build until it is fixed.",
        "",
        ...lines.slice(0, 8).map((l) => `    ${l}`),
        lines.length > 8 ? `    …and ${lines.length - 8} more` : "",
        "",
        "Fix it now, before making any other change — later errors will pile on",
        "top of this one and get harder to read.",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    process.exit(0);
  }
}

if (messages.length) console.log(`✓ ${messages.join(", ")}`);
