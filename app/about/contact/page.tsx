import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BookingCalendar, ChatBubble } from "@/components/icons/iso-icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CircuitDivider } from "@/components/sections/CircuitDivider";
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

// Meet-the-team roster. The LinkedIn URL is the source of truth for each person;
// `photo` is a headshot localized under public/ (only the public LinkedIn
// profiles exposed one — the rest fall back to a brand-gradient initials tile
// until real headshots are added). `title`/`email` are optional and left open
// until finalized; each renders only when present.
type TeamMember = {
  name: string;
  linkedin: string;
  photo?: string;
  title?: string;
  email?: string;
};

const salesTeam: TeamMember[] = [
  {
    name: "Eduard Montserrat",
    title: "Co-Founder & CEO",
    linkedin: "https://www.linkedin.com/in/eduardmontserrat/",
    photo: "/images/company/team/eduard-montserrat.jpg",
  },
  {
    name: "Albert Alemany",
    title: "Co-Founder & CTO",
    linkedin: "https://www.linkedin.com/in/albertalemanyfont/",
    photo: "/images/company/team/albert-alemany.jpg",
  },
  {
    name: "Àlex Porcel",
    title: "Data Analytics Director",
    linkedin: "https://www.linkedin.com/in/alex-porcel-julia/",
    photo: "/images/company/team/alex-porcel.jpg",
  },
  {
    name: "Alessandra Pinto",
    title: "Director of Product",
    linkedin: "https://www.linkedin.com/in/alessandra-pinto-productmanager/",
    photo: "/images/company/team/alessandra-pinto.jpg",
  },
  {
    name: "Kyle Hartsook",
    title: "Director of Strategy",
    linkedin: "https://www.linkedin.com/in/kyle-hartsook/",
    photo: "/images/company/team/kyle-hartsook.jpg",
  },
  {
    name: "Jonathan Chris Karam",
    title: "B2B Partnerships Manager",
    linkedin:
      "https://www.linkedin.com/in/jonathan-chris-karam-%F0%9F%94%9C-gamescom-66398287/",
    photo: "/images/company/team/jonathan-chris-karam.jpg",
  },
  {
    name: "Yoshiki Horiguchi",
    title: "Business Development",
    linkedin: "https://www.linkedin.com/in/yoshiki-horiguchi/",
    photo: "/images/company/team/yoshiki-horiguchi.jpg",
  },
  {
    name: "Andi Ding",
    title: "Strategic Business Development",
    linkedin: "https://www.linkedin.com/in/andi-ding/",
    photo: "/images/company/team/andi-ding.jpg",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

// The same simple-icons LinkedIn glyph the footer uses (see FooterSocials), so
// the mark reads identically across the site. Draws with currentColor.
const LINKEDIN_GLYPH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";

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
            {/* Book a Demo — primary. surface-paper scopes the card to the
                light theme: white card, dark ink, red button untouched. */}
            <article className="surface-paper border-brand/30 bg-card ring-brand/10 flex h-full flex-col rounded-2xl border p-7 shadow-sm ring-1">
              <span className="bg-accent ring-border/60 inline-flex size-[84px] items-center justify-center rounded-2xl ring-1 ring-inset">
                <BookingCalendar aria-hidden="true" className="size-[60px]" />
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

            {/* Send Us a Message — secondary, scrolls to the inline form.
                Same light-scoped treatment as the demo card. */}
            <article className="surface-paper border-border bg-card flex h-full flex-col rounded-2xl border p-7 shadow-sm">
              <span className="bg-accent ring-border/60 inline-flex size-[84px] items-center justify-center rounded-2xl ring-1 ring-inset">
                <ChatBubble aria-hidden="true" className="size-[60px]" />
              </span>
              <h2 className="h3 mt-4">Send us a message</h2>
              <p className="body text-muted mt-2 grow">
                Any doubt? Drop us a message and we&apos;ll get back to you.
              </p>
              <div className="mt-4">
                <Button asChild>
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
                {member.photo ? (
                  <Image
                    alt={member.name}
                    className="size-16 rounded-full object-cover shadow-sm"
                    height={200}
                    src={member.photo}
                    width={200}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-display flex size-16 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-lg font-semibold tracking-tight text-white shadow-sm"
                  >
                    {initials(member.name)}
                  </span>
                )}
                <h3 className="font-display text-foreground mt-5 text-lg font-semibold tracking-tight">
                  {member.name}
                </h3>
                {member.title ? (
                  <p className="small text-muted mt-1">{member.title}</p>
                ) : null}
                {member.email ? (
                  <a
                    className="text-muted hover:text-brand mt-2 text-sm font-medium break-all transition-colors"
                    href={`mailto:${member.email}`}
                  >
                    {member.email}
                  </a>
                ) : null}
                <a
                  aria-label={`${member.name} on LinkedIn`}
                  className="text-muted hover:text-brand mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  href={member.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    fill="currentColor"
                    role="img"
                    viewBox="0 0 24 24"
                  >
                    <path d={LINKEDIN_GLYPH} />
                  </svg>
                  LinkedIn
                </a>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <CircuitDivider pulseDelaySeconds={-3} />

      {/* ── Inline "send us a message" form ────────────────────────── */}
      <ContactForm />
    </main>
  );
}
