import { useEffect, useState } from 'react';
import {
  Building2,
  Filter,
  ShieldCheck,
  User,
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SmartAgentMatchModal } from './modals/SmartAgentMatchModal';

// Import the Property API used to load the Agency's real assigned Properties.
import { propertyApi } from '../../../api/property.api';


export default function AssignmentCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  // Store the real Properties returned by the Agency property endpoint.
  const [properties, setProperties] = useState<any[]>([]);

  // Track the Property currently being reviewed in the detail drawer.
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  // Track whether the Agency Properties are currently being loaded.
  const [isLoading, setIsLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Load the Properties assigned to the authenticated Agency.
  const fetchAgencyProperties = async () => {
    try {
      // Show the loading state while the API request is running.
      setIsLoading(true);

      // The shared HTTP client unwraps the API envelope,
      // so the returned object contains `properties` directly.
      const response = await propertyApi.getAgencyProperties();

      // Store the real Agency Properties returned by MongoDB.
      setProperties(response.properties || []);
    } catch (error) {
      // Keep the dashboard usable while logging the request failure.
      console.error('Failed to load agency properties:', error);
    } finally {
      // Always stop the loading state when the request finishes.
      setIsLoading(false);
    }
  };

  // Load the Agency's Properties when the Assignment Center opens.
  useEffect(() => {
    fetchAgencyProperties();
  }, []);

  // Filter real Properties by title, location, or Owner name.
  const filteredProperties = properties.filter((property) => {
    const search = searchQuery.toLowerCase();

    return (
      String(property.title || '').toLowerCase().includes(search) ||
      String(property.area || '').toLowerCase().includes(search) ||
      String(property.city || '').toLowerCase().includes(search) ||
      String(property.state || '').toLowerCase().includes(search) ||
      String(property.owner?.fullName || '').toLowerCase().includes(search)
    );
  });

  // Calculate Assignment Center summary counts from the real Agency properties.
const totalProperties = properties.length;

const pendingAgencyAssignments = properties.filter(
  (property) =>
    property.assignmentStatus === 'Pending Agency Assignment'
).length;

const agentAssignedProperties = properties.filter(
  (property) =>
    property.assignmentStatus === 'Agent Assigned'
).length;

const publishedProperties = properties.filter(
  (property) =>
    String(property.status || '').toLowerCase() === 'published'
).length;

  // Open the detail drawer for the selected real Property.
  const handleView = (property: any) => {
    setSelectedProperty(property);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Assignment Center"
        subtitle="Manage property assignments, route verified listings to agents, and monitor response deadlines."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Escalations
            </GhostButton>

            <GoldButton className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" /> Bulk Auto-Assign
            </GoldButton>
          </div>
        }
      />

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col min-h-[500px]">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search properties, locations, or owners..."
          actions={
            <div className="flex gap-2">
              <GhostButton className="px-3 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Status
              </GhostButton>

              <GhostButton className="px-3 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Priority
              </GhostButton>
            </div>
          }
        />

        <div className="flex-1 mt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-sm text-ink/60">
              Loading Agency Properties...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-ink/60">
              No Properties found for this Agency.
            </div>
          ) : (
            <DataTable
              data={filteredProperties}
              keyExtractor={(property) => String(property._id)}
              columns={[
                {
                  header: 'Property & Owner',
                  render: (property) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-navy-900 border border-white/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gold-400" />
                      </div>

                      <div>
                        <div
                          className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                          onClick={() => handleView(property)}
                        >
                          {property.title}
                        </div>

                        <div className="text-[10px] text-ink/60 flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {property.owner?.fullName ||
                            'Private / Internal Listing'}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Location',
                  render: (property) => (
                    <div>
                      <div className="text-sm text-cream">
                        {property.area ||
                          property.city ||
                          'Location unavailable'}
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {[property.city, property.state]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Property Details',
                  render: (property) => (
                    <div>
                      <div className="text-sm text-cream">
                        {property.propertyType}
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {property.bedrooms || 0} Beds •{' '}
                        {property.bathrooms || 0} Baths
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Verification',
                  render: (property) => (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`h-4 w-4 ${property.verificationLevel ===
                          'Physical Inspection Completed'
                          ? 'text-gold-400'
                          : property.verificationLevel !== 'Unverified'
                            ? 'text-emerald-400'
                            : 'text-ink/40'
                          }`}
                      />

                      <span className="text-xs text-cream">
                        {property.verificationLevel || 'Unverified'}
                      </span>
                    </div>
                  ),
                },

                {
                  header: 'Current Agent',
                  render: (property) => (
                    <div className="text-sm">
                      {property.agent ? (
                        <div>
                          <div className="text-cream">
                            {property.agent.fullName}
                          </div>

                          <div className="text-[10px] text-emerald-400">
                            {property.agent.status}
                          </div>
                        </div>
                      ) : (
                        <span className="text-ink/40 italic">
                          Unassigned
                        </span>
                      )}
                    </div>
                  ),
                },

                {
                  header: 'Status',
                  render: (property) => (
                    <EnterpriseStatusBadge
                      status={
                        property.assignmentStatus ||
                        property.status ||
                        'Unknown'
                      }
                    />
                  ),
                },

                {
                  header: 'Listing Status',
                  render: (property) => (
                    <EnterpriseStatusBadge
                      status={property.status || 'Unknown'}
                    />
                  ),
                },

                {
                  header: <div className="text-right">Action</div>,
                  className: 'text-right',
                  render: (property) => (
                    <GoldButton
                      size="sm"
                      onClick={() => handleView(property)}
                    >
                      Review
                    </GoldButton>
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          selectedProperty
            ? `Assignment: ${selectedProperty._id}`
            : 'Assignment Details'
        }
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1 flex justify-center items-center gap-2 text-rose-400 hover:text-rose-400 hover:bg-rose-400/10">
              <XCircle className="h-4 w-4" /> Reject
            </GhostButton>

            <GoldButton
              className="flex-1 flex justify-center items-center gap-2"
              onClick={() => setIsMatchModalOpen(true)}
            >
              <CheckCircle2 className="h-4 w-4" /> Assign Agent
            </GoldButton>
          </div>
        }
      >
        <div className="space-y-6 pb-20">
          {/* Property overview section. */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-ink/50" />
              Property Overview
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Title
                </div>

                <div className="text-cream font-medium">
                  {selectedProperty?.title}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Location
                </div>

                <div className="text-cream">
                  {[
                    selectedProperty?.area,
                    selectedProperty?.city,
                    selectedProperty?.state,
                  ]
                    .filter(Boolean)
                    .join(', ') || 'Location unavailable'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Type
                </div>

                <div className="text-cream">
                  {selectedProperty?.propertyType || 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Price
                </div>

                <div className="text-cream font-medium">
                  {selectedProperty?.price !== null &&
                    selectedProperty?.price !== undefined
                    ? `₦${Number(
                      selectedProperty.price,
                    ).toLocaleString()}`
                    : 'Price on Request'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Owner
                </div>

                <div className="text-cream">
                  {selectedProperty?.owner?.fullName ||
                    'Private / Internal Listing'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Transaction
                </div>

                <div className="text-cream capitalize">
                  {selectedProperty?.transactionType || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Assignment lifecycle section. */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-ink/50" />
              Assignment Status
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Assignment Status
                </div>

                <div className="text-cream">
                  {selectedProperty?.assignmentStatus || 'Not Assigned'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Listing Status
                </div>

                <div className="text-cream">
                  {selectedProperty?.status || 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Verification Level
                </div>

                <div className="text-cream flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-gold-400" />
                  {selectedProperty?.verificationLevel || 'Unverified'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Current Agent
                </div>

                <div className="text-cream">
                  {selectedProperty?.agent?.fullName || 'Unassigned'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Assigned At
                </div>

                <div className="text-cream">
                  {selectedProperty?.assignedAt
                    ? new Date(
                      selectedProperty.assignedAt,
                    ).toLocaleString()
                    : 'Not assigned yet'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>

      <SmartAgentMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        assignmentId={selectedProperty?._id}
        propertyTitle={selectedProperty?.title}
        propertyLocation={[
          selectedProperty?.area,
          selectedProperty?.city,
          selectedProperty?.state,
        ]
          .filter(Boolean)
          .join(', ')}

        // Refresh the real Assignment Center after a successful Agent assignment.
        onAssignmentComplete={fetchAgencyProperties}
      />
    </div>
  );
}