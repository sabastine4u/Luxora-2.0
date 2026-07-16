import { SlidersHorizontal, Check, X } from 'lucide-react';
import { useEffect } from 'react';

interface AdvancedFilterPanelProps {
  status: string;
  setStatus: (v: string) => void;
  listingTier: string;
  setListingTier: (v: string) => void;
  furnishing: string;
  setFurnishing: (v: string) => void;
  availability: string;
  setAvailability: (v: string) => void;
  paymentPlan: string[];
  setPaymentPlan: (v: string[]) => void;
  amenities: string[];
  setAmenities: (v: string[]) => void;
  mortgageSupport: boolean;
  setMortgageSupport: (v: boolean) => void;
  verificationLevel: string;
  setVerificationLevel: (v: string) => void;
  minArea: number;
  setMinArea: (v: number) => void;
  maxArea: number;
  setMaxArea: (v: number) => void;
  beds: string;
  setBeds: (v: string) => void;
  baths: string;
  setBaths: (v: string) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = ['Any', 'Available', 'Under Offer', 'Sold', 'Rented'];
const TIER_OPTIONS = ['Any', 'Basic', 'Plus', 'Pro'];
const FURNISHING_OPTIONS = ['Any', 'Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
const AVAILABILITY_OPTIONS = ['Any', 'Immediate', 'Negotiable'];
const PAYMENT_OPTIONS = ['Mortgage Available', 'Monthly Payment', 'Installment Plan', '6 Months', '12 Months', '24 Months', '36 Months'];
const VERIFICATION_OPTIONS = ['Any', 'Documents', 'Inspection', 'Premium', 'Agent'];
const AMENITIES = [
  'Private Pool', 'Helipad Access', '24/7 Concierge', 'Smart Home Integration', 
  'Private Elevator', 'Wine Cellar', 'Staff Quarters', 'Ocean View', 'Double Height Ceilings'
];
const NUMBERS = ['Any', '1', '2', '3', '4', '5'];

export function AdvancedFilterPanel({ onClose, ...props }: AdvancedFilterPanelProps) {
  const toggleAmenity = (amenity: string) => {
    if (props.amenities.includes(amenity)) {
      props.setAmenities(props.amenities.filter(a => a !== amenity));
    } else {
      props.setAmenities([...props.amenities, amenity]);
    }
  };

  const togglePaymentPlan = (plan: string) => {
    if (props.paymentPlan.includes(plan)) {
      props.setPaymentPlan(props.paymentPlan.filter(p => p !== plan));
    } else {
      props.setPaymentPlan([...props.paymentPlan, plan]);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleResetAll = () => {
    props.setStatus('Any');
    props.setListingTier('Any');
    props.setFurnishing('Any');
    props.setAvailability('Any');
    props.setPaymentPlan([]);
    props.setAmenities([]);
    props.setMortgageSupport(false);
    props.setVerificationLevel('Any');
    props.setMinArea(0);
    props.setMaxArea(10000);
    props.setBeds('Any');
    props.setBaths('Any');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Sheet / Modal */}
      <div className="relative flex w-full max-w-5xl flex-col bg-navy-950 shadow-2xl transition-transform duration-300 animate-slide-up sm:rounded-3xl border border-white/10 h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl">
        
        {/* Sticky Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-6 sm:px-8">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-cream">
            <SlidersHorizontal className="h-5 w-5 text-gold-400" />
            Advanced Filters
          </h3>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-ink/50 hover:bg-white/5 hover:text-cream transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Structure */}
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Listing Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => props.setStatus(s)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.status === s ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Listing Tier</label>
            <div className="flex flex-wrap gap-2">
              {TIER_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => props.setListingTier(t)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.listingTier === t ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Verification Level</label>
            <div className="flex flex-wrap gap-2">
              {VERIFICATION_OPTIONS.map(v => (
                <button
                  key={v}
                  onClick={() => props.setVerificationLevel(v)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.verificationLevel === v ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Furnishing</label>
            <div className="flex flex-wrap gap-2">
              {FURNISHING_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => props.setFurnishing(f)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.furnishing === f ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Availability</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => props.setAvailability(a)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.availability === a ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Space & Layout */}
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Bedrooms</label>
            <div className="flex flex-wrap gap-2">
              {NUMBERS.map(n => (
                <button
                  key={n}
                  onClick={() => props.setBeds(n)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.beds === n ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {n === 'Any' ? n : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Bathrooms</label>
            <div className="flex flex-wrap gap-2">
              {NUMBERS.map(n => (
                <button
                  key={n}
                  onClick={() => props.setBaths(n)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${props.baths === n ? 'border-gold-400 bg-gold-400/10 text-gold-400 font-medium' : 'border-white/10 text-cream hover:border-white/20 hover:bg-white/5'}`}
                >
                  {n === 'Any' ? n : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Area (sqm)</label>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                placeholder="Min Area"
                value={props.minArea > 0 ? props.minArea : ''}
                onChange={e => props.setMinArea(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none"
              />
              <span className="text-ink/50">-</span>
              <input 
                type="number" 
                placeholder="Max Area"
                value={props.maxArea < 10000 ? props.maxArea : ''}
                onChange={e => props.setMaxArea(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Payment Options</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors col-span-1 sm:col-span-2">
                <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${props.mortgageSupport ? 'border-gold-400 bg-gold-400 text-navy-950' : 'border-white/20'}`}>
                  {props.mortgageSupport && <Check className="h-3 w-3" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={props.mortgageSupport}
                  onChange={(e) => props.setMortgageSupport(e.target.checked)}
                />
                <span className="text-xs text-cream leading-tight">Mortgage Eligible</span>
              </label>

              {PAYMENT_OPTIONS.map(plan => {
                if (plan === 'Mortgage Available') return null;
                const active = props.paymentPlan.includes(plan);
                return (
                  <label key={plan} className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${active ? 'border-gold-400 bg-gold-400 text-navy-950' : 'border-white/20'}`}>
                      {active && <Check className="h-3 w-3" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={active}
                      onChange={() => togglePaymentPlan(plan)}
                    />
                    <span className="text-xs text-cream leading-tight">{plan}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-ink/70">Luxury Features & Amenities</label>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map(amenity => {
                const active = props.amenities.includes(amenity);
                return (
                  <label key={amenity} className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${active ? 'border-gold-400 bg-gold-400 text-navy-950' : 'border-white/20'}`}>
                      {active && <Check className="h-3 w-3" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={active}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span className="text-xs text-cream leading-tight">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
          </div>
        </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-navy-950 p-4 sm:px-8 sm:py-6 rounded-b-3xl">
          <button 
            onClick={handleResetAll} 
            className="text-sm font-semibold text-ink/60 hover:text-cream underline decoration-ink/30 underline-offset-4 transition-colors focus:outline-none"
          >
            Reset All
          </button>
          <button 
            onClick={onClose} 
            className="rounded-xl bg-gold-400 px-8 py-3 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-navy-950 active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
