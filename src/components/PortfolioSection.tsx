import React, { useMemo, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { Reveal } from './ui/Reveal';
import { SegmentedControl } from './ui/Controls';
import { PROJECTS, CATEGORIES } from '../data/projects';

export default function PortfolioSection() {
  const [category, setCategory] = useState<string>('All');

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: PROJECTS.length };
    PROJECTS.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, []);

  const visible = useMemo(
    () => (category === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === category)),
    [category],
  );

  return (
    <section id="portfolio" className="bg-surface-subtle py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-title-sm text-content md:text-title">Featured Projects</h2>
            <p className="mx-auto mt-4 max-w-2xl text-content-tertiary">
              Production systems, data analyses, and side projects.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mb-10 flex justify-center">
            <SegmentedControl
              ariaLabel="Filter projects by category"
              value={category}
              onChange={setCategory}
              options={CATEGORIES.map((c) => ({ value: c, label: c, count: counts[c] ?? 0 }))}
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <div
              // Keying on category too so cards re-run their entrance
              // animation when the filter changes.
              key={`${category}-${project.id}`}
              className="animate-scale-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-content-tertiary">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
