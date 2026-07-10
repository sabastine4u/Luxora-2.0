import React from 'react';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string | React.ReactNode; 
  trendColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  // Variants to preserve exact styling across dashboards
  hoverEffect?: 'lift' | 'highlight' | 'none';
  iconBorder?: boolean;
  valueTypography?: 'heading' | 'heading-xl' | 'standard' | 'standard-xl';
  labelTypography?: 'small' | 'standard' | 'uppercase-small';
  trendPosition?: 'bottom' | 'inline' | 'bottom-right' | 'inline-label-top';
  padding?: 'p-4' | 'p-5';
  layout?: 'vertical' | 'horizontal';
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendColor = 'text-ink/40',
  iconColor = 'text-emerald-400',
  backgroundColor = 'bg-emerald-400/10',
  footer,
  onClick,
  hoverEffect = 'highlight',
  iconBorder = false,
  valueTypography = 'standard',
  labelTypography = 'standard',
  trendPosition = 'bottom',
  padding = 'p-5',
  layout = 'vertical',
}: KPICardProps) {
  const hoverClass = hoverEffect === 'lift' 
    ? 'transition-transform hover:-translate-y-1' 
    : hoverEffect === 'highlight'
    ? 'transition-all hover:bg-navy-800/80'
    : '';

  const iconBorderClass = iconBorder ? 'border border-white/5' : '';

  const valueClass = valueTypography === 'heading' 
    ? 'font-heading text-2xl font-bold text-cream' 
    : valueTypography === 'heading-xl'
    ? 'font-heading text-xl font-bold text-cream leading-none'
    : valueTypography === 'standard-xl'
    ? 'text-2xl font-bold text-cream leading-none'
    : 'text-2xl font-bold text-cream';

  const labelClass = labelTypography === 'small' 
    ? 'text-xs text-ink/50' 
    : labelTypography === 'uppercase-small'
    ? 'text-xs text-ink/50 uppercase font-semibold'
    : 'text-sm font-medium text-ink/60 mt-1';

  return (
    <div 
      className={`rounded-2xl border border-white/10 bg-navy-800/50 ${padding} ${hoverClass} ${onClick ? 'cursor-pointer' : ''} ${layout === 'horizontal' ? 'flex items-center gap-4' : ''} ${trendPosition === 'inline-label-top' ? 'flex flex-col justify-between' : ''}`}
      onClick={onClick}
    >
      <div className={`${layout === 'horizontal' ? 'flex h-12 w-12 shrink-0' : 'mb-4 flex h-10 w-10'} items-center justify-center rounded-xl ${iconBorderClass} ${backgroundColor} ${iconColor}`}>
        <Icon className={`${layout === 'horizontal' ? 'h-6 w-6' : 'h-5 w-5'}`} />
      </div>
      
      {layout === 'horizontal' ? (
        <div>
          <div className={valueClass}>{value}</div>
          <div className={labelClass}>{title}</div>
        </div>
      ) : trendPosition === 'inline-label-top' ? (
        <div className="flex flex-col gap-1">
          <div className={labelClass.replace('mt-1', '')}>{title}</div>
          <div className="flex items-end justify-between">
            <div className={valueClass}>{value}</div>
            {trend && <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>}
          </div>
        </div>
      ) : trendPosition === 'inline' ? (
        <>
          <div className="flex items-end justify-between">
            <div className={valueClass}>{value}</div>
            {trend && <span className={`text-[10px] font-bold ${trendColor}`}>{trend}</span>}
          </div>
          <div className={`mt-1 ${labelClass.replace('mt-1', '')}`}>{title}</div>
        </>
      ) : trendPosition === 'bottom-right' ? (
        <>
          <div className={valueClass}>{value}</div>
          <div className="mt-1 flex items-center justify-between">
            <span className={labelClass.replace('mt-1', '')}>{title}</span>
            {trend && (
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trendColor}`}>
                {trend}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={valueClass}>{value}</div>
          <div className={labelClass}>{title}</div>
          {trend && (
            <div className={`mt-2 text-[10px] font-semibold tracking-wider uppercase ${trendColor}`}>
              {trend}
            </div>
          )}
        </>
      )}

      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
    </div>
  );
}
