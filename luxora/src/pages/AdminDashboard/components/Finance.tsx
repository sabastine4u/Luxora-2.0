import {
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  GoldButton,
  GhostButton,
} from "../../../components/ui/ui";

import { DataTable } from "../../../components/dashboard/shared/tables/DataTable";

import { financeApi } from "../../../api/finance.api";

interface FinanceSummary {
  totalGMV: number;
  revenue: number;
  pendingAgencyPayouts: number;
  gmvGrowth: number;
  revenueGrowth: number;
  platformFeePercent: number;
  currency: "NGN" | "USD" | "GBP";
}

interface FinanceTransaction {
  id: string;
  property: string;
  agency: string;
  value: number;
  fee: number;
  status: string;
  createdAt: string;
}

export default function Finance() {
  const [summary, setSummary] =
    useState<FinanceSummary | null>(
      null,
    );

  const [transactions, setTransactions] =
    useState<FinanceTransaction[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Load real Admin Finance data
   * from the backend.
   */
  useEffect(() => {
    const loadFinance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await financeApi.getAdminFinanceSummary();

        setSummary(
          response.summary as FinanceSummary,
        );

        setTransactions(
          (response.transactions ||
            []) as FinanceTransaction[],
        );
      } catch (err) {
        console.error(
          "Failed to load admin finance data:",
          err,
        );

        setError(
          "Unable to load platform finance data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadFinance();
  }, []);

  /*
   * Format amounts using the currency
   * returned by the backend.
   */
  const formatCurrency = (
    value: number,
    currency: string,
  ) => {
    return new Intl.NumberFormat(
      "en-NG",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      },
    ).format(value);
  };

  const currency =
    summary?.currency || "NGN";

  const platformFeePercent =
    summary?.platformFeePercent ?? 0;

  const gmvGrowth =
    summary?.gmvGrowth ?? 0;

  const revenueGrowth =
    summary?.revenueGrowth ?? 0;

  const isGmvPositive =
    gmvGrowth >= 0;

  const isRevenuePositive =
    revenueGrowth >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Platform Finance
          </h2>

          <p className="text-sm text-ink/60">
            Macroeconomic view of Luxora's GMV,
            revenue, and payouts.
          </p>
        </div>

        <GhostButton>
          Download Financials
        </GhostButton>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Finance KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total GMV */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Landmark className="h-6 w-6" />
          </div>

          <div className="text-sm text-ink/60 mb-1">
            Total GMV (YTD)
          </div>

          <div className="font-heading text-3xl font-bold text-cream">
            {isLoading
              ? "—"
              : formatCurrency(
                  summary?.totalGMV || 0,
                  currency,
                )}
          </div>

          {!isLoading && (
            <div
              className={`mt-2 flex items-center gap-1 text-xs ${
                isGmvPositive
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {isGmvPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}

              {Math.abs(gmvGrowth).toFixed(
                1,
              )}
              % vs Last Year
            </div>
          )}
        </div>

        {/* Luxora Revenue */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>

          <div className="text-sm text-ink/60 mb-1">
            Luxora Revenue (Fees)
          </div>

          <div className="font-heading text-3xl font-bold text-cream">
            {isLoading
              ? "—"
              : formatCurrency(
                  summary?.revenue || 0,
                  currency,
                )}
          </div>

          {!isLoading && (
            <div
              className={`mt-2 flex items-center gap-1 text-xs ${
                isRevenuePositive
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {isRevenuePositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}

              {Math.abs(
                revenueGrowth,
              ).toFixed(1)}
              % vs Last Year
            </div>
          )}
        </div>

        {/* Pending Agency Payouts */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">
            <ArrowDownRight className="h-6 w-6" />
          </div>

          <div className="text-sm text-ink/60 mb-1">
            Pending Agency Payouts
          </div>

          <div className="font-heading text-3xl font-bold text-cream">
            {isLoading
              ? "—"
              : formatCurrency(
                  summary?.pendingAgencyPayouts ||
                    0,
                  currency,
                )}
          </div>

          <GoldButton
            size="sm"
            className="mt-2"
            disabled={
              isLoading ||
              !summary
            }
          >
            Process Payouts
          </GoldButton>
        </div>
      </div>

      {/* Finance Details */}
      {!isLoading && summary && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
            <p className="text-xs uppercase tracking-wider text-ink/50">
              Current Platform Fee
            </p>

            <p className="mt-2 font-heading text-xl font-semibold text-gold-400">
              {platformFeePercent}%
            </p>

            <p className="mt-1 text-xs text-ink/50">
              Applied to current platform GMV.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
            <p className="text-xs uppercase tracking-wider text-ink/50">
              Reporting Currency
            </p>

            <p className="mt-2 font-heading text-xl font-semibold text-cream">
              {currency}
            </p>

            <p className="mt-1 text-xs text-ink/50">
              Loaded from Luxora global system settings.
            </p>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-cream">
            Recent Large Transactions (GMV)
          </h3>

          <GhostButton size="sm">
            View Ledger
          </GhostButton>
        </div>

        {isLoading ? (
          <div className="space-y-4 p-6">
            <div className="h-10 animate-pulse rounded-xl bg-white/5" />
            <div className="h-10 animate-pulse rounded-xl bg-white/5" />
            <div className="h-10 animate-pulse rounded-xl bg-white/5" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-ink/50">
              No finance transactions available yet.
            </p>
          </div>
        ) : (
          <DataTable
            data={transactions}
            keyExtractor={(tx) => tx.id}
            columns={[
              {
                header: "Deal ID",
                render: (tx) => (
                  <span className="font-medium text-cream">
                    {tx.id}
                  </span>
                ),
              },
              {
                header: "Property",
                render: (tx) => (
                  <span className="text-ink/60">
                    {tx.property}
                  </span>
                ),
              },
              {
                header: "Agency",
                render: (tx) => (
                  <span className="text-ink/60">
                    {tx.agency}
                  </span>
                ),
              },
              {
                header: "Total Value (GMV)",
                render: (tx) => (
                  <span className="font-bold text-cream">
                    {formatCurrency(
                      tx.value,
                      currency,
                    )}
                  </span>
                ),
              },
              {
                header: `Luxora Fee (${platformFeePercent}%)`,
                render: (tx) => (
                  <span className="font-bold text-gold-400">
                    +
                    {formatCurrency(
                      tx.fee,
                      currency,
                    )}
                  </span>
                ),
              },
              {
                header: (
                  <div className="text-right">
                    Invoice
                  </div>
                ),
                className:
                  "text-right",
                render: () => (
                  <button
                    type="button"
                    className="text-ink/40 hover:text-gold-400 transition-colors"
                  >
                    <Receipt className="h-5 w-5 ml-auto" />
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}