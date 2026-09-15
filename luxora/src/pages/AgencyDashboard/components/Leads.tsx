import { useEffect, useState } from 'react';
import { Target, Filter, Plus, Calendar, Clock, UserCircle, MessageSquare, Zap, Activity, Building2, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import type { AgencyLead } from '../../../types/agency';
// Use the real Agency inquiry records returned by the backend.
import { propertyApi } from '../../../api/property.api';

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('');
  // Match the Lead filters to the real Inquiry statuses used by the backend.
  const [leadStatus, setLeadStatus] = useState<
    'All' |
    'New' |
    'Contacted' |
    'Viewing Scheduled' |
    'Negotiating' |
    'Closed' |
    'Lost'
  >('All');
  const [selectedLead, setSelectedLead] = useState<AgencyLead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Store the real Inquiry records returned for this Agency.
  const [agencyInquiries, setAgencyInquiries] = useState<any[]>([]);

  // Track the loading state while the real Lead data is being fetched.
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Load the Agency's real inquiries when the Leads page opens.
  useEffect(() => {
    const fetchAgencyInquiries = async () => {
      try {
        setIsLoadingLeads(true);

        const response = await propertyApi.getAgencyInquiries();
        const rawResponse = response as any;

        // Support both the unwrapped API response and the Axios response shape.
        const inquiries = Array.isArray(rawResponse?.inquiries)
          ? rawResponse.inquiries
          : Array.isArray(rawResponse?.data?.inquiries)
            ? rawResponse.data.inquiries
            : [];

        setAgencyInquiries(inquiries);
      } catch (error) {
        console.error('Failed to load Agency inquiries:', error);
        setAgencyInquiries([]);
      } finally {
        setIsLoadingLeads(false);
      }
    };

    void fetchAgencyInquiries();
  }, []);

  // Convert backend Inquiry records into the shape already expected by this UI.
  const leads: AgencyLead[] = agencyInquiries.map((inquiry) => ({
    id: String(inquiry._id),
    name: String(inquiry.fullName || 'Unknown Lead'),
    email: String(inquiry.email || ''),
    phone: String(inquiry.phone || ''),
    interest: String(
      inquiry.property?.title ||
      'Property Inquiry'
    ),
    budget: inquiry.property?.price
      ? `₦${Number(inquiry.property.price).toLocaleString()}`
      : 'Not provided',
    status: String(inquiry.status || 'New'),
    agent: String(
      inquiry.agent?.fullName ||
      'Unassigned'
    ),
    // Lead scoring does not exist in the current Inquiry backend,
    // so keep this neutral instead of inventing a score.
    score: 0,
    source: String(inquiry.source || 'Website'),
    age: inquiry.createdAt
      ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(inquiry.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      )
      : 0,
    lastContact: inquiry.updatedAt
      ? new Date(inquiry.updatedAt).toLocaleString()
      : 'Never',
  }));

  // Calculate the number of inquiries created within the last seven days.
  const newLeadsLast7Days = agencyInquiries.filter((inquiry) => {
    if (!inquiry.createdAt) return false;

    const createdAt = new Date(inquiry.createdAt).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return createdAt >= sevenDaysAgo;
  }).length;

  // Calculate the current pipeline counts from the real Inquiry statuses.
  const newInquiryCount = agencyInquiries.filter(
    (inquiry) => inquiry.status === 'New'
  ).length;

  const contactedCount = agencyInquiries.filter(
    (inquiry) => inquiry.status === 'Contacted'
  ).length;

  const viewingScheduledCount = agencyInquiries.filter(
    (inquiry) => inquiry.status === 'Viewing Scheduled'
  ).length;

  const negotiatingCount = agencyInquiries.filter(
    (inquiry) => inquiry.status === 'Negotiating'
  ).length;

  const closedCount = agencyInquiries.filter(
    (inquiry) => inquiry.status === 'Closed'
  ).length;

  // Conversion is based on inquiries that have reached the Closed stage.
  const conversionRate =
    agencyInquiries.length > 0
      ? (closedCount / agencyInquiries.length) * 100
      : 0;

  // Calculate real Lead Source counts from the Inquiry source field.
  const websiteCount = agencyInquiries.filter(
    (inquiry) => inquiry.source === 'Website'
  ).length;

  const contactAgentCount = agencyInquiries.filter(
    (inquiry) => inquiry.source === 'Contact Agent'
  ).length;

  const scheduleViewingCount = agencyInquiries.filter(
    (inquiry) => inquiry.source === 'Schedule Viewing'
  ).length;

  const totalSourceCount =
    websiteCount +
    contactAgentCount +
    scheduleViewingCount;

  // Convert each real source count into a percentage.
  const websitePercentage =
    totalSourceCount > 0 ? (websiteCount / totalSourceCount) * 100 : 0;

  const contactAgentPercentage =
    totalSourceCount > 0
      ? (contactAgentCount / totalSourceCount) * 100
      : 0;

  const scheduleViewingPercentage =
    totalSourceCount > 0
      ? (scheduleViewingCount / totalSourceCount) * 100
      : 0;

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.interest.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      leadStatus === 'All' || l.status === leadStatus;

    return matchesSearch && matchesStatus;
  });
  // Open the drawer only when a real Lead has been selected.
  const handleViewLead = (lead: AgencyLead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Lead Management"
        subtitle="Track incoming inquiries, assign agents, and monitor conversion pipelines."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Follow-ups
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Lead
            </GoldButton>
          </div>
        }
      />

      {/* Real Lead performance metrics calculated from Agency inquiries. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="New Leads (7d)"
          value={String(newLeadsLast7Days)}
          trend="Real inquiries received in the last 7 days"
          trendColor="text-emerald-400"
          icon={Zap}
        />

        <KPICard
          title="Active Pipeline"
          value={String(
            contactedCount +
            viewingScheduledCount +
            negotiatingCount
          )}
          trend={`${contactedCount} contacted • ${viewingScheduledCount} viewing • ${negotiatingCount} negotiating`}
          trendColor="text-blue-400"
          icon={Target}
        />

        <KPICard
          title="Response Time"
          value="—"
          trend="Response-time tracking not available yet"
          trendColor="text-ink/50"
          icon={Clock}
        />

        <KPICard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          trend={`${closedCount} closed of ${agencyInquiries.length} total inquiries`}
          trendColor="text-gold-400"
          icon={CheckCircle2}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">

        {/* Main Lead Table */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search leads by name or interest..."
            actions={
              <div className="flex gap-2">
                <select
                  className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400"
                  value={leadStatus}
                  onChange={(e) =>
                    setLeadStatus(
                      e.target.value as
                      | 'All'
                      | 'New'
                      | 'Contacted'
                      | 'Viewing Scheduled'
                      | 'Negotiating'
                      | 'Closed'
                      | 'Lost'
                    )
                  }
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Viewing Scheduled">Viewing Scheduled</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
                <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</GhostButton>
              </div>
            }
          />

          <div className="flex-1 mt-6">
            <DataTable
              data={isLoadingLeads ? [] : filteredLeads}
              keyExtractor={(l) => String(l.id)}
              columns={[
                {
                  header: "Lead Info",
                  render: (l) => (
                    <div>
                      <div
                        className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                        onClick={() => handleViewLead(l)}
                      >
                        {String(l.name)}
                      </div>
                      <div className="text-xs text-ink/60 mt-0.5">{String(l.email)}</div>
                    </div>
                  )
                },
                {
                  header: "Interest",
                  render: (l) => (
                    <div>
                      <div className="text-sm text-cream flex items-center gap-1"><Building2 className="h-3 w-3" /> {String(l.interest)}</div>
                      <div className="text-xs text-ink/60 mt-0.5">{String(l.budget)}</div>
                    </div>
                  )
                },
                {
                  header: "Status",
                  render: (l) => <EnterpriseStatusBadge status={String(l.status)} />
                },
                {
                  header: "Agent",
                  render: (l) => (
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${l.agent === 'Unassigned' ? 'bg-navy-900 text-ink/40 border border-white/5' : 'bg-navy-900 text-cream border border-gold-400/30'}`}>
                        {l.agent === 'Unassigned' ? '?' : String(l.agent).charAt(0)}
                      </div>
                      <span className={`text-sm ${l.agent === 'Unassigned' ? 'text-rose-400' : 'text-ink/80'}`}>{String(l.agent)}</span>
                    </div>
                  )
                },
                {
                  header: "Activity",
                  render: (l) => (
                    <div>
                      <div className="text-xs text-cream flex items-center gap-1"><Clock className="h-3 w-3" /> {String(l.lastContact)}</div>
                      <div className="text-[10px] text-ink/60 mt-0.5">Age: {l.age} days</div>
                    </div>
                  )
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (l) => (
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors" title="Message">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewLead(l)}
                        className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors"
                        title="View Full Profile"
                      >
                        <UserCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Sidebar: Pipeline & Intelligence */}
        <div className="space-y-6">

          {/* Lead Funnel */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gold-400" /> Conversion Funnel
            </h3>

            <div className="space-y-3">
              {/* New inquiries */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">New Inquiries</span>
                  <span className="font-bold text-cream">
                    {newInquiryCount}
                  </span>
                </div>

                <div className="h-6 w-full bg-navy-950 rounded border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-slate-500"
                    style={{
                      width: `${agencyInquiries.length > 0
                        ? (newInquiryCount / agencyInquiries.length) * 100
                        : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* Contacted */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Contacted</span>
                  <span className="font-bold text-cream">
                    {contactedCount}
                  </span>
                </div>

                <div className="h-6 w-[80%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-blue-400"
                    style={{
                      width: `${agencyInquiries.length > 0
                        ? (contactedCount / agencyInquiries.length) * 100
                        : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* Viewing scheduled */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Viewing Scheduled</span>
                  <span className="font-bold text-cream">
                    {viewingScheduledCount}
                  </span>
                </div>

                <div className="h-6 w-[60%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${agencyInquiries.length > 0
                        ? (viewingScheduledCount / agencyInquiries.length) * 100
                        : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* Negotiating */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Negotiating</span>
                  <span className="font-bold text-cream">
                    {negotiatingCount}
                  </span>
                </div>

                <div className="h-6 w-[50%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-orange-400"
                    style={{
                      width: `${agencyInquiries.length > 0
                        ? (negotiatingCount / agencyInquiries.length) * 100
                        : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* Closed */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">Closed</span>
                  <span className="font-bold text-cream">
                    {closedCount}
                  </span>
                </div>

                <div className="h-6 w-[40%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{
                      width: `${agencyInquiries.length > 0
                        ? (closedCount / agencyInquiries.length) * 100
                        : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lead Source Analytics */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-6">Lead Sources</h3>
            {/* Real inquiry-source distribution. */}
            <SegmentedProgressBar
              segments={[
                {
                  label: 'Website',
                  value: websitePercentage,
                  color: 'bg-blue-400',
                },
                {
                  label: 'Contact Agent',
                  value: contactAgentPercentage,
                  color: 'bg-emerald-400',
                },
                {
                  label: 'Schedule Viewing',
                  value: scheduleViewingPercentage,
                  color: 'bg-gold-400',
                },
              ]}
            />
            <div className="mt-6 flex flex-col gap-2 text-xs text-ink/80">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Website
                </span>

                <span className="font-bold">
                  {websitePercentage.toFixed(0)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  Contact Agent
                </span>

                <span className="font-bold text-emerald-400">
                  {contactAgentPercentage.toFixed(0)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  Schedule Viewing
                </span>

                <span className="font-bold text-gold-400">
                  {scheduleViewingPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lead details drawer */}
      <EnterpriseDetailDrawer
        // Only open the drawer when an actual Lead has been selected.
        isOpen={isDrawerOpen && selectedLead !== null}
        onClose={() => {
          // Clear the selected Lead when the drawer closes.
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }}
        title={`Lead: ${selectedLead?.name ?? 'Details'}`}
        footerActions={
          selectedLead ? (
            <div className="flex gap-3 w-full">
              <GhostButton className="flex-1">
                Message Lead
              </GhostButton>

              <GoldButton className="flex-1">
                Assign to Agent
              </GoldButton>
            </div>
          ) : null
        }
      >
        {/* Render Lead information only when a Lead is selected. */}
        {selectedLead && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">
                Lead Information
              </h4>

              <div className="space-y-3 text-sm text-ink/80">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Email</span>
                  <span className="font-medium text-cream">
                    {selectedLead.email}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Phone</span>
                  <span className="font-medium text-cream">
                    {selectedLead.phone}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Interest</span>
                  <span className="font-medium text-cream">
                    {selectedLead.interest}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Budget</span>
                  <span className="font-medium text-cream">
                    {selectedLead.budget}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Assigned Agent</span>
                  <span className="font-medium text-cream">
                    {selectedLead.agent}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Lead Score</span>
                  <span className="font-medium text-cream">
                    {selectedLead.score}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Source</span>
                  <span className="font-medium text-cream">
                    {selectedLead.source}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Last Contact</span>
                  <span className="font-medium text-cream">
                    {selectedLead.lastContact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}