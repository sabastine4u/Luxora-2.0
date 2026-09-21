import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  withNav?: boolean;

  // Controls which footer is rendered.
  footerVariant?: 'default' | 'compact';
}

export function PageLayout({
  children,
  className = '',
  withNav = true,
  footerVariant = 'default',
}: PageLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-navy-900 ${className}`}
    >
      {withNav && <Navbar />}

      {withNav ? <main>{children}</main> : children}

      {withNav && (
        <Footer variant={footerVariant} />
      )}
    </div>
  );
}