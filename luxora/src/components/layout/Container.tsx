import type { ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1400px] ${className}`}>
      {children}
    </div>
  );
}
