import type { ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  disableHorizontalPadding?: boolean;
}

export function Container({ children, className = '', disableHorizontalPadding = false }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] ${!disableHorizontalPadding ? 'section-pad' : ''} ${className}`}>
      {children}
    </div>
  );
}
