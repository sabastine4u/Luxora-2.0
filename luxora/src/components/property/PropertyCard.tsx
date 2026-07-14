import { useState, memo } from 'react';
import { Bed, Bath, Maximize, Heart, MapPin, BadgeCheck, Scale, AlertTriangle, Share2, Car, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type properties } from '../../data/luxoraData';
import { useSession } from '../../contexts/SessionContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import { ROUTES } from '../../constants/routes';
import { agentNameToSlug, agencyNameToSlug } from '../../utils/agency';

export interface PropertyCardProps {
  property: (typeof properties)[number];
  variant?: 'grid' | 'list';
}

const formatVerification = (v: string) => {
  switch(v.toLowerCase()) {
    case 'documents': return 'Documents Verified';
    case 'inspection': return 'Physical Inspection';
    case 'premium': return 'Premium Verified';
    case 'agent': return 'Agent Verified';
    default: return v;
  }
};

export const PropertyCard = memo(function PropertyCard({ property: p, variant = 'grid' }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isCompared, toggleCompareProperty, openReportListingModal } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();

  const saved = isFavorite(p.id);
  const compared = isCompared(p.id);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(p.id);
    showToast(saved ? 'Removed from Saved' : 'Added to Saved');
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = toggleCompareProperty(p.id);
    if (result === 'limit_reached') {
      showToast('You can compare up to 4 properties.');
    } else if (result === 'added') {
      showToast('Added to Compare');
    } else if (result === 'exists') {
      showToast('Already in Compare');
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/property/${p.id}`);
      showToast('Link copied to clipboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = () => {
    navigate(ROUTES.PROPERTY_DETAILS.replace(':id', p.id));
  };

  const isList = variant === 'list';

  return (
    <div 
      onClick={handleViewDetails}
      className={`group relative flex overflow-hidden cursor-pointer rounded-3xl border border-white/10 bg-navy-800/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] h-full ${isList ? 'flex-col sm:flex-row' : 'flex-col'}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden shrink-0 ${isList ? 'h-64 sm:h-auto sm:w-72 xl:w-80' : 'aspect-[4/3] w-full'}`}>
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Tag */}
        {p.tag && (
          <div className="absolute left-4 top-4 rounded-full border border-gold-400/30 bg-navy-900/80 px-3 py-1 text-xs font-semibold text-gold-200 backdrop-blur-md">
            {p.tag}
          </div>
        )}

        {/* Desktop Quick Actions */}
        <div className="absolute right-4 top-4 hidden md:flex flex-col gap-2 translate-x-8 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          <button
            onClick={handleSaveClick}
            title={saved ? "Remove from saved" : "Save property"}
            aria-label={saved ? "Remove from saved" : "Save property"}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              saved
                ? 'bg-gold-400 text-navy-900 shadow-lux'
                : 'bg-navy-900/80 text-cream hover:bg-gold-400/20 hover:text-gold-300 border border-white/10 hover:border-gold-400/30'
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleCompareClick}
            title={compared ? "Remove from compare" : "Add to compare"}
            aria-label={compared ? "Remove from compare" : "Add to compare"}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              compared
                ? 'bg-gold-400 text-navy-900 shadow-lux'
                : 'bg-navy-900/80 text-cream hover:bg-gold-400/20 hover:text-gold-300 border border-white/10 hover:border-gold-400/30'
            }`}
          >
            <Scale className="h-4 w-4" />
          </button>

          <button
            onClick={handleShareClick}
            title="Share property"
            aria-label="Share property"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900/80 text-cream backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-gold-400/20 hover:text-gold-300 border border-white/10 hover:border-gold-400/30"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Verified badges */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 items-start">
          {p.verified.map((v) => (
            <span key={v} className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-navy-900/80 px-2.5 py-1 text-[10px] font-medium text-gold-100 backdrop-blur-md shadow-sm">
              <BadgeCheck className="h-3 w-3 text-gold-400" /> {formatVerification(v)}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-6 sm:p-7">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gold-300/80 uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5" /> {p.location}
        </div>
        <h3 className="font-heading text-xl font-semibold text-cream transition-colors duration-300 group-hover:text-gold-300 leading-snug">
          {p.title}
        </h3>

        {/* Specs & Intelligence Metrics */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-ink/70">
          <span className="flex items-center gap-1.5" title="Bedrooms"><Bed className="h-4 w-4 text-ink/50" /> {p.beds}</span>
          <span className="flex items-center gap-1.5" title="Bathrooms"><Bath className="h-4 w-4 text-ink/50" /> {p.baths}</span>
          <span className="flex items-center gap-1.5" title="Area"><Maximize className="h-4 w-4 text-ink/50" /> {p.area}</span>
          {p.parkingSpaces !== undefined && (
            <span className="flex items-center gap-1.5" title="Parking Spaces"><Car className="h-4 w-4 text-ink/50" /> {p.parkingSpaces}</span>
          )}
          {p.yearBuilt !== undefined && (
            <span className="flex items-center gap-1.5" title="Year Built"><Calendar className="h-4 w-4 text-ink/50" /> {p.yearBuilt}</span>
          )}
          {p.walkScore !== undefined && (
            <span className="flex items-center gap-1.5" title="Walk Score"><Activity className="h-4 w-4 text-ink/50" /> {p.walkScore}</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-5 mt-6">
          <div>
            <div className="font-heading text-2xl font-bold text-cream tracking-tight group-hover:text-gold-400 transition-colors duration-300">{p.price}</div>
            <div className="text-sm font-medium text-ink/50 mt-0.5 group-hover:text-gold-300/80 transition-colors duration-300">From {p.monthly}/month</div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
            aria-label={`View details for ${p.title}`}
            className="rounded-full bg-gold-400/10 border border-gold-400/30 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-all duration-300 hover:bg-gold-400 hover:text-navy-900 hover:shadow-lux"
          >
            View Details
          </button>
        </div>

        {/* Agent */}
        <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(p.agent.name)));
            }}
            className="relative shrink-0 transition-transform duration-300 hover:scale-105 focus:outline-none"
            aria-label={`View ${p.agent.name}'s profile`}
          >
            <img src={p.agent.avatar} alt={p.agent.name} className="h-11 w-11 rounded-full object-cover border-2 border-transparent transition-colors duration-300 group-hover:border-gold-400/50" />
            {p.agent.verified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-navy-900 p-0.5 border border-white/10" title="Verified Agent">
                <BadgeCheck className="h-3.5 w-3.5 text-gold-400" />
              </div>
            )}
          </button>
          <div className="min-w-0 flex-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(p.agent.name)));
              }}
              className="block w-full text-left truncate text-sm font-medium text-cream hover:text-gold-400 transition-colors focus:outline-none"
            >
              {p.agent.name}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.AGENCY_DETAILS.replace(':slug', agencyNameToSlug(p.agent.agency)));
              }}
              className="block w-full text-left truncate text-xs text-ink/50 font-medium tracking-wide mt-0.5 hover:text-gold-300/80 transition-colors focus:outline-none"
            >
              {p.agent.agency}
            </button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); openReportListingModal(p.id); }}
            className="text-ink/30 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-400/10"
            title="Report Listing"
            aria-label="Report Listing"
          >
            <AlertTriangle className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-navy-900/95 text-cream border border-gold-400/30 px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl shadow-black/50 whitespace-nowrap animate-in fade-in zoom-in duration-300 backdrop-blur-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
});
