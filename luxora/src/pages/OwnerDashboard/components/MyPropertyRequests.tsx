import { useState, useMemo } from 'react';
import { Plus, FileText, Upload, Trash2, X, Eye, Building2 } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { properties } from '../../../data/luxoraData';


import { useToast } from '../../../contexts/ToastContext';

// Types
type RequestStatus = 'Draft' | 'Submitted' | 'Documents Pending' | 'Documents Verified' | 'Inspection Scheduled' | 'Inspection Complete' | 'Approved' | 'Published' | 'Rejected';

interface PropertyRequest {

  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
  submissionDate: string;
  lastUpdated: string;
  status: RequestStatus;
  progress: number;
  agent: {
    name: string;
    avatar: string;
  };
  timeline: { stage: string; date: string; status: 'completed' | 'current' | 'pending' }[];
  documents: { name: string; status: 'verified' | 'pending' | 'rejected' }[];
  notes?: string;
}

const mockRequests: PropertyRequest[] = [

  {
    id: 'PR-101',
    name: 'The Sapphire Residences',
    type: 'Penthouse',
    location: 'Eko Atlantic, Lagos',
    image: properties[0].image,
    submissionDate: '2025-10-12',
    lastUpdated: '2025-10-14',
    status: 'Documents Verified',
    progress: 40,
    agent: { name: 'James Okoro', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' },
    timeline: [
      { stage: 'Submitted', date: 'Oct 12', status: 'completed' },
      { stage: 'Documents Verified', date: 'Oct 14', status: 'current' },
      { stage: 'Inspection Scheduled', date: 'Pending', status: 'pending' },
      { stage: 'Published', date: 'Pending', status: 'pending' }
    ],
    documents: [
      { name: 'Title Deed.pdf', status: 'verified' },
      { name: 'Property Layout.pdf', status: 'verified' },
      { name: 'Utility Bill.pdf', status: 'verified' }
    ],
    notes: 'Awaiting scheduling of physical inspection.'
  },
  {
    id: 'PR-102',
    name: 'Oceanview Villa #4',
    type: 'Villa',
    location: 'Lekki Phase 1, Lagos',
    image: properties[1].image,
    submissionDate: '2025-09-28',
    lastUpdated: '2025-10-02',
    status: 'Published',
    progress: 100,
    agent: { name: 'Sarah Adeyemi', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' },
    timeline: [
      { stage: 'Submitted', date: 'Sep 28', status: 'completed' },
      { stage: 'Documents Verified', date: 'Sep 29', status: 'completed' },
      { stage: 'Inspection Complete', date: 'Oct 1', status: 'completed' },
      { stage: 'Published', date: 'Oct 2', status: 'completed' }
    ],
    documents: [
      { name: 'Title Deed.pdf', status: 'verified' },
      { name: 'Property Layout.pdf', status: 'verified' }
    ],
    notes: 'Successfully listed and live on the marketplace.'
  },
  {
    id: 'PR-103',
    name: 'Ikoyi Luxury Apartment',
    type: 'Apartment',
    location: 'Ikoyi, Lagos',
    image: properties[2].image,
    submissionDate: '2025-10-25',
    lastUpdated: '2025-10-25',
    status: 'Draft',
    progress: 10,
    agent: { name: 'Unassigned', avatar: '' },
    timeline: [
      { stage: 'Draft Created', date: 'Oct 25', status: 'current' },
      { stage: 'Submitted', date: 'Pending', status: 'pending' }
    ],
    documents: [],
    notes: 'Please complete the property details to submit.'
  }
];

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'Draft': return { bg: 'bg-white/5 text-ink/60 border-white/10' };
    case 'Submitted': return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    case 'Documents Pending': return { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    case 'Documents Verified': return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'Inspection Scheduled': return { bg: 'bg-blue-400/10 text-blue-300 border-blue-400/20' };
    case 'Inspection Complete': return { bg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' };
    case 'Approved': return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'Published': return { bg: 'bg-gold-400/10 text-gold-400 border-gold-400/20' };
    case 'Rejected': return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    default: return { bg: 'bg-white/5 text-ink/60 border-white/10' };
  }
};

export default function MyPropertyRequests() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  const [selectedReq, setSelectedReq] = useState<PropertyRequest | null>(null);

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
    showToast({ type: 'info', title: 'Submit Property', description: 'Property submission form will be available during backend integration.' });
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Requests <span className="text-sm font-normal text-gold-400 ml-2">({mockRequests.length} Total)</span></h2>
          <p className="text-sm text-ink/60">Track every property you have submitted for verification and publication.</p>
        </div>
        <GoldButton className="flex items-center gap-2" onClick={handlePropertySubmit}>
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
          onAction={() => {}}
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
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${getStatusConfig(req.status).bg}`}>
                        {req.status}
                      </span>
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
                      <button className="p-2 text-ink/50 hover:text-emerald-400 transition-colors" title="Upload Documents" onClick={() => showToast({ type: 'info', title: 'Upload Documents', description: 'Document upload will be available during backend integration.' })}>
                        <Upload className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-ink/50 hover:text-rose-400 transition-colors" title="Withdraw Request" onClick={() => showToast({ type: 'info', title: 'Withdraw Request', description: 'Request withdrawal will be available during backend integration.' })}>
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
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusConfig(req.status).bg}`}>
                      {req.status}
                    </span>
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
      {selectedReq && (
        <>
          <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-[100] transition-opacity" onClick={() => setSelectedReq(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-navy-950 border-l border-white/10 z-[110] p-6 overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-xl font-bold text-cream">Request Details</h3>
              <button onClick={() => setSelectedReq(null)} className="p-2 text-ink/50 hover:text-cream rounded-full hover:bg-white/5 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8 flex-1">
              {/* Property Info */}
              <div className="flex gap-4">
                <img src={selectedReq.image} alt={selectedReq.name} className="h-20 w-28 rounded-xl object-cover border border-white/10 shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-cream text-lg mb-1 truncate">{selectedReq.name}</h4>
                  <div className="text-sm text-ink/60 mb-2 truncate">{selectedReq.location}</div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${getStatusConfig(selectedReq.status).bg}`}>
                    {selectedReq.status}
                  </span>
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
                  <button className="text-[10px] uppercase tracking-wider font-semibold text-gold-400 hover:text-gold-300" onClick={() => showToast({ type: 'info', title: 'Upload Documents', description: 'Document upload will be available during backend integration.' })}>Upload</button>
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

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-3 shrink-0">
              <GoldButton className="flex-1 justify-center" onClick={() => showToast({ type: 'info', title: 'Track Progress', description: 'Progress tracking will be available during backend integration.' })}>Track Progress</GoldButton>
              <GhostButton className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10" onClick={() => showToast({ type: 'info', title: 'Withdraw Request', description: 'Request withdrawal will be available during backend integration.' })}><Trash2 className="h-4 w-4 mr-2" /> Withdraw</GhostButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
