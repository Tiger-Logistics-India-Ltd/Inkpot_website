"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loader: Promise<void> | null = null;

// Injected on demand and shared by every widget on the page — the same pattern
// the Razorpay checkout uses. Nothing is fetched until a form mounts.
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  if (!loader) {
    loader = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Turnstile script failed to load"));
      document.head.appendChild(s);
    });
  }
  return loader;
}

/**
 * Invisible bot check. Renders nothing at all unless Cloudflare decides the
 * visitor needs to interact — no puzzles, no image grids.
 *
 * `onVerify` receives the token to post to the API, or null once it expires.
 * To reset the widget after a failed submit, change the component's `key`.
 */
export default function Turnstile({
  onVerify,
  theme = "auto",
}: {
  onVerify: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Held in a ref so a parent re-render never tears down the widget.
  const cb = useRef(onVerify);
  cb.current = onVerify;

  useEffect(() => {
    // No site key configured yet — stay out of the way entirely.
    if (!SITE_KEY) return;

    let widgetId: string | undefined;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          theme,
          appearance: "interaction-only",
          callback: (token: string) => cb.current(token),
          "expired-callback": () => cb.current(null),
          "error-callback": () => cb.current(null),
        });
      })
      .catch(() => {
        // Blocked by an ad blocker or offline. The submit still goes through;
        // the server decides, and returns a clear "refresh and try again".
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* widget already gone */
        }
      }
    };
  }, [theme]);

  if (!SITE_KEY) return null;
  return <div ref={ref} style={{ display: "flex", justifyContent: "center" }} />;
}

/**
 * The honeypot input. Positioned off-screen rather than `display:none`, which
 * more bots know to skip. Hidden from assistive tech and from autofill.
 */
export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Company
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
