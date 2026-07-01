import type { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  noPadding?: boolean;
}

export function Section({ children, id, className = '', noPadding = false }: SectionProps) {
  return (
    <section id={id} className={`relative ${!noPadding ? 'section-pad py-24 md:py-32' : ''} ${className}`}>
      {children}
    </section>
  );
}
