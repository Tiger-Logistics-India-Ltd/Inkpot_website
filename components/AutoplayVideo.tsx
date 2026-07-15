"use client";

import { useEffect, useRef } from "react";

/**
 * A <video> that autoplays reliably across browsers — including iOS Safari,
 * Android Chrome, and low-power/data-saver modes where the plain
 * `<video autoPlay muted>` JSX fails.
 *
 * Why this is needed: browsers only autoplay when the muted *property* is set,
 * but React does not reliably apply the `muted` attribute to that property.
 * We set it imperatively, then call play() immediately and again on the events
 * that signal the media is ready, on tab re-focus, and on the first user gesture.
 *
 * No timers, no delays — playback is attempted instantly (per project rule:
 * videos must autoplay instantly).
 */
type Props = React.VideoHTMLAttributes<HTMLVideoElement>;

export default function AutoplayVideo({ children, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Force the properties browsers actually check for autoplay eligibility.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.playsInline = true;
    v.setAttribute("playsinline", "");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay);
    v.addEventListener("canplay", tryPlay);

    // Re-kick when the tab becomes visible again (bfcache / background pause).
    const onVis = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener("visibilitychange", onVis);

    // Fallback: the first user gesture unblocks playback on strict browsers.
    const onGesture = () => tryPlay();
    document.addEventListener("touchstart", onGesture, { once: true, passive: true });
    document.addEventListener("pointerdown", onGesture, { once: true });

    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("pointerdown", onGesture);
    };
  }, []);

  return (
    <video ref={ref} autoPlay muted loop playsInline {...props}>
      {children}
    </video>
  );
}
