import { X } from 'lucide-react';

interface PropertyFilterChipsProps {
  search?: string;
  setSearch?: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  listingType?: string;
  setListingType?: (v: string) => void;
  budgetString?: string;
  setBudgetString?: (v: string) => void;
  minPriceM?: number;
  setMinPriceM?: (v: number) => void;
  maxPriceM?: number;
  setMaxPriceM?: (v: number) => void;
  beds?: string;
  setBeds?: (v: string) => void;
  baths?: string;
  setBaths?: (v: string) => void;
  status?: string;
  setStatus?: (v: string) => void;
  amenities?: string[];
  setAmenities?: (v: string[]) => void;
  mortgageSupport?: boolean;
  setMortgageSupport?: (v: boolean) => void;
  listingTier?: string;
  setListingTier?: (v: string) => void;
  furnishing?: string;
  setFurnishing?: (v: string) => void;
  availability?: string;
  setAvailability?: (v: string) => void;
  paymentPlan?: string[];
  setPaymentPlan?: (v: string[]) => void;
  verificationLevel?: string;
  setVerificationLevel?: (v: string) => void;
  minArea?: number;
  setMinArea?: (v: number) => void;
  maxArea?: number;
  setMaxArea?: (v: number) => void;
  resetFilters: () => void;
}

export function PropertyFilterChips(props: PropertyFilterChipsProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (props.search) {
    chips.push({ label: `"${props.search}"`, onRemove: () => props.setSearch?.('') });
  }
  
  if (props.listingType && props.listingType !== 'Any') {
    chips.push({ label: props.listingType.charAt(0).toUpperCase() + props.listingType.slice(1), onRemove: () => props.setListingType?.('Any') });
  }

  if (props.type && props.type !== 'Any Type') {
    chips.push({ label: props.type, onRemove: () => props.setType('Any Type') });
  }
  if (props.location && props.location !== 'Any Location') {
    chips.push({ label: props.location, onRemove: () => props.setLocation('Any Location') });
  }
  if (props.budgetString && props.budgetString !== 'Any Budget') {
    chips.push({ label: props.budgetString, onRemove: () => props.setBudgetString!('Any Budget') });
  }
  if (props.minPriceM !== undefined && props.maxPriceM !== undefined) {
    if (props.minPriceM > 0 || props.maxPriceM < 1000) {
      chips.push({
        label: `₦${props.minPriceM}M – ₦${props.maxPriceM}${props.maxPriceM === 1000 ? 'M+' : 'M'}`,
        onRemove: () => {
          props.setMinPriceM!(0);
          props.setMaxPriceM!(1000);
        }
      });
    }
  }
  if (props.beds && props.beds !== 'Any') {
    chips.push({ label: `${props.beds}+ Beds`, onRemove: () => props.setBeds!('Any') });
  }
  if (props.baths && props.baths !== 'Any') {
    chips.push({ label: `${props.baths}+ Baths`, onRemove: () => props.setBaths!('Any') });
  }
  if (props.status && props.status !== 'Any') {
    chips.push({ label: props.status, onRemove: () => props.setStatus!('Any') });
  }
  if (props.listingTier && props.listingTier !== 'Any') {
    chips.push({ label: props.listingTier, onRemove: () => props.setListingTier!('Any') });
  }
  if (props.furnishing && props.furnishing !== 'Any') {
    chips.push({ label: props.furnishing, onRemove: () => props.setFurnishing!('Any') });
  }
  if (props.availability && props.availability !== 'Any') {
    chips.push({ label: props.availability, onRemove: () => props.setAvailability!('Any') });
  }
  if (props.verificationLevel && props.verificationLevel !== 'Any') {
    chips.push({ label: props.verificationLevel, onRemove: () => props.setVerificationLevel!('Any') });
  }
  if (props.mortgageSupport) {
    chips.push({ label: 'Mortgage Eligible', onRemove: () => props.setMortgageSupport!(false) });
  }
  if (props.minArea !== undefined && props.maxArea !== undefined) {
    if (props.minArea > 0 || props.maxArea < 10000) {
      chips.push({
        label: `${props.minArea} - ${props.maxArea === 10000 ? '10k+' : props.maxArea} sqm`,
        onRemove: () => {
          props.setMinArea!(0);
          props.setMaxArea!(10000);
        }
      });
    }
  }
  if (props.amenities && props.amenities.length > 0) {
    props.amenities.forEach(amenity => {
      chips.push({
        label: amenity,
        onRemove: () => {
          props.setAmenities!(props.amenities!.filter(a => a !== amenity));
        }
      });
    });
  }
  if (props.paymentPlan && props.paymentPlan.length > 0) {
    props.paymentPlan.forEach(plan => {
      chips.push({
        label: plan,
        onRemove: () => {
          props.setPaymentPlan!(props.paymentPlan!.filter(p => p !== plan));
        }
      });
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
      {chips.map(chip => (
        <span key={chip.label} className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1 text-xs font-medium text-gold-200 backdrop-blur-md">
          {chip.label}
          <button onClick={chip.onRemove} className="hover:text-gold-400 focus:outline-none rounded-full p-0.5 hover:bg-gold-400/20 transition-colors">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button 
        onClick={props.resetFilters}
        className="text-xs font-semibold text-ink/50 hover:text-cream ml-2 underline decoration-ink/30 underline-offset-4 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
