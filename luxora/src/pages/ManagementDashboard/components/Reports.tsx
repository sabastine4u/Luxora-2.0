import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  FileText,
  Search,
  RefreshCw,
  Eye,
  TrendingUp,
  Building2,
  Users,
  Wallet,
  CalendarDays,
} from "lucide-react";

import { reportApi } from "../../../api/report.api";
import { ReportPreviewModal } from "./modals/ReportPreviewModal";

interface FinancialMetrics {
  totalGMV: number;
  totalCommission: number;
  agencyCommission: number;
  paidCommission: number;
  transactionCount: number;
}

interface ListingMetrics {
  total: number;
  draft: number;
  pendingReview: number;
  approved: number;
  published: number;
  underOffer: number;
  sold: number;
  rented: number;
  leased: number;
  archived: number;
}

interface WorkforceDepartment {
  department: string;
  count: number;
}

interface WorkforceMetrics {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  verifiedStaff: number;
  departmentBreakdown: WorkforceDepartment[];
}

interface ManagerReportResponse {
  report: {
    category: string;
    startDate?: string | null;
    endDate?: string | null;
    metrics:
    | FinancialMetrics
    | ListingMetrics
    | WorkforceMetrics;
  };
}

interface ReportDefinition {
  id: string;
  name: string;
  type: string;
  category:
  | "financial"
  | "listing-performance"
  | "workforce";
  description: string;
}

interface KPIProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}

function KPI({
  title,
  value,
  subtitle,
  icon,
}: KPIProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.06] p-3 text-[#D4AF37]">
          {icon}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-NG").format(
    value || 0,
  );
}

export default function Reports() {
  const [financialReport, setFinancialReport] =
    useState<FinancialMetrics | null>(null);

  const [listingReport, setListingReport] =
    useState<ListingMetrics | null>(null);

  const [workforceReport, setWorkforceReport] =
    useState<WorkforceMetrics | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedReport, setSelectedReport] =
    useState<ReportDefinition | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const reportDefinitions: ReportDefinition[] =
    useMemo(
      () => [
        {
          id: "MAN-FIN-001",
          name: "Enterprise Financial Report",
          type: "Financial",
          category: "financial",
          description:
            "Current transaction value, commission and financial performance across the management scope.",
        },
        {
          id: "MAN-LST-001",
          name: "Listing Performance Report",
          type: "Listing Performance",
          category: "listing-performance",
          description:
            "Current property portfolio distribution across listing lifecycle stages.",
        },
        {
          id: "MAN-WRK-001",
          name: "Workforce Report",
          type: "Workforce",
          category: "workforce",
          description:
            "Current internal workforce totals, activity status and department coverage.",
        },
      ],
      [],
    );

  const loadReports = async (
    isRefresh = false,
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        financialResponse,
        listingResponse,
        workforceResponse,
      ] = await Promise.all([
        reportApi.getManagerReport({
          category: "financial",
        }),

        reportApi.getManagerReport({
          category: "listing-performance",
        }),

        reportApi.getManagerReport({
          category: "workforce",
        }),
      ]);

      const financialData =
        financialResponse.data as ManagerReportResponse;

      const listingData =
        listingResponse.data as ManagerReportResponse;

      const workforceData =
        workforceResponse.data as ManagerReportResponse;

      setFinancialReport(
        financialData?.report
          ?.metrics as FinancialMetrics,
      );

      setListingReport(
        listingData?.report
          ?.metrics as ListingMetrics,
      );

      setWorkforceReport(
        workforceData?.report
          ?.metrics as WorkforceMetrics,
      );
    } catch (error: any) {
      console.error(
        "Failed to load manager reports:",
        error,
      );

      setError(
        error?.message ||
        "Failed to load management reports.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeReports = async () => {
      await loadReports();
    };

    initializeReports();
  }, []);

  const filteredReports =
    useMemo(() => {
      const search =
        searchTerm.trim().toLowerCase();

      if (!search) {
        return reportDefinitions;
      }

      return reportDefinitions.filter(
        (report) =>
          `${report.id} ${report.name} ${report.type} ${report.description}`
            .toLowerCase()
            .includes(search),
      );
    }, [reportDefinitions, searchTerm]);

  const departmentCoverage =
    workforceReport?.departmentBreakdown || [];

  const previewReport = selectedReport
    ? {
      id: selectedReport.id,
      name: selectedReport.name,
      type: selectedReport.type,
      author: "Management",
      date: new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      ),
      status: "Generated",
    }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <FileText size={16} />
            <span>Management Reports</span>
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Reports & Analytics
          </h1>

          <p className="mt-1 max-w-3xl text-sm text-gray-400">
            Real-time management reports generated
            from current Luxora operational data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReports(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-[#D4AF37]"
          />

          <p className="mt-4 text-sm text-gray-400">
            Loading management reports...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KPI
              title="Closed Deal Value"
              value={formatCurrency(
                financialReport?.totalGMV || 0,
              )}
              subtitle="Finalized transaction value"
              icon={<Wallet size={20} />}
            />

            <KPI
              title="Agency Commission"
              value={formatCurrency(
                financialReport?.agencyCommission || 0,
              )}
              subtitle="Recorded agency commission"
              icon={<TrendingUp size={20} />}
            />

            <KPI
              title="Property Portfolio"
              value={formatNumber(
                listingReport?.total || 0,
              )}
              subtitle="Properties in current portfolio"
              icon={<Building2 size={20} />}
            />

            <KPI
              title="Active Workforce"
              value={formatNumber(
                workforceReport?.activeStaff || 0,
              )}
              subtitle={`${formatNumber(
                workforceReport?.totalStaff || 0,
              )} total internal staff`}
              icon={<Users size={20} />}
            />
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Available Reports
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Report types currently supported
                    by the Manager reporting API.
                  </p>
                </div>

                <div className="relative w-full lg:w-80">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value,
                      )
                    }
                    placeholder="Search reports..."
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4 font-medium">
                      Report
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Type
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Coverage
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map(
                    (report) => (
                      <tr
                        key={report.id}
                        className="border-b border-white/5 last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {report.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {report.id}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-300">
                          {report.type}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                            Generated
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-400">
                          {report.category ===
                            "financial" &&
                            "Financial activity"}

                          {report.category ===
                            "listing-performance" &&
                            "Property portfolio"}

                          {report.category ===
                            "workforce" &&
                            "Internal workforce"}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedReport(
                                report,
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white transition hover:bg-white/[0.08]"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    ),
                  )}

                  {filteredReports.length ===
                    0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-sm text-gray-500"
                        >
                          No reports match your
                          search.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Property Snapshot
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Current distribution of the
                  management property portfolio.
                </p>
              </div>

              <Building2
                size={20}
                className="text-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {[
                {
                  label: "Draft",
                  value:
                    listingReport?.draft || 0,
                },
                {
                  label: "Published",
                  value:
                    listingReport?.published || 0,
                },
                {
                  label: "Under Offer",
                  value:
                    listingReport?.underOffer || 0,
                },
                {
                  label: "Sold",
                  value:
                    listingReport?.sold || 0,
                },
                {
                  label: "Archived",
                  value:
                    listingReport?.archived || 0,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-black/10 p-4"
                >
                  <p className="text-xs text-gray-500">
                    {item.label}
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {formatNumber(
                      item.value,
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Workforce Snapshot
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Current internal staff activity.
                  </p>
                </div>

                <Users
                  size={20}
                  className="text-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-gray-500">
                    Total Staff
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {formatNumber(
                      workforceReport?.totalStaff ||
                      0,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-gray-500">
                    Active
                  </p>

                  <p className="mt-2 text-xl font-semibold text-emerald-300">
                    {formatNumber(
                      workforceReport?.activeStaff ||
                      0,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-gray-500">
                    Inactive
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {formatNumber(
                      workforceReport?.inactiveStaff ||
                      0,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-gray-500">
                    Verified
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {formatNumber(
                      workforceReport?.verifiedStaff ||
                      0,
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Department Coverage
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Real workforce distribution by
                    department.
                  </p>
                </div>

                <CalendarDays
                  size={20}
                  className="text-[#D4AF37]"
                />
              </div>

              <div className="space-y-3">
                {departmentCoverage.length ===
                  0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No department data
                    available.
                  </p>
                ) : (
                  departmentCoverage.map(
                    (department) => (
                      <div
                        key={
                          department.department
                        }
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3"
                      >
                        <span className="text-sm text-gray-300">
                          {
                            department.department
                          }
                        </span>

                        <span className="text-sm font-semibold text-white">
                          {formatNumber(
                            department.count,
                          )}
                        </span>
                      </div>
                    ),
                  )
                )}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Financial Snapshot
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Current financial metrics returned
                  by the Manager report endpoint.
                </p>
              </div>

              <Wallet
                size={20}
                className="text-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs text-gray-500">
                  Transaction Count
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {formatNumber(
                    financialReport?.transactionCount ||
                    0,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs text-gray-500">
                  Total Commission
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {formatCurrency(
                    financialReport?.totalCommission ||
                    0,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs text-gray-500">
                  Agency Commission
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {formatCurrency(
                    financialReport?.agencyCommission ||
                    0,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs text-gray-500">
                  Paid Commission
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {formatCurrency(
                    financialReport?.paidCommission ||
                    0,
                  )}
                </p>
              </div>
            </div>
          </section>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <FileText
                size={18}
                className="mt-0.5 text-[#D4AF37]"
              />

              <div>
                <p className="text-sm font-medium text-white">
                  Report scope
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  These reports are generated from
                  the current Manager reporting
                  endpoints and represent live
                  operational data.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <ReportPreviewModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={previewReport}
      />
    </div>
  );
}