import { useState } from 'react';
import { Calendar, Phone, Mail, AlertTriangle, Heart, Scale, Loader2, MessageCircle } from 'lucide-react';
import type { Property } from '../../types';
import { GoldButton, GhostButton } from '../ui/ui';
import { useSession } from '../../contexts/SessionContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { agentNameToSlug, agencyNameToSlug } from '../../utils/agency';

interface PropertySidebarProps {
  property: Property;
  onContactClick?: () => void;
}

export function PropertySidebar({ property, onContactClick }: PropertySidebarProps) {
  const { 
    toggleCompareProperty,
    openScheduleViewingModal, 
    openReportListingModal 
  } = useSession();
  
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const navigate = useNavigate();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saved = isFavorite(property.id);

  const executeWithLoading = (actionKey: string, callback: () => void) => {
    setLoadingAction(actionKey);
    setTimeout(() => {
      setLoadingAction(null);
      callback();
    }, 400);
  };

  const handleSaveClick = () => {
    executeWithLoading('save', () => {
      toggleFavorite(property.id);
    });
  };

  const handleCompareClick = () => {
    executeWithLoading('compare', () => {
      const result = toggleCompareProperty(property.id);
      if (result === 'limit_reached') {
        setToastMessage('You can compare up to 4 properties.');
      } else if (result === 'added') {
        setToastMessage('Added to Compare');
      } else if (result === 'exists') {
        setToastMessage('Already in Compare');
      }
      
      if (result) {
        setTimeout(() => setToastMessage(null), 3000);
      }
    });
  };

  const handleContactClick = () => {
    if (onContactClick) {
      executeWithLoading('contact', onContactClick);
    }
  };

  return (
    <div className="relative lg:sticky lg:top-24 space-y-6 pb-6">
      {/* Agent Card */}
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        <h3 className="font-heading text-lg font-semibold text-cream mb-6">Listed By</h3>
        <div className="flex items-start gap-4 mb-8">
          <button 
            onClick={() => navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(property.agent.name)))}
            className="shrink-0 transition-transform hover:scale-105 focus:outline-none"
            aria-label={`View ${property.agent.name}'s profile`}
          >
            <img src={property.agent.avatar} alt={property.agent.name} className="h-16 w-16 rounded-full object-cover border-2 border-gold-400/30 hover:border-gold-400/80 transition-colors" />
          </button>
          <div className="flex flex-col">
            <button 
              onClick={() => navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(property.agent.name)))}
              className="font-semibold text-cream hover:text-gold-400 transition-colors focus:outline-none text-left mb-0.5"
            >
              {property.agent.name}
            </button>
            {property.agent.verified && (
              <span className="text-[9px] text-gold-400/90 font-medium tracking-wide flex items-center uppercase mb-2">
                ✓ Verified Agent, Trusted by Luxora
              </span>
            )}
            <button 
              onClick={() => navigate(ROUTES.AGENCY_DETAILS.replace(':slug', agencyNameToSlug(property.agent.agency)))}
              className="text-sm text-ink/50 mb-2 hover:text-gold-300 transition-colors focus:outline-none text-left block w-full"
            >
              {property.agent.agency}
            </button>
            {property.agent.phone && (
              <div className="text-xs text-cream/70 flex items-center gap-1.5 mb-1">
                <Phone className="h-3.5 w-3.5 text-gold-400/70" /> {property.agent.phone}
              </div>
            )}
            {property.agent.email && (
              <div className="text-xs text-cream/70 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gold-400/70" /> {property.agent.email}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <GoldButton 
            size="lg" 
            className="w-full justify-center text-sm h-12" 
            disabled={loadingAction === 'call'}
            onClick={() => executeWithLoading('call', () => window.location.href = `tel:${property.agent.phone}`)}
          >
            {loadingAction === 'call' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />} Call Agent
          </GoldButton>
          <div className="grid grid-cols-2 gap-3">
            <GhostButton 
              size="sm" 
              className="w-full justify-center text-xs h-10 border-white/10 hover:border-gold-400/50 hover:text-gold-400 hover:bg-gold-400/5 transition-all" 
              disabled={loadingAction === 'contact'}
              onClick={handleContactClick}
            >
              {loadingAction === 'contact' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Mail className="h-3.5 w-3.5 mr-1.5" />} Message
            </GhostButton>
            <GhostButton 
              size="sm" 
              className="w-full justify-center text-xs h-10 border-white/10 hover:border-gold-400/50 hover:text-gold-400 hover:bg-gold-400/5 transition-all" 
              disabled={loadingAction === 'whatsapp'}
              onClick={() => executeWithLoading('whatsapp', () => window.open(`https://wa.me/${property.agent.phone?.replace(/[^0-9]/g, '')}`, '_blank'))}
            >
              {loadingAction === 'whatsapp' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <MessageCircle className="h-3.5 w-3.5 mr-1.5" />} WhatsApp
            </GhostButton>
          </div>
        </div>

        {/* Save and Compare Properties */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/5">
          <GhostButton 
            size="sm" 
            className={`w-full justify-center text-xs h-10 transition-colors ${saved ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'}`}
            disabled={loadingAction === 'save'}
            onClick={handleSaveClick}
            aria-label={saved ? "Unsave property" : "Save property"}
          >
            {loadingAction === 'save' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Heart className={`h-3.5 w-3.5 mr-1.5 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />}
            {saved ? 'Saved' : 'Save'}
          </GhostButton>
          <GhostButton 
            size="sm" 
            className="w-full justify-center text-xs h-10 border-white/10 hover:bg-gold-400/10 hover:text-gold-400 hover:border-gold-400/20 transition-colors" 
            disabled={loadingAction === 'compare'}
            onClick={handleCompareClick}
            aria-label="Add to compare"
          >
            {loadingAction === 'compare' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Scale className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />} Compare
          </GhostButton>
        </div>
      </div>

      {/* Viewing Card */}
      <div className="rounded-3xl border border-white/10 bg-gold-400/5 p-6 md:p-8 backdrop-blur-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 mb-5">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-cream mb-2">Schedule a Viewing</h3>
        <p className="text-sm text-ink/60 mb-6 leading-relaxed">Book an in-person or virtual tour with the listing agent.</p>
        <GoldButton 
          size="lg" 
          className="w-full justify-center text-sm h-12" 
          disabled={loadingAction === 'tour'}
          onClick={() => executeWithLoading('tour', () => openScheduleViewingModal(property.id))}
        >
          {loadingAction === 'tour' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Request Tour
        </GoldButton>
      </div>
      
      <div className="text-center pb-2">
        <button 
          onClick={() => openReportListingModal(property.id)} 
          className="text-xs text-ink/40 hover:text-rose-400 transition-colors inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm px-2 py-1"
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Report this listing
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-navy-900 text-cream border border-gold-400/30 px-6 py-3 rounded-full text-sm font-medium shadow-xl shadow-navy-900/50 whitespace-nowrap animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
