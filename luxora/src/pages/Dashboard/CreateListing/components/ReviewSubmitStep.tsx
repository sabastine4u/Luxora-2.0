import { useSearchParams } from 'react-router-dom';

import { useSession } from '../../../../contexts/SessionContext';
import { ROLES } from '../../../../constants/roles';
import type { ListingDraft } from '../types';

interface Props {
  draft: ListingDraft;
}

export function ReviewSubmitStep({
  draft,
}: Props) {
  const { user } = useSession();

  const [searchParams] =
    useSearchParams();

  // An editId means the Agent is updating an existing
  // property rather than creating a brand-new one.
  const editId =
    searchParams.get('editId');

  const isEditMode =
    Boolean(editId);

  const isOwner =
    user?.role === ROLES.OWNER;

  const isAgent =
    user?.role === ROLES.AGENT;

  // Existing server-side images count as completed media
  // during edit mode even when no new browser files were added.
  const mediaComplete = isEditMode
    ? true
    : draft.images.length > 0;

  // Existing property ownership/assignment information
  // is already stored on the Property during edit mode.
  const ownershipComplete =
    isEditMode
      ? true
      : draft.listingSource ===
          'Assigned Property'
        ? true
        : isOwner
          ? draft.ownershipVerification
              .length > 0
          : Boolean(
                draft.ownerName ||
                  draft.organizationName,
              ) &&
            draft.ownershipVerification
              .length > 0;

  const validation = {
    basic: Boolean(
      draft.title &&
        draft.propertyType &&
        draft.transactionType &&
        draft.description,
    ),

    location: Boolean(
      draft.city &&
        draft.address &&
        draft.state &&
        draft.country,
    ),

    details: Boolean(
      draft.bedrooms !== '' &&
        draft.bathrooms !== '' &&
        draft.propertySize,
    ),

    pricing: Boolean(
      draft.priceValue !== '',
    ),

    media: mediaComplete,

    ownership:
      ownershipComplete,
  };

  const completedSteps =
    Object.values(validation).filter(
      Boolean,
    ).length;

  const totalSteps =
    Object.keys(validation).length;

  const completionPercentage =
    Math.round(
      (completedSteps /
        totalSteps) *
        100,
    );

  let qualityScore =
    completionPercentage;

  // New uploads increase the quality score.
  // Existing edit-mode media is already attached
  // to the property and therefore does not need to
  // be uploaded again merely to resubmit the listing.
  if (draft.images.length >= 5) {
    qualityScore = Math.min(
      100,
      qualityScore + 10,
    );
  }

  if (
    draft.videoUrl ||
    draft.virtualTourUrl
  ) {
    qualityScore = Math.min(
      100,
      qualityScore + 10,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-heading font-semibold text-white">
            {isEditMode
              ? 'Review & Resubmit Listing'
              : isOwner
                ? 'Review Property Request'
                : 'Review & Publish'}
          </h2>

          {isEditMode && (
            <span className="rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400">
              Existing Listing
            </span>
          )}
        </div>

        <p className="text-ink/70 mt-1">
          {isEditMode
            ? 'Review your updated property details before submitting the listing for review again.'
            : isOwner
              ? 'Review your property details before submitting your property request.'
              : 'Review your listing details before submitting for approval.'}
        </p>
      </div>

      {isEditMode && (
        <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
          <p className="text-sm leading-relaxed text-gold-200">
            You are editing an existing property.
            Your existing ownership, assignment,
            and stored media information will be
            preserved. Submitting this update will
            send the property back through the review
            workflow.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Property Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Title
                  </span>

                  <span className="text-ink font-medium">
                    {draft.title || '—'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Type
                  </span>

                  <span className="text-ink font-medium">
                    {draft.propertyType ||
                      '—'}{' '}
                    (
                    {draft.transactionType ||
                      '—'}
                    )
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Location
                  </span>

                  <span className="text-ink font-medium">
                    {[
                      draft.estateName,
                      draft.address,
                      draft.city,
                    ]
                      .filter(Boolean)
                      .join(', ') ||
                      '—'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Features
                  </span>

                  <span className="text-ink font-medium">
                    {draft.bedrooms
                      ? `${draft.bedrooms} Beds, `
                      : ''}
                    {draft.bathrooms
                      ? `${draft.bathrooms} Baths, `
                      : ''}
                    {draft.toilets
                      ? `${draft.toilets} Toilets`
                      : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Pricing Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Asking Price
                  </span>

                  <span className="text-white font-semibold text-lg">
                    {draft.price ||
                      '—'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Transaction
                  </span>

                  <span className="text-ink font-medium capitalize">
                    {draft.transactionType ||
                      '—'}
                  </span>
                </div>

                {draft.transactionType ===
                  'rent' && (
                  <>
                    <div>
                      <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                        Service Charge
                      </span>

                      <span className="text-ink font-medium">
                        {draft.serviceCharge
                          ? `₦${draft.serviceCharge.toLocaleString()}`
                          : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                        Agency Fee
                      </span>

                      <span className="text-ink font-medium">
                        {draft.agencyFee
                          ? `₦${draft.agencyFee.toLocaleString()}`
                          : '—'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Ownership Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Source
                  </span>

                  <span className="text-ink font-medium">
                    {isOwner
                      ? 'Private Owner'
                      : draft.listingSource ||
                        '—'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    {isOwner
                      ? 'Registered Owner'
                      : 'Legal Owner / Organization'}
                  </span>

                  <span className="text-ink font-medium">
                    {isOwner
                      ? user?.name ||
                        'Authenticated Owner'
                      : draft.ownerName ||
                        draft.organizationName ||
                        'Internal Assignment'}
                  </span>
                </div>
              </div>

              {isEditMode && isAgent && (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-ink/50">
                    Edit Mode
                  </p>

                  <p className="mt-1 text-sm text-ink/70">
                    Ownership and Agent assignment
                    details are preserved from the
                    existing property record.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Review Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Listing Mode
                  </span>

                  <span className="text-sm font-medium text-white">
                    {isEditMode
                      ? 'Existing Property Edit'
                      : 'New Property Submission'}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="block text-xs text-ink/50 uppercase tracking-wider mb-1">
                    Next Workflow Step
                  </span>

                  <span className="text-sm font-medium text-gold-400">
                    {isEditMode
                      ? 'Submit for Review'
                      : isOwner
                        ? 'Property Request'
                        : 'Approval Review'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Listing Quality
            </h3>

            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-heading font-bold text-gold-400">
                {qualityScore}
              </span>

              <span className="text-ink/50 mb-1">
                / 100
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-ink/70 uppercase tracking-wider">
                Validation Checklist
              </h4>

              <div className="space-y-2">
                <div
                  className={`flex items-center gap-2 text-sm ${
                    validation.basic
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {validation.basic
                    ? '✅'
                    : '❌'}{' '}
                  Basic Information
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    validation.location
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {validation.location
                    ? '✅'
                    : '❌'}{' '}
                  Location Details
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    validation.details
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {validation.details
                    ? '✅'
                    : '❌'}{' '}
                  Property Details
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    validation.pricing
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {validation.pricing
                    ? '✅'
                    : '❌'}{' '}
                  Pricing Details
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    validation.media
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {validation.media
                    ? '✅'
                    : '❌'}{' '}
                  Media & Images
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    validation.ownership
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {validation.ownership
                    ? '✅'
                    : '❌'}{' '}
                  {isOwner
                    ? 'Ownership Documents'
                    : 'Ownership Status'}
                </div>
              </div>
            </div>

            {completionPercentage <
              100 && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-300 leading-relaxed">
                  Please complete all required fields marked with
                  ❌ before submitting.
                </p>
              </div>
            )}

            {isEditMode &&
              completionPercentage ===
                100 && (
                <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-xs text-green-300 leading-relaxed">
                    This existing listing is ready to be
                    submitted for review again.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}