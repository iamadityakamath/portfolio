import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** What the user picked. 'system' follows the OS. */
  mode: ThemeMode;
  /** What is actually on screen right now. */
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;

  /** User-facing motion switch, on top of the OS prefers-reduced-motion. */
  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;
  /** True when the OS asks for reduced motion — the toggle is then forced on. */
  systemReducedMotion: boolean;
}

const STORAGE_THEME = 'portfolio:theme';
const STORAGE_MOTION = 'portfolio:reduce-motion';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStoredTheme(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_THEME);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* private mode / blocked storage — fall through to system */
  }
  return 'system';
}

function readStoredMotion(): boolean {
  try {
    return localStorage.getItem(STORAGE_MOTION) === 'true';
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredTheme());
  const [systemDark, setSystemDark] = useState<boolean>(() => systemPrefersDark());
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [reduceMotionPref, setReduceMotionPref] = useState<boolean>(() => readStoredMotion());

  // Follow the OS colour scheme while mode === 'system'.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Follow the OS reduced-motion setting.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
    setSystemReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: 'light' | 'dark' =
    mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  // The OS setting wins: if the system asks for reduced motion we never
  // animate, regardless of the in-page toggle.
  const reduceMotion = systemReducedMotion || reduceMotionPref;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
  }, [resolved]);

  useEffect(() => {
    const root = document.documentElement;
    if (reduceMotion) root.setAttribute('data-motion', 'reduced');
    else root.removeAttribute('data-motion');
  }, [reduceMotion]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_THEME, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setReduceMotion = useCallback((v: boolean) => {
    setReduceMotionPref(v);
    try {
      localStorage.setItem(STORAGE_MOTION, String(v));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setMode]);

  const value = useMemo(
    () => ({
      mode,
      resolved,
      setMode,
      toggle,
      reduceMotion,
      setReduceMotion,
      systemReducedMotion,
    }),
    [mode, resolved, setMode, toggle, reduceMotion, setReduceMotion, systemReducedMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
