"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  detectTimezone,
  tzLabel,
  dayLabel,
  timeLabel,
  fullLabel,
  groupByDay,
  type Slot,
} from "./time";

type Step = "time" | "details" | "done";

interface Availability {
  host_timezone: string;
  duration_min: number;
  slots: Slot[];
}

interface FormState {
  name: string;
  email: string;
  job_title: string;
  company_website: string;
  notes: string;
  website: string; // honeypot
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  job_title: "",
  company_website: "",
  notes: "",
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALE = "en-US";

// Static English copy — ported from the uioai `book` i18n namespace.
const COPY = {
  eyebrow: "Book a demo",
  heading: "Request a time.",
  sub: "Pick a 30-minute slot that works for you. This is a request — we'll email you to confirm shortly.",
  steps: { time: "Pick a time", details: "Your details", confirm: "Confirm" },
  loading: "Loading available times…",
  error: "We couldn't load available times. Please try again.",
  retry: "Try again",
  empty:
    "No times are available right now. Please check back soon or email us.",
  slotTaken: "That time was just taken. Please pick another.",
  back: "Back",
  form: {
    name: "Name",
    email: "Work email",
    jobTitle: "Job title",
    companyWebsite: "Company website",
    notes: "What would you like to cover?",
    optional: "Optional",
    submit: "Request this time",
    submitting: "Sending…",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      url: "Enter a valid company website.",
    },
  },
  genericError: "Something went wrong. Please try again.",
  requestNote:
    "This is a request, not a confirmed booking. We'll email you to confirm the time.",
  confirm: {
    heading: "Request received",
    body: "We'll email you to confirm this time shortly. Keep an eye on your inbox.",
    close: "Done",
  },
} as const;

function slotCountLabel(count: number): string {
  if (count === 0) return "No times";
  return `${count} ${count === 1 ? "time" : "times"}`;
}

export function BookDemo({ onClose }: { onClose?: () => void }) {
  const [tz, setTz] = useState("UTC");
  const [step, setStep] = useState<Step>("time");

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<"taken" | "generic" | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmedTime, setConfirmedTime] = useState<string>("");

  // Detect the visitor tz once mounted. Client-only — resolving it during SSR
  // would yield the server's tz and cause a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTz(detectTimezone());
  }, []);

  // Bare fetch — state updates happen only after the await.
  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/demo/availability");
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Availability;
      setAvailability(data);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    void fetchAvailability();
  }, [fetchAvailability]);

  // Fetch availability once on mount — a genuine external-data sync (state lands
  // post-await), not the derived-state anti-pattern the lint rule targets.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAvailability();
  }, [fetchAvailability]);

  const days = useMemo(
    () => (availability ? groupByDay(availability.slots, tz) : []),
    [availability, tz],
  );

  // Derive the effective day during render rather than syncing it in an effect.
  const effectiveDay =
    selectedDay && days.some((d) => d.key === selectedDay)
      ? selectedDay
      : (days[0]?.key ?? null);
  const activeDay = days.find((d) => d.key === effectiveDay) ?? null;

  function selectSlot(slot: Slot) {
    setSelectedSlot(slot);
    setSubmitError(null);
    setStep("details");
  }

  function validateClient(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = COPY.form.errors.required;
    if (!form.email.trim()) e.email = COPY.form.errors.required;
    else if (!EMAIL_RE.test(form.email.trim()))
      e.email = COPY.form.errors.email;
    if (!form.job_title.trim()) e.job_title = COPY.form.errors.required;
    if (!form.company_website.trim())
      e.company_website = COPY.form.errors.required;
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!selectedSlot || submitting) return;
    if (!validateClient()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/demo/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_start_utc: selectedSlot.start_utc,
          booker_timezone: tz,
          name: form.name.trim(),
          email: form.email.trim(),
          job_title: form.job_title.trim(),
          company_website: form.company_website.trim(),
          notes: form.notes.trim(),
          website: form.website, // honeypot
        }),
      });

      if (res.status === 201) {
        setConfirmedTime(
          fullLabel(new Date(selectedSlot.start_utc), tz, LOCALE),
        );
        setStep("done");
        return;
      }
      if (res.status === 409) {
        // Slot taken/stale — bounce back to step 1 and refresh.
        setSubmitError("taken");
        setSelectedSlot(null);
        setStep("time");
        reload();
        return;
      }
      if (res.status === 422) {
        const data = (await res.json()) as {
          errors?: Record<string, string>;
        };
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.errors ?? {})) {
          mapped[k] =
            v === "invalid" && k === "email"
              ? COPY.form.errors.email
              : v === "invalid" && k === "company_website"
                ? COPY.form.errors.url
                : COPY.form.errors.required;
        }
        setFieldErrors(mapped);
        return;
      }
      setSubmitError("generic");
    } catch {
      setSubmitError("generic");
    } finally {
      setSubmitting(false);
    }
  }

  function setField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  }

  return (
    <div className="surface-paper flex flex-col">
      {/* Header */}
      <p className="eyebrow text-brand mb-3">{COPY.eyebrow}</p>
      <h2 className="h2 mb-2 tracking-tight">{COPY.heading}</h2>
      <p className="body text-muted mb-7 max-w-[46ch]">{COPY.sub}</p>

      <Steps step={step} />

      <AnimatePresence mode="wait">
        {step === "time" && (
          <motion.div
            key="time"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitError === "taken" && (
              <p
                role="alert"
                className="border-brand/40 bg-brand/10 text-foreground mb-6 rounded-lg border px-4 py-3 text-sm"
              >
                {COPY.slotTaken}
              </p>
            )}

            <p className="text-muted mb-5 text-sm">
              Times shown in {tzLabel(tz)}
            </p>

            {loading && <SkeletonGrid label={COPY.loading} />}

            {!loading && loadError && (
              <EmptyState
                message={COPY.error}
                actionLabel={COPY.retry}
                onAction={reload}
              />
            )}

            {!loading && !loadError && days.length === 0 && (
              <EmptyState message={COPY.empty} />
            )}

            {!loading && !loadError && days.length > 0 && (
              <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                {/* Day selector */}
                <div
                  className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0"
                  role="tablist"
                  aria-label={COPY.steps.time}
                >
                  {days.map((d) => {
                    const active = d.key === effectiveDay;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedDay(d.key)}
                        className={cn(
                          "shrink-0 rounded-xl border px-4 py-3 text-left text-sm transition-colors md:shrink",
                          active
                            ? "border-brand bg-brand/10 text-foreground"
                            : "border-border text-muted hover:border-foreground/40",
                        )}
                      >
                        <span className="text-foreground block font-medium">
                          {dayLabel(d.date, tz, LOCALE)}
                        </span>
                        <span className="text-muted text-xs">
                          {slotCountLabel(d.slots.length)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Slot grid */}
                {activeDay && (
                  <div
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    role="group"
                    aria-label={dayLabel(activeDay.date, tz, LOCALE)}
                  >
                    {activeDay.slots.map((slot) => (
                      <button
                        key={slot.start_utc}
                        type="button"
                        onClick={() => selectSlot(slot)}
                        className="border-border text-foreground hover:border-brand hover:bg-brand/10 focus:border-brand rounded-xl border px-3 py-3 text-sm transition-colors focus:outline-none"
                      >
                        {timeLabel(new Date(slot.start_utc), tz, LOCALE)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === "details" && selectedSlot && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setStep("time")}
              className="text-muted hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
            >
              <span aria-hidden>←</span> {COPY.back}
            </button>

            <p className="border-border bg-foreground/[0.03] text-foreground mb-8 rounded-xl border px-4 py-3 text-sm">
              {fullLabel(new Date(selectedSlot.start_utc), tz, LOCALE)}
            </p>

            <form onSubmit={submit} noValidate className="grid gap-5">
              <Field
                id="name"
                label={COPY.form.name}
                value={form.name}
                onChange={(v) => setField("name", v)}
                error={fieldErrors.name}
                autoComplete="name"
              />
              <Field
                id="email"
                type="email"
                label={COPY.form.email}
                value={form.email}
                onChange={(v) => setField("email", v)}
                error={fieldErrors.email}
                autoComplete="email"
              />
              <Field
                id="job_title"
                label={COPY.form.jobTitle}
                value={form.job_title}
                onChange={(v) => setField("job_title", v)}
                error={fieldErrors.job_title}
                autoComplete="organization-title"
              />
              <Field
                id="company_website"
                label={COPY.form.companyWebsite}
                placeholder="acme.com"
                value={form.company_website}
                onChange={(v) => setField("company_website", v)}
                error={fieldErrors.company_website}
                autoComplete="url"
              />
              <Field
                id="notes"
                label={COPY.form.notes}
                optional={COPY.form.optional}
                value={form.notes}
                onChange={(v) => setField("notes", v)}
                textarea
              />

              {/* Honeypot — visually hidden, off-screen, not announced. */}
              <div
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setField("website", e.target.value)}
                />
              </div>

              {submitError === "generic" && (
                <p role="alert" className="text-destructive text-sm">
                  {COPY.genericError}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full"
                size="lg"
              >
                {submitting ? COPY.form.submitting : COPY.form.submit}
              </Button>

              <p className="text-muted text-xs leading-relaxed">
                {COPY.requestNote}
              </p>
            </form>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border-border rounded-2xl border px-6 py-12 text-center"
          >
            <div className="border-brand text-brand mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border text-lg">
              ✓
            </div>
            <h3 className="h3 mb-3 tracking-tight">{COPY.confirm.heading}</h3>
            <p className="text-foreground/80 mx-auto mb-2 max-w-[40ch]">
              {confirmedTime}
            </p>
            <p className="text-muted mx-auto mb-8 max-w-[42ch] text-sm leading-relaxed">
              {COPY.confirm.body}
            </p>
            <Button type="button" variant="outline" onClick={onClose}>
              {COPY.confirm.close}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Steps({ step }: { step: Step }) {
  const items: { key: Step; label: string }[] = [
    { key: "time", label: COPY.steps.time },
    { key: "details", label: COPY.steps.details },
    { key: "done", label: COPY.steps.confirm },
  ];
  const activeIndex = items.findIndex((i) => i.key === step);
  return (
    <ol className="text-muted mb-8 flex items-center gap-3 text-xs">
      {items.map((item, i) => {
        const state =
          i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
        return (
          <li key={item.key} className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2",
                state === "active"
                  ? "text-foreground"
                  : state === "done"
                    ? "text-brand"
                    : "",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                  state === "active"
                    ? "border-brand text-foreground"
                    : state === "done"
                      ? "border-brand text-brand"
                      : "border-border",
                )}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              {item.label}
            </span>
            {i < items.length - 1 && (
              <span className="bg-border h-px w-6" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
  optional,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  optional?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const base =
    "w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:outline-none";
  const borderClass = error
    ? "border-destructive"
    : "border-border focus:border-brand";
  return (
    <div>
      <label
        htmlFor={id}
        className="text-foreground/80 mb-2 flex items-baseline justify-between text-sm"
      >
        <span>{label}</span>
        {optional && <span className="text-muted text-xs">{optional}</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, borderClass, "resize-none")}
          aria-invalid={!!error}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, borderClass)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-destructive mt-1.5 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

function SkeletonGrid({ label }: { label: string }) {
  return (
    <div aria-busy className="grid gap-6 md:grid-cols-[180px_1fr]">
      <span className="sr-only">{label}</span>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-foreground/[0.04] h-14 animate-pulse rounded-xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-foreground/[0.04] h-11 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="border-border rounded-2xl border px-6 py-16 text-center">
      <p className="text-muted mb-4">{message}</p>
      {actionLabel && onAction && (
        <Button type="button" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
