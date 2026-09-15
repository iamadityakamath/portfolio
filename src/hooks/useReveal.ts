import { useEffect, useRef, useState } from 'react';

interface RevealOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number;
  /** Stagger, in ms, applied as a CSS transition-delay. */
  delay?: number;
  rootMargin?: string;
}

/**
 * Reveal-on-scroll, fired once.
 *
 * The old build re-triggered its timeline animation every time an item left
 * and re-entered the viewport, so scrolling up replayed everything. This
 * unobserves after the first intersection instead, per the HIG note that
 * people shouldn't have to sit through the same animation more than once.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  delay = 0,
  rootMargin = '0px 0px -10% 0px',
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If motion is off, show immediately and never attach an observer.
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-motion') === 'reduced';
    if (reduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Already scrolled past — show it immediately rather than waiting for
          // an intersection that will never come. Browsers restore scroll
          // position *after* mount, so on a reload (or a deep link) everything
          // above the restored offset would otherwise stay invisible forever.
          const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;

          if (entry.isIntersecting || scrolledPast) {
            setVisible(true);
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined;

  return {
    ref,
    visible,
    /** Spread onto the element you want to reveal. */
    revealProps: {
      ref,
      className: `reveal${visible ? ' reveal-visible' : ''}`,
      style,
    },
  };
}
