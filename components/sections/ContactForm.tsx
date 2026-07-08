"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react/ssr";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "border-border bg-card text-foreground placeholder:text-muted focus-visible:border-brand focus-visible:ring-brand/30 w-full rounded-lg border px-4 py-3 text-sm shadow-xs outline-none transition-[border-color,box-shadow] focus-visible:ring-3";

/**
 * Inline "send us a message" form on the Contact page. No backend is wired yet,
 * so submission is handled client-side and swapped for a confirmation state.
 * Anchored by #contact-form so the hero's secondary CTA can scroll to it.
 */
export function ContactForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      className={cn(
        "surface-paper bg-background text-foreground scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
      id="contact-form"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <div className="max-w-md">
            <p className="eyebrow text-brand">Contact us</p>
            <h2 className="h1 mt-4">Send a quick message.</h2>
            <p className="body-lg text-muted mt-5">
              Any doubt? Drop us a message and we&apos;ll get back to you as
              soon as possible.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <span className="bg-brand/10 text-brand inline-flex size-14 items-center justify-center rounded-full">
                  <CheckCircle aria-hidden="true" className="size-8" />
                </span>
                <h3 className="h3 mt-6">Message received.</h3>
                <p className="body text-muted mt-3 max-w-sm">
                  Thanks for reaching out. Our team will get back to you
                  shortly.
                </p>
              </div>
            ) : (
              <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="small text-foreground font-medium">
                      Name
                    </span>
                    <input
                      autoComplete="name"
                      className={FIELD_CLASS}
                      name="name"
                      placeholder="Your name"
                      required
                      type="text"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="small text-foreground font-medium">
                      Company
                    </span>
                    <input
                      autoComplete="organization"
                      className={FIELD_CLASS}
                      name="company"
                      placeholder="Company"
                      type="text"
                    />
                  </label>
                </div>
                <label className="grid gap-2">
                  <span className="small text-foreground font-medium">
                    Email
                  </span>
                  <input
                    autoComplete="email"
                    className={FIELD_CLASS}
                    name="email"
                    placeholder="you@company.com"
                    required
                    type="email"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="small text-foreground font-medium">
                    Message
                  </span>
                  <textarea
                    className={cn(FIELD_CLASS, "min-h-32 resize-y")}
                    name="message"
                    placeholder="Type your message here"
                    required
                    rows={5}
                  />
                </label>
                <div className="flex justify-end">
                  <Button type="submit">
                    Send message
                    <PaperPlaneTilt aria-hidden="true" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
