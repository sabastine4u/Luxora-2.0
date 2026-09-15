import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Eye,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Search,
} from "lucide-react";

import { GoldButton, GhostButton } from "../../../components/ui/ui";
import { EmptyState } from "../../../components/layout/EmptyState";
import { DataTable } from "../../../components/dashboard/shared/tables/DataTable";
import { KPICard } from "../../../components/dashboard/shared/cards/KPICard";
import { EnterpriseDetailDrawer } from "../../../components/enterprise/EnterpriseDetailDrawer";
import { agentApi } from "../../../api/agent.api";

interface AgentProperty {
  _id: string;
  title?: string;
  price?: number;
  status?: string;
  transactionType?: string;
  propertyType?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AgentLead {
  _id: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AgentAppointment {
  _id: string;
  appointmentStatus?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AgentDeal {
  _id: string;
  offerAmount?: number;
  counterOfferAmount?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AgentCommission {
  _id: string;
  agentAmount?: number;
  commissionPool?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CommissionSummary {
  totalEarned?: number;
  totalCommissionPool?: number;
  totalDeals?: number;
  paid?: {
    amount?: number;
    count?: number;
  };
  pending?: {
    amount?: number;
    count?: number;
  };
  processing?: {
    amount?: number;
    count?: number;
  };
  overdue?: {
    amount?: number;
    count?: number;
  };
  cancelled?: {
    amount?: number;
    count?: number;
  };
}

interface ReportRow extends Record<string, unknown> {
  id: string;
  report: string;
  category: string;
  metric: string;
  value: string;
  status: string;
  date: string;
  rawDate: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (date?: string) => {
  if (!date) return "Not provided";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not provided";
  }

  return parsed.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getArray = <T,>(response: unknown, key: string): T[] => {
  const result = response as {
    [key: string]: unknown;
    data?: {
      [key: string]: unknown;
    };
  } | null;

  if (Array.isArray(result?.[key])) {
    return result[key] as T[];
  }

  if (Array.isArray(result?.data?.[key])) {
    return result.data[key] as T[];
  }

  if (Array.isArray(response)) {
    return response as T[];
  }

  return [];
};

const getSummary = (response: unknown): CommissionSummary => {
  const result = response as {
    summary?: CommissionSummary;
    data?: {
      summary?: CommissionSummary;
      totalEarned?: number;
      totalCommissionPool?: number;
      totalDeals?: number;
    };
  } | null;

  if (result?.summary) {
    return result.summary;
  }

  if (result?.data?.summary) {
    return result.data.summary;
  }

  if (result?.data) {
    return result.data;
  }

  return {};
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  const [listings, setListings] = useState<AgentProperty[]>([]);
  const [leads, setLeads] = useState<AgentLead[]>([]);
  const [appointments, setAppointments] = useState<AgentAppointment[]>([]);
  const [deals, setDeals] = useState<AgentDeal[]>([]);
  const [commissions, setCommissions] = useState<AgentCommission[]>([]);
  const [commissionSummary, setCommissionSummary] =
    useState<CommissionSummary>({});

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("All Time");
  const [propertyType, setPropertyType] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");

  const reportCategories = [
    "All",
    "Sales Reports",
    "Listings Reports",
    "Leads Reports",
    "Viewing Reports",
    "Commission Reports",
    "Activity Reports",
  ];

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);

        const [
          listingsResponse,
          leadsResponse,
          appointmentsResponse,
          dealsResponse,
          commissionsResponse,
          commissionSummaryResponse,
        ] = await Promise.all([
          agentApi.getMyListings(),
          agentApi.getMyLeads(),
          agentApi.getMyAppointments(),
          agentApi.getMyDeals(),
          agentApi.getMyCommissions(),
          agentApi.getMyCommissionSummary(),
        ]);

        setListings(
          getArray<AgentProperty>(listingsResponse, "properties")
        );

        setLeads(
          getArray<AgentLead>(leadsResponse, "inquiries")
        );

        setAppointments(
          getArray<AgentAppointment>(
            appointmentsResponse,
            "appointments"
          )
        );

        setDeals(
          getArray<AgentDeal>(dealsResponse, "offers")
        );

        setCommissions(
          getArray<AgentCommission>(
            commissionsResponse,
            "commissions"
          )
        );

        setCommissionSummary(
          getSummary(commissionSummaryResponse)
        );
      } catch (error) {
        console.error(
          "Failed to load agent report data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  const acceptedDeals = useMemo(() => {
    return deals.filter(
      (deal) => deal.status === "Accepted"
    );
  }, [deals]);

  const totalSalesValue = useMemo(() => {
    return acceptedDeals.reduce((sum, deal) => {
      return (
        sum +
        (deal.counterOfferAmount ??
          deal.offerAmount ??
          0)
      );
    }, 0);
  }, [acceptedDeals]);

  const activeListings = useMemo(() => {
    return listings.filter(
      (property) =>
        !["Sold", "Rented", "Leased"].includes(
          property.status || ""
        )
    );
  }, [listings]);

  const closedLeads = useMemo(() => {
    return leads.filter(
      (lead) => lead.status === "Closed"
    );
  }, [leads]);

  const leadConversionRate = useMemo(() => {
    if (leads.length === 0) return 0;

    return (
      (closedLeads.length / leads.length) *
      100
    );
  }, [closedLeads.length, leads.length]);

  const totalCommissionEarned = useMemo(() => {
    if (
      typeof commissionSummary.totalEarned ===
      "number"
    ) {
      return commissionSummary.totalEarned;
    }

    return commissions.reduce(
      (sum, commission) =>
        sum + (commission.agentAmount || 0),
      0
    );
  }, [
    commissionSummary.totalEarned,
    commissions,
  ]);

  const paidCommission = useMemo(() => {
    if (
      typeof commissionSummary.paid?.amount ===
      "number"
    ) {
      return commissionSummary.paid.amount;
    }

    return commissions
      .filter(
        (commission) =>
          commission.status === "Paid"
      )
      .reduce(
        (sum, commission) =>
          sum + (commission.agentAmount || 0),
        0
      );
  }, [
    commissionSummary.paid?.amount,
    commissions,
  ]);

  const pendingCommission = useMemo(() => {
    if (
      typeof commissionSummary.pending?.amount ===
      "number"
    ) {
      return commissionSummary.pending.amount;
    }

    return commissions
      .filter(
        (commission) =>
          commission.status === "Pending"
      )
      .reduce(
        (sum, commission) =>
          sum + (commission.agentAmount || 0),
        0
      );
  }, [
    commissionSummary.pending?.amount,
    commissions,
  ]);

  const reportRows = useMemo<ReportRow[]>(() => {
    const rows: ReportRow[] = [];

    const latestDealDate =
      deals
        .map(
          (deal) =>
            deal.updatedAt || deal.createdAt
        )
        .filter(Boolean)
        .sort()
        .reverse()[0] || undefined;

    const latestListingDate =
      listings
        .map(
          (property) =>
            property.updatedAt ||
            property.createdAt
        )
        .filter(Boolean)
        .sort()
        .reverse()[0] || undefined;

    const latestLeadDate =
      leads
        .map(
          (lead) =>
            lead.updatedAt || lead.createdAt
        )
        .filter(Boolean)
        .sort()
        .reverse()[0] || undefined;

    const latestAppointmentDate =
      appointments
        .map(
          (appointment) =>
            appointment.scheduledDate ||
            appointment.updatedAt ||
            appointment.createdAt
        )
        .filter(Boolean)
        .sort()
        .reverse()[0] || undefined;

    const latestCommissionDate =
      commissions
        .map(
          (commission) =>
            commission.updatedAt ||
            commission.createdAt
        )
        .filter(Boolean)
        .sort()
        .reverse()[0] || undefined;

    const activityLatestDate =
      [
        ...listings.map(
          (property) =>
            property.updatedAt ||
            property.createdAt
        ),
        ...leads.map(
          (lead) =>
            lead.updatedAt || lead.createdAt
        ),
        ...appointments.map(
          (appointment) =>
            appointment.updatedAt ||
            appointment.createdAt
        ),
      ]
        .filter(Boolean)
        .sort()
        .reverse()[0] || undefined;

    rows.push({
      id: "sales-performance",
      report: "Sales Performance Report",
      category: "Sales Reports",
      metric: `${acceptedDeals.length} accepted deal${
        acceptedDeals.length === 1
          ? ""
          : "s"
      }`,
      value: formatCurrency(totalSalesValue),
      status: "Available",
      date: formatDate(latestDealDate),
      rawDate: latestDealDate
        ? new Date(latestDealDate).getTime()
        : 0,
    });

    rows.push({
      id: "listings-performance",
      report: "Listings Performance Report",
      category: "Listings Reports",
      metric: `${activeListings.length} active listing${
        activeListings.length === 1
          ? ""
          : "s"
      }`,
      value: `${listings.length} total`,
      status: "Available",
      date: formatDate(latestListingDate),
      rawDate: latestListingDate
        ? new Date(
            latestListingDate
          ).getTime()
        : 0,
    });

    rows.push({
      id: "lead-performance",
      report: "Lead Performance Report",
      category: "Leads Reports",
      metric: `${leads.length} lead${
        leads.length === 1
          ? ""
          : "s"
      }`,
      value: `${leadConversionRate.toFixed(
        1
      )}% closed`,
      status: "Available",
      date: formatDate(latestLeadDate),
      rawDate: latestLeadDate
        ? new Date(
            latestLeadDate
          ).getTime()
        : 0,
    });

    rows.push({
      id: "viewing-activity",
      report: "Viewing Activity Report",
      category: "Viewing Reports",
      metric: `${appointments.length} appointment${
        appointments.length === 1
          ? ""
          : "s"
      }`,
      value: `${appointments.filter(
        (appointment) =>
          appointment.appointmentStatus ===
          "Completed"
      ).length} completed`,
      status: "Available",
      date: formatDate(
        latestAppointmentDate
      ),
      rawDate: latestAppointmentDate
        ? new Date(
            latestAppointmentDate
          ).getTime()
        : 0,
    });

    rows.push({
      id: "commission-performance",
      report: "Commission Performance Report",
      category: "Commission Reports",
      metric: `${commissions.length} recorded commission${
        commissions.length === 1
          ? ""
          : "s"
      }`,
      value: formatCurrency(
        totalCommissionEarned
      ),
      status: "Available",
      date: formatDate(
        latestCommissionDate
      ),
      rawDate: latestCommissionDate
        ? new Date(
            latestCommissionDate
          ).getTime()
        : 0,
    });

    rows.push({
      id: "agent-activity",
      report: "Agent Activity Report",
      category: "Activity Reports",
      metric: `${listings.length} listings • ${leads.length} leads`,
      value: `${appointments.length} viewings`,
      status: "Available",
      date: formatDate(activityLatestDate),
      rawDate: activityLatestDate
        ? new Date(
            activityLatestDate
          ).getTime()
        : 0,
    });

    return rows;
  }, [
    acceptedDeals.length,
    activeListings.length,
    appointments,
    commissions,
    deals,
    leadConversionRate,
    leads,
    listings,
    totalCommissionEarned,
    totalSalesValue,
  ]);

  const filteredRows = useMemo(() => {
    let rows = [...reportRows];

    if (activeTab !== "All") {
      rows = rows.filter(
        (row) =>
          row.category === activeTab
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery.toLowerCase();

      rows = rows.filter(
        (row) =>
          row.report
            .toLowerCase()
            .includes(query) ||
          row.category
            .toLowerCase()
            .includes(query) ||
          row.metric
            .toLowerCase()
            .includes(query)
      );
    }

    if (propertyType !== "All Types") {
      // Property-specific report filtering will be
      // implemented with the future Reports backend.
    }

    if (dateRange !== "All Time") {
      // Date-range report filtering will be
      // implemented with the future Reports backend.
    }

    if (statusFilter !== "All Status") {
      rows = rows.filter(
        (row) =>
          row.status === statusFilter
      );
    }

    if (sortBy === "Oldest") {
      rows.sort(
        (a, b) =>
          a.rawDate - b.rawDate
      );
    } else {
      rows.sort(
        (a, b) =>
          b.rawDate - a.rawDate
      );
    }

    return rows;
  }, [
    activeTab,
    dateRange,
    propertyType,
    reportRows,
    searchQuery,
    sortBy,
    statusFilter,
  ]);

  const handleWorkflow = (
    action: string,
    reportName?: string
  ) => {
    setActiveWorkflow(
      reportName
        ? `${action}: ${reportName}`
        : action
    );
  };

  const totalCommissionPool =
    commissionSummary.totalCommissionPool ??
    commissions.reduce(
      (sum, commission) =>
        sum +
        (commission.commissionPool || 0),
      0
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-cream">
            Reports
          </h1>

          <p className="mt-1 text-sm text-ink/60">
            Monitor your sales, listings, leads, viewings
            and commission performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <GhostButton
            onClick={() =>
              handleWorkflow("Print Report")
            }
          >
            <Printer className="h-4 w-4" />
            Print
          </GhostButton>

          <GhostButton
            onClick={() =>
              handleWorkflow("Export CSV")
            }
          >
            <Download className="h-4 w-4" />
            CSV
          </GhostButton>

          <GhostButton
            onClick={() =>
              handleWorkflow("Export PDF")
            }
          >
            <FileText className="h-4 w-4" />
            PDF
          </GhostButton>

          <GoldButton
            onClick={() =>
              handleWorkflow("Generate Report")
            }
          >
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KPICard
          title="Total Reports"
          value={loading ? "—" : reportRows.length}
          icon={FileText}
          trend={loading ? "—" : "+0"}
          trendColor="text-ink/40"
        />

        <KPICard
          title="Sales This Month"
          value={
            loading
              ? "—"
              : formatCurrency(totalSalesValue)
          }
          icon={DollarSign}
          trend={loading ? "—" : "+0"}
          trendColor="text-ink/40"
        />

        <KPICard
          title="Closed Deals"
          value={
            loading
              ? "—"
              : acceptedDeals.length
          }
          icon={TrendingUp}
          trend={loading ? "—" : "+0"}
          trendColor="text-ink/40"
        />

        <KPICard
          title="Commission Earned"
          value={
            loading
              ? "—"
              : formatCurrency(
                  totalCommissionEarned
                )
          }
          icon={PieChart}
          trend={loading ? "—" : "+0"}
          trendColor="text-ink/40"
        />

        <KPICard
          title="Active Listings"
          value={
            loading
              ? "—"
              : activeListings.length
          }
          icon={Home}
          trend={loading ? "—" : "+0"}
          trendColor="text-ink/40"
        />
      </div>

      {/* Report Categories */}
      <div className="overflow-x-auto border-b border-white/10">
        <div className="flex min-w-max gap-6">
          {reportCategories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveTab(category)
                }
                className={`border-b-2 px-1 pb-3 text-sm font-medium transition ${
                  activeTab === category
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-ink/50 hover:text-cream"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search reports..."
              className="w-full rounded-xl border border-white/10 bg-navy-900 py-2.5 pl-10 pr-3 text-sm text-cream outline-none placeholder:text-ink/40 focus:border-gold-400"
            />
          </div>

          <select
            value={dateRange}
            onChange={(event) =>
              setDateRange(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold-400"
          >
            <option>All Time</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>

          <select
            value={propertyType}
            onChange={(event) =>
              setPropertyType(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold-400"
          >
            <option>All Types</option>
            <option>Buy</option>
            <option>Rent</option>
            <option>Lease</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold-400"
          >
            <option>All Status</option>
            <option>Available</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-navy-900 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold-400"
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/50">
                Sales Performance
              </p>

              <h3 className="mt-1 text-xl font-semibold text-cream">
                {loading
                  ? "Loading..."
                  : formatCurrency(
                      totalSalesValue
                    )}
              </h3>
            </div>

            <TrendingUp className="h-5 w-5 text-gold-400" />
          </div>

          <p className="text-sm text-ink/50">
            Based on accepted deals assigned to you.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/50">
                Commission Trend
              </p>

              <h3 className="mt-1 text-xl font-semibold text-cream">
                {loading
                  ? "Loading..."
                  : formatCurrency(
                      totalCommissionEarned
                    )}
              </h3>
            </div>

            <DollarSign className="h-5 w-5 text-gold-400" />
          </div>

          <p className="text-sm text-ink/50">
            Recorded agent commission across your deals.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/50">
                Lead Conversion
              </p>

              <h3 className="mt-1 text-xl font-semibold text-cream">
                {loading
                  ? "Loading..."
                  : `${leadConversionRate.toFixed(
                      1
                    )}%`}
              </h3>
            </div>

            <Users className="h-5 w-5 text-gold-400" />
          </div>

          <p className="text-sm text-ink/50">
            Closed leads compared with all agent leads.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/50">
                Property Performance
              </p>

              <h3 className="mt-1 text-xl font-semibold text-cream">
                {loading
                  ? "Loading..."
                  : listings.length}
              </h3>
            </div>

            <Home className="h-5 w-5 text-gold-400" />
          </div>

          <p className="text-sm text-ink/50">
            Total listings currently associated with you.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/50">
                Paid Commission
              </p>

              <h3 className="mt-1 text-xl font-semibold text-cream">
                {loading
                  ? "Loading..."
                  : formatCurrency(
                      paidCommission
                    )}
              </h3>
            </div>

            <Calendar className="h-5 w-5 text-gold-400" />
          </div>

          <p className="text-sm text-ink/50">
            Commission marked as paid.
          </p>
        </div>
      </div>

      {/* Report Table */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-cream">
              Reports
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              Current report summaries are calculated from
              your live Agent data.
            </p>
          </div>

          <GhostButton
            onClick={() =>
              window.location.reload()
            }
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </GhostButton>
        </div>

        <div className="p-5">
          <DataTable
            data={filteredRows}
            isLoading={loading}
            keyExtractor={(row) =>
              row.id
            }
            emptyState={
              <EmptyState
                icon={
                  <FileText className="h-7 w-7" />
                }
                title="No reports found"
                description="There is no report data matching your current filters."
              />
            }
            columns={[
              {
                header: "Report",
                render: (
                  row: ReportRow
                ) => (
                  <div>
                    <div className="font-medium text-cream">
                      {row.report}
                    </div>

                    <div className="mt-1 text-xs text-ink/40">
                      {row.metric}
                    </div>
                  </div>
                ),
              },
              {
                header: "Category",
                render: (
                  row: ReportRow
                ) => (
                  <span className="text-sm text-ink/70">
                    {row.category}
                  </span>
                ),
              },
              {
                header: "Value",
                render: (
                  row: ReportRow
                ) => (
                  <span className="font-medium text-cream">
                    {row.value}
                  </span>
                ),
              },
              {
                header: "Status",
                render: (
                  row: ReportRow
                ) => (
                  <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    {row.status}
                  </span>
                ),
              },
              {
                header: "Last Updated",
                render: (
                  row: ReportRow
                ) => (
                  <span className="text-sm text-ink/50">
                    {row.date}
                  </span>
                ),
              },
              {
                header: "Actions",
                render: (
                  row: ReportRow
                ) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleWorkflow(
                          "Print",
                          row.report
                        )
                      }
                      className="rounded-lg border border-white/10 p-2 text-ink/50 transition hover:border-white/20 hover:text-cream"
                      title="Print"
                    >
                      <Printer className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleWorkflow(
                          "Export CSV",
                          row.report
                        )
                      }
                      className="rounded-lg border border-white/10 p-2 text-ink/50 transition hover:border-white/20 hover:text-cream"
                      title="CSV"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleWorkflow(
                          "Export PDF",
                          row.report
                        )
                      }
                      className="rounded-lg border border-white/10 p-2 text-ink/50 transition hover:border-white/20 hover:text-cream"
                      title="PDF"
                    >
                      <FileText className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleWorkflow(
                          "View",
                          row.report
                        )
                      }
                      className="rounded-lg border border-white/10 p-2 text-ink/50 transition hover:border-white/20 hover:text-cream"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleWorkflow(
                          "More",
                          row.report
                        )
                      }
                      className="rounded-lg border border-white/10 p-2 text-ink/50 transition hover:border-white/20 hover:text-cream"
                      title="More"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-sm text-ink/50">
            Total Leads
          </p>

          <p className="mt-2 text-2xl font-semibold text-cream">
            {loading ? "—" : leads.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-sm text-ink/50">
            Total Viewings
          </p>

          <p className="mt-2 text-2xl font-semibold text-cream">
            {loading
              ? "—"
              : appointments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-sm text-ink/50">
            Pending Commission
          </p>

          <p className="mt-2 text-2xl font-semibold text-cream">
            {loading
              ? "—"
              : formatCurrency(
                  pendingCommission
                )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-sm text-ink/50">
            Commission Pool
          </p>

          <p className="mt-2 text-2xl font-semibold text-cream">
            {loading
              ? "—"
              : formatCurrency(
                  totalCommissionPool
                )}
          </p>
        </div>
      </div>

      {/* Workflow Drawer */}
      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() =>
          setActiveWorkflow(null)
        }
        title="Report Action"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-navy-800 p-4">
            <p className="text-sm text-ink/50">
              Selected action
            </p>

            <p className="mt-1 text-base font-medium text-cream">
              {activeWorkflow}
            </p>
          </div>

          <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 p-4">
            <p className="text-sm text-gold-200">
              Report generation and file export are not
              connected to a dedicated backend Reports service
              yet.
            </p>

            <p className="mt-2 text-xs leading-5 text-ink/50">
              The page now uses live Agent listings, leads,
              appointments, deals and commission data. Actual
              report generation, PDF export and CSV generation
              can be built later without replacing this page.
            </p>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}