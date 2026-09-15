import React, { useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import type { TimelineEntry } from '../../data/experience';

function LogoNode({ entry }: { entry: TimelineEntry }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      aria-hidden="true"
      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden
        rounded-full border border-hairline bg-surface-elevated shadow-sm"
    >
      {entry.logo && !failed ? (
        <img
          src={entry.logo}
          alt=""
          className="h-6 w-6 object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        // Not every employer has a logo asset — fall back to the initial
        // rather than leaving an empty ring.
        <span className="text-sm font-bold text-accent">{entry.company.charAt(0)}</span>
      )}
    </span>
  );
}

function TimelineItem({
  entry,
  isLast,
  index,
}: {
  entry: TimelineEntry;
  isLast: boolean;
  index: number;
}) {
  const { revealProps } = useReveal<HTMLLIElement>({ delay: index * 80, threshold: 0.15 });

  return (
    <li
      ref={revealProps.ref}
      style={revealProps.style}
      className={`${revealProps.className} relative pb-12 last:pb-0`}
    >
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px
            bg-gradient-to-b from-accent/45 to-hairline"
        />
      )}

      <div className="flex items-start gap-5">
        <LogoNode entry={entry} />

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              {entry.period}
            </p>
            {entry.location && (
              <p className="text-xs text-content-tertiary">{entry.location}</p>
            )}
          </div>

          <h3 className="mt-1 text-subhead text-content">{entry.company}</h3>
          <p className="text-sm font-medium text-content-secondary">{entry.role}</p>

          <ul className="mt-4 space-y-2">
            {entry.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-content-secondary">
                <span
                  aria-hidden="true"
                  className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-content-tertiary"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className="relative">
      {items.map((entry, i) => (
        <TimelineItem
          key={`${entry.company}-${entry.period}`}
          entry={entry}
          index={i}
          isLast={i === items.length - 1}
        />
      ))}
    </ol>
  );
}
