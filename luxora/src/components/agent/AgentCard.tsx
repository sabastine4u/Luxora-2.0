import { useNavigate } from 'react-router-dom';
import type { Agent } from '../../types';
import { ROUTES } from '../../constants/routes';
import { agentNameToSlug } from '../../utils/agency';

export interface AgentCardProps {
  agent: Agent;
  index?: number;
}

export function AgentCard({ agent: a, index: i }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(a.name)))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(a.name)));
        }
      }}
      className="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20 hover:bg-white/[0.06] cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={a.avatar} alt={a.name} className="h-12 w-12 rounded-full object-cover" />
          {i === 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-navy-900">
              1
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-cream">{a.name}</div>
          <div className="truncate text-xs text-ink/50">{a.agency}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <div>
          <div className="font-heading text-lg font-bold text-cream">{a.deals ?? 0}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink/40">Deals</div>
        </div>
        <div className="text-right">
          <div className="font-heading text-lg font-bold gold-text">{a.value ?? 'N/A'}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink/40">Volume</div>
        </div>
      </div>
    </div>
  );
}
