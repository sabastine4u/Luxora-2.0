import { useState } from 'react';
import { UserCircle, Filter, Plus, FileText, ArrowRight, Users, Home, Star, Phone, Activity } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { agencyClients } from '../../../data/agencyData';
import type { AgencyClient } from '../../../types/agency';

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clientType, setClientType] = useState<'All' | 'Buyer' | 'Owner'>('All');
  const [selectedClient, setSelectedClient] = useState<AgencyClient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const clients = agencyClients;

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = clientType === 'All' || c.type === clientType;
    return matchesSearch && matchesType;
  });

  const handleViewClient = (client: AgencyClient) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Client Management"
        subtitle="Manage buyers, owners, and monitor client satisfaction."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Export
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Client
            </GoldButton>
          </div>
        }
      />

      {/* Client Dashboard KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Active Buyers"
          value="124"
          trend="+12 this month"
          trendColor="text-blue-400"
          icon={Users}
        />
        <KPICard
          title="Active Owners"
          value="85"
          trend="+5 this month"
          trendColor="text-emerald-400"
          icon={Home}
        />
        <KPICard
          title="VIP Clients"
          value="18"
          trend="High net-worth"
          trendColor="text-gold-400"
          icon={Star}
        />
        <KPICard
          title="Returning Clients"
          value="34%"
          trend="Repeat transactions"
          trendColor="text-emerald-400"
          icon={Activity}
        />
        <KPICard
          title="New Clients"
          value="24"
          trend="Last 30 days"
          trendColor="text-emerald-400"
          icon={UserCircle}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Main Client Table */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search clients by name or email..."
            actions={
              <div className="flex gap-2">
                <select 
                  className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as 'All' | 'Buyer' | 'Owner')}
                >
                  <option value="All">All Types</option>
                  <option value="Buyer">Buyers</option>
                  <option value="Owner">Owners</option>
                </select>
                <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</GhostButton>
              </div>
            }
          />

          <div className="flex-1 mt-6">
            <DataTable
              data={filteredClients}
              keyExtractor={(c) => String(c.id)}
              columns={[
                {
                  header: "Client Profile",
                  render: (c) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center font-bold text-cream border border-white/10">
                        {String(c.name).charAt(0)}
                      </div>
                      <div>
                        <div 
                          className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                          onClick={() => handleViewClient(c)}
                        >
                          {String(c.name)}
                        </div>
                        <div className="text-xs text-ink/60 mt-0.5">{String(c.email)}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Type",
                  render: (c) => (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${c.type === 'Buyer' ? 'bg-blue-400/10 text-blue-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                      {String(c.type)}
                    </span>
                  )
                },
                {
                  header: "Agent",
                  render: (c) => <span className="text-sm text-ink/80">{String(c.agent)}</span>
                },
                {
                  header: "Transactions",
                  render: (c) => <span className="font-medium text-cream">{String(c.transactions)}</span>
                },
                {
                  header: "Status",
                  render: (c) => <EnterpriseStatusBadge status={String(c.status)} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (c) => (
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors" title="Contact">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleViewClient(c)}
                        className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors" 
                        title="View Profile"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Sidebar: Intelligence */}
        <div className="space-y-6">
          
          {/* Client Growth & Retention */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Growth & Retention</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Client Retention Rate</span>
                  <span className="font-bold text-emerald-400">92%</span>
                </div>
                <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-400" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] uppercase font-bold tracking-widest text-ink/60 mb-3">Buyer vs Owner Distribution</div>
                <SegmentedProgressBar
                  segments={[
                    { label: 'Buyers', value: 60, color: 'bg-blue-400' },
                    { label: 'Owners', value: 40, color: 'bg-emerald-400' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Active Transactions */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Active Transactions</h3>
            <div className="space-y-3">
              <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                <div className="text-sm font-bold text-cream mb-1">Ikoyi Penthouse</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink/60">Aliko Dangote</span>
                  <span className="text-gold-400 font-bold">Offer Pending</span>
                </div>
              </div>
              <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                <div className="text-sm font-bold text-cream mb-1">Victoria Island Office</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink/60">Folorunso Alakija</span>
                  <span className="text-blue-400 font-bold">Under Contract</span>
                </div>
              </div>
            </div>
          </div>

          {/* Satisfaction Overview */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-400" /> Client Satisfaction
            </h3>
            <div className="text-4xl font-bold text-cream mb-2">4.8<span className="text-xl text-ink/40">/5</span></div>
            <div className="text-sm text-ink/60 mb-4">Based on 142 reviews</div>
            <div className="flex gap-1 text-gold-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current opacity-50" />
            </div>
          </div>

        </div>

      </div>

      <EnterpriseDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedClient ? `Client: ${selectedClient.name}` : 'Client Details'}
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1">Message Client</GhostButton>
            <GoldButton className="flex-1">Reassign Agent</GoldButton>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-semibold text-cream mb-4">Client Information</h4>
            <div className="space-y-3 text-sm text-ink/80">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Email</span><span className="font-medium text-cream">{selectedClient?.email}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Phone</span><span className="font-medium text-cream">{selectedClient?.phone}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Type</span><span className="font-medium text-cream">{selectedClient?.type}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Assigned Agent</span><span className="font-medium text-cream">{selectedClient?.agent}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Total Transactions</span><span className="font-medium text-cream">{selectedClient?.transactions}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>Last Communication</span><span className="font-medium text-cream">{selectedClient?.lastComm}</span></div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}
