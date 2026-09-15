import React from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { EDUCATION } from '../data/experience';

export default function EducationSection() {
  return (
    <section id="education" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Reveal>
          <div className="mb-14 text-center">
            <h2 className="text-title-sm text-content md:text-title">Education</h2>
            <p className="mx-auto mt-4 max-w-2xl text-content-tertiary">
              Information management, built on an electronics and telecommunication foundation.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {EDUCATION.map((item, i) => (
            <Reveal key={item.institution} delay={i * 90}>
              <article className="card card-hover flex h-full flex-col rounded-2xl p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                      bg-accent/12 text-accent"
                  >
                    <GraduationCap size={21} />
                  </span>
                  <span
                    className="rounded-full bg-badge-bg px-3 py-1.5 text-xs font-semibold text-badge-text"
                    title="Grade point average"
                  >
                    GPA {item.gpa}
                  </span>
                </div>

                <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                  {item.period}
                </p>

                <h3 className="mt-2 text-subhead leading-snug text-content">{item.institution}</h3>

                <p className="mt-2 flex-1 text-sm font-medium text-content-secondary">
                  {item.degree}
                </p>

                <p className="mt-4 flex items-center gap-1.5 text-xs text-content-tertiary">
                  <MapPin size={13} aria-hidden="true" />
                  {item.location}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
