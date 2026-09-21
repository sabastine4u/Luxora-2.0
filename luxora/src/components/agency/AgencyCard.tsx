import { Building2, MapPin, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PublicAgency } from '../../types';
import { ROUTES } from '../../constants/routes';

export interface AgencyCardProps {
  agency: PublicAgency;
  index?: number;
}

const getAgencyInitials = (name: string) => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 'A';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export function AgencyCard({
  agency,
}: AgencyCardProps) {
  const navigate = useNavigate();

  const primaryArea =
    agency.serviceAreas?.[0] || 'Nigeria';

  const handleNavigate = () => {
    navigate(
      ROUTES.AGENCY_DETAILS.replace(
        ':slug',
        agency.slug,
      ),
    );
  };

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
      className="group cursor-pointer rounded-3xl border border-white/10 bg-navy-800/50 p-5 transition-all duration-300 hover:border-gold-400/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-400/5 text-lg font-bold text-gold-300 ring-1 ring-gold-400/10">
          {getAgencyInitials(agency.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-heading text-base font-semibold text-cream">
                {agency.name}
              </h3>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/50">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {primaryArea}
                </span>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold-400" />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
        <div>
          <div className="flex items-center gap-2 text-cream">
            <Building2 className="h-4 w-4 text-gold-400" />
            <span className="font-heading text-lg font-bold">
              {agency.listingCount}
            </span>
          </div>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-ink/40">
            Published Listings
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-cream">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="font-heading text-lg font-bold">
              {agency.agentCount}
            </span>
          </div>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-ink/40">
            Active Agents
          </p>
        </div>
      </div>
    </div>
  );
}