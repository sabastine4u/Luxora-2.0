import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Home,
  Loader2,
  Plus,
  Wallet,
  X,
} from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout';
import { mortgageApi } from '../../../api/mortgage.api';
import { propertyApi } from '../../../api/property.api';
import { mapApiPropertiesToProperties } from '../../../api/property.mapper';
import type { Property } from '../../../types';
import { formatCurrency } from '../../../utils';
import MortgageSnapshot from './MortgageSnapshot';
import { useToast } from '../../../contexts/ToastContext';

interface MortgageStage {
  label: string;
  date: string | null;
  completed: boolean;
}

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
    price?: number;
  } | null;
}

interface MortgageApplicationsResponse {
  applications?: MortgageApplication[];
}

interface PropertiesResponse {
  properties?: unknown[];
  results?: unknown[];
  data?:
    | unknown[]
    | {
        properties?: unknown[];
        results?: unknown[];
      };
}

const TERMINAL_MORTGAGE_STATUSES = [
  'Rejected',
  'Disbursed',
  'Cancelled',
];

const TERM_OPTIONS = [5, 10, 15, 20, 25, 30];

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function MortgageTracker() {
  const { showToast } = useToast();

  const [applications, setApplications] = useState<MortgageApplication[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [requestedLoanAmount, setRequestedLoanAmount] = useState('');
  const [loanTermYears, setLoanTermYears] = useState('20');
  const [lender, setLender] = useState('');

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        (await mortgageApi.getMyMortgageApplications()) as MortgageApplicationsResponse;

      setApplications(response.applications || []);
    } catch (err) {
      console.error(
        'Failed to load mortgage applications:',
        err,
      );

      setError(
        'Unable to load your mortgage applications.',
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      setPropertiesLoading(true);

      const response = await propertyApi.getProperties({
        status: 'Published',
        availabilityStatus: 'Available',
        transactionType: 'buy',
        limit: 100,
      });

      const payload =
        response as unknown as PropertiesResponse;

      let backendProperties: unknown[] = [];

      if (Array.isArray(payload.properties)) {
        backendProperties = payload.properties;
      } else if (Array.isArray(payload.results)) {
        backendProperties = payload.results;
      } else if (Array.isArray(payload.data)) {
        backendProperties = payload.data;
      } else if (
        payload.data &&
        typeof payload.data === 'object'
      ) {
        backendProperties =
          payload.data.properties ??
          payload.data.results ??
          [];
      }

      setProperties(
        mapApiPropertiesToProperties(
          backendProperties,
        ) as Property[],
      );
    } catch (err) {
      console.error(
        'Failed to load mortgage properties:',
        err,
      );

      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  useEffect(() => {
    void Promise.all([
      loadApplications(),
      loadProperties(),
    ]);
  }, []);

  const currentApplication = useMemo(() => {
    if (applications.length === 0) {
      return null;
    }

    return (
      applications.find(
        (application) =>
          !TERMINAL_MORTGAGE_STATUSES.includes(
            application.status,
          ),
      ) || applications[0]
    );
  }, [applications]);

  const openApplicationModal = () => {
    setApplicationError('');

    const availableProperty = properties[0];

    if (availableProperty) {
      setSelectedPropertyId(
        availableProperty.id,
      );

      setRequestedLoanAmount(
        Math.round(
          availableProperty.priceValue * 0.8,
        ).toString(),
      );
    } else {
      setSelectedPropertyId('');
      setRequestedLoanAmount('');
    }

    setLoanTermYears('20');
    setLender('');
    setApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    if (isSubmitting) {
      return;
    }

    setApplicationModalOpen(false);
    setApplicationError('');
  };

  const handlePropertyChange = (
    propertyId: string,
  ) => {
    setSelectedPropertyId(propertyId);
    setApplicationError('');

    const selectedProperty = properties.find(
      (property) =>
        property.id === propertyId,
    );

    if (selectedProperty) {
      setRequestedLoanAmount(
        Math.round(
          selectedProperty.priceValue * 0.8,
        ).toString(),
      );
    }
  };

  const handleApplicationSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const amount = Number(
      requestedLoanAmount,
    );

    const term = Number(
      loanTermYears,
    );

    if (!selectedPropertyId) {
      setApplicationError(
        'Select a property to finance.',
      );
      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setApplicationError(
        'Enter a valid requested loan amount.',
      );
      return;
    }

    if (
      !Number.isInteger(term) ||
      term < 1
    ) {
      setApplicationError(
        'Select a valid loan term.',
      );
      return;
    }

    const selectedProperty = properties.find(
      (property) =>
        property.id === selectedPropertyId,
    );

    if (
      selectedProperty &&
      selectedProperty.priceValue > 0 &&
      amount >
        selectedProperty.priceValue
    ) {
      setApplicationError(
        'Requested loan amount cannot be greater than the property price.',
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setApplicationError('');

      await mortgageApi.createMortgageApplication(
        {
          propertyId:
            selectedPropertyId,

          lender:
            lender.trim(),

          requestedLoanAmount:
            amount,

          loanTermYears:
            term,
        },
      );

      setApplicationModalOpen(false);

      showToast({
        type: 'success',
        title:
          'Mortgage application submitted',
        description:
          'Your application has been submitted and is now being tracked.',
      });

      await loadApplications();
    } catch (err: any) {
      console.error(
        'Failed to submit mortgage application:',
        err,
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to submit your mortgage application.';

      setApplicationError(message);

      showToast({
        type: 'error',
        title:
          'Mortgage application failed',
        description:
          message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Mortgage Tracker
          </h2>

          <p className="text-sm text-ink/60">
            Apply for property financing and track your
            mortgage application from submission through
            approval.
          </p>
        </div>

        <GoldButton
          onClick={openApplicationModal}
          disabled={
            propertiesLoading ||
            properties.length === 0
          }
          className="justify-center gap-2 md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Start Mortgage Application
        </GoldButton>
      </div>

      <MortgageSnapshot
        application={
          currentApplication || undefined
        }
        onStartApplication={
          openApplicationModal
        }
      />

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-sm text-ink/60">
          Loading your mortgage
          applications...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6 text-sm text-rose-300">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        applications.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
            <EmptyState
              icon={
                <Wallet className="h-8 w-8 text-gold-400" />
              }
              title="No mortgage application yet"
              description={
                propertiesLoading
                  ? 'Loading eligible Buy properties...'
                  : properties.length > 0
                    ? 'Choose a published Buy property and submit a real mortgage application to start tracking your financing journey.'
                    : 'There are currently no published Buy properties available for a new mortgage application.'
              }
              actionLabel={
                properties.length > 0
                  ? 'Start Mortgage Application'
                  : 'Browse Properties'
              }
              onAction={
                properties.length > 0
                  ? openApplicationModal
                  : () => {
                      window.location.href =
                        '/properties?listingType=buy';
                    }
              }
            />
          </div>
        )}

      {applications.length > 0 &&
        currentApplication && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-5 w-5 text-gold-400" />

                    <h3 className="font-heading text-lg font-semibold text-cream">
                      Application Timeline
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-ink/50">
                    {currentApplication
                      .property?.title ||
                      'Property financing application'}
                  </p>

                  <p className="mt-1 text-xs text-ink/40">
                    Submitted{' '}
                    {formatDate(
                      currentApplication.createdAt,
                    )}
                    {currentApplication.lender
                      ? ` • Lender: ${currentApplication.lender}`
                      : ''}
                  </p>
                </div>

                <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300">
                  {currentApplication.status}
                </span>
              </div>

              <div className="relative">
                <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-white/10" />

                <div className="relative space-y-6">
                  {currentApplication.stages.map(
                    (stage, index) => (
                      <div
                        key={`${stage.label}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-navy-800 ${
                            stage.completed
                              ? 'bg-gold-400'
                              : 'bg-white/10'
                          }`}
                        >
                          {stage.completed && (
                            <CheckCircle2 className="h-4 w-4 text-navy-900" />
                          )}
                        </div>

                        <div>
                          <div
                            className={`font-semibold ${
                              stage.completed
                                ? 'text-cream'
                                : 'text-ink/40'
                            }`}
                          >
                            {stage.label}
                          </div>

                          <div className="text-xs text-ink/50">
                            {stage.date
                              ? formatDate(
                                  stage.date,
                                )
                              : 'Pending'}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-gold-400" />

                  <h3 className="font-heading text-base font-semibold text-cream">
                    Application Summary
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <span className="text-sm text-ink/60">
                      Requested
                    </span>

                    <span className="font-semibold text-cream">
                      {formatCurrency(
                        currentApplication.requestedLoanAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <span className="text-sm text-ink/60">
                      Approved
                    </span>

                    <span className="font-semibold text-cream">
                      {currentApplication.approvedLoanAmount != null
                        ? formatCurrency(
                            currentApplication.approvedLoanAmount,
                          )
                        : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <span className="text-sm text-ink/60">
                      Interest Rate
                    </span>

                    <span className="font-semibold text-cream">
                      {currentApplication.interestRate != null
                        ? `${currentApplication.interestRate}%`
                        : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <span className="text-sm text-ink/60">
                      Term
                    </span>

                    <span className="font-semibold text-cream">
                      {currentApplication.loanTermYears
                        ? `${currentApplication.loanTermYears} years`
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <h3 className="font-heading text-base font-semibold text-cream">
                  Need another application?
                </h3>

                <p className="mt-2 text-sm leading-6 text-ink/60">
                  You can submit a new application for
                  another property when you are ready.
                </p>

                <GhostButton
                  onClick={
                    openApplicationModal
                  }
                  disabled={
                    propertiesLoading ||
                    properties.length === 0
                  }
                  className="mt-5 w-full justify-between"
                >
                  Start New Application
                  <ChevronRight className="h-4 w-4" />
                </GhostButton>
              </div>
            </div>
          </div>
        )}

      {applicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-navy-800 p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={
                closeApplicationModal
              }
              disabled={isSubmitting}
              className="absolute right-6 top-6 rounded-full p-2 text-ink/50 transition-colors hover:bg-white/5 hover:text-cream disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close mortgage application"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-10">
              <h3 className="font-heading text-2xl font-bold text-cream">
                Start Mortgage Application
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink/60">
                Submit your financing request for a
                published Buy property. Your application
                will immediately appear in Mortgage
                Tracker.
              </p>
            </div>

            {applicationError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
              >
                {applicationError}
              </div>
            )}

            <form
              onSubmit={
                handleApplicationSubmit
              }
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-cream">
                  Property
                </label>

                <select
                  value={
                    selectedPropertyId
                  }
                  onChange={(event) =>
                    handlePropertyChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    isSubmitting ||
                    propertiesLoading
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold-400/50"
                >
                  <option value="">
                    Select a property
                  </option>

                  {properties.map(
                    (property) => (
                      <option
                        key={property.id}
                        value={property.id}
                      >
                        {property.title} —{' '}
                        {property.price}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-cream">
                  Requested Loan Amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    requestedLoanAmount
                  }
                  onChange={(event) =>
                    setRequestedLoanAmount(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  placeholder="e.g. 80000000"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-ink/40 focus:border-gold-400/50"
                />

                <p className="mt-2 text-xs text-ink/50">
                  This should be the amount you
                  want to finance, not the full
                  property price.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-cream">
                    Loan Term
                  </label>

                  <select
                    value={
                      loanTermYears
                    }
                    onChange={(event) =>
                      setLoanTermYears(
                        event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold-400/50"
                  >
                    {TERM_OPTIONS.map(
                      (term) => (
                        <option
                          key={term}
                          value={term}
                        >
                          {term} years
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-cream">
                    Preferred Lender
                  </label>

                  <input
                    type="text"
                    value={lender}
                    onChange={(event) =>
                      setLender(
                        event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-ink/40 focus:border-gold-400/50"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gold-400/15 bg-gold-400/5 p-4">
                <div className="flex items-start gap-3">
                  <Home className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />

                  <div>
                    <div className="text-sm font-semibold text-cream">
                      What happens next?
                    </div>

                    <p className="mt-1 text-xs leading-5 text-ink/60">
                      Your application starts in the
                      Submitted stage. The financing
                      team can then move it through
                      document verification, credit
                      assessment, approval, and
                      disbursement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <GhostButton
                  type="button"
                  onClick={
                    closeApplicationModal
                  }
                  disabled={isSubmitting}
                >
                  Cancel
                </GhostButton>

                <GoldButton
                  type="submit"
                  disabled={
                    isSubmitting ||
                    properties.length === 0
                  }
                  className="justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Mortgage Application'
                  )}
                </GoldButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}