import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import {
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  FileText,
  Download,
  User,
  Building2,
} from 'lucide-react';
import type { AdminListing } from '../../../types/admin';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';

export interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
  // Pass the admin's verification notes together with the selected action.
  onAction?: (
    actionType: 'approve' | 'return' | 'hold' | 'reject',
    notes: string
  ) => void;
}

// These optional fields allow the modal to work with newer real-property
// data without forcing the older AdminListing type to contain every field.
type ListingWithDetails = AdminListing & {
  propertyType?: string;
  transactionType?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  size?: number;
  lotSize?: number;
  priceFrequency?: string;
  images?: string[];
  amenities?: string[];
  verificationLevel?: string;
  assignmentStatus?: string;
  agency?: {
    _id?: string;
    id?: string;
    name?: string;
  } | null;
  agent?: {
    _id?: string;
    id?: string;
    name?: string;
  } | null;
  documents?: Array<{
    name?: string;
    type?: string;
    size?: string;
    url?: string;
    status?: string;
  }>;
};

export function ListingDetailModal({
  isOpen,
  onClose,
  listing,
  onAction,
}: ListingDetailModalProps) {
  const [notes, setNotes] = useState('');

  // Convert the incoming listing into the extended view type.
  const detailedListing = listing as ListingWithDetails | null;

  // Refresh the notes whenever a different listing is opened.
  useEffect(() => {
    setNotes(listing?.verification?.notes || '');
  }, [listing]);

  if (!detailedListing) return null;

  const isPendingReview =
    detailedListing.status === 'Pending Review' ||
    detailedListing.verification?.status === 'Pending Review';

  const propertyImages = detailedListing.images?.filter(Boolean) || [];

 // Normalize documents from either source into one consistent shape.
const documents = (
  detailedListing.documents ||
  detailedListing.verification?.documents ||
  []
).map((doc) => ({
  name: doc.name,
  type: doc.type,
  size: doc.size,
  url: 'url' in doc ? doc.url : undefined,
  status: 'status' in doc ? doc.status : undefined,
}));

  const agencyName =
    detailedListing.agency?.name ||
    detailedListing.assignment?.agencyName ||
    'Unassigned';

  const agentName =
    detailedListing.agent?.name ||
    'Unassigned';

  const propertyType =
    detailedListing.propertyType || 'Property';

  const transactionType =
    detailedListing.transactionType || 'Not specified';

  const verificationLevel =
    detailedListing.verificationLevel ||
    detailedListing.verification?.status ||
    'Not verified';

  const assignmentStatus =
    detailedListing.assignmentStatus ||
    detailedListing.assignment?.status ||
    'Not assigned';

  const bedrooms = detailedListing.bedrooms;
  const bathrooms = detailedListing.bathrooms;
  const propertySize =
    detailedListing.area ??
    detailedListing.size ??
    detailedListing.lotSize;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setNotes('');
        onClose();
      }}
      title={`Listing Review: ${detailedListing.title}`}
      size="5xl"
      actionButton={
        <div className="flex flex-wrap gap-2 justify-end">
          {/* Only show rejection when the property is actually awaiting review. */}
          {isPendingReview && (
            <GhostButton
              size="sm"
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
              // Send the notes from the listing modal with the reject action.
              onClick={() => onAction?.('reject', notes)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </GhostButton>
          )}

          {/* The current backend does not have a real Hold workflow yet. */}

          {/* Only show approval when the property is awaiting admin review. */}
          {isPendingReview && (
            <GoldButton
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-white"
              // Send the notes from the listing modal with the approve action.
              onClick={() => onAction?.('approve', notes)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </GoldButton>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================================================================
            LEFT COLUMN
            Property details, gallery, documents and notes
        ================================================================ */}
        <div className="lg:col-span-2 space-y-8">

          {/* Property Information */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Property Information
            </h4>

            <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>
                  <h3 className="text-xl font-bold text-cream">
                    {detailedListing.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-ink/60 mt-1">
                    <MapPin className="h-4 w-4" />
                    {detailedListing.location || 'Location not provided'}
                  </div>

                  <div className="text-sm text-ink/60 mt-2">
                    Owner:{' '}
                    <span className="font-semibold text-cream">
                      {detailedListing.owner || 'Unknown'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <EnterpriseStatusBadge
                      status={detailedListing.status}
                    />

                    {detailedListing.assignment?.status && (
                      <EnterpriseStatusBadge
                        status={detailedListing.assignment.status}
                      />
                    )}
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-2xl font-bold text-gold-400">
                    {detailedListing.price || 'Price not provided'}
                  </div>

                  <div className="text-xs text-ink/50 uppercase tracking-wider mt-1">
                    {detailedListing.priceFrequency || 'Pricing'}
                  </div>
                </div>
              </div>

              {/* Real property specifications */}
              <div className="flex flex-wrap gap-4 mt-6">

                {bedrooms !== undefined && (
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                    <Bed className="h-4 w-4 text-ink/40" />
                    {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
                  </div>
                )}

                {bathrooms !== undefined && (
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                    <Bath className="h-4 w-4 text-ink/40" />
                    {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
                  </div>
                )}

                {propertySize !== undefined && (
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                    <Square className="h-4 w-4 text-ink/40" />
                    {propertySize.toLocaleString()} sqft
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                  <Home className="h-4 w-4 text-ink/40" />
                  {propertyType}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                  <Building2 className="h-4 w-4 text-ink/40" />
                  {transactionType}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {detailedListing.description && (
            <div>
              <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
                Description
              </h4>

              <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-6">
                <p className="text-sm leading-7 text-ink/70 whitespace-pre-line">
                  {detailedListing.description}
                </p>
              </div>
            </div>
          )}

          {/* Property Gallery */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Property Gallery
            </h4>

            {propertyImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {propertyImages.slice(0, 5).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={
                      index === 0
                        ? 'col-span-2 row-span-2 overflow-hidden rounded-xl border border-white/10 bg-navy-900/50 aspect-video'
                        : 'overflow-hidden rounded-xl border border-white/10 bg-navy-900/50 aspect-video'
                    }
                  >
                    <img
                      src={image}
                      alt={`${detailedListing.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-12 w-12 text-ink/20" />
                <p className="mt-3 text-sm text-ink/40">
                  No property images available
                </p>
              </div>
            )}
          </div>

          {/* Property Documents */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Property Documents
            </h4>

            {documents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {documents.map((doc, index) => (
                  <div
                    key={`${doc.name || 'document'}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-navy-900/50 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-gold-400">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-cream truncate">
                          {doc.name || 'Unnamed document'}
                        </div>

                        <div className="text-xs text-ink/50">
                          {doc.type || 'Document'}
                          {doc.size ? ` • ${doc.size}` : ''}
                        </div>

                        {doc.status && (
                          <div
                            className={`text-[11px] mt-1 ${doc.status.toLowerCase() === 'verified'
                              ? 'text-emerald-400'
                              : 'text-yellow-400'
                              }`}
                          >
                            {doc.status}
                          </div>
                        )}
                      </div>
                    </div>

                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-ink/40 hover:text-gold-400 transition-colors"
                        title="Open document"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-ink/50 italic">
                No documents available for this property.
              </div>
            )}
          </div>

          {/* Verification Notes */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Verification Notes
            </h4>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add verification comments..."
              className="w-full h-32 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none resize-none"
            />

            {/* These notes are passed to the existing approval/rejection workflow
    and saved by the backend as reviewNotes. */}
            <p className="mt-2 text-xs text-ink/40">
              These notes will be included in the approval or rejection review.
            </p>
          </div>

          {/* Assignment Details */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Assignment Details
            </h4>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Assignment Status
                  </div>

                  <EnterpriseStatusBadge status={assignmentStatus} />
                </div>

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Assigned Agency
                  </div>

                  <div className="flex items-center gap-2 font-semibold text-cream">
                    <Building2 className="h-4 w-4 text-ink/40" />
                    {agencyName}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Assigned Agent
                  </div>

                  <div className="flex items-center gap-2 font-semibold text-cream">
                    <User className="h-4 w-4 text-ink/40" />
                    {agentName}
                  </div>
                </div>

                {detailedListing.assignment?.assignedBy && (
                  <div>
                    <div className="text-xs text-ink/60 mb-1">
                      Assigned By
                    </div>

                    <div className="font-semibold text-cream">
                      {detailedListing.assignment.assignedBy}
                    </div>
                  </div>
                )}

                {detailedListing.assignment?.assignedAt && (
                  <div>
                    <div className="text-xs text-ink/60 mb-1">
                      Assigned At
                    </div>

                    <div className="font-semibold text-cream">
                      {detailedListing.assignment.assignedAt}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            RIGHT COLUMN
            Verification and workflow information
        ================================================================ */}
        <div className="space-y-8 lg:border-l lg:border-white/10 lg:pl-8">

          {/* Verification Status */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Verification
            </h4>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-5">
              <div className="text-xs text-ink/50 mb-2">
                Verification Level
              </div>

              <EnterpriseStatusBadge status={verificationLevel} />

              <div className="mt-5 text-xs text-ink/50">
                Property Status
              </div>

              <div className="mt-2">
                <EnterpriseStatusBadge status={detailedListing.status} />
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Verification Checklist
            </h4>

            {detailedListing.verification?.checklist?.length ? (
              <div className="space-y-3">
                {detailedListing.verification.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${item.checked
                        ? 'border-emerald-400/50 bg-emerald-400/10'
                        : 'border-white/20 bg-navy-900'
                        }`}
                    >
                      {item.checked && (
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                      )}
                    </div>

                    <span
                      className={`text-sm ${item.checked
                        ? 'text-cream'
                        : 'text-ink/60'
                        }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                <p className="text-sm text-ink/50">
                  No verification checklist has been recorded for this
                  property.
                </p>
              </div>
            )}
          </div>

          {/* Verification History */}
          <div className="pt-8 border-t border-white/10">
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-6">
              Verification History
            </h4>

            {detailedListing.verification?.history?.length ? (
              <div className="space-y-6">
                {detailedListing.verification.history.map((event, index) => (
                  <div key={`${event.title}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-gold-400" />

                      {index <
                        detailedListing.verification!.history.length - 1 && (
                          <div className="h-full w-px bg-white/10 mt-2" />
                        )}
                    </div>

                    <div className="pb-2 text-sm">
                      <div className="text-cream font-medium">
                        {event.title}
                      </div>

                      <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {event.time} • {event.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
                <p className="text-sm text-ink/50">
                  No verification history has been recorded yet.
                </p>
              </div>
            )}
          </div>

          {/* Assignment summary */}
          <div className="pt-8 border-t border-white/10">
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">
              Current Assignment
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-gold-400" />
                </div>

                <div>
                  <div className="text-xs text-ink/50">
                    Agency
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {agencyName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <User className="h-4 w-4 text-gold-400" />
                </div>

                <div>
                  <div className="text-xs text-ink/50">
                    Agent
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {agentName}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}