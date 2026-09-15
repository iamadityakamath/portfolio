import React, { useState, useEffect, useRef } from 'react';
import { FileText, Linkedin, Github, Mail, Sparkles, ArrowDown } from 'lucide-react';
import { useTheme } from '../lib/theme';

const ROLES = [
  'production ML systems',
  'agentic AI workflows',
  'RAG architectures',
  'data pipelines at scale',
];

/**
 * Cycles a word with a crossfade. Pauses when the tab is hidden and when
 * motion is reduced (in which case it renders the first item statically),
 * so it isn't an animation that runs forever with no way to stop it.
 */
function RoleRotator({ className = '' }: { className?: string }) {
  const { reduceMotion } = useTheme();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setVisible(false);
      const t = window.setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setVisible(true);
      }, 200);
      timeouts.current.push(t);
    }, 2800);

    return () => {
      window.clearInterval(interval);
      timeouts.current.forEach(window.clearTimeout);
      timeouts.current = [];
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return <span className={className}>{ROLES[0]}</span>;
  }

  return (
    <span
      className={`inline-block transition-all duration-200 ease-out-expo
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'} ${className}`}
    >
      {ROLES[index]}
    </span>
  );
}

const SOCIALS = [
  { href: 'https://linkedin.com/in/kamath-aditya', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://github.com/iamadityakamath', label: 'GitHub', Icon: Github },
  { href: 'mailto:adityasureshkamath@gmail.com', label: 'Email', Icon: Mail },
];

export default function HeroSection() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden
        bg-surface px-4 pb-24 pt-28 md:px-6"
    >
      {/* Ambient background wash — purely decorative, sits under everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] max-w-[120vw] -translate-x-1/2
            rounded-full opacity-60 blur-[110px]
            bg-[radial-gradient(circle_at_center,rgb(var(--accent)/0.20),transparent_65%)]"
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[520px] rounded-full opacity-50 blur-[110px]
            bg-[radial-gradient(circle_at_center,rgb(var(--accent)/0.12),transparent_70%)]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* Availability pill */}
        <div
          className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-badge-bg px-4 py-2
            text-sm font-medium text-badge-text"
          style={{ animationDelay: '0ms' }}
        >
          <Sparkles size={14} />
          Open to Full-Time &amp; Contract Roles
        </div>

        {/* Name — the one thing that should win this screen */}
        <h1
          className="animate-fade-up mt-8 text-display-sm md:text-display"
          style={{ animationDelay: '60ms' }}
        >
          <span className="block text-content">Aditya</span>
          <span className="block bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent">
            Kamath
          </span>
        </h1>

        <p
          className="animate-fade-up mt-6 text-heading text-content"
          style={{ animationDelay: '120ms' }}
        >
          Machine Learning Engineer
        </p>

        <p
          className="animate-fade-up mt-3 flex flex-wrap items-center justify-center gap-x-2 text-subhead
            font-normal text-content-tertiary"
          style={{ animationDelay: '160ms' }}
        >
          <span>I build</span>
          <RoleRotator className="font-semibold text-accent" />
        </p>

        {/* Socials */}
        <div
          className="animate-fade-up mt-8 flex items-center justify-center gap-3"
          style={{ animationDelay: '200ms' }}
        >
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline
                bg-surface-elevated text-content transition-all duration-base ease-out-expo
                hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* CTAs — one primary, one secondary. The old build had three
            equal-weight buttons, which meant none of them read as the ask. */}
        <div
          className="animate-fade-up mt-10 flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <button
            onClick={() => scrollTo('portfolio')}
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border
              border-transparent bg-accent-solid px-10 text-base font-semibold text-accent-contrast
              shadow-[0_6px_20px_rgb(var(--accent)/0.32)]
              transition-all duration-base ease-out-expo
              hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgb(var(--accent)/0.42)]
              active:translate-y-0 active:scale-[0.98]"
          >
            View My Projects
            <ArrowDown
              size={17}
              className="transition-transform duration-base ease-spring group-hover:translate-y-0.5"
            />
          </button>

          <a
            href="/pdf/Aditya Kamath Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border
              border-hairline bg-surface-elevated px-8 text-base font-medium text-content
              transition-all duration-base ease-out-expo
              hover:-translate-y-0.5 hover:border-accent hover:text-accent
              active:translate-y-0 active:scale-[0.98]"
          >
            <FileText size={17} />
            View Resume
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <button
        onClick={() => scrollTo('about')}
        aria-label="Scroll to About"
        className="absolute bottom-24 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center
          rounded-full text-content-tertiary transition-colors hover:text-accent md:flex"
      >
        <ArrowDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}
