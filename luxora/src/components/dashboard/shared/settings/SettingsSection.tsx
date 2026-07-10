import type { ReactNode } from 'react';

export interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  isDanger?: boolean;
  className?: string;
  size?: '2xl' | '3xl' | '3xl-small';
}

export function SettingsSection({
  title,
  subtitle,
  description,
  icon,
  headerAction,
  children,
  isDanger = false,
  className = '',
  size = '3xl'
}: SettingsSectionProps) {
  const baseCardStyles = isDanger
    ? 'rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 lg:p-8 space-y-6'
    : size === '2xl'
      ? 'rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-6'
      : size === '3xl-small'
        ? 'rounded-3xl border border-white/10 bg-navy-800/50 p-6 space-y-6'
        : 'rounded-3xl border border-white/10 bg-navy-800/50 p-6 lg:p-8 space-y-6';

  const titleStyles = isDanger
    ? 'font-heading text-xl font-bold text-rose-400'
    : size === '2xl'
      ? 'font-heading text-lg font-semibold text-cream'
      : 'font-heading text-xl font-bold text-cream';

  const borderStyles = isDanger ? 'border-rose-500/20' : 'border-white/10';

  return (
    <section className={`${baseCardStyles} ${className}`}>
      {(title || headerAction || subtitle || description) && (
        <div className={`border-b ${borderStyles} pb-4 space-y-1`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className={`${titleStyles} flex items-center gap-2`}>
              {icon}
              {title}
            </h3>
            {headerAction && <div>{headerAction}</div>}
          </div>
          {subtitle && <p className="text-sm text-ink/60">{subtitle}</p>}
          {description && <p className="text-xs text-ink/50">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
