import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Styleguide | Hatchet",
  robots: {
    index: false,
    follow: false,
  },
};

type Swatch = {
  label: string;
  variable: string;
  className: string;
};

const coreSwatches: Swatch[] = [
  { label: "Brand", variable: "--brand", className: "bg-brand" },
  {
    label: "Brand strong",
    variable: "--brand-strong",
    className: "bg-brand-strong",
  },
  {
    label: "Brand soft",
    variable: "--brand-soft",
    className: "bg-brand-soft",
  },
  { label: "Ink", variable: "--ink", className: "bg-ink" },
  { label: "Background", variable: "--bg", className: "bg-bg" },
  { label: "Surface", variable: "--surface", className: "bg-surface" },
  { label: "Elevated", variable: "--elevated", className: "bg-elevated" },
  { label: "Border", variable: "--border", className: "bg-border" },
  { label: "Text", variable: "--text", className: "bg-text" },
  { label: "Text muted", variable: "--text-muted", className: "bg-muted" },
  { label: "Signal", variable: "--signal", className: "bg-signal" },
  { label: "Signal 2", variable: "--signal-2", className: "bg-signal-2" },
  {
    label: "Signal grid",
    variable: "--signal-grid",
    className: "bg-signal-grid",
  },
];

const paperSwatches: Swatch[] = [
  { label: "Paper", variable: "--paper", className: "bg-paper" },
  {
    label: "Paper surface",
    variable: "--paper-surface",
    className: "bg-paper-surface",
  },
  {
    label: "Paper border",
    variable: "--paper-border",
    className: "bg-paper-border",
  },
  { label: "Paper ink", variable: "--paper-ink", className: "bg-paper-ink" },
  {
    label: "Paper muted",
    variable: "--paper-muted",
    className: "bg-paper-muted",
  },
];

const typeSamples = [
  {
    label: "Display",
    className: "display",
    text: "Measure the live signal",
  },
  {
    label: "H1",
    className: "h1",
    text: "Gaming and streaming intelligence",
  },
  {
    label: "H2",
    className: "h2",
    text: "Track creators, games, and audiences",
  },
  {
    label: "H3",
    className: "h3",
    text: "Signals for every team",
  },
  {
    label: "Body large",
    className: "body-lg",
    text: "Hatchet turns live-streaming, esports, press, and community movement into analytics teams can act on.",
  },
  {
    label: "Body",
    className: "body",
    text: "Use plain product language, frame numbers as proof, and keep controls active and specific.",
  },
  {
    label: "Small",
    className: "small",
    text: "Secondary labels and supporting metadata stay readable.",
  },
];

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {swatches.map((swatch) => (
        <div
          key={swatch.variable}
          className="border-border bg-card overflow-hidden rounded-lg border"
        >
          <div className={`${swatch.className} border-border h-20 border-b`} />
          <div className="space-y-1 p-3">
            <p className="small text-foreground font-medium">{swatch.label}</p>
            <p className="text-muted font-mono text-xs">{swatch.variable}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SignalPlaceholder() {
  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <p className="eyebrow text-muted">Signal placeholder</p>
      <div className="bg-signal-grid mt-5 h-px w-full" />
      <div className="mt-4 grid gap-2">
        <div className="bg-signal-2 h-px w-4/5" />
        <div className="bg-signal h-px w-3/5" />
      </div>
      <p className="small text-muted mt-5">
        Phase 2 will replace this with the live sparkline, divider pulse, and
        stat sparkline primitives.
      </p>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:px-10">
        <div className="space-y-4">
          <Badge variant="outline">Noindex</Badge>
          <p className="eyebrow text-muted">Hatchet design system</p>
          <h1 className="display max-w-4xl">Token foundation review</h1>
          <p className="body-lg text-muted max-w-3xl">
            A compact surface for checking fonts, color tokens, shadcn
            inheritance, type scale, stat figures, and the future Signal
            components.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Type scale</CardTitle>
            <CardDescription>
              Bricolage Grotesque for display, Inter for body and UI, JetBrains
              Mono for data labels.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-7">
            {typeSamples.map((sample) => (
              <div key={sample.label} className="grid gap-2">
                <p className="eyebrow text-muted">{sample.label}</p>
                <p className={sample.className}>{sample.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dark surface colors</CardTitle>
            <CardDescription>
              Core brand, charcoal, text, and Signal tokens on the default brand
              surface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SwatchGrid swatches={coreSwatches} />
          </CardContent>
        </Card>

        <section className="surface-paper border-border bg-background text-foreground rounded-lg border p-6 shadow-md">
          <div className="mb-6 space-y-2">
            <p className="eyebrow text-muted">Paper surface</p>
            <h2 className="h2">Light-section tokens</h2>
            <p className="body text-muted max-w-2xl">
              Paper sections interleave with dark sections while shadcn
              primitives inherit the same semantic aliases.
            </p>
          </div>
          <SwatchGrid swatches={paperSwatches} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Book a demo</Button>
            <Button variant="secondary">Sign up</Button>
            <Button variant="outline">Compare plans</Button>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              shadcn variants remapped to Hatchet semantic tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Book a demo</Button>
            <Button variant="secondary">Sign up</Button>
            <Button variant="outline">Talk to sales</Button>
            <Button variant="ghost">View resources</Button>
            <Button variant="link">Log in</Button>
            <Button variant="destructive">Remove filter</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Eyebrow and stat figure</CardTitle>
              <CardDescription>
                Mono labels and proof-scale numbers use tabular figures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="eyebrow text-muted">Creators tracked</p>
              <p className="stat-figure mt-4">40M+</p>
              <p className="body text-muted mt-4">
                Numbers are framed as evidence, not decoration.
              </p>
            </CardContent>
          </Card>

          <SignalPlaceholder />
        </div>
      </section>
    </main>
  );
}
