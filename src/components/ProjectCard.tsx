import React, { useRef, useState } from 'react';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { use3dEffect } from './ui/use3dEffect';
import { Modal } from './ui/Modal';
import type { Project } from '../data/projects';

/** Deterministic hue per project so the fallback art is stable across reloads. */
function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

function CardArt({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const hue = hueFor(project.id);

  if (failed) {
    // Graceful stand-in. Four of the six project images 404 in this build;
    // a tinted plate reads as "artwork pending" rather than "broken page".
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 70% 62% / 0.22), hsl(${
            (hue + 50) % 360
          } 70% 55% / 0.12))`,
        }}
      >
        <ImageOff size={22} className="text-content-tertiary" aria-hidden="true" />
        <span className="px-4 text-center text-xs font-medium text-content-tertiary">
          Preview coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-slow ease-out-expo
        group-hover:scale-[1.04]"
    />
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleMouseMove, handleMouseEnter, handleMouseLeave } = use3dEffect(cardRef);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full [transform-style:preserve-3d]"
      >
        <button
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="card card-hover relative flex h-full w-full flex-col overflow-hidden rounded-2xl
            text-left"
        >
          {/* cursor-following highlight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity
              duration-slow group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--accent) / 0.10), transparent 60%)',
            }}
          />

          <div className="relative h-48 shrink-0 overflow-hidden bg-surface-subtle">
            <CardArt project={project} />
            <span
              className="absolute left-4 top-4 rounded-full bg-badge-bg px-3 py-1.5 text-xs
                font-semibold text-badge-text shadow-sm"
            >
              {project.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h3 className="text-subhead text-content">{project.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-content-secondary">{project.shortInfo}</p>

            {project.stats && project.stats.length > 0 && (
              <p className="mt-3 text-xs font-medium text-accent">{project.stats.join('  •  ')}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-content-tertiary/10 px-3 py-1.5 text-xs font-medium
                    text-content-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>

            <span
              className="mt-5 inline-flex items-center gap-1 self-start text-sm font-semibold text-accent
                transition-all duration-base ease-out-expo group-hover:gap-2"
            >
              Details
              <ArrowUpRight size={16} />
            </span>
          </div>
        </button>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={project.title}
        description={project.detailedDescription || project.description}
        images={[project.image]}
        isRichText={project.isRichText}
        links={project.links}
      />
    </>
  );
}
