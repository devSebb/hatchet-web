"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/lib/config/site";
import { BookDemo } from "./BookDemo";

type BookDemoContextValue = {
  open: () => void;
  close: () => void;
};

const BookDemoContext = createContext<BookDemoContextValue | null>(null);

/** Open the book-a-demo modal programmatically from any client component. */
export function useBookDemo(): BookDemoContextValue {
  const ctx = useContext(BookDemoContext);
  if (!ctx) {
    throw new Error("useBookDemo must be used within <BookDemoProvider>");
  }
  return ctx;
}

/**
 * Hosts the single book-a-demo modal for the whole app and rewires every existing
 * "Book a demo" link to open it instead of navigating away.
 *
 * Rather than touch the ~15 scattered `<Link href={siteConfig.bookDemoUrl}>` call
 * sites, a capture-phase document click listener intercepts any left-click on an
 * anchor whose href resolves to the demo URL, cancels the navigation, and opens the
 * modal. Modifier-clicks (⌘/ctrl/shift/alt) and middle-clicks fall through so the
 * external page still opens in a new tab as a graceful fallback.
 */
export function BookDemoProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Left click only, no modifier keys (let ⌘/ctrl-click open a new tab).
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      // `anchor.href` is the resolved absolute URL; compare both forms so it
      // matches whether the link was written absolute or (future) relative.
      if (
        anchor.href !== siteConfig.bookDemoUrl &&
        href !== siteConfig.bookDemoUrl
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setIsOpen(true);
    }

    // Capture phase so we run before Next's <Link> click handler navigates.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const value = useMemo<BookDemoContextValue>(
    () => ({ open, close }),
    [open, close],
  );

  return (
    <BookDemoContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="surface-paper max-h-[88vh] max-w-2xl overflow-y-auto">
          {/* Visible copy lives inside <BookDemo>; these satisfy Radix's a11y
              requirement for a labelled dialog without duplicating the UI. */}
          <DialogTitle className="sr-only">Book a demo</DialogTitle>
          <DialogDescription className="sr-only">
            Request a 30-minute demo. Pick a time that works for you and
            we&apos;ll email you to confirm.
          </DialogDescription>
          <BookDemo onClose={close} />
        </DialogContent>
      </Dialog>
    </BookDemoContext.Provider>
  );
}
