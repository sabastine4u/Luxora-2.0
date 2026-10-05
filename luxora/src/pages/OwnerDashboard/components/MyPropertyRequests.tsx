import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  FileText,
  Upload,
  Trash2,
  Eye,
  Building2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
import { uploadApi } from '../../../api/upload.api';
import { propertyApi } from '../../../api/property.api';
import type { PropertyRequest } from '../../../types/owner';
import ConfirmationModal from './modals/ConfirmationModal';
import UploadDocumentModal from './modals/UploadDocumentModal';

const PROPERTY_TYPES = [
  'Apartment',
  'Duplex',
  'Studio',
  'Mini Flat',
  'Self Contain',
  'Short Let',
  'Student Housing',
  'Affordable Rental',
  'Family House',
  'Land',
  'Warehouse',
  'Office Space',
];

// Convert the real backend Owner Property record into the
// structure already used by the Owner dashboard UI.
export const mapOwnerPropertyToRequest = (
  property: any,
): PropertyRequest => {
  // Use the property's first image when available.
  const image =
    property.coverImage ||
    property.images?.[0] ||
    '';

  // Build the display location from the property's city and state.
  const location = [property.city, property.state]
    .filter(Boolean)
    .join(', ');

  /*
   * Map the real backend lifecycle into the Owner-facing
   * dashboard status.
   *
   * Backend lifecycle:
   *
   * Draft + Pending Agency Assignment
   * → Pending Agency Assignment
   *
   * Agency Assigned
   * → Agency Assigned
   *
   * Agent Assigned
   * → Agent Assigned
   *
   * Agent Accepted
   * → Agent Accepted
   *
   * Pending Review
   * → Pending Review
   *
   * Approved + Documents Verified
   * → Documents Verified
   *
   * Published
   * → Published
   *
   * Archived + Owner origin
   * → Withdrawn
   */
  let status = 'Pending Agency Assignment';

  if (
    property.status === 'Archived' &&
    property.origin === 'owner'
  ) {
    status = 'Withdrawn';
  } else if (property.status === 'Published') {
    status = 'Published';
  } else if (
    property.status === 'Approved' &&
    property.verificationLevel === 'Documents Verified'
  ) {
    status = 'Documents Verified';
  } else if (property.status === 'Pending Review') {
    status = 'Pending Review';
  } else if (
    property.assignmentStatus === 'Agent Accepted'
  ) {
    status = 'Agent Accepted';
  } else if (
    property.assignmentStatus === 'Agent Assigned'
  ) {
    status = 'Agent Assigned';
  } else if (
    property.assignmentStatus === 'Agency Assigned'
  ) {
    status = 'Agency Assigned';
  } else if (
    property.status === 'Draft' &&
    property.assignmentStatus === 'Pending Agency Assignment'
  ) {
    status = 'Pending Agency Assignment';
  }

  /*
   * Estimate Owner-facing progress from the real workflow state.
   */
  let progress = 20;

  if (
    property.assignmentStatus === 'Agency Assigned'
  ) {
    progress = 40;
  } else if (
    property.assignmentStatus === 'Agent Assigned'
  ) {
    progress = 60;
  } else if (
    property.assignmentStatus === 'Agent Accepted'
  ) {
    progress = 65;
  }

  if (property.status === 'Pending Review') {
    progress = 75;
  }

  if (
    property.status === 'Approved' &&
    property.verificationLevel === 'Documents Verified'
  ) {
    progress = 90;
  }

  if (property.status === 'Published') {
    progress = 100;
  }


  // Convert the backend Agency object into the format
  // expected by the existing Owner dashboard.
  const agency =
    property.agency &&
      typeof property.agency === 'object'
      ? {
        name:
          property.agency.name ||
          'Assigned Agency',
        status:
          property.agency.status ||
          undefined,
      }
      : null;

  // Convert the backend agent object into the format
  // expected by the existing Owner dashboard.
  const agent = property.agent
    ? {
      name:
        property.agent.user?.fullName ||
        'Assigned Agent',
      avatar:
        property.agent.user?.avatar || '',
    }
    : {
      name: 'Unassigned',
      avatar: '',
    };

  /*
   * Determine the real workflow state for each
   * timeline stage.
   */
  const hasAgencyAssignment =
    property.assignmentStatus === 'Agency Assigned' ||
    property.assignmentStatus === 'Agent Assigned' ||
    property.assignmentStatus === 'Agent Accepted' ||
    property.status === 'Pending Review' ||
    property.status === 'Approved' ||
    property.status === 'Published';

  const hasAgentAssignment =
    property.assignmentStatus === 'Agent Assigned' ||
    property.assignmentStatus === 'Agent Accepted' ||
    property.status === 'Pending Review' ||
    property.status === 'Approved' ||
    property.status === 'Published';

  const agentAccepted =
    property.assignmentStatus === 'Agent Accepted' ||
    property.status === 'Pending Review' ||
    property.status === 'Approved' ||
    property.status === 'Published';

  const isPendingReview =
    property.status === 'Pending Review';

  const isVerified =
    property.verificationLevel === 'Documents Verified';

  const isPublished =
    property.status === 'Published';

  const isWithdrawn =
    property.status === 'Archived' &&
    property.origin === 'owner';

  return {
    id: property._id,
    name: property.title,
    type:
      property.propertyType ||
      property.propertySubType ||
      'Property',
    location,
    image,
    submissionDate: property.createdAt,
    lastUpdated: property.updatedAt,
    status,
    progress,
    agency,
    agent,

    // Build the existing timeline from the real
    // Owner → Agency → Agent → Review → Publish workflow.
    timeline: [
      {
        stage: 'Property Submitted',
        date: property.createdAt,
        status: 'completed',
      },
      {
        stage: 'Agency Assignment',
        date: property.assignedAt,
        status: hasAgencyAssignment
          ? 'completed'
          : isWithdrawn
            ? 'pending'
            : 'current',
      },
      {
        stage: 'Agent Assignment',
        date: property.assignedAt,
        status: hasAgentAssignment
          ? 'completed'
          : isWithdrawn
            ? 'pending'
            : hasAgencyAssignment
              ? 'current'
              : 'pending',
      },
      {
        stage: 'Agent Acceptance',
        date: property.assignmentRespondedAt,
        status: agentAccepted
          ? 'completed'
          : isWithdrawn
            ? 'pending'
            : hasAgentAssignment
              ? 'current'
              : 'pending',
      },
      {
        stage: 'Review & Verification',
        date:
          isVerified || isPendingReview
            ? property.updatedAt
            : undefined,
        status: isVerified
          ? 'completed'
          : isPendingReview
            ? 'current'
            : 'pending',
      },
      {
        stage: 'Publication',
        date: isPublished
          ? property.updatedAt
          : undefined,
        status: isPublished
          ? 'completed'
          : property.status === 'Approved'
            ? 'current'
            : 'pending',
      },
    ],

    /*
     * Backend documents use:
     * verified: boolean
     *
     * Map that into the existing Owner UI structure.
     */
    documents: (property.documents || []).map(
      (document: any) => ({
        name:
          document.name ||
          document.title ||
          'Document',

        status: document.verified
          ? 'verified'
          : 'pending',

        type: document.type,
      }),
    ),

    notes: property.description || undefined,
  };
};

export default function MyPropertyRequests() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('All');
  const [typeFilter, setTypeFilter] =
    useState('All');
  const [sortOrder, setSortOrder] =
    useState('Newest');

  const [searchParams] =
    useSearchParams();

  const [selectedReq, setSelectedReq] =
    useState<PropertyRequest | null>(null);

  // Store the authenticated owner's real property requests.
  const [requests, setRequests] = useState<
    PropertyRequest[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  // Modal state.
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);

  // Owner document uploads are allowed only during the
  // initial submission/review stages.
  // Owner document uploads are allowed only during the
  // initial submission/review stages.
  const canUploadOwnerDocuments = (
    request: PropertyRequest | null,
  ) => {
    if (!request) {
      return false;
    }

    return (
      request.status === 'Pending Agency Assignment' ||
      request.status === 'Pending Review'
    );
  };

  // Owner withdrawal is allowed only before the property
  // progresses beyond Draft/Pending Review.
  const canWithdrawOwnerRequest = (
    request: PropertyRequest | null,
  ) => {
    if (!request) {
      return false;
    }

    return (
      request.status === 'Pending Agency Assignment' ||
      request.status === 'Pending Review'
    );
  };
  /*
   * The Owner dashboard can open this page with
   * ?action=submit.
   *
   * Send the Owner directly to the real Create Listing
   * page instead of opening the old mock submission modal.
   */
  useEffect(() => {
    if (searchParams.get('action') === 'submit') {
      navigate(
        '/dashboard/create-listing',
        { replace: true },
      );
    }
  }, [searchParams, navigate]);

  /*
   * Load the authenticated owner's properties
   * from the real backend.
   */
  useEffect(() => {
    const loadOwnerProperties = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response =
          await propertyApi.getOwnerProperties();

        const properties =
          (response as any)?.properties || [];

        const mappedRequests =
          properties.map(
            mapOwnerPropertyToRequest,
          );

        setRequests(mappedRequests);

        console.log(
          'Mapped owner requests:',
          mappedRequests,
        );
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load your property requests.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOwnerProperties();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        const matchSearch =
          req.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
          statusFilter === 'All' ||
          req.status === statusFilter;

        const matchType =
          typeFilter === 'All' ||
          req.type === typeFilter;

        return (
          matchSearch &&
          matchStatus &&
          matchType
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'Newest') {
          return (
            new Date(b.submissionDate).getTime() -
            new Date(a.submissionDate).getTime()
          );
        }

        if (sortOrder === 'Oldest') {
          return (
            new Date(a.submissionDate).getTime() -
            new Date(b.submissionDate).getTime()
          );
        }

        if (
          sortOrder ===
          'Recently Updated'
        ) {
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        }

        return 0;
      });
  }, [
    requests,
    search,
    statusFilter,
    typeFilter,
    sortOrder,
  ]);

  const handleWithdraw = async () => {
    if (!selectedReq) {
      return;
    }

    try {
      const response =
        (await propertyApi.withdrawOwnerProperty(
          selectedReq.id,
        )) as {
          property?: any;
        };

      if (!response.property) {
        throw new Error(
          'The property request could not be withdrawn.',
        );
      }

      const updatedRequest =
        mapOwnerPropertyToRequest(
          response.property,
        );

      setRequests(
        (currentRequests) =>
          currentRequests.map(
            (request) =>
              request.id ===
                updatedRequest.id
                ? updatedRequest
                : request,
          ),
      );

      setSelectedReq(
        updatedRequest,
      );

      setIsWithdrawModalOpen(false);

      showToast({
        type: 'success',
        title: 'Request Withdrawn',
        description:
          'Your property request has been withdrawn successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Withdrawal Failed',
        description:
          error instanceof Error
            ? error.message
            : 'The property request could not be withdrawn.',
      });
    }
  };

  const handleUpload = async (
    type: string,
    file: File,
  ) => {
    if (!selectedReq) {
      throw new Error(
        'Select a property before uploading a document.',
      );
    }

    // Upload the file to Luxora's protected document storage endpoint.
    const uploadResponse =
      (await uploadApi.uploadPropertyDocuments(
        [file],
      )) as {
        documents?: string[];
      };

    const documentUrl =
      uploadResponse.documents?.[0];

    if (!documentUrl) {
      throw new Error(
        'The document was uploaded, but no document URL was returned.',
      );
    }

    // Attach the uploaded document URL to the actual Owner Property record.
    const propertyResponse =
      (await propertyApi.addOwnerPropertyDocuments(
        selectedReq.id,
        [
          {
            title: type,
            url: documentUrl,
          },
        ],
      )) as {
        property?: any;
      };

    if (!propertyResponse.property) {
      throw new Error(
        'The document was uploaded, but the property record could not be updated.',
      );
    }

    const updatedRequest =
      mapOwnerPropertyToRequest(
        propertyResponse.property,
      );

    setRequests(
      (currentRequests) =>
        currentRequests.map(
          (request) =>
            request.id ===
              updatedRequest.id
              ? updatedRequest
              : request,
        ),
    );

    setSelectedReq(updatedRequest);

    setIsUploadModalOpen(false);

    showToast({
      type: 'success',
      title: 'Document Uploaded',
      description:
        `${type} has been uploaded and attached to your property request.`,
    });
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Property Requests{' '}
            <span className="text-sm font-normal text-gold-400 ml-2">
              ({requests.length} Total)
            </span>
          </h2>

          <p className="text-sm text-ink/60">
            Track every property you have submitted for
            assignment, verification and publication.
          </p>
        </div>

        <GoldButton
          className="flex items-center gap-2"
          onClick={() =>
            navigate('/dashboard/create-listing')
          }
        >
          <Plus className="h-4 w-4" />
          Submit New Property
        </GoldButton>
      </div>

      {/* Filters */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search property name..."
        actions={
          <>
            <select
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending Agency Assignment">
                Pending Agency Assignment
              </option>

              <option value="Agency Assigned">
                Agency Assigned
              </option>

              <option value="Agent Assigned">
                Agent Assigned
              </option>

              <option value="Agent Accepted">
                Agent Accepted
              </option>

              <option value="Pending Review">
                Pending Review
              </option>

              <option value="Documents Verified">
                Documents Verified
              </option>

              <option value="Published">
                Published
              </option>

              <option value="Withdrawn">
                Withdrawn
              </option>
            </select>

            <select
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
            >
              <option value="All">
                All Types
              </option>

              {PROPERTY_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
            >
              <option value="Newest">
                Newest
              </option>

              <option value="Oldest">
                Oldest
              </option>

              <option value="Recently Updated">
                Recently Updated
              </option>
            </select>
          </>
        }
      />

      {/* Main Content */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
          <p className="text-sm text-ink/60">
            Loading your property requests...
          </p>
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <p className="text-sm text-rose-400">
            {loadError}
          </p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={
            <Building2 className="h-8 w-8 text-gold-400" />
          }
          title="No property requests found."
          description="You haven't submitted any properties matching these filters yet."
          actionLabel="Submit New Property"
          onAction={() =>
            navigate('/dashboard/create-listing')
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full">
            <DataTable
              data={filteredRequests}
              keyExtractor={(req) => req.id}
              columns={[
                {
                  header: 'Property',
                  render: (req) => (
                    <div className="flex items-center gap-4">
                      <img
                        src={req.image}
                        alt={req.name}
                        className="h-12 w-16 rounded-lg object-cover border border-white/10"
                      />

                      <div>
                        <div className="font-semibold text-cream">
                          {req.name}
                        </div>

                        <div className="text-xs text-ink/50">
                          {req.type} • Submitted{' '}
                          {req.submissionDate}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Agent',
                  render: (req) =>
                    req.agent.name !==
                      'Unassigned' ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={req.agent.avatar}
                          alt="Agent"
                          className="h-6 w-6 rounded-full object-cover"
                        />

                        <span className="text-ink/80 whitespace-nowrap">
                          {req.agent.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-ink/40 text-xs italic">
                        Unassigned
                      </span>
                    ),
                },

                {
                  header: 'Status & Progress',
                  render: (req) => (
                    <div className="space-y-2 max-w-[200px]">
                      <EnterpriseStatusBadge
                        status={req.status}
                      />

                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-400 rounded-full transition-all"
                            style={{
                              width: `${req.progress}%`,
                            }}
                          />
                        </div>

                        <span className="text-[10px] text-ink/50">
                          {req.progress}%
                        </span>
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Updated',
                  render: (req) => (
                    <span className="text-ink/60 text-xs whitespace-nowrap">
                      {req.lastUpdated}
                    </span>
                  ),
                },

                {
                  header: (
                    <div className="text-right">
                      Actions
                    </div>
                  ),
                  className: 'text-right',

                  render: (req) => (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          setSelectedReq(req)
                        }
                        className="p-2 text-ink/50 hover:text-gold-400 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {canUploadOwnerDocuments(req) && (
                        <button
                          className="p-2 text-ink/50 hover:text-emerald-400 transition-colors"
                          title="Upload Documents"
                          onClick={() => {
                            setSelectedReq(req);
                            setIsUploadModalOpen(true);
                          }}
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}

                      {canWithdrawOwnerRequest(req) && (
                        <button
                          className="p-2 text-ink/50 hover:text-rose-400 transition-colors"
                          title="Withdraw Request"
                          onClick={() => {
                            setSelectedReq(req);
                            setIsWithdrawModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-white/10 bg-navy-800/50 p-4 relative"
              >
                <div className="flex gap-4 mb-4">
                  <img
                    src={req.image}
                    alt={req.name}
                    className="h-16 w-20 rounded-lg object-cover border border-white/10 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-cream text-sm mb-1 truncate">
                      {req.name}
                    </h3>

                    <div className="text-[10px] text-ink/50 mb-2 truncate">
                      {req.type}
                    </div>

                    <EnterpriseStatusBadge
                      status={req.status}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-ink/50 mb-1">
                    <span>
                      Progress
                    </span>

                    <span>
                      {req.progress}%
                    </span>
                  </div>

                  <div className="h-1 bg-navy-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-400 rounded-full"
                      style={{
                        width: `${req.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="text-[10px] text-ink/40">
                    Updated {req.lastUpdated}
                  </div>

                  <div className="flex gap-2">
                    <GhostButton
                      size="sm"
                      className="px-3 py-1 text-xs"
                      onClick={() =>
                        setSelectedReq(req)
                      }
                    >
                      Details
                    </GhostButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <EnterpriseDetailDrawer
        isOpen={!!selectedReq}
        onClose={() =>
          setSelectedReq(null)
        }
        title="Request Details"
        footerActions={
          selectedReq?.status === 'Withdrawn' ? (
            <GhostButton
              className="w-full justify-center"
              onClick={() =>
                setSelectedReq(null)
              }
            >
              Close
            </GhostButton>
          ) : (
            <div className="flex gap-3 w-full">
              <GoldButton
                className={
                  canWithdrawOwnerRequest(selectedReq)
                    ? 'flex-1 justify-center'
                    : 'w-full justify-center'
                }
                onClick={() =>
                  navigate(
                    '/owner-dashboard?tab=Verification+Progress',
                  )
                }
              >
                Track Progress
              </GoldButton>

              {canWithdrawOwnerRequest(selectedReq) && (
                <GhostButton
                  className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                  onClick={() =>
                    setIsWithdrawModalOpen(true)
                  }
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Withdraw
                </GhostButton>
              )}
            </div>
          )
        }
      >
        {selectedReq && (
          <div className="space-y-8">
            {/* Property Info */}
            <div className="flex gap-4">
              <img
                src={selectedReq.image}
                alt={selectedReq.name}
                className="h-20 w-28 rounded-xl object-cover border border-white/10 shrink-0"
              />

              <div className="min-w-0">
                <h4 className="font-semibold text-cream text-lg mb-1 truncate">
                  {selectedReq.name}
                </h4>

                <div className="text-sm text-ink/60 mb-2 truncate">
                  {selectedReq.location}
                </div>

                <EnterpriseStatusBadge
                  status={selectedReq.status}
                />
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2 bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-cream">
                  Overall Progress
                </span>

                <span className="text-gold-400 font-bold">
                  {selectedReq.progress}%
                </span>
              </div>

              <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 rounded-full transition-all"
                  style={{
                    width: `${selectedReq.progress}%`,
                  }}
                />
              </div>

              <div className="text-xs text-ink/50 pt-2 flex justify-between">
                <span>
                  Completion estimate: Not available
                </span>

                <span>
                  Submitted:{' '}
                  {selectedReq.submissionDate}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-cream mb-4">
                Journey Timeline
              </h4>

              <div className="relative border-l-2 border-white/5 ml-3 space-y-6">
                {selectedReq.timeline.map(
                  (step, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6"
                    >
                      <div
                        className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-navy-950 ${step.status ===
                          'completed'
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : step.status ===
                            'current'
                            ? 'border-gold-400 bg-gold-400/20'
                            : 'border-white/10'
                          }`}
                      />

                      <div
                        className={`text-sm font-semibold ${step.status ===
                          'completed'
                          ? 'text-cream'
                          : step.status ===
                            'current'
                            ? 'text-gold-400'
                            : 'text-ink/40'
                          }`}
                      >
                        {step.stage}
                      </div>

                      <div className="text-xs text-ink/50">
                        {step.date || 'Pending'}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-cream">
                  Submitted Documents
                </h4>

                {canUploadOwnerDocuments(selectedReq) && (
                  <button
                    className="text-[10px] uppercase tracking-wider font-semibold text-gold-400 hover:text-gold-300"
                    onClick={() =>
                      setIsUploadModalOpen(true)
                    }
                  >
                    Upload
                  </button>
                )}
              </div>

              {selectedReq.documents.length > 0 ? (
                <div className="space-y-3">
                  {selectedReq.documents.map(
                    (doc, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 rounded-xl bg-navy-900/50 border border-white/5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-4 w-4 text-ink/50 shrink-0" />

                          <span className="text-sm text-cream truncate">
                            {doc.name}
                          </span>
                        </div>

                        <span
                          className={`text-xs capitalize ml-4 shrink-0 ${doc.status ===
                            'verified'
                            ? 'text-emerald-400'
                            : 'text-yellow-400'
                            }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="text-sm text-ink/50 italic">
                  No documents uploaded yet.
                </div>
              )}
            </div>


            {/* Assigned Staff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-xs text-ink/50 mb-2">
                  Assigned Agency
                </div>

                {selectedReq.agency ? (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-gold-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-cream truncate">
                        {selectedReq.agency.name}
                      </div>

                      {selectedReq.agency.status && (
                        <div className="text-[11px] text-ink/40 mt-0.5">
                          {selectedReq.agency.status}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-ink/40 italic">
                    Pending Assignment
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-xs text-ink/50 mb-2">
                  Assigned Agent
                </div>

                {selectedReq.agent.name !== 'Unassigned' ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedReq.agent.avatar}
                      alt="Agent"
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />

                    <div className="text-sm font-semibold text-cream truncate">
                      {selectedReq.agent.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-ink/40 italic">
                    Pending Assignment
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-xs text-ink/50 mb-2">
                  Internal Notes
                </div>

                <div className="text-xs text-ink/70 leading-relaxed">
                  {selectedReq.notes || 'No notes available.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ConfirmationModal
        isOpen={isWithdrawModalOpen}
        onClose={() =>
          setIsWithdrawModalOpen(false)
        }
        onConfirm={handleWithdraw}
        title="Withdraw Request"
        description="Are you sure you want to withdraw this property request? This action cannot be undone."
        confirmText="Withdraw Request"
        isDestructive={true}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() =>
          setIsUploadModalOpen(false)
        }
        onUpload={handleUpload}
      />
    </div>
  );
}