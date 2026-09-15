import React, { useId, useRef, useState, useLayoutEffect } from 'react';

/* ============================================================
   SWITCH — iOS-style toggle.
   Track is 51x31pt like the system control, wrapped in a >=44pt
   hit region. HIG allows the Liquid Glass appearance on toggles
   as a transient interactive element, so the knob picks up a
   glass sheen while pressed.
   ============================================================ */

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  /** Rendered next to the switch; omit for icon-only/compact use. */
  showLabel?: boolean;
  description?: string;
  disabled?: boolean;
}

export function Switch({
  checked,
  onChange,
  label,
  showLabel = true,
  description,
  disabled = false,
}: SwitchProps) {
  const id = useId();
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <label
          htmlFor={id}
          className={`select-none text-sm font-medium ${
            disabled ? 'text-content-tertiary' : 'text-content'
          }`}
        >
          {label}
          {description && (
            <span className="block text-xs font-normal text-content-tertiary">{description}</span>
          )}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={showLabel ? undefined : label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={`relative inline-flex h-11 w-[51px] shrink-0 items-center justify-center
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        {/* track */}
        <span
          aria-hidden="true"
          className={`block h-[31px] w-[51px] rounded-full transition-colors duration-base ease-out-expo
            ${checked ? 'bg-accent-solid' : 'bg-content-tertiary/35'}`}
        />
        {/* knob */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-1/2 h-[27px] w-[27px] -translate-y-1/2
            rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]
            transition-transform duration-base ease-spring
            ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}
            ${pressed ? 'scale-95' : ''}`}
        />
      </button>
    </div>
  );
}

/* ============================================================
   SEGMENTED CONTROL — iOS-style, with a sliding indicator that
   measures the active segment so it works with any label widths.
   ============================================================ */

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const active = list.querySelector<HTMLButtonElement>('[data-active="true"]');
      if (!active) return;
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [value, options]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className="relative inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full
        bg-content-tertiary/10 p-1 no-scrollbar"
    >
      {indicator && (
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-full bg-surface-elevated shadow-[0_1px_3px_rgba(0,0,0,0.12)]
            transition-all duration-base ease-out-expo"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            data-active={active}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium
              transition-colors duration-fast
              ${active ? 'text-content' : 'text-content-tertiary hover:text-content-secondary'}`}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={`ml-1.5 text-xs ${active ? 'text-accent' : 'text-content-tertiary'}`}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
