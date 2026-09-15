import React, { useMemo, useState } from 'react';
import { Reveal } from './ui/Reveal';
import { SegmentedControl } from './ui/Controls';

interface SkillCategory {
  title: string;
  skills: string[];
  /** Skills to surface first — gives the eye a ranking inside each card. */
  primary?: string[];
}

const CATEGORIES: SkillCategory[] = [
  { title: 'Languages', skills: ['Python', 'SQL', 'R'], primary: ['Python', 'SQL'] },
  {
    title: 'GenAI & LLM',
    skills: [
      'LangChain',
      'LlamaIndex',
      'RAG Pipelines',
      'Prompt Engineering',
      'Fine-tuning',
      'LLM Evaluation',
      'MCP',
      'A2A',
    ],
    primary: ['LangChain', 'RAG Pipelines', 'MCP'],
  },
  {
    title: 'Data & Databases',
    skills: [
      'Apache Spark',
      'BigQuery',
      'Airflow',
      'dbt',
      'PostgreSQL',
      'ChromaDB',
      'Pinecone',
      'Supabase',
    ],
    primary: ['BigQuery', 'Apache Spark', 'ChromaDB'],
  },
  {
    title: 'Developer Tools',
    skills: [
      'Docker',
      'Kubernetes',
      'Vertex AI',
      'SageMaker',
      'CI/CD',
      'MLOps',
      'Pytest',
      'Tableau',
      'Power BI',
      'Looker Studio',
    ],
    primary: ['Docker', 'Kubernetes', 'MLOps'],
  },
  {
    title: 'Cloud',
    skills: ['Google Cloud Platform', 'Amazon Web Services', 'Microsoft Azure', 'Databricks'],
    primary: ['Google Cloud Platform', 'Databricks'],
  },
  {
    title: 'Certifications',
    skills: [
      'GCP Professional Machine Learning Engineer',
      'GCP Professional Cloud Architect',
    ],
    primary: ['GCP Professional Machine Learning Engineer', 'GCP Professional Cloud Architect'],
  },
];

type ViewMode = 'grouped' | 'all';

const COMPACT_LIMIT = 6;

function Pill({ label, primary = false }: { label: string; primary?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-2 text-[13px] leading-none
        transition-colors duration-fast
        ${
          primary
            ? 'bg-accent/12 font-semibold text-accent'
            : 'bg-content-tertiary/10 font-medium text-content-secondary'
        }`}
    >
      {label}
    </span>
  );
}

function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const primary = category.primary ?? [];

  // Primary skills first, then the rest.
  const ordered = useMemo(
    () => [...category.skills].sort((a, b) => Number(primary.includes(b)) - Number(primary.includes(a))),
    [category.skills, primary],
  );

  const canExpand = ordered.length > COMPACT_LIMIT;
  const shown = expanded ? ordered : ordered.slice(0, COMPACT_LIMIT);
  const hidden = ordered.length - shown.length;

  return (
    <Reveal delay={index * 60}>
      <div className="card card-hover h-full rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-subhead text-content">{category.title}</h3>
          <span
            className="flex h-8 min-w-8 items-center justify-center rounded-full bg-badge-bg px-2
              text-sm font-semibold text-badge-text"
          >
            {category.skills.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {shown.map((skill) => (
            <Pill key={skill} label={skill} primary={primary.includes(skill)} />
          ))}
        </div>

        {canExpand && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent
              transition-colors hover:text-content"
          >
            {expanded ? 'Show less' : `Show ${hidden} more`}
          </button>
        )}
      </div>
    </Reveal>
  );
}

export default function SkillsSection() {
  const [view, setView] = useState<ViewMode>('grouped');

  const allSkills = useMemo(() => {
    const primary = new Set(CATEGORIES.flatMap((c) => c.primary ?? []));
    const all = CATEGORIES.flatMap((c) => c.skills);
    return Array.from(new Set(all)).sort(
      (a, b) => Number(primary.has(b)) - Number(primary.has(a)) || a.localeCompare(b),
    );
  }, []);

  const primarySet = useMemo(() => new Set(CATEGORIES.flatMap((c) => c.primary ?? [])), []);

  return (
    <section id="skills" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-title-sm text-content md:text-title">Technical Skills</h2>
            <p className="mx-auto mt-4 max-w-2xl text-content-tertiary">
              Tools and technologies I use to build production ML systems, data pipelines, and
              full-stack applications.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mb-10 flex justify-center">
            <SegmentedControl<ViewMode>
              ariaLabel="Skills view"
              value={view}
              onChange={setView}
              options={[
                { value: 'grouped', label: 'By category', count: CATEGORIES.length },
                { value: 'all', label: 'All skills', count: allSkills.length },
              ]}
            />
          </div>
        </Reveal>

        {view === 'grouped' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, i) => (
              <SkillCard key={category.title} category={category} index={i} />
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="card mx-auto max-w-4xl rounded-2xl p-8">
              <div className="flex flex-wrap justify-center gap-2.5">
                {allSkills.map((skill, i) => (
                  <span
                    key={skill}
                    className="animate-scale-in"
                    style={{ animationDelay: `${Math.min(i * 18, 400)}ms` }}
                  >
                    <Pill label={skill} primary={primarySet.has(skill)} />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Legend */}
        <Reveal delay={120}>
          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-content-tertiary">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            Core day-to-day tools
          </p>
        </Reveal>
      </div>
    </section>
  );
}
