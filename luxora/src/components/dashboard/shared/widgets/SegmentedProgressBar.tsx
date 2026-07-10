import type { ReactNode } from 'react';

export interface Segment {
  label: string;
  value: number;
  color: string;
}

export interface SegmentedProgressBarProps {
  title?: string;
  segments: Segment[];
  showLegend?: boolean;
  showTotal?: boolean;
  headerAction?: ReactNode;
  emptyState?: ReactNode;
}

export function SegmentedProgressBar({
  title,
  segments,
  showLegend = true,
  showTotal = false,
  headerAction,
  emptyState
}: SegmentedProgressBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
      {(title || showTotal || headerAction) && (
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div>
            {title && <h3 className="font-heading text-lg font-bold text-cream">{title}</h3>}
          </div>
          <div className="flex items-center gap-4">
            {showTotal && (
              <span className="text-sm font-semibold text-cream">
                Total: {total}
              </span>
            )}
            {headerAction}
          </div>
        </div>
      )}

      {total === 0 ? (
        emptyState || (
          <div className="text-center py-8 text-sm text-ink/50">
            No segment data.
          </div>
        )
      ) : (
        <>
          <div className="flex h-12 w-full rounded-xl overflow-hidden mb-8">
            {segments.map((segment, i) => {
              const percentage = (segment.value / total) * 100;
              return (
                <div
                  key={i}
                  className={`h-full ${segment.color} flex items-center justify-center text-navy-900 font-bold text-xs shadow-inner`}
                  style={{ width: `${percentage}%` }}
                  title={`${segment.label}: ${segment.value}`}
                >
                  {percentage > 10 ? segment.value : ''}
                </div>
              );
            })}
          </div>

          {showLegend && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {segments.map((segment, i) => (
                <div key={i} className="flex items-center gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <div className={`h-3 w-3 rounded-full ${segment.color}`}></div>
                  <div>
                    <div className="text-xs text-ink/60 font-medium">{segment.label}</div>
                    <div className="text-lg font-bold text-cream">{segment.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
