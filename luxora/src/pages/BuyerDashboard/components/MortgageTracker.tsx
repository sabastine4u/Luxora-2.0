// Import React hooks used to load the Buyer's mortgage applications.
import { useEffect, useState } from 'react';

// Import the icons used by the Mortgage Tracker UI.
import { Wallet, CheckCircle2, ChevronRight, Percent } from 'lucide-react';

// Import the existing button component.
import { GoldButton } from '../../../components/ui/ui';

// Import the mortgage API client.
import { mortgageApi } from '../../../api/mortgage.api';

// Import the mortgage snapshot component.
import MortgageSnapshot from './MortgageSnapshot';

// Describe one stage in the mortgage application timeline.
interface MortgageStage {
  label: string;
  date: string | null;
  completed: boolean;
}

// Describe the mortgage application returned by the backend.
interface MortgageApplication {
  _id: string;
  lender: string;
  requestedLoanAmount: number;
  approvedLoanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  monthlyPayment: number | null;
  status: string;
  stages: MortgageStage[];
  createdAt: string;
  property?: {
    _id: string;
    title?: string;
  } | null;
}

export default function MortgageTracker() {
  // Store all mortgage applications belonging to the logged-in Buyer.
  const [applications, setApplications] = useState<MortgageApplication[]>([]);

  // Track whether the mortgage applications are still loading.
  const [loading, setLoading] = useState(true);

  // Store a user-friendly API error message.
  const [error, setError] = useState('');

  // Load the Buyer's mortgage applications when this page opens.
  useEffect(() => {
    const loadMortgageApplications = async () => {
      try {
        setLoading(true);
        setError('');

        // Request the authenticated Buyer's mortgage applications.
        const response = await mortgageApi.getMyMortgageApplications();

        // The shared HTTP client already unwraps the Axios response body.
        setApplications(response.applications || []);
      } catch (err) {
        console.error('Failed to load mortgage applications:', err);

        // Show a user-friendly error when the request fails.
        setError('Unable to load your mortgage applications.');
      } finally {
        setLoading(false);
      }
    };

    loadMortgageApplications();
  }, []);

  // Find the Buyer's current active mortgage application.
  const activeApplication = applications.find((application) =>
    [
      'Submitted',
      'Document Verification',
      'Credit Assessment',
      'Approved',
    ].includes(application.status),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">
          Mortgage Tracker
        </h2>

        <p className="text-sm text-ink/60">
          Manage your financing and track application status.
        </p>
      </div>

      {/* Pass the active backend application into the mortgage snapshot. */}
      <MortgageSnapshot application={activeApplication} />

      {/* Show feedback while mortgage applications are loading. */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-sm text-ink/60">
          Loading your mortgage applications...
        </div>
      )}

      {/* Show an API error without breaking the rest of the dashboard. */}
      {!loading && error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Show a simple empty state when the Buyer has no active application. */}
      {!loading && !error && !activeApplication && (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream">
            No Active Application
          </h3>

          <p className="mt-2 text-sm text-ink/60">
            You do not currently have an active mortgage application.
          </p>
        </div>
      )}

      {/* Render the application section only when an active application exists. */}
      {!loading && activeApplication && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Application */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Active Application
                </h3>

                {/* Show the property attached to this mortgage application. */}
                <p className="mt-1 text-sm text-ink/50">
                  {activeApplication.property?.title || 'Property financing application'}
                </p>

                {/* Show the lender attached to the application. */}
                <p className="mt-1 text-xs text-ink/40">
                  Lender: {activeApplication.lender || 'Not specified'}
                </p>
              </div>

              {/* Use a different visual treatment for submitted, approved, and rejected states. */}
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${activeApplication.status === 'Approved'
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : activeApplication.status === 'Rejected'
                    ? 'border-rose-400/20 bg-rose-400/10 text-rose-300'
                    : 'border-gold-400/20 bg-gold-400/10 text-gold-300'
                  }`}
              >
                {activeApplication.status}
              </span>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="text-sm text-ink/60">
                  {activeApplication.approvedLoanAmount != null
                    ? 'Approved Loan Amount'
                    : 'Requested Loan Amount'}
                </div>
                <div className="mt-1 font-heading text-xl font-bold text-cream">
                  ₦{(
                    activeApplication.approvedLoanAmount ??
                    activeApplication.requestedLoanAmount
                  ).toLocaleString()}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="text-sm text-ink/60">Interest Rate</div>

                <div className="mt-1 font-heading text-xl font-bold text-cream">
                  {activeApplication.interestRate != null
                    ? `${activeApplication.interestRate}%`
                    : 'Not set'}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="text-sm text-ink/60">Duration</div>

                <div className="mt-1 font-heading text-xl font-bold text-cream">
                  {activeApplication.loanTermYears
                    ? `${activeApplication.loanTermYears} Years`
                    : 'Not set'}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-white/10" />

              <div className="relative space-y-6">
                {activeApplication.stages.map((stage, index) => (
                  <div key={`${stage.label}-${index}`} className="flex items-center gap-4">
                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-navy-800 ${stage.completed ? 'bg-gold-400' : 'bg-white/10'
                        }`}
                    >
                      {stage.completed && (
                        <CheckCircle2 className="h-4 w-4 text-navy-900" />
                      )}
                    </div>

                    <div>
                      <div
                        className={`font-semibold ${stage.completed ? 'text-cream' : 'text-ink/40'
                          }`}
                      >
                        {stage.label}
                      </div>

                      <div className="text-xs text-ink/50">
                        {stage.date
                          ? new Date(stage.date).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                          : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tools & Resources */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-gold-400" />

                <h3 className="font-heading text-base font-semibold text-cream">
                  Quick Affordability
                </h3>
              </div>

              <p className="mb-4 text-sm text-ink/60">
                Calculate your estimated monthly payments based on current
                rates.
              </p>

              <GoldButton className="w-full justify-between">
                Calculator
                <ChevronRight className="h-4 w-4" />
              </GoldButton>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Percent className="h-5 w-5 text-gold-400" />

                <h3 className="font-heading text-base font-semibold text-cream">
                  Current Rates
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-sm text-ink/60">
                    Federal Mortgage
                  </span>

                  <span className="font-semibold text-emerald-400">
                    9.5%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-sm text-ink/60">
                    Commercial (Avg)
                  </span>

                  <span className="font-semibold text-emerald-400">
                    14.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}