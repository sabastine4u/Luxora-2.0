import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-cream sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
