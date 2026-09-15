import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, Briefcase, GraduationCap, Code, Mail } from 'lucide-react';
import { FloatingDock, type DockItem } from './ui/floating-dock';
import { useTheme } from '../lib/theme';

const SECTIONS: DockItem[] = [
  { id: 'about', title: 'About', icon: <Brain className="h-full w-full" /> },
  { id: 'skills', title: 'Skills', icon: <Sparkles className="h-full w-full" /> },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="h-full w-full" /> },
  { id: 'education', title: 'Education', icon: <GraduationCap className="h-full w-full" /> },
  { id: 'portfolio', title: 'Projects', icon: <Code className="h-full w-full" /> },
  { id: 'contact', title: 'Contact', icon: <Mail className="h-full w-full" /> },
];

/**
 * Floating glass dock with macOS-style magnification. Highlights the section
 * currently in view, so it doubles as a position indicator rather than just a
 * jump list.
 */
export function Dock() {
  const [active, setActive] = useState('about');
  const { reduceMotion } = useTheme();

  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
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
      <FloatingDock
        items={SECTIONS}
        activeId={active}
        onSelect={go}
        magnify={!reduceMotion}
      />
    </nav>
  );
}
