import React from 'react';
import { Timeline } from './ui/timeline';
import { Reveal } from './ui/Reveal';
import { EXPERIENCE } from '../data/experience';

export default function TimelineDemo() {
  return (
    <section id="experience" className="bg-surface-subtle py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Reveal>
          <div className="mb-14 text-center">
            <h2 className="text-title-sm text-content md:text-title">Work Experience</h2>
            <p className="mx-auto mt-4 max-w-2xl text-content-tertiary">
              Three years building and shipping production machine learning systems.
            </p>
          </div>
        </Reveal>

        <Timeline items={EXPERIENCE} />
      </div>
    </section>
  );
}
