import type { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  noPadding?: boolean;
}

export function Section({ children, id, className = '', noPadding = false }: SectionProps) {
  return (
    <section id={id} className={`relative ${!noPadding ? 'py-16 md:py-20' : ''} ${className}`}>
      {children}
    </section>
  );
}
