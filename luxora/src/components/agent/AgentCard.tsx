import {
  ArrowRight,
  Award,
  Building2,
  MapPin,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { PublicAgent } from '../../types';
import { ROUTES } from '../../constants/routes';

export interface AgentCardProps {
  agent: PublicAgent;
  index?: number;
}

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'A';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export function AgentCard({
  agent,
  index = 0,
}: AgentCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(
      ROUTES.AGENT_DETAILS.replace(
        ':slug',
        agent.slug,
      ),
    );
  };

  const primaryMarket =
    agent.activeMarkets?.[0] ||
    agent.serviceStates?.[0] ||
    'Nigeria';

  return (
    <div
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className="group cursor-pointer rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-sm font-bold text-gold-300 ring-1 ring-gold-400/20">
              {getInitials(agent.name)}
            </div>
          )}

          {index < 3 && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-navy-900">
              {index + 1}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <div className="truncate text-sm font-semibold text-cream">
              {agent.name}
            </div>

            {agent.verified && (
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink/50">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {agent.agency?.name ||
                'Independent Agent'}
            </span>
          </div>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-gold-400" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-gold-400" />

            <div className="font-heading text-lg font-bold text-cream">
              {agent.listingCount}
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-ink/40">
            Published Listings
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-blue-400" />

            <div className="font-heading text-lg font-bold text-cream">
              {agent.yearsOfExperience}
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-ink/40">
            Years Experience
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-white/5 pt-3 text-xs text-ink/50">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-400" />

        <span className="truncate">
          {primaryMarket}
        </span>

        {agent.activeMarkets?.length > 1 && (
          <span className="shrink-0 text-ink/30">
            +{agent.activeMarkets.length - 1}
          </span>
        )}

        <UserRound className="ml-auto h-3.5 w-3.5 shrink-0 text-ink/20" />
      </div>
    </div>
  );
}