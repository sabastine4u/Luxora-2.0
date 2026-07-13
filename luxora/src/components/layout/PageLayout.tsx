import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  withNav?: boolean;
}

export function PageLayout({ children, className = '', withNav = true }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-navy-900 ${className}`}>
      {withNav && <Navbar />}
      {withNav ? <main>{children}</main> : children}
      {withNav && <Footer />}
    </div>
  );
}
