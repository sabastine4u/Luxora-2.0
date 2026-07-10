export interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  let colorClass: string;

  // Auto-detect type if not provided
  const normalizedStatus = status.toLowerCase();
  let finalType = type;
  
  if (!finalType) {
    if (['active', 'completed', 'optimal', 'generated', 'success', 'approved'].includes(normalizedStatus)) {
      finalType = 'success';
    } else if (['pending', 'review', 'warning', 'on leave', 'medium'].includes(normalizedStatus)) {
      finalType = 'warning';
    } else if (['failed', 'critical', 'error', 'rejected'].includes(normalizedStatus)) {
      finalType = 'error';
    } else if (['info', 'processing'].includes(normalizedStatus)) {
      finalType = 'info';
    } else {
      finalType = 'neutral';
    }
  }

  switch (finalType) {
    case 'success':
      colorClass = 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400';
      break;
    case 'warning':
      colorClass = 'border-yellow-400/20 bg-yellow-400/10 text-yellow-400';
      break;
    case 'error':
      colorClass = 'border-rose-400/20 bg-rose-400/10 text-rose-400';
      break;
    case 'info':
      colorClass = 'border-blue-400/20 bg-blue-400/10 text-blue-400';
      break;
    default:
      colorClass = 'border-ink/20 bg-white/5 text-ink/60';
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {status}
    </span>
  );
}
