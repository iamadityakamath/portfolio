import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * macOS-style magnifying dock, adapted from Aceternity UI's FloatingDock.
 *
 * Deviations from the original, and why:
 *  - Takes `onSelect` + `id` instead of `href`, so it can drive in-page
 *    scrolling and show which section you're currently in.
 *  - Rest size is 44px, not the original's 40px, to stay on the 44pt minimum
 *    hit target.
 *  - Uses this project's glass material and colour tokens rather than
 *    hard-coded bg-gray-50 / dark:bg-neutral-900.
 *  - `magnify={false}` renders a plain static row. The caller passes this
 *    when reduced motion is on — a dock that swells under the cursor is
 *    exactly the kind of effect that setting exists to suppress.
 */

export interface DockItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface FloatingDockProps {
  items: DockItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  className?: string;
  /** Set false to disable the hover magnification entirely. */
  magnify?: boolean;
}

const REST = 44;
const PEAK = 78;
const ICON_REST = 20;
const ICON_PEAK = 32;
const RANGE = 140;

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

export function FloatingDock({
  items,
  activeId,
  onSelect,
  className,
  magnify = true,
}: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => magnify && mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn('glass glass-sheen flex items-end gap-1 rounded-full p-1.5', className)}
    >
      {items.map((item) => (
        <IconContainer
          key={item.id}
          mouseX={mouseX}
          item={item}
          isActive={activeId === item.id}
          onSelect={onSelect}
          magnify={magnify}
        />
      ))}
    </div>
  );
}

function IconContainer({
  mouseX,
  item,
  isActive,
  onSelect,
  magnify,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
  isActive: boolean;
  onSelect: (id: string) => void;
  magnify: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  // Horizontal distance from the cursor to this icon's centre.
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const size = useSpring(useTransform(distance, [-RANGE, 0, RANGE], [REST, PEAK, REST]), SPRING);
  const iconSize = useSpring(
    useTransform(distance, [-RANGE, 0, RANGE], [ICON_REST, ICON_PEAK, ICON_REST]),
    SPRING,
  );

  const sizeStyle = magnify ? { width: size, height: size } : { width: REST, height: REST };
  const iconStyle = magnify
    ? { width: iconSize, height: iconSize }
    : { width: ICON_REST, height: ICON_REST };

  return (
    <motion.button
      ref={ref}
      style={sizeStyle}
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={item.title}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'relative flex aspect-square shrink-0 items-center justify-center rounded-full',
        'transition-colors duration-base',
        isActive
          ? 'bg-accent-solid text-accent-contrast'
          : 'text-content-tertiary hover:bg-content/5 hover:text-content',
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 4, x: '-50%' }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -top-9 left-1/2 w-fit whitespace-pre rounded-lg
              bg-content px-2 py-1 text-xs font-medium text-surface shadow-sm"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span style={iconStyle} className="flex items-center justify-center">
        {item.icon}
      </motion.span>
    </motion.button>
  );
}
