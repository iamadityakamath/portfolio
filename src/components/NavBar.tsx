import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Sparkles, Settings2, X } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { Switch } from './ui/Controls';

const THEME_OPTIONS = [
  { value: 'light' as const, icon: Sun, label: 'Light' },
  { value: 'dark' as const, icon: Moon, label: 'Dark' },
  { value: 'system' as const, icon: Monitor, label: 'System' },
];

export function NavBar() {
  const { mode, setMode, reduceMotion, setReduceMotion, systemReducedMotion } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the settings popover on Escape.
  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSettingsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-slow ease-out-expo
        ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        {/* Wordmark */}
        <a
          href="#top"
          className={`glass glass-sheen hidden items-center gap-2 rounded-full px-4 py-2
            text-sm font-semibold tracking-tight text-content sm:flex
            transition-all duration-slow ease-out-expo
            ${scrolled ? 'opacity-100' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        >
          <Sparkles size={15} className="text-accent" />
          Aditya Kamath
        </a>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme segmented control — glass, navigation layer */}
          <div
            role="radiogroup"
            aria-label="Colour theme"
            className="glass glass-sheen flex items-center gap-0.5 rounded-full p-1"
          >
            {THEME_OPTIONS.map(({ value, icon: Icon, label }) => {
              const active = mode === value;
              return (
                <button
                  key={value}
                  role="radio"
                  aria-checked={active}
                  aria-label={`${label} theme`}
                  title={`${label} theme`}
                  onClick={() => setMode(value)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full
                    transition-all duration-base ease-out-expo
                    ${
                      active
                        ? 'bg-accent-solid text-accent-contrast scale-100'
                        : 'text-content-tertiary hover:text-content hover:bg-content/5'
                    }`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {/* Settings / motion */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              aria-expanded={settingsOpen}
              aria-label="Display settings"
              className={`glass glass-sheen flex h-11 w-11 items-center justify-center rounded-full
                text-content transition-all duration-base ease-out-expo hover:scale-105
                ${settingsOpen ? 'ring-2 ring-accent' : ''}`}
            >
              {settingsOpen ? <X size={17} /> : <Settings2 size={17} />}
            </button>

            {settingsOpen && (
              <>
                {/* click-away */}
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setSettingsOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="glass glass-sheen absolute right-0 top-[52px] z-10 w-[268px] origin-top-right
                    animate-scale-in rounded-2xl p-4"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-content-tertiary">
                    Display
                  </p>
                  <div className="flex items-start justify-between gap-3">
                    <Switch
                      checked={reduceMotion}
                      onChange={setReduceMotion}
                      disabled={systemReducedMotion}
                      label="Reduce motion"
                      description={
                        systemReducedMotion ? 'On — set by your system' : 'Calms animation'
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
