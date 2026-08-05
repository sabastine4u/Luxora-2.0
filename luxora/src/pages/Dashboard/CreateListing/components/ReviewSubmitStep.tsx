import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
}

export function ReviewSubmitStep({ draft }: Props) {
  const validation = {
    basic: Boolean(draft.title && draft.propertyType && draft.transactionType && draft.description),
    location: Boolean(draft.city && draft.address && draft.state && draft.country),
    details: Boolean(draft.bedrooms !== '' && draft.bathrooms !== '' && draft.propertySize),
    pricing: Boolean(draft.priceValue !== ''),
    media: draft.images.length > 0,
    ownership: draft.listingSource === 'Assigned Property' || 
               (Boolean(draft.ownerName || draft.organizationName) && draft.ownershipVerification.length > 0)
  };

  const completedSteps = Object.values(validation).filter(Boolean).length;
  const totalSteps = Object.keys(validation).length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  let qualityScore = completionPercentage;
  if (draft.images.length >= 5) qualityScore = Math.min(100, qualityScore + 10);
  if (draft.videoUrl || draft.virtualTourUrl) qualityScore = Math.min(100, qualityScore + 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Review & Publish</h2>
        <p className="text-ink/70 mt-1">Review your listing details before submitting for approval.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Property Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Title</span>
                  <span className="text-ink font-medium">{draft.title || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Type</span>
                  <span className="text-ink font-medium">{draft.propertyType || '—'} ({draft.transactionType || '—'})</span>
                </div>
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Location</span>
                  <span className="text-ink font-medium">
                    {[draft.estateName, draft.address, draft.city].filter(Boolean).join(', ') || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Features</span>
                  <span className="text-ink font-medium">
                    {draft.bedrooms ? `${draft.bedrooms} Beds, ` : ''}
                    {draft.bathrooms ? `${draft.bathrooms} Baths, ` : ''}
                    {draft.toilets ? `${draft.toilets} Toilets` : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Asking Price</span>
                  <span className="text-white font-semibold text-lg">{draft.price || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Transaction</span>
                  <span className="text-ink font-medium capitalize">{draft.transactionType || '—'}</span>
                </div>
                {draft.transactionType === 'rent' && (
                  <>
                    <div>
                      <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Service Charge</span>
                      <span className="text-ink font-medium">{draft.serviceCharge ? `₦${draft.serviceCharge.toLocaleString()}` : '—'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Agency Fee</span>
                      <span className="text-ink font-medium">{draft.agencyFee ? `₦${draft.agencyFee.toLocaleString()}` : '—'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ownership Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Source</span>
                  <span className="text-ink font-medium">{draft.listingSource || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Legal Owner / Organization</span>
                  <span className="text-ink font-medium">
                    {draft.ownerName || draft.organizationName || 'Internal Assignment'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Listing Quality</h3>
            
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-heading font-bold text-gold-400">{qualityScore}</span>
              <span className="text-ink/50 mb-1">/ 100</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-ink/70 uppercase tracking-wider">Validation Checklist</h4>
              
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${validation.basic ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.basic ? '✅' : '❌'} Basic Information
                </div>
                <div className={`flex items-center gap-2 text-sm ${validation.location ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.location ? '✅' : '❌'} Location Details
                </div>
                <div className={`flex items-center gap-2 text-sm ${validation.details ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.details ? '✅' : '❌'} Property Details
                </div>
                <div className={`flex items-center gap-2 text-sm ${validation.pricing ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.pricing ? '✅' : '❌'} Pricing Details
                </div>
                <div className={`flex items-center gap-2 text-sm ${validation.media ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.media ? '✅' : '❌'} Media & Images
                </div>
                <div className={`flex items-center gap-2 text-sm ${validation.ownership ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.ownership ? '✅' : '❌'} Ownership Status
                </div>
              </div>
            </div>
            
            {completionPercentage < 100 && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-300 leading-relaxed">
                  Please complete all required fields marked with ❌ before submitting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

