import { useState } from 'react';
import {
  Home,
  MapPin,
  Tag,
  Users,
  Eye,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Clock,
  Building2,
  Bed,
  Bath,
} from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Record<string, unknown> | null;
  onSubmitReview?: (
    propertyId: string,
  ) => Promise<void>;
}

type ListingDetails = Record<string, unknown> & {
  propertyId?: string;
  property?: string;
  title?: string;
  location?: string;
  price?: string;
  status?: string;
  assignmentStatus?: string;
  propertyType?: string;
  transactionType?: string;

  bedrooms?: number | null;
  bathrooms?: number | null;
  toilets?: number | null;
  parkingSpaces?: number | null;
  propertySize?: number | null;
  propertySizeUnit?: string;
  yearBuilt?: number | null;
  furnishing?: string;
  propertyCondition?: string;

  description?: string;
  amenities?: string[];

  coverImage?: string;
  images?: string[];

  documents?: Array<{
    title?: string;
    name?: string;
    type?: string;
    url?: string;
    verified?: boolean;
  }>;

  videoUrl?: string;
  virtualTourUrl?: string;
  brochureUrl?: string;
  floorPlans?: string[];

  owner?: string;
  agency?: string;
  verificationLevel?: string;

  assignedAt?: string;
  assignmentRespondedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function ListingDetailModal({
  isOpen,
  onClose,
  listing,
  onSubmitReview,
}: ListingDetailModalProps) {
  const [activeTab, setActiveTab] =
    useState<'overview' | 'analytics' | 'history'>(
      'overview',
    );

  const [
    isSubmittingReview,
    setIsSubmittingReview,
  ] = useState(false);

  if (!listing) return null;

  const detailedListing =
    listing as ListingDetails;

  const propertyId = String(
    detailedListing.propertyId || '',
  );

  const status = String(
    detailedListing.status || 'Draft',
  );

  const assignmentStatus = String(
    detailedListing.assignmentStatus || '',
  );

  const canSubmitForReview =
    status === 'Draft' &&
    assignmentStatus === 'Agent Accepted' &&
    Boolean(propertyId) &&
    Boolean(onSubmitReview);

  const title = String(
    detailedListing.property ||
      detailedListing.title ||
      'Property',
  );

  const location = String(
    detailedListing.location ||
      'Location unavailable',
  );

  const price = String(
    detailedListing.price ||
      'Price on request',
  );

  const propertyType = String(
    detailedListing.propertyType ||
      'Property',
  );

  const transactionType = String(
    detailedListing.transactionType ||
      'Not specified',
  );

  const coverImage =
    detailedListing.coverImage ||
    detailedListing.images?.[0] ||
    '';

  const bedrooms =
    detailedListing.bedrooms ?? null;

  const bathrooms =
    detailedListing.bathrooms ?? null;

  const toilets =
    detailedListing.toilets ?? null;

  const parkingSpaces =
    detailedListing.parkingSpaces ?? null;

  const propertySize =
    detailedListing.propertySize ?? null;

  const propertySizeUnit = String(
    detailedListing.propertySizeUnit ||
      'sqm',
  );

  const yearBuilt =
    detailedListing.yearBuilt ?? null;

  const furnishing = String(
    detailedListing.furnishing || '—',
  );

  const propertyCondition = String(
    detailedListing.propertyCondition ||
      '—',
  );

  const description = String(
    detailedListing.description ||
      'No property description provided.',
  );

  const amenities = Array.isArray(
    detailedListing.amenities,
  )
    ? detailedListing.amenities
    : [];

  const documents = Array.isArray(
    detailedListing.documents,
  )
    ? detailedListing.documents
    : [];

  const imageCount = Array.isArray(
    detailedListing.images,
  )
    ? detailedListing.images.length
    : 0;

  const floorPlanCount = Array.isArray(
    detailedListing.floorPlans,
  )
    ? detailedListing.floorPlans.length
    : 0;

  const hasVideo = Boolean(
    detailedListing.videoUrl,
  );

  const hasVirtualTour = Boolean(
    detailedListing.virtualTourUrl,
  );

  const hasBrochure = Boolean(
    detailedListing.brochureUrl,
  );

  const hasDocuments = documents.length > 0;

  const hasDescription =
    description.trim().length > 0 &&
    description !==
      'No property description provided.';

  const handleSubmitReview = async () => {
    if (
      !onSubmitReview ||
      !propertyId ||
      isSubmittingReview
    ) {
      return;
    }

    try {
      setIsSubmittingReview(true);
      await onSubmitReview(propertyId);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Listing Details"
      size="2xl"
      actionButton={
        canSubmitForReview ? (
          <GoldButton
            onClick={handleSubmitReview}
            disabled={isSubmittingReview}
          >
            {isSubmittingReview
              ? 'Submitting...'
              : 'Submit for Review'}
          </GoldButton>
        ) : null
      }
    >
      <div className="space-y-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-32 w-48 items-center justify-center rounded-2xl bg-navy-900 border border-white/10 shrink-0 overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-ink/40" />
                <span className="ml-2 text-sm text-ink/40">
                  Gallery
                </span>
              </>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream flex items-center gap-2">
                {title}
              </h2>

              <p className="text-ink/60 text-lg flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {location}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={status} />

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                <Tag className="h-3 w-3 mr-1 inline" />
                {price}
              </span>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                {assignmentStatus || 'Not assigned'}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <GhostButton
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
                type="button"
              >
                <Eye className="h-4 w-4" />
                View as Public
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-white/10">
          {[
            {
              id: 'overview',
              label: 'Overview',
            },
            {
              id: 'analytics',
              label: 'Analytics',
            },
            {
              id: 'history',
              label: 'History & Timeline',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'overview'
                    | 'analytics'
                    | 'history',
                )
              }
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-ink/60 hover:text-cream hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Property Overview */}
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                    <Home className="h-4 w-4 text-ink/60" />
                    Property Overview
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Type
                      </span>

                      <span className="text-cream">
                        {propertyType}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Transaction
                      </span>

                      <span className="text-cream capitalize">
                        {transactionType}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Beds / Baths
                      </span>

                      <span className="text-cream flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5 text-ink/50" />
                        {bedrooms ?? '—'} /{' '}
                        <Bath className="h-3.5 w-3.5 text-ink/50" />
                        {bathrooms ?? '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Toilets
                      </span>

                      <span className="text-cream">
                        {toilets ?? '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Parking Spaces
                      </span>

                      <span className="text-cream">
                        {parkingSpaces ?? '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Property Size
                      </span>

                      <span className="text-cream">
                        {propertySize ?? '—'}
                        {propertySize !== null &&
                        propertySize !== undefined
                          ? ` ${propertySizeUnit}`
                          : ''}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Year Built
                      </span>

                      <span className="text-cream">
                        {yearBuilt ?? '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Furnishing
                      </span>

                      <span className="text-cream">
                        {furnishing}
                      </span>
                    </div>

                    <div>
                      <span className="block text-ink/60 text-xs mb-1">
                        Condition
                      </span>

                      <span className="text-cream">
                        {propertyCondition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Listing Content Checklist */}
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-ink/60" />
                    Listing Content Checklist
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        task: 'Property photos uploaded',
                        completed: imageCount > 0,
                      },
                      {
                        task: 'Property documents uploaded',
                        completed: hasDocuments,
                      },
                      {
                        task: 'Property description provided',
                        completed: hasDescription,
                      },
                      {
                        task: 'Video available',
                        completed: hasVideo,
                      },
                      {
                        task: 'Virtual tour available',
                        completed: hasVirtualTour,
                      },
                      {
                        task: 'Brochure available',
                        completed: hasBrochure,
                      },
                      {
                        task: 'Floor plans uploaded',
                        completed:
                          floorPlanCount > 0,
                      },
                    ].map((item) => (
                      <div
                        key={item.task}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            item.completed
                              ? 'bg-gold-400 border-gold-400'
                              : 'border-ink/40'
                          }`}
                        />

                        <span
                          className={`text-sm ${
                            item.completed
                              ? 'text-cream'
                              : 'text-ink/60'
                          }`}
                        >
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Assignment Details */}
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-ink/60" />
                    Assignment Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-3">
                      <span className="text-sm text-ink/60">
                        Agency
                      </span>

                      <span className="text-sm text-cream text-right">
                        {String(
                          detailedListing.agency ||
                            '—',
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-3">
                      <span className="text-sm text-ink/60">
                        Agent
                      </span>

                      <span className="text-sm text-cream text-right">
                        Assigned Agent
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-3">
                      <span className="text-sm text-ink/60">
                        Assignment Status
                      </span>

                      <span className="text-sm text-cream text-right">
                        {assignmentStatus ||
                          'Not assigned'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm text-ink/60">
                        Verification
                      </span>

                      <span className="text-sm text-cream text-right">
                        {String(
                          detailedListing.verificationLevel ||
                            'Unverified',
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-ink/60" />
                    Property Description
                  </h3>

                  <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                    {description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-ink/60" />
                    Amenities
                  </h3>

                  {amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {amenities.map(
                        (amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full border border-white/10 bg-navy-800/70 px-3 py-1 text-xs text-cream"
                          >
                            {amenity}
                          </span>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-ink/50">
                      No amenities have been provided.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/60" />
                Documents
              </h3>

              {documents.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {documents.map(
                    (document, index) => (
                      <div
                        key={
                          document.title ||
                          document.name ||
                          index
                        }
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-navy-800/60 p-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-cream truncate">
                            {document.title ||
                              document.name ||
                              'Document'}
                          </div>

                          <div className="text-xs text-ink/50 mt-1">
                            {document.verified
                              ? 'Verified'
                              : 'Pending verification'}
                          </div>
                        </div>

                        {document.verified ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-gold-400 shrink-0" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-xs text-ink/50">
                  No documents have been uploaded.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="h-5 w-5 text-gold-400" />

                <div>
                  <h3 className="font-semibold text-cream">
                    Listing Analytics
                  </h3>

                  <p className="text-xs text-ink/50 mt-1">
                    Engagement analytics are not yet
                    supplied by the Agent listing
                    endpoint.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-navy-800 p-4">
                  <div className="text-xs text-ink/50">
                    Views
                  </div>

                  <div className="text-xl font-bold text-cream mt-1">
                    —
                  </div>
                </div>

                <div className="rounded-xl bg-navy-800 p-4">
                  <div className="text-xs text-ink/50">
                    Inquiries
                  </div>

                  <div className="text-xl font-bold text-cream mt-1">
                    —
                  </div>
                </div>

                <div className="rounded-xl bg-navy-800 p-4">
                  <div className="text-xs text-ink/50">
                    Showings
                  </div>

                  <div className="text-xl font-bold text-cream mt-1">
                    —
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6 flex flex-col items-center justify-center min-h-[180px]">
              <BarChart3 className="h-12 w-12 text-ink/20 mb-3" />

              <p className="text-ink/60 text-sm text-center">
                Performance charts will appear here when
                real listing analytics are connected.
              </p>
            </div>
          </div>
        )}

        {/* History & Timeline */}
        {activeTab === 'history' && (
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6">
            <ActivityTimeline
              title="Property Workflow Timeline"
              items={[
                {
                  title: 'Property Submitted',
                  time: String(
                    detailedListing.createdAt ||
                      'Unknown',
                  ),
                  desc:
                    'The owner submitted this property to Luxora.',
                  icon: FileText,
                  color: 'text-blue-400',
                },
                {
                  title: 'Agency Assigned',
                  time: String(
                    detailedListing.assignedAt ||
                      'Unknown',
                  ),
                  desc:
                    `Assigned to ${
                      detailedListing.agency ||
                      'the agency'
                    }.`,
                  icon: Users,
                  color: 'text-gold-400',
                },
                {
                  title: 'Agent Accepted',
                  time: String(
                    detailedListing.assignmentRespondedAt ||
                      'Unknown',
                  ),
                  desc:
                    'The assigned Agent accepted responsibility for the property.',
                  icon: CheckCircle2,
                  color: 'text-emerald-400',
                },
                {
                  title: 'Current Stage',
                  time: status,
                  desc:
                    status === 'Draft' &&
                    assignmentStatus ===
                      'Agent Accepted'
                      ? 'The property has been accepted by the Agent and is ready for submission to Admin/Super Admin for review.'
                      : `Current property status: ${status}.`,
                  icon: Clock,
                  color: 'text-blue-400',
                },
              ]}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}