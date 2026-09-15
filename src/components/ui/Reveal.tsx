import React from 'react';
import { useReveal } from '../../hooks/useReveal';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger in ms. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
}

/** Wrapper that fades + lifts its children into place once, on first scroll-in. */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const { revealProps } = useReveal<HTMLDivElement>({ delay });
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={revealProps.ref}
      style={revealProps.style}
      className={`${revealProps.className} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
