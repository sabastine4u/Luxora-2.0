import { useState } from 'react';
import { Building2, Activity, ShieldAlert, Search, Zap, DollarSign, Briefcase } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

import { StatusBadge } from './shared/StatusBadge';
import { DepartmentDetailModal } from './modals/DepartmentDetailModal';
import type { Department } from '../../../types';

export default function DepartmentOversight() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments: Department[] = [
    { id: 'D-FIN', name: 'Finance & Administration', head: 'Sarah Jacobs', budgetStatus: 'Optimal', headcount: 18, riskLevel: 'Low', status: 'Active' },
    { id: 'D-PRO', name: 'Procurement', head: 'Chidi Okafor', budgetStatus: 'Warning', headcount: 22, riskLevel: 'Medium', status: 'Active' },
    { id: 'D-INT', name: 'Intelligence & Security', head: 'Musa Bello', budgetStatus: 'Optimal', headcount: 45, riskLevel: 'Low', status: 'Active' },
    { id: 'D-PRP', name: 'Property Management', head: 'Aisha Lawal', budgetStatus: 'Critical', headcount: 57, riskLevel: 'High', status: 'Warning' },
  ];

  const initiatives = [
    { name: 'Q4 Budget Expansion', dept: 'Finance', progress: 85, status: 'On Track' },
    { name: 'V2 Security Audit', dept: 'Intelligence', progress: 40, status: 'Warning' },
    { name: 'Vendor Policy Renewals', dept: 'Procurement', progress: 15, status: 'Behind' },
  ];

  const handleRowClick = (dept: Department) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Department Oversight"
        subtitle="Monitor department workloads, resource consumption, and operational risks."
        actions={
          <div className="flex gap-3">
          </div>
        }
      />

      {/* Oversight KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Departments"
          value="8"
          trend="All operational"
          trendColor="text-emerald-400"
          icon={Building2}
          footer={<div className="text-xs text-ink/60">Active enterprise units</div>}
        />
        <KPICard
          title="Active Initiatives"
          value="24"
          trend="4 requiring review"
          trendColor="text-yellow-400"
          icon={Zap}
          footer={<div className="text-xs text-ink/60">Cross-department projects</div>}
        />
        <KPICard
          title="Resource Consumption"
          value="82%"
          trend="Within budget"
          trendColor="text-emerald-400"
          icon={DollarSign}
          footer={<div className="text-xs text-ink/60">Q3 allocations</div>}
        />
        <KPICard
          title="Operational Risks"
          value="Critical"
          trend="Property Management"
          trendColor="text-rose-400"
          icon={ShieldAlert}
          footer={<div className="text-xs text-ink/60">Highest risk sector</div>}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Department Workload Overview */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Workload Distribution</h3>
              <div className="space-y-4">
                {[
                  { name: 'Finance', value: 92, color: 'bg-emerald-400' },
                  { name: 'Intelligence', value: 85, color: 'bg-emerald-400' },
                  { name: 'Procurement', value: 78, color: 'bg-yellow-400' },
                  { name: 'Property Mgt', value: 105, color: 'bg-rose-400' },
                ].map((dept, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cream">{dept.name}</span>
                      <span className={`font-medium ${dept.value > 100 ? 'text-rose-400' : 'text-cream'}`}>{dept.value}% Capacity</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${dept.color}`} style={{ width: `${Math.min(dept.value, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Health Comparison */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Department Health</h3>
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-cream">Healthy (A+)</span>
                  </div>
                  <span className="text-sm font-bold text-cream">5 Depts</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-cream">Strained (B)</span>
                  </div>
                  <span className="text-sm font-bold text-cream">2 Depts</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-rose-400" />
                    <span className="text-sm font-medium text-cream">Critical (C-)</span>
                  </div>
                  <span className="text-sm font-bold text-cream">1 Dept</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-heading text-lg font-semibold text-cream">Department Directory</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input 
                  type="text" 
                  placeholder="Search departments..." 
                  className="w-full rounded-lg border border-white/10 bg-navy-900/50 py-2 pl-9 pr-4 text-sm text-cream placeholder-ink/40 outline-none focus:border-gold-400/50"
                />
              </div>
            </div>

            <DataTable
              data={departments}
              keyExtractor={(dept) => dept.id}
              columns={[
                {
                  header: "Department",
                  render: (dept) => (
                    <div className="font-semibold text-cream flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-ink/40" /> {dept.name}
                    </div>
                  )
                },
                {
                  header: "Head",
                  render: (dept) => <span className="text-ink/60">{dept.head}</span>
                },
                {
                  header: "Headcount",
                  render: (dept) => <span className="text-cream">{dept.headcount}</span>
                },
                {
                  header: "Budget Status",
                  render: (dept) => (
                    <span className={`text-xs font-bold ${dept.budgetStatus === 'Optimal' ? 'text-emerald-400' : dept.budgetStatus === 'Warning' ? 'text-yellow-400' : 'text-rose-400'}`}>
                      {dept.budgetStatus}
                    </span>
                  )
                },
                {
                  header: "Overall Status",
                  render: (dept) => <StatusBadge status={dept.status} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (dept) => (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRowClick(dept); }}
                      className="text-gold-400 hover:underline text-sm font-medium"
                    >
                      Oversight
                    </button>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Right Sidebar widgets */}
        <div className="space-y-6">
          {/* Active Initiatives */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-gold-400" /> Active Initiatives
            </h3>
            <div className="space-y-4">
              {initiatives.map((init, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-medium text-cream">{init.name}</div>
                      <div className="text-[10px] text-ink/60">{init.dept}</div>
                    </div>
                    <span className={`font-bold ${init.status === 'On Track' ? 'text-emerald-400' : init.status === 'Warning' ? 'text-yellow-400' : 'text-rose-400'}`}>
                      {init.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                    <div className={`h-full ${init.status === 'On Track' ? 'bg-emerald-400' : init.status === 'Warning' ? 'bg-yellow-400' : 'bg-rose-400'}`} style={{ width: `${init.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Risk Dashboard */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" /> Operational Risk
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-rose-400/5 border border-rose-400/20 rounded-xl">
                <div className="text-xs font-bold text-rose-400 mb-1">Property Management</div>
                <div className="text-[10px] text-ink/80 leading-relaxed">
                  Headcount scaling has fallen behind asset acquisition rate. Requires immediate talent injection.
                </div>
              </div>
              <div className="p-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                <div className="text-xs font-bold text-yellow-400 mb-1">Procurement</div>
                <div className="text-[10px] text-ink/80 leading-relaxed">
                  Vendor renewal delays risk Q4 supply chain. Warning issued to department head.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepartmentDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDept}
      />
    </div>
  );
}
