import React from 'react';
import { PageLayout } from '../../../components/layout';

export function ServiceLayout({ children }: { children: React.ReactNode }) {
  return (
   <PageLayout footerVariant="compact">
      <div className="bg-navy-900 text-ink min-h-screen">
        {children}
      </div>
    </PageLayout>
  );
}
