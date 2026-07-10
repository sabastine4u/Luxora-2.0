import type { OnlineStatus } from '../types/communicationTypes';
import { clsx } from 'clsx';

interface OnlineIndicatorProps {
  status: OnlineStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OnlineIndicator = ({ status, size = 'md', className }: OnlineIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-400',
    busy: 'bg-red-500'
  };

  return (
    <div className={clsx(
      'rounded-full border-2 border-white dark:border-ink',
      sizeClasses[size],
      statusClasses[status],
      className
    )} />
  );
};
