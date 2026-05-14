"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      /* Allen Brau uses 1.2 — tighter than 1.4, gives that
         "heavy but responsive" weighted feel.                */
      duration: 1.2,

      /* Exponential ease-out: fast start, long deceleration tail.
         Matches the premium inertia on luxury editorial sites.   */
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

      smoothWheel: true,
      syncTouch: true,       /* smooth on trackpad/touch too   */
      touchMultiplier: 1.5,  /* touch swipe sensitivity        */
      wheelMultiplier: 0.85, /* slightly less aggressive wheel */
    });

    /* ── Sync Lenis ↔ GSAP ScrollTrigger ─────────────────────────
       Without this, ScrollTrigger reads native scroll while Lenis
       interpolates a different value — causing jitter in all
       scroll-linked animations (OurExperiences, parallax, etc.)  */
    lenis.on("scroll", ScrollTrigger.update);

    /* Let GSAP's ticker drive Lenis instead of a raw RAF loop.
       This keeps them in lock-step on every frame.               */
    const gsapTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(gsapTick);

    /* Prevents frame drops from being compensated with jumps */
    gsap.ticker.lagSmoothing(0);

    /* Proxy so ScrollTrigger knows Lenis's interpolated position */
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (value !== undefined) lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    return () => {
      gsap.ticker.remove(gsapTick);
      lenis.destroy();
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return <>{children}</>;
}
