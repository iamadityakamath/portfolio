import { useEffect, useRef, useState } from 'react';

/**
 * Counts a number up once, when it first scrolls into view.
 * Uses rAF with an ease-out curve; snaps straight to the final value
 * when motion is reduced.
 */
export function useCountUp(
  target: number,
  { duration = 1100, decimals = 0 }: { duration?: number; decimals?: number } = {},
) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-motion') === 'reduced';

    if (reduced) {
      setValue(target);
      done.current = true;
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (done.current) return;

        // Same scroll-restoration guard as useReveal: if the stat is already
        // above the viewport, snap to the final value instead of showing 0.
        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.bottom <= 0) {
            done.current = true;
            observer.disconnect();
            setValue(target);
          }
          return;
        }

        done.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(target * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value, display: value.toFixed(decimals) };
}
