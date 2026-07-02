"use client";

import {
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Hero } from "@/components/sections/Hero";
import { cn } from "@/lib/utils";

/**
 * TEMPORARY pre-launch design lab — delete before shipping (along with the
 * --hero-gradient-2/-3 tokens in globals.css and this file's use in page.tsx).
 *
 * Floating numbered tabs on the left switch the hero between three theme
 * candidates. Only the hero zone changes; the top nav and everything below the
 * trusted-by band stay identical. Theme 1 renders the current production hero
 * untouched. Append ?heroTheme=2|3 to the URL to deep-link a variant.
 */

const THEMES = [
  {
    number: "01",
    name: "Navy / steel",
    gradient: "var(--hero-gradient)",
    dark: true,
  },
  {
    number: "02",
    name: "Navy / ember",
    gradient: "var(--hero-gradient-2)",
    dark: true,
  },
  {
    number: "03",
    name: "Daylight",
    gradient: "var(--hero-gradient-3)",
    dark: false,
  },
] as const;

type HeroThemeLabProps = Omit<
  ComponentProps<typeof Hero>,
  "surface" | "statStyle"
> & {
  children?: ReactNode;
};

const noopSubscribe = () => () => {};

function readThemeFromUrl() {
  const param = new URLSearchParams(window.location.search).get("heroTheme");
  const index = param ? Number(param) - 1 : -1;
  return index >= 0 && index < THEMES.length ? index : 0;
}

export function HeroThemeLab({ children, ...heroProps }: HeroThemeLabProps) {
  // Deep-link support (?heroTheme=2|3) so each variant can be reviewed or
  // screenshotted directly. The URL is read via useSyncExternalStore so the
  // server render (always theme 1) hydrates cleanly before the param applies.
  const urlTheme = useSyncExternalStore(
    noopSubscribe,
    readThemeFromUrl,
    () => 0,
  );
  const [override, setOverride] = useState<number | null>(null);
  const theme = override ?? urlTheme;
  const setTheme = setOverride;
  const active = THEMES[theme];

  return (
    <div className="relative isolate overflow-hidden">
      {/* All three gradients stay mounted and crossfade, since
          background-image itself can't transition. */}
      {THEMES.map((t, index) => (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700",
            index === theme ? "opacity-100" : "opacity-0",
          )}
          key={t.number}
          style={{ backgroundImage: t.gradient }}
        />
      ))}

      <nav
        aria-label="Hero theme preview"
        className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
      >
        {THEMES.map((t, index) => {
          const isActive = index === theme;
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "font-display flex size-10 cursor-pointer items-center justify-center rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-(--dur-base)",
                isActive
                  ? "bg-gradient-brand shadow-glow-brand scale-105 border-transparent text-white"
                  : active.dark
                    ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    : "border-(--paper-border) bg-white/40 text-(--paper-muted) hover:bg-white/70 hover:text-(--paper-ink)",
              )}
              key={t.number}
              onClick={() => setTheme(index)}
              title={t.name}
              type="button"
            >
              {t.number}
            </button>
          );
        })}
      </nav>

      <Hero
        {...heroProps}
        statStyle={active.dark ? "default" : "compact"}
        surface={active.dark ? "gradient" : "light"}
      />

      {children}
    </div>
  );
}
