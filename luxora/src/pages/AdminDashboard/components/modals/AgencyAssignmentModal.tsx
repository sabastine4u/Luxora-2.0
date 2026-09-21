import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import {
  GhostButton,
  GoldButton,
} from '../../../../components/ui/ui';
import { DataTable } from '../../../../components/dashboard/shared/tables/DataTable';
import { adminApi } from '../../../../api/admin.api';
import {
  Building2,
  Search,
  Users,
  FileCheck,
} from 'lucide-react';
import { EnterpriseStatusBadge } from '../../../../components/enterprise/EnterpriseStatusBadge';
import type { AdminListing } from '../../../../types/admin';

interface AgencyOption {
  id: string;
  name: string;
  status: string;
  agents: number;
  listings: number;
}

interface AgencyAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
  onAssign: (agencyId: string, notes: string) => void;
}

export function AgencyAssignmentModal({
  isOpen,
  onClose,
  listing,
  onAssign,
}: AgencyAssignmentModalProps) {
  const [selectedAgencyId, setSelectedAgencyId] =
    useState<string | null>(null);

  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [agencies, setAgencies] = useState<
    AgencyOption[]
  >([]);

  const [isLoadingAgencies, setIsLoadingAgencies] =
    useState(false);

  const [agencyLoadError, setAgencyLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadAgencies = async () => {
      try {
        setIsLoadingAgencies(true);
        setAgencyLoadError(null);

        const response = await adminApi.getAgencies();

        const fetchedAgencies =
          (response as any)?.agencies || [];

        setAgencies(
          fetchedAgencies.map((agency: any) => ({
            id: agency._id,
            name: agency.name,
            status: agency.status,
            agents: agency.agentCount || 0,
            listings: agency.listingCount || 0,
          })),
        );
      } catch (error: any) {
        console.error(
          'Failed to load agencies:',
          error,
        );

        setAgencies([]);

        setAgencyLoadError(
          error?.message ||
            'Unable to load agencies right now.',
        );
      } finally {
        setIsLoadingAgencies(false);
      }
    };

    void loadAgencies();
  }, [isOpen]);

  if (!listing) return null;

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.status === 'Active' &&
      agency.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const selectedAgency = agencies.find(
    (agency) =>
      agency.id === selectedAgencyId,
  );

  const handleClose = () => {
    setSelectedAgencyId(null);
    setNotes('');
    setSearchQuery('');
    setAgencyLoadError(null);
    onClose();
  };

  const handleAssign = () => {
    if (selectedAgencyId) {
      onAssign(
        selectedAgencyId,
        notes,
      );

      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Agency"
      size="4xl"
      actionButton={
        <div className="flex gap-3">
          <GhostButton onClick={handleClose}>
            Cancel
          </GhostButton>

          <GoldButton
            disabled={
              !selectedAgencyId ||
              isLoadingAgencies
            }
            onClick={handleAssign}
          >
            Assign Property
          </GoldButton>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Property Summary */}
        <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
          <h3 className="font-heading text-sm font-bold text-cream mb-4 uppercase tracking-wider">
            Property Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-ink/60 mb-1">
                Property Name
              </div>

              <div className="font-semibold text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gold-400" />
                {listing.title}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Location
              </div>

              <div className="font-semibold text-cream">
                {listing.location}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Owner
              </div>

              <div className="font-semibold text-cream">
                {listing.owner}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Verification Status
              </div>

              <EnterpriseStatusBadge
                status={
                  listing.status ||
                  listing.verification?.status ||
                  'Draft'
                }
              />
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Assignment Status
              </div>

              <EnterpriseStatusBadge
                status={
                  listing.assignmentStatus ||
                  listing.assignment?.status ||
                  'Pending Agency Assignment'
                }
              />
            </div>
          </div>
        </div>

        {/* Agency Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-cream uppercase tracking-wider">
              Select Agency
            </h3>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/50" />

              <input
                type="text"
                placeholder="Search active agencies..."
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2 pl-9 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none placeholder:text-ink/40"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-navy-900/50">
            {isLoadingAgencies ? (
              <div className="p-8 text-center">
                <p className="text-sm text-ink/60">
                  Loading available agencies...
                </p>
              </div>
            ) : agencyLoadError ? (
              <div className="p-8 text-center">
                <p className="text-sm text-rose-400">
                  {agencyLoadError}
                </p>
              </div>
            ) : filteredAgencies.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-ink/60">
                  No active agencies available.
                </p>
              </div>
            ) : (
              <DataTable
                data={filteredAgencies}
                keyExtractor={(item) => item.id}
                columns={[
                  {
                    header: '',
                    className:
                      'w-10 text-center',

                    render: (item) => (
                      <input
                        type="radio"
                        name="agency_selection"
                        className="h-4 w-4 rounded-full border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
                        checked={
                          selectedAgencyId ===
                          item.id
                        }
                        onChange={() =>
                          setSelectedAgencyId(
                            item.id,
                          )
                        }
                      />
                    ),
                  },

                  {
                    header: 'Agency Name',

                    render: (item) => (
                      <div>
                        <div className="font-semibold text-cream">
                          {item.name}
                        </div>

                        <div className="text-[10px] text-ink/50 mt-0.5">
                          ID: {item.id}
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: 'Capacity',

                    render: (item) => (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-ink/60">
                          <Users className="h-3.5 w-3.5 text-blue-400" />
                          {item.agents} Agents
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-ink/60">
                          <FileCheck className="h-3.5 w-3.5 text-gold-400" />
                          {item.listings} Active
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: 'Status',

                    render: (item) => (
                      <EnterpriseStatusBadge
                        status={item.status}
                      />
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Assignment Notes */}
        <div className="space-y-2">
          <label className="font-heading text-sm font-bold text-cream uppercase tracking-wider block">
            Assignment Notes (Internal)
          </label>

          <textarea
            className="w-full h-24 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none placeholder:text-ink/40 resize-none"
            placeholder="E.g., Luxury specialist requested, Priority assignment, VIP owner..."
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />
        </div>

        {/* Assignment Summary */}
        {selectedAgency && (
          <div className="rounded-xl bg-gold-400/5 border border-gold-400/20 p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-gold-400/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-gold-400" />
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-bold text-gold-400 mb-2">
                Ready to Dispatch
              </h4>

              <p className="text-sm text-ink/80 leading-relaxed">
                You are about to assign{' '}
                <span className="font-semibold text-cream">
                  {listing.title}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-cream">
                  {selectedAgency.name}
                </span>
                . The agency will be notified
                immediately and the property will
                appear in their Assignment Center.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}