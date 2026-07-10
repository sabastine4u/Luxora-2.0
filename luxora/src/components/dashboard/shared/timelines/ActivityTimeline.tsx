import type { ComponentType, ReactNode } from 'react';

export interface ActivityItem {
  title: string;
  desc: string;
  time: string;
  icon: ComponentType<{ className?: string }>;
  color?: string;
}

export interface ActivityTimelineProps {
  title?: string;
  subtitle?: string;
  items: ActivityItem[];
  onViewAll?: () => void;
  showViewAll?: boolean;
  emptyState?: ReactNode;
}

export function ActivityTimeline({
  title,
  subtitle,
  items,
  onViewAll,
  showViewAll = false,
  emptyState
}: ActivityTimelineProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
      {(title || onViewAll || showViewAll) && (
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div>
            {title && <h3 className="font-heading text-lg font-bold text-cream">{title}</h3>}
            {subtitle && <p className="text-xs text-ink/50 mt-1">{subtitle}</p>}
          </div>
          {(onViewAll || showViewAll) && (
            <button
              onClick={onViewAll}
              className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View All
            </button>
          )}
        </div>
      )}

      {items.length === 0 ? (
        emptyState || (
          <div className="text-center py-6 text-sm text-ink/50">
            No recent activity.
          </div>
        )
      ) : (
        <div className="relative border-l border-white/10 ml-4 space-y-6 pb-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative pl-6">
                <div className="absolute -left-3.5 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 border border-white/10">
                  <Icon className={`h-3.5 w-3.5 ${item.color || 'text-gold-400'}`} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream">{item.title}</div>
                  <div className="text-xs text-ink/60 mt-0.5">{item.desc}</div>
                  <div className="text-[10px] font-semibold text-ink/40 mt-1 uppercase tracking-wider">{item.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
