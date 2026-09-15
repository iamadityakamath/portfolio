import { useCallback, useEffect, useRef, RefObject } from 'react';

/**
 * Pointer-tracking tilt + spotlight.
 *
 * The previous version called setState on every mousemove (60+ renders/sec),
 * which is what made the tilt feel loose. This writes transforms straight to
 * the element via rAF instead, so React never re-renders during the gesture.
 * Also no-ops entirely when motion is reduced.
 */
export function use3dEffect<T extends HTMLElement>(
  ref: RefObject<T>,
  { tilt = 5, scale = 1.02 }: { tilt?: number; scale?: number } = {},
) {
  const frame = useRef<number | null>(null);
  const enabled = useRef(true);

  useEffect(() => {
    const check = () =>
      !(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.getAttribute('data-motion') === 'reduced' ||
        window.matchMedia('(hover: none)').matches
      );

    enabled.current = check();

    const observer = new MutationObserver(() => {
      enabled.current = check();
      if (!enabled.current && ref.current) {
        ref.current.style.transform = '';
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });
    return () => observer.disconnect();
  }, [ref]);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || !enabled.current) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${(py - 0.5) * -tilt}deg) rotateY(${
          (px - 0.5) * tilt
        }deg) scale3d(${scale}, ${scale}, ${scale})`;
        // Drives the cursor-following highlight in CSS.
        el.style.setProperty('--spot-x', `${px * 100}%`);
        el.style.setProperty('--spot-y', `${py * 100}%`);
      });
    },
    [ref, tilt, scale],
  );

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el || !enabled.current) return;
    el.style.transition = 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)';
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transform = '';
  }, [ref]);

  return { handleMouseMove, handleMouseEnter, handleMouseLeave };
}
