#!/usr/bin/env bash
#
# `pnpm format:check` with a known baseline.
#
# Two files in this repo have never been Prettier-clean and are not going to be
# reformatted:
#
#   AGENTS.md                       — the agent instruction file
#   components/icons/iso-icons.tsx  — generated icon paths; reformatting it
#                                     produces a 2,000-line diff on every touch
#
# So a bare `pnpm format:check` always exits 1, which makes it useless as a
# gate: a real formatting regression looks exactly like the normal state. This
# compares the offending set against the baseline instead — unchanged passes,
# anything added or removed fails and says which.
#
#   ./scripts/check-format.sh
#
#
# ---------------------------------------------------------------------------
# WARNING: "used to be exempt and are now clean" IS A FAILURE, NOT GOOD NEWS.
#
# It means something reformatted a BASELINE file — almost always a bare
# `pnpm format`, which formats everything and does not honour this baseline.
# Reformatting iso-icons.tsx is a +2056/-288 diff against a file whose
# generator is lost and which cannot be regenerated.
#
# The safe sequence when you need to format:
#
#   pnpm format
#   git restore AGENTS.md components/icons/iso-icons.tsx
#   ./scripts/check-format.sh        # must print "baseline of 2", exit 0
#
# DO NOT resolve that message by deleting entries from BASELINE below. That
# silences the guard rather than fixing the cause, and leaves nothing to catch
# the next bare `pnpm format`.
# ---------------------------------------------------------------------------
set -uo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BASELINE="AGENTS.md
components/icons/iso-icons.tsx"

ACTUAL="$(pnpm format:check 2>&1 | sed -n 's/^\[warn\] \(.*\)$/\1/p' \
  | grep -v 'Code style issues' | sort)"
EXPECTED="$(printf '%s\n' "$BASELINE" | sort)"

if [ "$ACTUAL" = "$EXPECTED" ]; then
  echo "✓ formatting is at the expected baseline (2 known files)"
  exit 0
fi

echo ""
echo "✗ FORMATTING CHECK FAILED"
echo ""

NEW="$(comm -13 <(printf '%s\n' "$EXPECTED") <(printf '%s\n' "$ACTUAL"))"
GONE="$(comm -23 <(printf '%s\n' "$EXPECTED") <(printf '%s\n' "$ACTUAL"))"

if [ -n "$NEW" ]; then
  echo "These files are not formatted correctly:"
  printf '%s\n' "$NEW" | sed 's/^/    /'
  echo ""
  echo "  To fix, run this and commit the result:"
  echo ""
  echo "      pnpm format"
  echo ""
fi

if [ -n "$GONE" ]; then
  echo "These files used to be exempt and are now clean:"
  printf '%s\n' "$GONE" | sed 's/^/    /'
  echo ""
  echo "  That is good news, but it means the baseline in"
  echo "  scripts/check-format.sh is stale. Remove them from BASELINE there."
  echo ""
fi

exit 1
