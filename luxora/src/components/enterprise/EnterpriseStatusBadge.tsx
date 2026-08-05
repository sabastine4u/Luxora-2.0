export interface EnterpriseStatusBadgeProps {
  status: string;
}

export function EnterpriseStatusBadge({ status }: EnterpriseStatusBadgeProps) {
  const getStatusColor = (s: string) => {
    const normalized = s.toLowerCase();
    if (['active', 'completed', 'approved', 'paid', 'success', 'open', 'published', 'verified', 'assigned to agency', 'agency acknowledged', 'online', 'operational', 'optimal', 'healthy'].includes(normalized)) {
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
    if (['pending', 'processing', 'in progress', 'under review', 'scheduled', 'submitted', 'requires info', 'returned for correction', 'ready for agency assignment', 'warning'].includes(normalized)) {
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
    if (['rejected', 'failed', 'overdue', 'closed', 'suspended', 'critical', 'offline'].includes(normalized)) {
      return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    }
    if (['draft', 'inactive', 'on hold', 'cancelled'].includes(normalized)) {
      return 'text-ink/60 bg-white/5 border-white/10';
    }
    // Default
    return 'text-gold-400 bg-gold-400/10 border-gold-400/20';
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
