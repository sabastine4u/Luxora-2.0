import type { ReactNode } from 'react';
import { GhostButton } from '../ui/ui';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-16 px-4 text-center">
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">{icon}</div>}
      <h3 className="mb-2 font-heading text-lg font-semibold text-cream">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-ink/50">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        {actionLabel && onAction && (
          <GhostButton onClick={onAction}>{actionLabel}</GhostButton>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button 
            onClick={onSecondaryAction}
            className="text-gold-400 hover:text-gold-300 font-medium text-sm transition-colors"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
