import { useState } from 'react';
import { Building2, Filter, ShieldCheck, Clock, User, AlertCircle, ArrowRightLeft, CheckCircle2, XCircle } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SmartAgentMatchModal } from './modals/SmartAgentMatchModal';
import { agencyAssignments } from '../../../data/agencyData';
import type { AgencyAssignment } from '../../../types/agency';

export default function AssignmentCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<AgencyAssignment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const filteredData = agencyAssignments.filter(a => 
    a.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (assignment: AgencyAssignment) => {
    setSelectedAssignment(assignment);
    setIsDrawerOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
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
              <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Status</GhostButton>
              <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Priority</GhostButton>
            </div>
          }
        />

        <div className="flex-1 mt-6">
          <DataTable
            data={filteredData}
            keyExtractor={(a) => a.id}
            columns={[
              {
                header: "Property & Owner",
                render: (a) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-navy-900 border border-white/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gold-400" />
                    </div>
                    <div>
                      <div 
                        className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                        onClick={() => handleView(a)}
                      >
                        {a.propertyTitle}
                      </div>
                      <div className="text-[10px] text-ink/60 flex items-center gap-2">
                        <User className="h-3 w-3" /> {a.ownerName}
                      </div>
                    </div>
                  </div>
                )
              },
              {
                header: "Source",
                render: (a) => (
                  <div>
                    <div className="text-sm text-cream">{a.source}</div>
                    <div className="text-[10px] text-ink/60">{a.propertyLocation}</div>
                  </div>
                )
              },
              {
                header: "Verification",
                render: (a) => (
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className={`h-4 w-4 ${a.verificationLevel === 'Premium' ? 'text-gold-400' : 'text-emerald-400'}`} />
                    <span className="text-xs text-cream">{a.verificationLevel}</span>
                  </div>
                )
              },
              {
                header: "Priority",
                render: (a) => (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getPriorityColor(a.priority)}`}>
                    {a.priority}
                  </span>
                )
              },
              {
                header: "Recommended Agent",
                render: (a) => (
                  <div className="text-sm">
                    {a.recommendedAgent ? (
                      <span className="text-cream">{a.recommendedAgent}</span>
                    ) : (
                      <span className="text-ink/40 italic">Unassigned</span>
                    )}
                  </div>
                )
              },
              {
                header: "Deadline",
                render: (a) => (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-xs font-medium text-rose-400">{a.responseDeadline}</span>
                  </div>
                )
              },
              {
                header: "Status",
                render: (a) => <EnterpriseStatusBadge status={a.status} />
              },
              {
                header: <div className="text-right">Action</div>,
                className: "text-right",
                render: (a) => (
                  <GoldButton size="sm" onClick={() => handleView(a)}>Review</GoldButton>
                )
              }
            ]}
          />
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedAssignment ? `Assignment: ${selectedAssignment.id}` : 'Assignment Details'}
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1 flex justify-center items-center gap-2 text-rose-400 hover:text-rose-400 hover:bg-rose-400/10">
              <XCircle className="h-4 w-4" /> Reject
            </GhostButton>
            <GoldButton className="flex-1 flex justify-center items-center gap-2" onClick={() => setIsMatchModalOpen(true)}>
              <CheckCircle2 className="h-4 w-4" /> Assign Agent
            </GoldButton>
          </div>
        }
      >
        <div className="space-y-6 pb-20">
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-ink/50" /> Property Overview
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Title</div>
                <div className="text-cream font-medium">{selectedAssignment?.propertyTitle}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Location</div>
                <div className="text-cream">{selectedAssignment?.propertyLocation}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Type</div>
                <div className="text-cream">{selectedAssignment?.propertyType}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Price</div>
                <div className="text-cream font-medium">{selectedAssignment?.propertyPrice}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Owner</div>
                <div className="text-cream">{selectedAssignment?.ownerName}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Source</div>
                <div className="text-cream">{selectedAssignment?.source}</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-ink/50" /> Assignment Status
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Priority</div>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-block ${selectedAssignment ? getPriorityColor(selectedAssignment.priority) : ''}`}>
                    {selectedAssignment?.priority}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Verification Level</div>
                <div className="text-cream flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-gold-400" />
                  {selectedAssignment?.verificationLevel}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Recommended Agent</div>
                {selectedAssignment?.recommendedAgent ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-950 mt-1">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center font-bold text-cream">
                        {selectedAssignment.recommendedAgent.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-cream">{selectedAssignment.recommendedAgent}</div>
                        <div className="text-[10px] text-emerald-400">Match Score: 95%</div>
                      </div>
                    </div>
                    <GhostButton size="sm" className="text-xs">Change</GhostButton>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-white/20 text-center mt-1">
                    <span className="text-sm text-ink/60">No agent recommended. System requires manual assignment.</span>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">Response Deadline</div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-medium text-rose-400">{selectedAssignment?.responseDeadline}</span>
                  <span className="text-xs text-ink/60">(Time remaining for agent to accept)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>

      <SmartAgentMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        assignmentId={selectedAssignment?.id}
        propertyTitle={selectedAssignment?.propertyTitle}
        propertyLocation={selectedAssignment?.propertyLocation}
      />
    </div>
  );
}
