"use client";

/**
 * Replaces the root layout when it is itself the thing that failed, so it must
 * render its own <html> and <body>. Per the Next docs this document does not
 * receive the app's global styles — hence the inline styles rather than the
 * design tokens used everywhere else.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#17171b",
          color: "#f5f3f7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <title>Something went wrong · Grub Box</title>

        <main style={{ maxWidth: 460, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🍳</div>

          <h1 style={{ fontSize: 28, margin: "0 0 12px", fontWeight: 800 }}>
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              color: "#8d8993",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Grub Box hit an unexpected error. Trying again usually clears it.
          </p>

          <button
            type="button"
            onClick={retry}
            style={{
              background: "#c9a3ff",
              color: "#17171b",
              border: 0,
              borderRadius: 999,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Try again
          </button>

          {error.digest && (
            <p style={{ marginTop: 28, color: "#8d8993", fontSize: 12 }}>
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
