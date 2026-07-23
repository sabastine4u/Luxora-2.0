import { useState, useMemo, useEffect } from 'react';
import { Plus, FileText, Upload, Trash2, Eye, Building2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
import { mockRequests } from '../../../data/ownerData';
import type { PropertyRequest } from '../../../types/owner';
import ConfirmationModal from './modals/ConfirmationModal';
import UploadDocumentModal from './modals/UploadDocumentModal';
import PropertySubmissionModal from './modals/PropertySubmissionModal';

export default function MyPropertyRequests() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedReq, setSelectedReq] = useState<PropertyRequest | null>(null);
  
  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'submit') {
      setTimeout(() => {
        setIsSubmissionModalOpen(true);
        setSearchParams(prev => {
          prev.delete('action');
          return prev;
        }, { replace: true });
      }, 0);
    }
  }, [searchParams, setSearchParams]);

  const filteredRequests = useMemo(() => {
    return mockRequests.filter(req => {
      const matchSearch = req.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || req.status === statusFilter;
      const matchType = typeFilter === 'All' || req.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    }).sort((a, b) => {
      if (sortOrder === 'Newest') return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      if (sortOrder === 'Oldest') return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
      if (sortOrder === 'Recently Updated') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      return 0;
    });
  }, [search, statusFilter, typeFilter, sortOrder]);

  const handlePropertySubmit = () => {
    setIsSubmissionModalOpen(false);
    showToast({ type: 'success', title: 'Property Submitted', description: 'Your property has been submitted for review.' });
    navigate('/owner-dashboard?tab=Listing+Journey');
  };

  const handleWithdraw = () => {
    showToast({ type: 'success', title: 'Request Withdrawn', description: 'Your property request has been withdrawn.' });
    setIsWithdrawModalOpen(false);
    setSelectedReq(null);
  };

  const handleUpload = () => {
    showToast({ type: 'success', title: 'Document Uploaded', description: 'Document has been successfully submitted.' });
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Requests <span className="text-sm font-normal text-gold-400 ml-2">({mockRequests.length} Total)</span></h2>
          <p className="text-sm text-ink/60">Track every property you have submitted for verification and publication.</p>
        </div>
        <GoldButton className="flex items-center gap-2" onClick={() => setIsSubmissionModalOpen(true)}>
          <Plus className="h-4 w-4" /> Submit New Property
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
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Documents Verified">Documents Verified</option>
              <option value="Published">Published</option>
            </select>
            <select 
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
            </select>
            <select 
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Recently Updated">Recently Updated</option>
            </select>
          </>
        }
      />

      {/* Main Content */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8 text-gold-400" />}
          title="No property requests found."
          description="You haven't submitted any properties matching these filters yet."
          actionLabel="Submit New Property"
          onAction={() => setIsSubmissionModalOpen(true)}
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
                  header: "Property",
                  render: (req) => (
                    <div className="flex items-center gap-4">
                      <img src={req.image} alt={req.name} className="h-12 w-16 rounded-lg object-cover border border-white/10" />
                      <div>
                        <div className="font-semibold text-cream">{req.name}</div>
                        <div className="text-xs text-ink/50">{req.type} • Submitted {req.submissionDate}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Agent",
                  render: (req) => (
                    req.agent.name !== 'Unassigned' ? (
                      <div className="flex items-center gap-2">
                        <img src={req.agent.avatar} alt="Agent" className="h-6 w-6 rounded-full object-cover" />
                        <span className="text-ink/80 whitespace-nowrap">{req.agent.name}</span>
                      </div>
                    ) : (
                      <span className="text-ink/40 text-xs italic">Unassigned</span>
                    )
                  )
                },
                {
                  header: "Status & Progress",
                  render: (req) => (
                    <div className="space-y-2 max-w-[200px]">
                      <EnterpriseStatusBadge status={req.status} />
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gold-400 rounded-full transition-all" style={{ width: `${req.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-ink/50">{req.progress}%</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Updated",
                  render: (req) => <span className="text-ink/60 text-xs whitespace-nowrap">{req.lastUpdated}</span>
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (req) => (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedReq(req)} className="p-2 text-ink/50 hover:text-gold-400 transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-ink/50 hover:text-emerald-400 transition-colors" title="Upload Documents" onClick={() => setIsUploadModalOpen(true)}>
                        <Upload className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-ink/50 hover:text-rose-400 transition-colors" title="Withdraw Request" onClick={() => setIsWithdrawModalOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-4">
            {filteredRequests.map(req => (
              <div key={req.id} className="rounded-2xl border border-white/10 bg-navy-800/50 p-4 relative">
                <div className="flex gap-4 mb-4">
                  <img src={req.image} alt={req.name} className="h-16 w-20 rounded-lg object-cover border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-cream text-sm mb-1 truncate">{req.name}</h3>
                    <div className="text-[10px] text-ink/50 mb-2 truncate">{req.type}</div>
                    <EnterpriseStatusBadge status={req.status} />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-ink/50 mb-1">
                    <span>Progress</span>
                    <span>{req.progress}%</span>
                  </div>
                  <div className="h-1 bg-navy-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full" style={{ width: `${req.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="text-[10px] text-ink/40">Updated {req.lastUpdated}</div>
                  <div className="flex gap-2">
                    <GhostButton size="sm" className="px-3 py-1 text-xs" onClick={() => setSelectedReq(req)}>Details</GhostButton>
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
        onClose={() => setSelectedReq(null)}
        title="Request Details"
        footerActions={
          <>
            <GoldButton className="flex-1 justify-center" onClick={() => navigate('/owner-dashboard?tab=Verification+Progress')}>
              Track Progress
            </GoldButton>
            <GhostButton className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10" onClick={() => setIsWithdrawModalOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Withdraw
            </GhostButton>
          </>
        }
      >
        {selectedReq && (
          <div className="space-y-8">
            {/* Property Info */}
            <div className="flex gap-4">
              <img src={selectedReq.image} alt={selectedReq.name} className="h-20 w-28 rounded-xl object-cover border border-white/10 shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-cream text-lg mb-1 truncate">{selectedReq.name}</h4>
                <div className="text-sm text-ink/60 mb-2 truncate">{selectedReq.location}</div>
                <EnterpriseStatusBadge status={selectedReq.status} />
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2 bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-cream">Overall Progress</span>
                <span className="text-gold-400 font-bold">{selectedReq.progress}%</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 rounded-full transition-all" style={{ width: `${selectedReq.progress}%` }} />
              </div>
              <div className="text-xs text-ink/50 pt-2 flex justify-between">
                <span>Est. Completion: Nov 15, 2025</span>
                <span>Submitted: {selectedReq.submissionDate}</span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-cream mb-4">Journey Timeline</h4>
              <div className="relative border-l-2 border-white/5 ml-3 space-y-6">
                {selectedReq.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-navy-950 ${step.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20' : step.status === 'current' ? 'border-gold-400 bg-gold-400/20' : 'border-white/10'}`} />
                    <div className={`text-sm font-semibold ${step.status === 'completed' ? 'text-cream' : step.status === 'current' ? 'text-gold-400' : 'text-ink/40'}`}>
                      {step.stage}
                    </div>
                    <div className="text-xs text-ink/50">{step.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-cream">Submitted Documents</h4>
                <button className="text-[10px] uppercase tracking-wider font-semibold text-gold-400 hover:text-gold-300" onClick={() => setIsUploadModalOpen(true)}>Upload</button>
              </div>
              {selectedReq.documents.length > 0 ? (
                <div className="space-y-3">
                  {selectedReq.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-navy-900/50 border border-white/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-ink/50 shrink-0" />
                        <span className="text-sm text-cream truncate">{doc.name}</span>
                      </div>
                      <span className={`text-xs capitalize ml-4 shrink-0 ${doc.status === 'verified' ? 'text-emerald-400' : 'text-yellow-400'}`}>{doc.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-ink/50 italic">No documents uploaded yet.</div>
              )}
            </div>

            {/* Assigned Staff */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-xs text-ink/50 mb-2">Assigned Agent</div>
                {selectedReq.agent.name !== 'Unassigned' ? (
                  <div className="flex items-center gap-3">
                    <img src={selectedReq.agent.avatar} alt="Agent" className="h-8 w-8 rounded-full object-cover shrink-0" />
                    <div className="text-sm font-semibold text-cream truncate">{selectedReq.agent.name}</div>
                  </div>
                ) : (
                  <div className="text-sm text-ink/40 italic">Pending Assignment</div>
                )}
              </div>
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-xs text-ink/50 mb-2">Internal Notes</div>
                <div className="text-xs text-ink/70 leading-relaxed">{selectedReq.notes || 'No notes available.'}</div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ConfirmationModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
        title="Withdraw Request"
        description="Are you sure you want to withdraw this property request? This action cannot be undone."
        confirmText="Withdraw Request"
        isDestructive={true}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <PropertySubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={handlePropertySubmit}
      />
    </div>
  );
}
