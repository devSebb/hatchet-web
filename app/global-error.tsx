"use client";

import { useEffect } from "react";

/**
 * Last resort: only fires when the root layout itself throws, so the site
 * chrome is unavailable and this must render its own <html>/<body>. Styling is
 * inline because a layout failure may mean the stylesheet never loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error.digest ?? "", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121926",
          color: "#f8fafc",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "34rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem" }}>
            Hatchet is temporarily unavailable
          </h1>
          <p style={{ opacity: 0.75, lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            An unexpected error stopped the page from loading. Please try again
            in a moment.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#c8102e",
              color: "#fff",
              border: 0,
              borderRadius: "0.5rem",
              padding: "0.65rem 1.25rem",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
            type="button"
          >
            Try again
          </button>
          {error.digest ? (
            <p
              style={{ opacity: 0.5, fontSize: "0.8rem", marginTop: "1.5rem" }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
