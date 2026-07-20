import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { useToast } from '../../contexts/ToastContext';
import { properties } from '../../data/luxoraData';
import { GhostButton, GoldButton } from '../../components/ui/ui';
import { EmptyState } from '../../components/layout/EmptyState';
import { PageLayout } from '../../components/layout';
import { PageHeader } from '../../components/layout/PageHeader';
import { Printer, Download, Share2, Scale, MapPin, BadgeCheck, Check, Minus, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

// Deterministic mock data generator based on property ID string hash
const generateMockData = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    parkingSpaces: (hash % 3) + 2, // 2 to 4
    yearBuilt: 2015 + (hash % 10), // 2015 to 2024
    closingCost: `${(hash % 5) + 3}%`, // 3% to 7%
    propertyTax: `₦${(hash % 500) * 1000 + 200000}/yr`,
    amenities: {
      swimmingPool: hash % 2 === 0,
      gym: hash % 3 !== 0,
      security: true,
      powerBackup: true,
      waterSupply: true,
      internet: hash % 4 !== 0,
      balcony: hash % 2 !== 0,
      garden: hash % 5 === 0,
      parking: true,
    },
    location: {
      city: id.includes('1') ? 'Lagos' : 'Abuja',
      neighborhood: id.includes('1') ? 'Eko Atlantic' : 'Asokoro',
      schools: `${(hash % 4) + 1} km`,
      hospitals: `${(hash % 5) + 2} km`,
      shopping: `${(hash % 3) + 1} km`,
      airport: `${(hash % 20) + 10} km`,
    },
    investment: {
      roi: `${(hash % 8) + 8}%`, // 8% to 15%
      rentalYield: `${(hash % 5) + 5}%`, // 5% to 9%
      marketTrend: hash % 2 === 0 ? 'Rising' : 'Stable',
      appreciation: `+${(hash % 6) + 4}%/yr`,
    }
  };
};

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareList, toggleCompareProperty, isAuthenticated, openScheduleViewingModal, openReportListingModal } = useSession();
  const { showToast } = useToast();
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  type MockedProperty = typeof properties[0] & ReturnType<typeof generateMockData>;
  
  const selectedProps = compareList.map(id => {
    const p = properties.find(prop => prop.id === id);
    if (!p) return null;
    return {
      ...p,
      ...generateMockData(p.id)
    };
  }).filter(Boolean) as MockedProperty[];

  if (selectedProps.length === 0) {
    return (
      <PageLayout className="p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-navy-800/50 p-8 rounded-3xl border border-white/10">
          <EmptyState
            icon={<Scale className="h-12 w-12 text-gold-400" />}
            title="No properties selected"
            description="You haven't added any properties to compare yet. Add up to 4 properties side-by-side to make informed decisions."
            actionLabel="Browse Properties"
            onAction={() => navigate(ROUTES.PROPERTIES)}
          />
        </div>
      </PageLayout>
    );
  }

  // Helper to check if a specific key has different values across all selected properties
  const isDifferent = <T,>(extractor: (p: MockedProperty) => T) => {
    if (selectedProps.length <= 1) return false;
    const firstValue = extractor(selectedProps[0]);
    return selectedProps.some(p => extractor(p) !== firstValue);
  };

  const renderRow = <T,>(label: string, extractor: (p: MockedProperty) => T, format: 'text' | 'boolean' = 'text') => {
    const diff = isDifferent(extractor);
    const muted = highlightDifferences && !diff;
    
    return (
      <div className={`grid grid-cols-[160px_1fr] sm:grid-cols-[200px_repeat(${selectedProps.length},minmax(250px,1fr))] border-b border-white/5 transition-opacity ${muted ? 'opacity-30' : 'opacity-100'}`}>
        <div className="py-4 pr-4 text-sm font-medium text-ink/70 sticky left-0 bg-navy-900 z-10 flex items-center">
          {label}
        </div>
        <div className={`grid grid-cols-${selectedProps.length} sm:grid-cols-none sm:flex w-full`}>
           {selectedProps.map(p => (
             <div key={p.id} className="py-4 px-4 text-sm text-cream border-l border-white/5 min-w-[250px] flex-1 sm:w-auto break-words">
               {format === 'boolean' ? (
                 extractor(p) ? <Check className="h-4 w-4 text-emerald-400" /> : <Minus className="h-4 w-4 text-ink/30" />
               ) : (
                 extractor(p) as React.ReactNode
               )}
             </div>
           ))}
        </div>
      </div>
    );
  };

  const getLowestPrice = () => {
    return [...selectedProps].sort((a, b) => a.priceValue - b.priceValue)[0];
  };

  const getHighestROI = () => {
    return [...selectedProps].sort((a, b) => parseFloat(b.investment.roi) - parseFloat(a.investment.roi))[0];
  };

  return (
    <PageLayout className="pb-20">
      {/* Header Container */}
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <PageHeader 
          title="Compare Properties"
          description={`Comparing ${selectedProps.length} of 4 properties side-by-side to make informed decisions.`}
          action={
            <div className="flex items-center gap-3 flex-wrap">
              <GhostButton size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2"/> Print</GhostButton>
              <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'Export PDF', description: 'PDF export will be available during backend integration.' })}><Download className="h-4 w-4 mr-2"/> Export PDF</GhostButton>
              <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'Share Compare', description: 'Sharing features will be available during backend integration.' })}><Share2 className="h-4 w-4 mr-2"/> Share</GhostButton>
            </div>
          }
        />

        {/* Highlights Bar */}
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-ink/60">Lowest Price:</span>
              <span className="text-gold-400 font-semibold">{getLowestPrice().title}</span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-ink/60">Highest ROI:</span>
              <span className="text-emerald-400 font-semibold">{getHighestROI().title} ({getHighestROI().investment.roi})</span>
            </div>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer shrink-0">
            <span className="text-sm font-medium text-cream">Highlight Differences</span>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highlightDifferences ? 'bg-gold-400' : 'bg-white/10'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highlightDifferences ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            {/* hidden checkbox for accessibility/state if needed, but handled via onClick on div or just using standard checkbox */}
            <input type="checkbox" className="sr-only" checked={highlightDifferences} onChange={(e) => setHighlightDifferences(e.target.checked)} />
          </label>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-navy-800/30">
          <div className="min-w-max w-full">
            
            {/* Properties Header Row */}
            <div className="grid grid-cols-[160px_1fr] sm:grid-cols-[200px_repeat(${selectedProps.length},minmax(250px,1fr))] border-b border-white/10 bg-navy-800/80 sticky top-0 z-20 shadow-sm">
              <div className="py-6 pr-4 sticky left-0 bg-navy-800/80 backdrop-blur-md z-30">
                {/* Empty top-left cell */}
              </div>
              <div className={`grid grid-cols-${selectedProps.length} sm:grid-cols-none sm:flex w-full`}>
                {selectedProps.map(p => (
                  <div key={p.id} className="p-6 border-l border-white/10 min-w-[250px] flex-1 sm:w-auto relative group">
                    <button 
                      onClick={() => toggleCompareProperty(p.id)}
                      className="absolute top-2 right-2 p-1.5 bg-navy-900/80 backdrop-blur-md rounded-full text-ink hover:text-rose-400 hover:bg-rose-500/10 transition-colors z-10"
                      title="Remove from compare"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-white/10">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-2">
                      <MapPin className="h-3 w-3" /> {p.location}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-cream mb-2 line-clamp-1">{p.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.verified.map((v: string) => (
                        <span key={v} className="inline-flex items-center gap-1 rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-medium text-gold-300">
                          <BadgeCheck className="h-3 w-3" /> {v}
                        </span>
                      ))}
                    </div>
                    <div className="text-xl font-heading font-bold text-cream mb-1">{p.price}</div>
                    <div className="text-xs text-gold-400 mb-6">Est. {p.monthly}/mo</div>
                    
                    <div className="space-y-2">
                      <GoldButton className="w-full" size="sm" onClick={() => navigate(ROUTES.PROPERTY_DETAILS.replace(':id', p.id))}>View Details</GoldButton>
                      <div className="grid grid-cols-2 gap-2">
                        <GhostButton className="w-full" size="sm" onClick={() => isAuthenticated ? openScheduleViewingModal(p.id) : navigate(ROUTES.LOGIN)}>Schedule</GhostButton>
                        <GhostButton className="w-full" size="sm" onClick={() => isAuthenticated ? showToast({ type: 'info', title: 'Make Offer', description: 'Offer functionality will be available during backend integration.' }) : navigate(ROUTES.LOGIN)}>Offer</GhostButton>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => openReportListingModal(p.id)} 
                      className="w-full mt-3 text-[10px] text-ink/40 hover:text-rose-400 transition-colors inline-flex items-center justify-center gap-1 uppercase font-semibold tracking-wider"
                    >
                      <AlertTriangle className="h-3 w-3" /> Report
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-navy-900/50 py-3 px-6 text-xs font-bold tracking-wider text-gold-400 uppercase sticky left-0 z-10 border-b border-white/5">
              Basic Information
            </div>
            {renderRow('Property Type', p => p.type)}
            {renderRow('Property Size', p => p.area)}
            {renderRow('Bedrooms', p => p.beds)}
            {renderRow('Bathrooms', p => p.baths)}
            {renderRow('Parking Spaces', p => p.parkingSpaces)}
            {renderRow('Year Built', p => p.yearBuilt)}

            {/* Pricing */}
            <div className="bg-navy-900/50 py-3 px-6 text-xs font-bold tracking-wider text-gold-400 uppercase sticky left-0 z-10 border-b border-t border-white/5">
              Pricing Details
            </div>
            {renderRow('Purchase Price', p => p.price)}
            {renderRow('Monthly Mortgage', p => p.monthly)}
            {renderRow('Est. Closing Cost', p => p.closingCost)}
            {renderRow('Property Tax (Est.)', p => p.propertyTax)}

            {/* Amenities */}
            <div className="bg-navy-900/50 py-3 px-6 text-xs font-bold tracking-wider text-gold-400 uppercase sticky left-0 z-10 border-b border-t border-white/5">
              Amenities
            </div>
            {renderRow('Swimming Pool', p => p.amenities.swimmingPool, 'boolean')}
            {renderRow('Gym / Fitness', p => p.amenities.gym, 'boolean')}
            {renderRow('24/7 Security', p => p.amenities.security, 'boolean')}
            {renderRow('Power Backup', p => p.amenities.powerBackup, 'boolean')}
            {renderRow('Water Supply', p => p.amenities.waterSupply, 'boolean')}
            {renderRow('High-Speed Internet', p => p.amenities.internet, 'boolean')}
            {renderRow('Balcony / Terrace', p => p.amenities.balcony, 'boolean')}
            {renderRow('Garden', p => p.amenities.garden, 'boolean')}
            {renderRow('Dedicated Parking', p => p.amenities.parking, 'boolean')}

            {/* Location */}
            <div className="bg-navy-900/50 py-3 px-6 text-xs font-bold tracking-wider text-gold-400 uppercase sticky left-0 z-10 border-b border-t border-white/5">
              Location Insights
            </div>
            {renderRow('City', p => p.location.city)}
            {renderRow('Neighborhood', p => p.location.neighborhood)}
            {renderRow('Nearby Schools', p => p.location.schools)}
            {renderRow('Hospitals', p => p.location.hospitals)}
            {renderRow('Shopping Centers', p => p.location.shopping)}
            {renderRow('Airport Distance', p => p.location.airport)}

            {/* Investment */}
            <div className="bg-navy-900/50 py-3 px-6 text-xs font-bold tracking-wider text-gold-400 uppercase sticky left-0 z-10 border-b border-t border-white/5">
              Investment Potential
            </div>
            {renderRow('Estimated ROI', p => p.investment.roi)}
            {renderRow('Rental Yield', p => p.investment.rentalYield)}
            {renderRow('Market Trend', p => p.investment.marketTrend)}
            {renderRow('Appreciation Forecast', p => p.investment.appreciation)}

            {/* Agent Information */}
            <div className="bg-navy-900/50 py-3 px-6 text-xs font-bold tracking-wider text-gold-400 uppercase sticky left-0 z-10 border-b border-t border-white/5">
              Agent Information
            </div>
            <div className={`grid grid-cols-[160px_1fr] sm:grid-cols-[200px_repeat(${selectedProps.length},minmax(250px,1fr))] border-b border-white/5`}>
              <div className="py-4 pr-4 text-sm font-medium text-ink/70 sticky left-0 bg-navy-900 z-10 flex items-center">
                Contact Person
              </div>
              <div className={`grid grid-cols-${selectedProps.length} sm:grid-cols-none sm:flex w-full`}>
                {selectedProps.map(p => (
                  <div key={p.id} className="py-4 px-4 border-l border-white/5 min-w-[250px] flex-1 sm:w-auto">
                    <div className="flex items-center gap-3">
                      <img src={p.agent.avatar} alt={p.agent.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <div className="text-sm font-medium text-cream">{p.agent.name}</div>
                        <div className="text-[10px] text-ink/60">{p.agent.agency}</div>
                      </div>
                    </div>
                    <GhostButton className="w-full mt-4" size="sm" onClick={() => isAuthenticated ? showToast({ type: 'info', title: 'Agent Contacted', description: 'Contact modal opened.' }) : navigate(ROUTES.LOGIN)}>Contact Agent</GhostButton>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
