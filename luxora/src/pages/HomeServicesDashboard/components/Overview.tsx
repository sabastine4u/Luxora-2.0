import { useEffect, useState } from 'react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { homeServicesApi } from '../../../api/home-services.api';
import { DollarSign, Users, Wrench, CheckCircle2 } from 'lucide-react';

interface ServiceRequest {
  id: string;
  customerId?: string | null;
  customerName: string;
  category: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  assignedProviderId?: string;
  assignedProviderName?: string;
  createdAt: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  revenue: number;
  status: string;
  verificationStatus: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface HomeServicesOverview {
  summary: {
    totalMonthlyRevenue: number;
    activeProviders: number;
    pendingRequests: number;
    jobsCompleted: number;
    activeCategories: number;
  };
  recentRequests: ServiceRequest[];
  topProviders: ServiceProvider[];
}

export default function Overview() {
  const [overview, setOverview] =
    useState<HomeServicesOverview | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const loadOverview = async () => {
    try {
      setIsLoading(true);

      const response = await homeServicesApi.getOverview();

      setOverview(response.overview);
    } catch (error) {
      console.error(
        'Failed to load Home Services overview:',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const summary = overview?.summary;

  const recentRequests =
    overview?.recentRequests?.slice(0, 4) || [];

  const topProviders =
    overview?.topProviders?.slice(0, 4) || [];

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString('en-NG')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Home Services Overview
          </h2>

          <p className="text-sm text-ink/60">
            Executive command center for Service Administration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Monthly Revenue"
          value={
            isLoading
              ? 'Loading...'
              : formatCurrency(
                  summary?.totalMonthlyRevenue || 0,
                )
          }
          trend=""
          icon={DollarSign}
        />

        <KPICard
          title="Active Providers"
          value={
            isLoading
              ? 'Loading...'
              : String(summary?.activeProviders || 0)
          }
          trend=""
          icon={Users}
        />

        <KPICard
          title="Pending Requests"
          value={
            isLoading
              ? 'Loading...'
              : String(summary?.pendingRequests || 0)
          }
          trend=""
          icon={Wrench}
        />

        <KPICard
          title="Jobs Completed"
          value={
            isLoading
              ? 'Loading...'
              : String(summary?.jobsCompleted || 0)
          }
          trend=""
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4">
            Recent Service Requests
          </h3>

          {isLoading ? (
            <div className="py-10 text-center text-sm text-ink/50">
              Loading service requests...
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  header: 'Customer',
                  render: (req: ServiceRequest) =>
                    req.customerName,
                },
                {
                  header: 'Category',
                  render: (req: ServiceRequest) =>
                    req.category,
                },
                {
                  header: 'Status',
                  render: (req: ServiceRequest) => (
                    <EnterpriseStatusBadge
                      status={req.status}
                    />
                  ),
                },
              ]}
              keyExtractor={(req: ServiceRequest) =>
                req.id
              }
              data={recentRequests}
            />
          )}
        </div>

        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4">
            Top Providers
          </h3>

          {isLoading ? (
            <div className="py-10 text-center text-sm text-ink/50">
              Loading top providers...
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  header: 'Provider',
                  render: (provider: ServiceProvider) =>
                    provider.name,
                },
                {
                  header: 'Rating',
                  render: (provider: ServiceProvider) =>
                    provider.rating,
                },
                {
                  header: 'Jobs',
                  render: (provider: ServiceProvider) =>
                    provider.completedJobs,
                },
              ]}
              keyExtractor={(provider: ServiceProvider) =>
                provider.id
              }
              data={topProviders}
            />
          )}
        </div>
      </div>
    </div>
  );
}