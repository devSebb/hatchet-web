import type { Metadata } from "next";
import Link from "next/link";
import { LinkedinLogo } from "@phosphor-icons/react/ssr";

import { Calendar, ChatBubble } from "@/components/icons/iso-icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { ContactForm } from "@/components/sections/ContactForm";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Contact",
    description:
      "Book a demo or send Hatchet's gaming-native team a message. Real people with real gaming knowledge, ready to show you what Hatchet can do.",
    path: "/about/contact",
  });
}

// Placeholder sales team — swap names/titles/photos when finalized. Avatars fall
// back to brand-gradient tiles with initials until real headshots are added.
const salesTeam = [
  {
    name: "Eduard Montserrat",
    title: "Co-founder & CEO",
    linkedin: "https://www.linkedin.com/company/stream-hatchet",
  },
  {
    name: "Albert Alemany",
    title: "Co-founder & CPO",
    linkedin: "https://www.linkedin.com/company/stream-hatchet",
  },
  {
    name: "Sofia Navarro",
    title: "Head of Sales",
    linkedin: "https://www.linkedin.com/company/stream-hatchet",
  },
  {
    name: "Marc Vidal",
    title: "Senior Account Executive",
    linkedin: "https://www.linkedin.com/company/stream-hatchet",
  },
] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ── Hero + the two primary CTAs ────────────────────────────── */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal className="max-w-3xl">
            <div>
              <p className="eyebrow text-muted">Contact</p>
              <h1 className="display mt-4">
                The right data starts with the right conversation.
              </h1>
              <p className="body-lg text-muted mt-5">
                Ready to see Hatchet in action, or just have questions? Our team
                is built around gaming. They&apos;ll know what you&apos;re up
                against.
              </p>
            </div>
          </Reveal>

          <Stagger
            childClassName="h-full"
            className="mt-10 grid gap-4 md:grid-cols-2"
          >
            {/* Book a Demo — primary */}
            <article className="border-brand/30 bg-card ring-brand/10 flex h-full flex-col rounded-2xl border p-7 shadow-sm ring-1">
              <span className="bg-accent ring-border/60 inline-flex size-[84px] items-center justify-center rounded-2xl ring-1 ring-inset">
                <Calendar aria-hidden="true" className="size-[60px]" />
              </span>
              <h2 className="h3 mt-4">Book a demo</h2>
              <p className="body text-muted mt-2 grow">
                30 minutes. We&apos;ll show you exactly what Hatchet can do for
                your campaign.
              </p>
              <div className="mt-4">
                <Button asChild>
                  <a
                    href={siteConfig.bookDemoUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Book a demo
                  </a>
                </Button>
              </div>
            </article>

            {/* Send Us a Message — secondary, scrolls to the inline form */}
            <article className="border-border bg-card flex h-full flex-col rounded-2xl border p-7 shadow-sm">
              <span className="bg-accent ring-border/60 inline-flex size-[84px] items-center justify-center rounded-2xl ring-1 ring-inset">
                <ChatBubble aria-hidden="true" className="size-[60px]" />
              </span>
              <h2 className="h3 mt-4">Send us a message</h2>
              <p className="body text-muted mt-2 grow">
                Any doubt? Drop us a message and we&apos;ll get back to you.
              </p>
              <div className="mt-4">
                <Button
                  asChild
                  className="border-border hover:border-brand/50 hover:text-brand bg-white text-[#022658] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--brand)_20%,transparent),0_10px_28px_-8px_color-mix(in_oklch,var(--brand)_40%,transparent)]"
                  variant="secondary"
                >
                  <Link href="#contact-form">Send us a message</Link>
                </Button>
              </div>
            </article>
          </Stagger>
        </div>
      </section>

      {/* ── Meet the team ──────────────────────────────────────────── */}
      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Meet the team</p>
              <h2 className="h1 mt-4">Real people. Real gaming knowledge.</h2>
              <p className="body-lg text-muted mt-5">
                Our team knows creator marketing analytics inside out.
                They&apos;re ready to show you what Hatchet can do.
              </p>
            </div>
          </Reveal>

          <Stagger
            childClassName="h-full"
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {salesTeam.map((member) => (
              <article
                className="border-border bg-card flex h-full flex-col items-start rounded-xl border p-6 shadow-sm"
                key={member.name}
              >
                <span
                  aria-hidden="true"
                  className="font-display flex size-16 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-lg font-semibold tracking-tight text-white shadow-sm"
                >
                  {initials(member.name)}
                </span>
                <h3 className="font-display text-foreground mt-5 text-lg font-semibold tracking-tight">
                  {member.name}
                </h3>
                <p className="small text-muted mt-1">{member.title}</p>
                <a
                  aria-label={`${member.name} on LinkedIn`}
                  className="text-muted hover:text-brand mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  href={member.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkedinLogo
                    aria-hidden="true"
                    className="size-5"
                    weight="fill"
                  />
                  LinkedIn
                </a>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Inline "send us a message" form ────────────────────────── */}
      <ContactForm />
    </main>
  );
}
