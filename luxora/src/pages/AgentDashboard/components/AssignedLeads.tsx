import { useState } from 'react';
import { Mail, Phone, Clock, ArrowUpRight, FileText, UserCheck, DollarSign, Filter, SlidersHorizontal, ArrowRight, UserCircle, MapPin, MoreHorizontal, X, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';
import { MOCK_LEADS, KPI_DATA_LEADS, ACTIVITY_TIMELINE } from '../../../data/agentData';
import type { Lead } from '../../../types/agent';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

const PIPELINE_STAGES = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'viewing', label: 'Viewing Scheduled' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed', label: 'Closed' },
  { id: 'lost', label: 'Lost' },
];

export default function AssignedLeads() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<{ title: string, type: string, data?: Record<string, unknown> } | null>(null);

  const handleAction = (title: string, type: string, data?: Record<string, unknown>) => {
    setActiveWorkflow({ title, type, data });
  };

  const executeWorkflow = () => {
    showToast({ type: 'success', title: 'Action Initiated', description: `Executing: ${activeWorkflow?.title}. Integration pending.` });
    setActiveWorkflow(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Medium': return 'text-gold-400 bg-gold-400/10 border-gold-400/20';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  const filteredLeads = MOCK_LEADS.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Assigned Leads</h2>
          <p className="text-sm text-ink/60">Manage, qualify, and convert buyer leads into successful transactions.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton size="sm" onClick={() => handleAction('Export CSV', 'export')}><ArrowUpRight className="h-4 w-4 mr-2"/> Export CSV</GhostButton>
          <GoldButton size="sm" onClick={() => handleAction('Add New Lead', 'add_lead')}>Add Lead</GoldButton>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPI_DATA_LEADS.map((kpi, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-navy-800/50 p-4 transition-all hover:bg-navy-800/80 flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-cream leading-none">{kpi.value}</div>
              <div className="text-xs font-medium text-ink/60 mt-1">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search leads by name or property..."
        actions={
          <>
            <GhostButton size="sm" className="bg-navy-900/80"><Filter className="h-4 w-4 mr-2"/> Status</GhostButton>
            <GhostButton size="sm" className="bg-navy-900/80"><Briefcase className="h-4 w-4 mr-2"/> Property Type</GhostButton>
            <GhostButton size="sm" className="bg-navy-900/80"><MapPin className="h-4 w-4 mr-2"/> Location</GhostButton>
            <GhostButton size="sm" className="bg-navy-900/80"><SlidersHorizontal className="h-4 w-4 mr-2"/> Sort: Priority</GhostButton>
          </>
        }
      />

      {/* KANBAN BOARD */}
      {filteredLeads.length === 0 ? (
        <div className="py-12">
          <EmptyState 
            icon={<UserCheck className="h-12 w-12 text-gold-400" />}
            title="No assigned leads."
            description="You don't have any leads matching your filters."
            actionLabel="Refresh Leads"
            onAction={() => setSearchQuery('')}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-6 min-w-max h-[calc(100vh-400px)] min-h-[500px]">
            {PIPELINE_STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
              
              return (
                <div key={stage.id} className="w-80 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-heading font-semibold text-cream">{stage.label}</h3>
                    <span className="bg-navy-800 text-ink/60 text-xs font-bold px-2 py-0.5 rounded-full border border-white/10">
                      {stageLeads.length}
                    </span>
                  </div>
                  
                  {/* Column Cards */}
                  <div className="flex-1 rounded-2xl bg-navy-800/30 border border-white/5 p-3 space-y-3 overflow-y-auto no-scrollbar">
                    {stageLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className="bg-navy-900 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-400/5 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-navy-800 flex items-center justify-center border border-white/5">
                              {lead.avatar ? (
                                <img src={lead.avatar} alt={lead.name} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <UserCircle className="h-6 w-6 text-ink/40" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-cream group-hover:text-gold-400 transition-colors">{lead.name}</div>
                              <div className="text-[10px] text-ink/50 uppercase tracking-wider">{lead.type}</div>
                            </div>
                          </div>
                          <button className="text-ink/40 hover:text-cream" onClick={(e) => { e.stopPropagation(); handleAction(`Lead Actions: ${lead.name}`, 'lead_actions', lead); }}><MoreHorizontal className="h-4 w-4" /></button>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-ink/70">
                            <Briefcase className="h-3.5 w-3.5 text-ink/40" />
                            <span className="truncate">{lead.property}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ink/70">
                            <DollarSign className="h-3.5 w-3.5 text-ink/40" />
                            {lead.budget}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ink/70">
                            <MapPin className="h-3.5 w-3.5 text-ink/40" />
                            {lead.location}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${getPriorityColor(lead.priority)}`}>
                            {lead.priority} Priority
                          </span>
                          <span className="text-[10px] text-ink/40 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {lead.assignedDate}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {stageLeads.length === 0 && (
                      <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-xs text-ink/30 font-medium">
                        Drag leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LEAD DETAILS SIDE PANEL */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-900 border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="font-heading text-xl font-bold text-cream">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-ink/50 hover:text-cream rounded-lg hover:bg-white/5 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              
              {/* Buyer Info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-navy-800 flex items-center justify-center border border-white/5">
                  {selectedLead.avatar ? (
                    <img src={selectedLead.avatar} alt={selectedLead.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <UserCircle className="h-8 w-8 text-ink/40" />
                  )}
                </div>
                <div>
                  <div className="text-xl font-bold text-cream">{selectedLead.name}</div>
                  <div className="text-sm text-ink/50 mb-2">{selectedLead.type} • Assigned {selectedLead.assignedDate}</div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${getPriorityColor(selectedLead.priority)}`}>
                    {selectedLead.priority} Priority
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <GoldButton size="sm" onClick={() => handleAction('Call Buyer', 'call', selectedLead)}><Phone className="h-4 w-4 mr-2" /> Call Buyer</GoldButton>
                <GhostButton size="sm" onClick={() => handleAction('Email Buyer', 'email', selectedLead)}><Mail className="h-4 w-4 mr-2" /> Email</GhostButton>
                <GhostButton size="sm" onClick={() => handleAction('Schedule Viewing', 'schedule', selectedLead)}><CalendarIcon className="h-4 w-4 mr-2" /> Schedule</GhostButton>
                <GhostButton size="sm" onClick={() => handleAction('Move Pipeline Stage', 'stage_change', selectedLead)}><ArrowRight className="h-4 w-4 mr-2" /> Move Stage</GhostButton>
              </div>

              {/* Requirements & Budget */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">Requirements</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/50">Interested In</span>
                    <span className="text-cream font-medium text-right">{selectedLead.property}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Preferred Location</span>
                    <span className="text-cream font-medium">{selectedLead.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Budget</span>
                    <span className="text-cream font-medium">{selectedLead.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Financing Status</span>
                    <span className="text-emerald-400 font-medium">{selectedLead.financing}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">Contact</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-3 text-cream">
                    <Phone className="h-4 w-4 text-ink/40" /> {selectedLead.phone}
                  </div>
                  <div className="flex items-center gap-3 text-cream">
                    <Mail className="h-4 w-4 text-ink/40" /> {selectedLead.email}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60">Notes</h4>
                  <button className="text-gold-400 hover:text-gold-300 text-xs font-semibold flex items-center gap-1" onClick={() => handleAction('Add Note', 'add_note', selectedLead)}>
                    <FileText className="h-3 w-3" /> Add Note
                  </button>
                </div>
                <div className="bg-navy-800/50 border border-white/5 rounded-xl p-4 text-sm text-ink/80 leading-relaxed italic">
                  "{selectedLead.notes}"
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">Recent Activity</h4>
                <div className="relative border-l border-white/10 ml-3 space-y-6 pb-4 pt-2">
                  {ACTIVITY_TIMELINE.map((activity, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-navy-900 ${activity.active ? 'bg-gold-400' : 'bg-white/20'}`} />
                      <div>
                        <div className={`text-sm font-medium ${activity.active ? 'text-cream' : 'text-ink/50'}`}>{activity.title}</div>
                        <div className="text-[10px] font-semibold text-ink/40 mt-1 uppercase tracking-wider">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() => setActiveWorkflow(null)}
        title={activeWorkflow?.title || 'Workflow'}
        footerActions={
          <GoldButton onClick={executeWorkflow} className="w-full justify-center">Confirm Action</GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">Workflow Details</h4>
            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the <strong>{activeWorkflow?.type}</strong> workflow. 
              Please review the action details below and confirm to integrate with the backend system.
            </p>
          </div>
          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">Context Data</h4>
              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(activeWorkflow.data).map(([key, value]) => {
                  if (typeof value === 'string' || typeof value === 'number') {
                    return (
                      <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium text-cream">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>

    </div>
  );
}
