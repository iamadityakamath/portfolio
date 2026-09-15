import React, { useState } from 'react';
import { Mail, Linkedin, Github, Check, Copy } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const EMAIL = 'adityasureshkamath@gmail.com';

const SOCIALS = [
  { href: 'https://linkedin.com/in/kamath-aditya', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://github.com/iamadityakamath', label: 'GitHub', Icon: Github },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the mailto link below still works */
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-24 md:py-32">
      {/* accent wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0
          bg-[radial-gradient(ellipse_at_center,rgb(var(--accent)/0.14),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <Reveal>
          <h2 className="text-title-sm text-content md:text-title">Let&rsquo;s work together</h2>
          <p className="mx-auto mt-4 max-w-xl text-content-secondary">
            Have a project in mind or want to discuss opportunities? I&rsquo;d love to hear from you.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border
                border-transparent bg-accent-solid px-8 text-base font-semibold text-accent-contrast
                shadow-[0_6px_20px_rgb(var(--accent)/0.32)]
                transition-all duration-base ease-out-expo
                hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgb(var(--accent)/0.42)]
                active:translate-y-0 active:scale-[0.98]"
            >
              <Mail size={18} />
              <span className="hidden sm:inline">{EMAIL}</span>
              <span className="sm:hidden">Email me</span>
            </a>

            <button
              onClick={copy}
              aria-label={copied ? 'Email copied' : 'Copy email address'}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border
                border-hairline bg-surface-elevated text-content
                transition-all duration-base ease-out-expo
                hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              {copied ? <Check size={18} className="text-accent" /> : <Copy size={18} />}
            </button>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 flex items-center justify-center gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline
                  bg-surface-elevated text-content-secondary transition-all duration-base ease-out-expo
                  hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p
            aria-live="polite"
            className={`mt-6 text-sm text-content-tertiary transition-opacity duration-base
              ${copied ? 'opacity-100' : 'opacity-0'}`}
          >
            Copied to clipboard
          </p>
        </Reveal>
      </div>
    </section>
  );
}
