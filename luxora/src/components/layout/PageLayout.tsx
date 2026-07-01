import type { ReactNode } from 'react';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-navy-900 ${className}`}>
      {children}
    </div>
  );
}
