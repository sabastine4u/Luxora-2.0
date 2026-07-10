import React, { useState } from 'react';
import { 
  Phone, Mail, MoreHorizontal, UserCheck, Clock, CheckCircle2, DollarSign, 
  Filter, SlidersHorizontal, ArrowRight, UserCircle, MapPin, 
  Calendar as CalendarIcon, Briefcase, FileText, X, ArrowUpRight
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

// --- MOCK DATA ---
const KPI_DATA = [
  { label: 'Total Leads', value: '45', icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'New Leads', value: '12', icon: SparklesIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Qualified Leads', value: '18', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Viewings Scheduled', value: '8', icon: CalendarIcon, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { label: 'Closed Deals', value: '5', icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

const PIPELINE_STAGES = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'viewing', label: 'Viewing Scheduled' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed', label: 'Closed' },
  { id: 'lost', label: 'Lost' },
];

type Lead = {
  id: string;
  name: string;
  avatar?: string;
  budget: string;
  property: string;
  location: string;
  phone: string;
  email: string;
  assignedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  stage: string;
  type: string;
  financing: string;
  notes: string;
};

const MOCK_LEADS: Lead[] = [
  {
    id: 'L-245', name: 'Bisi Williams', budget: '₦400M - ₦500M', property: 'Skyline Penthouse Residence',
    location: 'Eko Atlantic', phone: '+234 800 111 2222', email: 'bisi@example.com', assignedDate: 'Today',
    priority: 'High', stage: 'new', type: 'Buyer', financing: 'Pre-approved Mortgage',
    notes: 'Looking for a penthouse with ocean views. Needs to move in within 3 months.'
  },
  {
    id: 'L-244', name: 'Chidi Okafor', budget: '₦150M - ₦200M', property: 'Marina View Apartment',
    location: 'Lekki Phase 1', phone: '+234 800 333 4444', email: 'chidi@example.com', assignedDate: 'Yesterday',
    priority: 'Medium', stage: 'contacted', type: 'Buyer', financing: 'Cash Buyer',
    notes: 'Interested in investment properties. High yield preferred.'
  },
  {
    id: 'L-243', name: 'Amara Eze', budget: '₦800M+', property: 'Garden Court Villa',
    location: 'Banana Island', phone: '+234 800 555 6666', email: 'amara@example.com', assignedDate: '2 Days Ago',
    priority: 'High', stage: 'qualified', type: 'Buyer', financing: 'Pre-approved Mortgage',
    notes: 'Family of 5, requires at least 6 bedrooms and a large garden.'
  },
  {
    id: 'L-242', name: 'Tunde Bakare', budget: '₦300M', property: 'The Continental Duplex',
    location: 'Maitama, Abuja', phone: '+234 800 777 8888', email: 'tunde@example.com', assignedDate: 'Oct 24',
    priority: 'Medium', stage: 'viewing', type: 'Buyer', financing: 'Seeking Mortgage',
    notes: 'Viewing scheduled for this Saturday at 2 PM.'
  },
  {
    id: 'L-241', name: 'Ngozi Okonjo', budget: '₦250M', property: 'Victoria Island Condo',
    location: 'Victoria Island', phone: '+234 800 999 0000', email: 'ngozi@example.com', assignedDate: 'Oct 20',
    priority: 'High', stage: 'negotiation', type: 'Buyer', financing: 'Cash Buyer',
    notes: 'Submitted an offer 5% below asking. Awaiting seller response.'
  },
];

const ACTIVITY_TIMELINE = [
  { title: 'Deal Closed', date: 'Oct 28', active: false },
  { title: 'Offer Submitted', date: 'Oct 26', active: false },
  { title: 'Viewing Completed', date: 'Oct 24', active: true },
  { title: 'Viewing Scheduled', date: 'Oct 22', active: true },
  { title: 'Buyer Contacted', date: 'Oct 21', active: true },
  { title: 'Lead Assigned', date: 'Oct 21', active: true },
];

// --- COMPONENT ---
export default function AssignedLeads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
          <GhostButton size="sm"><ArrowUpRight className="h-4 w-4 mr-2"/> Export CSV</GhostButton>
          <GoldButton size="sm">Add Lead</GoldButton>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPI_DATA.map((kpi, i) => (
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
                          <button className="text-ink/40 hover:text-cream"><MoreHorizontal className="h-4 w-4" /></button>
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
                <GoldButton size="sm" onClick={() => alert('Mock: Call Buyer')}><Phone className="h-4 w-4 mr-2" /> Call Buyer</GoldButton>
                <GhostButton size="sm" onClick={() => alert('Mock: Email Buyer')}><Mail className="h-4 w-4 mr-2" /> Email</GhostButton>
                <GhostButton size="sm" onClick={() => alert('Mock: Schedule Viewing')}><CalendarIcon className="h-4 w-4 mr-2" /> Schedule</GhostButton>
                <GhostButton size="sm" onClick={() => alert('Mock: Move Pipeline Stage')}><ArrowRight className="h-4 w-4 mr-2" /> Move Stage</GhostButton>
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
                  <button className="text-gold-400 hover:text-gold-300 text-xs font-semibold flex items-center gap-1">
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

    </div>
  );
}
