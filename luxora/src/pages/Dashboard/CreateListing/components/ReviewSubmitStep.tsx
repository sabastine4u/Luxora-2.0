import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
}

export function ReviewSubmitStep({ draft }: Props) {
  const missingFields: string[] = [];

  if (!draft.title) missingFields.push('Property Title');
  if (!draft.propertyType) missingFields.push('Property Type');
  if (!draft.transactionType) missingFields.push('Transaction Type');
  if (!draft.priceValue) missingFields.push('Price / Rent Amount');
  if (!draft.city) missingFields.push('City');
  if (!draft.address) missingFields.push('Street Address');
  if (draft.images.length === 0) missingFields.push('Property Images (at least 1)');
  if (!draft.ownerReference) missingFields.push('Owner Reference');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-white">Review & Submit</h2>
        <p className="text-ink/70 mt-1">Review your listing details before submitting for approval.</p>
      </div>

      {missingFields.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Missing Required Information
          </div>
          <ul className="list-disc list-inside text-sm text-red-300/80 space-y-1 ml-1">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Listing Preview Summary</h3>
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
              <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Price</span>
              <span className="text-ink font-medium">{draft.price || '—'}</span>
            </div>
            <div>
              <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">Location</span>
              <span className="text-ink font-medium">
                {[draft.address, draft.city, draft.state].filter(Boolean).join(', ') || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-navy-900/50">
          <h3 className="text-sm font-semibold text-white mb-3">Internal Routing</h3>
          <div className="flex items-center gap-2 text-sm text-ink/70">
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            This listing will be routed to the Admin Verification Queue. It will not be visible publicly until approved.
          </div>
        </div>
      </div>
    </div>
  );
}
