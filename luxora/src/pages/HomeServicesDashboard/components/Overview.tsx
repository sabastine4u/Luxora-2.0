import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { serviceRequests, serviceProviders } from '../../../data/homeServicesData';
import { DollarSign, Users, Wrench, CheckCircle2 } from 'lucide-react';

export default function Overview() {
  const recentRequests = serviceRequests.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Home Services Overview</h2>
          <p className="text-sm text-ink/60">Executive command center for Service Administration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Monthly Revenue" 
          value="₦24.5M" 
          trend="+12%" 
          icon={DollarSign} 
        />
        <KPICard 
          title="Active Providers" 
          value="142" 
          trend="+5 new" 
          icon={Users} 
        />
        <KPICard 
          title="Pending Requests" 
          value="28" 
          trend="-2" 
          icon={Wrench} 
        />
        <KPICard 
          title="Jobs Completed" 
          value="1,204" 
          trend="+18%" 
          icon={CheckCircle2} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4">Recent Service Requests</h3>
          <DataTable
            columns={[
              { header: 'Customer', render: (req) => req.customerName },
              { header: 'Category', render: (req) => req.category },
              { header: 'Status', render: (req) => <EnterpriseStatusBadge status={req.status} /> },
            ]}
            keyExtractor={(req) => req.id}
            data={recentRequests}
          />
        </div>
        
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4">Top Providers</h3>
          <DataTable
            columns={[
              { header: 'Provider', render: (p) => p.name },
              { header: 'Rating', render: (p) => p.rating },
              { header: 'Jobs', render: (p) => p.completedJobs },
            ]}
            keyExtractor={(p) => p.id}
            data={serviceProviders.slice(0, 4)}
          />
        </div>
      </div>
    </div>
  );
}
