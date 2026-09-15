import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, Briefcase, GraduationCap, Code, Mail } from 'lucide-react';

const ITEMS = [
  { id: 'about', label: 'About', Icon: Brain },
  { id: 'skills', label: 'Skills', Icon: Sparkles },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'education', label: 'Education', Icon: GraduationCap },
  { id: 'portfolio', label: 'Projects', Icon: Code },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

/**
 * Floating glass dock. Highlights the section currently in view, so it
 * doubles as a position indicator rather than just a jump list.
 */
export function Dock() {
  const [active, setActive] = useState<string>('about');

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="glass glass-sheen flex items-center gap-1 rounded-full p-1.5">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => go(id)}
              aria-label={label}
              aria-current={isActive ? 'true' : undefined}
              title={label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-full
                transition-all duration-base ease-out-expo
                ${
                  isActive
                    ? 'bg-accent-solid text-accent-contrast'
                    : 'text-content-tertiary hover:bg-content/5 hover:text-content'
                }`}
            >
              <Icon size={18} className="transition-transform duration-base ease-spring group-hover:scale-110" />
              {/* tooltip */}
              <span
                className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                  rounded-lg bg-content px-2 py-1 text-xs font-medium text-surface opacity-0
                  transition-opacity duration-fast group-hover:opacity-100"
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
