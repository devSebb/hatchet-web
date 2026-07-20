"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CaretLeft,
  CaretRight,
  CheckSquare,
  Clock,
  Globe,
  VideoCamera,
} from "@phosphor-icons/react/ssr";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  detectTimezone,
  tzLabel,
  dayKey,
  dateLabel,
  timeLabel,
  rangeLabel,
  fullLabel,
  groupByDay,
  type DayGroup,
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
  company: string;
  company_website: string;
  linkedin_url: string;
  topic: string;
  website: string; // honeypot
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  job_title: "",
  company: "",
  company_website: "",
  linkedin_url: "",
  topic: "",
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALE = "en-US";

const COPY = {
  heading: "Book a Demo!",
  sub: "Pick a time that works. In 30 minutes we'll walk through Hatchet live and show you exactly what it can do for your campaign.",
  meta: {
    confirmation: "Requires confirmation",
    minutes: (n: number) => `${n} minutes`,
    meeting: "Online Meeting",
    changeTz: "(change timezone)",
  },
  loading: "Loading available times…",
  error: "We couldn't load available times. Please try again.",
  retry: "Try again",
  empty:
    "No times are available right now. Please check back soon or email us.",
  slotTaken: "That time was just taken. Please pick another.",
  form: {
    name: "Your name",
    email: "Work email",
    jobTitle: "Job title",
    company: "Company",
    companyWebsite: "Company website",
    linkedin: "LinkedIn URL",
    topic: "What would you like to cover?",
    topicPlaceholder:
      "Anything you'd like us to focus on, or context about your team (optional)",
    back: "Back",
    submit: "Confirm",
    submitting: "Confirming…",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      url: "Enter a valid company website.",
      linkedin: "Enter a valid LinkedIn URL.",
    },
  },
  genericError: "Something went wrong. Please try again.",
  confirm: {
    heading: "Request received",
    body: "We'll email you to confirm this time shortly. Keep an eye on your inbox.",
    close: "Done",
  },
} as const;

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const panelMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "YYYY-MM-DD" → month index (year*12 + month-1) for clamping navigation. */
function monthIndexOfKey(key: string): number {
  return Number(key.slice(0, 4)) * 12 + (Number(key.slice(5, 7)) - 1);
}

export function BookDemo({ onClose }: { onClose?: () => void }) {
  const [tz, setTz] = useState("UTC");
  const [tzPickerOpen, setTzPickerOpen] = useState(false);
  const [hour12, setHour12] = useState(true);
  const [step, setStep] = useState<Step>("time");

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  /** Month being viewed, as year*12+month-1; null = follow the selected day. */
  const [viewMonthIdx, setViewMonthIdx] = useState<number | null>(null);

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
  const dayByKey = useMemo(
    () => new Map<string, DayGroup>(days.map((d) => [d.key, d])),
    [days],
  );

  // Derive the effective day during render rather than syncing it in an effect.
  const effectiveDay =
    selectedDay && dayByKey.has(selectedDay)
      ? selectedDay
      : (days[0]?.key ?? null);
  const activeDay = effectiveDay ? (dayByKey.get(effectiveDay) ?? null) : null;

  const durationMin = availability?.duration_min ?? 30;

  const tzOptions = useMemo<string[]>(() => {
    if (!tzPickerOpen) return [];
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return [tz];
    }
  }, [tzPickerOpen, tz]);

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
    if (!form.company.trim()) e.company = COPY.form.errors.required;
    if (!form.company_website.trim())
      e.company_website = COPY.form.errors.required;
    if (!form.linkedin_url.trim())
      e.linkedin_url = COPY.form.errors.required;
    // topic is optional free-text — no validation.
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
          company: form.company.trim(),
          company_website: form.company_website.trim(),
          linkedin_url: form.linkedin_url.trim(),
          topic: form.topic.trim(),
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
                : v === "invalid" && k === "linkedin_url"
                  ? COPY.form.errors.linkedin
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

  const slotStart = selectedSlot ? new Date(selectedSlot.start_utc) : null;
  const slotEnd = selectedSlot ? new Date(selectedSlot.end_utc) : null;

  return (
    <div className="surface-paper bg-background text-foreground flex max-h-[88vh] flex-col overflow-y-auto md:flex-row">
      {/* ---- Info sidebar (persistent across steps) ---- */}
      <aside className="bg-bg flex shrink-0 flex-col p-6 text-white md:w-[280px] md:p-7 lg:w-[300px]">
        <div className="flex items-center">
          <BrandLogo alt="Hatchet" className="h-auto w-[140px]" variant="primary" />
        </div>

        <h2 className="mt-6 text-[1.4rem] font-semibold tracking-tight text-white">
          {COPY.heading}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          {COPY.sub}
        </p>

        {step !== "time" && slotStart && slotEnd && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-white">
              {dateLabel(slotStart, tz, LOCALE)}
            </p>
            <p className="mt-0.5 text-[13px] text-white/70">
              {rangeLabel(slotStart, slotEnd, tz, LOCALE, hour12)}
            </p>
          </div>
        )}

        <div className="my-5 h-px bg-white/10" aria-hidden />

        <ul className="space-y-3 text-[13px] text-white/85">
          <li className="flex items-center gap-2.5">
            <CheckSquare
              className="text-brand size-[18px] shrink-0"
              aria-hidden
            />
            {COPY.meta.confirmation}
          </li>
          <li className="flex items-center gap-2.5">
            <Clock
              className="text-brand size-[18px] shrink-0"
              aria-hidden
            />
            {COPY.meta.minutes(durationMin)}
          </li>
          <li className="flex items-center gap-2.5">
            <VideoCamera
              className="text-brand size-[18px] shrink-0"
              aria-hidden
            />
            {COPY.meta.meeting}
          </li>
          <li className="flex items-start gap-2.5">
            <Globe
              className="text-brand mt-0.5 size-[18px] shrink-0"
              aria-hidden
            />
            {tzPickerOpen ? (
              <select
                autoFocus
                value={tz}
                onChange={(e) => {
                  setTz(e.target.value);
                  setTzPickerOpen(false);
                  setSelectedDay(null);
                  setViewMonthIdx(null);
                }}
                onBlur={() => setTzPickerOpen(false)}
                className="w-full rounded-md border border-white/20 bg-transparent px-2 py-1 text-[13px] text-white focus:outline-none [&>option]:text-black"
                aria-label="Timezone"
              >
                {tzOptions.map((z) => (
                  <option key={z} value={z}>
                    {tzLabel(z)}
                  </option>
                ))}
              </select>
            ) : (
              <span>
                {tzLabel(tz)}{" "}
                <button
                  type="button"
                  onClick={() => setTzPickerOpen(true)}
                  className="text-white/50 underline-offset-2 transition-colors hover:text-white hover:underline"
                >
                  {COPY.meta.changeTz}
                </button>
              </span>
            )}
          </li>
        </ul>
      </aside>

      {/* ---- Step panels ---- */}
      <div className="flex min-w-0 flex-1 flex-col md:min-h-[520px]">
        <AnimatePresence mode="wait" initial={false}>
          {step === "time" && (
            <motion.div
              key="time"
              {...panelMotion}
              className="flex flex-1 flex-col"
            >
              {submitError === "taken" && (
                <p
                  role="alert"
                  className="border-brand/40 bg-brand/10 text-foreground mx-5 mt-5 rounded-lg border px-4 py-2.5 text-sm md:mx-6"
                >
                  {COPY.slotTaken}
                </p>
              )}

              {loading && <CalendarSkeleton label={COPY.loading} />}

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
                <div className="flex flex-1 flex-col lg:flex-row">
                  <CalendarPanel
                    days={days}
                    dayByKey={dayByKey}
                    effectiveDay={effectiveDay}
                    viewMonthIdx={viewMonthIdx}
                    tz={tz}
                    onSelectDay={setSelectedDay}
                    onViewMonth={setViewMonthIdx}
                  />
                  <SlotsPanel
                    activeDay={activeDay}
                    tz={tz}
                    hour12={hour12}
                    onHour12={setHour12}
                    onSelect={selectSlot}
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === "details" && selectedSlot && (
            <motion.div
              key="details"
              {...panelMotion}
              className="flex-1 p-[24px] md:p-[32px]"
            >
              <form onSubmit={submit} noValidate className="grid gap-[14px]">
                <Field
                  id="name"
                  label={COPY.form.name}
                  placeholder="Sam Fisher"
                  value={form.name}
                  onChange={(v) => setField("name", v)}
                  error={fieldErrors.name}
                  autoComplete="name"
                />
                <Field
                  id="email"
                  type="email"
                  label={COPY.form.email}
                  placeholder="sam@company.com"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                  error={fieldErrors.email}
                  autoComplete="email"
                />
                <Field
                  id="job_title"
                  label={COPY.form.jobTitle}
                  placeholder="Campaign Manager"
                  value={form.job_title}
                  onChange={(v) => setField("job_title", v)}
                  error={fieldErrors.job_title}
                  autoComplete="organization-title"
                />
                <Field
                  id="company"
                  label={COPY.form.company}
                  placeholder="Company name"
                  value={form.company}
                  onChange={(v) => setField("company", v)}
                  error={fieldErrors.company}
                  autoComplete="organization"
                />
                <Field
                  id="company_website"
                  label={COPY.form.companyWebsite}
                  placeholder="www.company.com"
                  value={form.company_website}
                  onChange={(v) => setField("company_website", v)}
                  error={fieldErrors.company_website}
                  autoComplete="url"
                />
                <Field
                  id="linkedin_url"
                  label={COPY.form.linkedin}
                  placeholder="https://www.linkedin.com/in/you"
                  value={form.linkedin_url}
                  onChange={(v) => setField("linkedin_url", v)}
                  error={fieldErrors.linkedin_url}
                  autoComplete="url"
                />
                <TextareaField
                  id="topic"
                  label={COPY.form.topic}
                  placeholder={COPY.form.topicPlaceholder}
                  value={form.topic}
                  onChange={(v) => setField("topic", v)}
                  optional
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

                <p className="text-muted text-xs leading-relaxed">
                  By proceeding, you agree to Hatchet&apos;s{" "}
                  <Link
                    href="/terms-of-service"
                    className="hover:text-foreground underline underline-offset-2"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="hover:text-foreground underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                <div className="mt-1 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("time")}
                  >
                    {COPY.form.back}
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? COPY.form.submitting : COPY.form.submit}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              {...panelMotion}
              className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
            >
              <div className="border-brand text-brand mb-6 flex size-[48px] items-center justify-center rounded-full border text-lg">
                ✓
              </div>
              <h3 className="h3 mb-3 tracking-tight">{COPY.confirm.heading}</h3>
              <p className="text-foreground/80 mb-2 max-w-[40ch]">
                {confirmedTime}
              </p>
              <p className="text-muted mb-8 max-w-[42ch] text-sm leading-relaxed">
                {COPY.confirm.body}
              </p>
              <Button type="button" variant="outline" onClick={onClose}>
                {COPY.confirm.close}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Calendar ---------- */

function CalendarPanel({
  days,
  dayByKey,
  effectiveDay,
  viewMonthIdx,
  tz,
  onSelectDay,
  onViewMonth,
}: {
  days: DayGroup[];
  dayByKey: Map<string, DayGroup>;
  effectiveDay: string | null;
  viewMonthIdx: number | null;
  tz: string;
  onSelectDay: (key: string) => void;
  onViewMonth: (idx: number) => void;
}) {
  const minIdx = monthIndexOfKey(days[0].key);
  const maxIdx = monthIndexOfKey(days[days.length - 1].key);
  const idx =
    viewMonthIdx ?? (effectiveDay ? monthIndexOfKey(effectiveDay) : minIdx);
  const clamped = Math.min(Math.max(idx, minIdx), maxIdx);

  const year = Math.floor(clamped / 12);
  const month = clamped - year * 12 + 1; // 1-based

  // Pure calendar arithmetic — UTC keeps it independent of the browser tz.
  const first = new Date(Date.UTC(year, month - 1, 1));
  const lead = first.getUTCDay(); // 0 = Sunday, matching the SUN-first header
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const monthName = new Intl.DateTimeFormat(LOCALE, {
    timeZone: "UTC",
    month: "long",
  }).format(first);

  const todayKey = dayKey(new Date(), tz);

  return (
    <div className="flex-1 p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm">
          <span className="text-foreground font-semibold">{monthName}</span>{" "}
          <span className="text-muted">{year}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewMonth(clamped - 1)}
            disabled={clamped <= minIdx}
            aria-label="Previous month"
            className="text-muted hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:hover:text-inherit"
          >
            <CaretLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewMonth(clamped + 1)}
            disabled={clamped >= maxIdx}
            aria-label="Next month"
            className="text-muted hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:hover:text-inherit"
          >
            <CaretRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-muted pb-1 text-center text-[10px] font-medium tracking-wider"
          >
            {wd}
          </div>
        ))}
        {Array.from({ length: lead }).map((_, i) => (
          <div key={`lead-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const key = `${year}-${pad2(month)}-${pad2(dayNum)}`;
          const available = dayByKey.has(key);
          const selected = key === effectiveDay;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={!available}
              onClick={() => onSelectDay(key)}
              aria-pressed={selected}
              className={cn(
                "relative flex aspect-square max-h-11 items-center justify-center rounded-lg text-[13px] transition-colors",
                selected
                  ? "bg-brand text-primary-foreground font-semibold"
                  : available
                    ? "bg-foreground/[0.05] text-foreground hover:bg-brand/15 font-medium"
                    : "text-muted/50",
              )}
            >
              {dayNum}
              {isToday && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-[6px] h-[4px] w-[4px] rounded-full",
                    selected ? "bg-primary-foreground" : "bg-brand",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Time slots ---------- */

function SlotsPanel({
  activeDay,
  tz,
  hour12,
  onHour12,
  onSelect,
}: {
  activeDay: DayGroup | null;
  tz: string;
  hour12: boolean;
  onHour12: (v: boolean) => void;
  onSelect: (slot: Slot) => void;
}) {
  if (!activeDay) return null;

  const weekday = new Intl.DateTimeFormat(LOCALE, {
    timeZone: tz,
    weekday: "short",
  }).format(activeDay.date);
  const dayNum = new Intl.DateTimeFormat(LOCALE, {
    timeZone: tz,
    day: "2-digit",
  }).format(activeDay.date);

  return (
    <div className="border-border flex flex-col border-t p-[20px] lg:w-[250px] lg:border-t-0 lg:border-l">
      {/* lg:pr keeps the 12h/24h toggle clear of the dialog close button,
          which floats over this panel's top-right corner on desktop. */}
      <div className="mb-[16px] flex items-center justify-between gap-2 lg:pr-[30px]">
        <p className="text-sm whitespace-nowrap">
          <span className="text-foreground font-semibold">{weekday}</span>{" "}
          <span className="text-muted">{dayNum}</span>
        </p>
        <div
          className="border-border flex rounded-md border p-0.5 text-[11px] font-medium"
          role="group"
          aria-label="Time format"
        >
          {([true, false] as const).map((is12) => (
            <button
              key={String(is12)}
              type="button"
              onClick={() => onHour12(is12)}
              aria-pressed={hour12 === is12}
              className={cn(
                "rounded px-[8px] py-[2px] transition-colors",
                hour12 === is12
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground",
              )}
            >
              {is12 ? "12h" : "24h"}
            </button>
          ))}
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-2 pr-1 sm:grid-cols-3 lg:block lg:max-h-[400px] lg:space-y-2 lg:overflow-y-auto"
        role="group"
        aria-label={dateLabel(activeDay.date, tz, LOCALE)}
      >
        {activeDay.slots.map((slot) => (
          <button
            key={slot.start_utc}
            type="button"
            onClick={() => onSelect(slot)}
            className="border-border bg-background text-foreground hover:border-brand hover:text-brand focus-visible:border-brand w-full rounded-lg border px-3 py-2.5 text-center text-[13px] font-semibold transition-colors focus:outline-none"
          >
            {timeLabel(new Date(slot.start_utc), tz, LOCALE, hour12)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Form fields ---------- */

const FIELD_BASE =
  "w-full rounded-lg border bg-transparent px-[12px] py-[9px] text-sm text-foreground placeholder:text-muted/60 transition-colors focus:outline-none";

function fieldBorder(error?: string): string {
  return error ? "border-destructive" : "border-border focus:border-brand";
}

function FieldLabel({
  id,
  label,
  optional,
}: {
  id: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="text-foreground mb-1.5 block text-[13px] font-semibold"
    >
      {label}{" "}
      {optional ? (
        <span className="text-muted font-normal">(optional)</span>
      ) : (
        <span aria-hidden>*</span>
      )}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="text-destructive mt-1.5 text-xs">
      {error}
    </p>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} />
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={cn(FIELD_BASE, fieldBorder(error))}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} optional={optional} />
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(FIELD_BASE, fieldBorder(error), "resize-y")}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

/* ---------- Loading / empty states ---------- */

function CalendarSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy className="flex flex-1 flex-col lg:flex-row">
      <span className="sr-only">{label}</span>
      <div className="flex-1 p-5 md:p-6">
        <div className="bg-foreground/[0.05] mb-4 h-[20px] w-[128px] animate-pulse rounded" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="bg-foreground/[0.04] aspect-square max-h-11 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
      <div className="border-border hidden p-[20px] lg:block lg:w-[250px] lg:border-l">
        <div className="bg-foreground/[0.05] mb-4 h-[20px] w-[64px] animate-pulse rounded" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-foreground/[0.04] h-[40px] animate-pulse rounded-lg"
            />
          ))}
        </div>
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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-muted mb-4">{message}</p>
      {actionLabel && onAction && (
        <Button type="button" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
