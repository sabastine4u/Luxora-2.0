import { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck, FileCheck, Activity, Search, Filter } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function FraudAlerts() {
  const [activeTab, setActiveTab] = useState('All');

  const investigations = [
    { id: 'INV-402', title: 'Suspicious Agency Registration', status: 'Under Review', assignee: 'Compliance Team A' },
    { id: 'INV-401', title: 'Payment Gateway Anomaly', status: 'Resolved', assignee: 'SecOps' },
    { id: 'INV-400', title: 'Duplicate Listings Farm', status: 'Pending Evidence', assignee: 'Fraud Desk' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Enterprise Compliance & Risk Center" 
        subtitle="Global oversight of regulatory compliance, fraud detection, and internal audits."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" /> Audit Center
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Manage Policies
            </GoldButton>
          </div>
        }
      />

      {/* Enterprise Compliance Score & Risk Heatmap */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-400/20 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-cream">Enterprise Compliance Score</h3>
            </div>
            <div className="text-4xl font-bold text-emerald-400">98/100</div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Data Privacy</div>
              <div className="text-xl font-bold text-emerald-400">100%</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Financial Auth</div>
              <div className="text-xl font-bold text-emerald-400">99%</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">User KYC</div>
              <div className="text-xl font-bold text-gold-400">92%</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Property Audits</div>
              <div className="text-xl font-bold text-emerald-400">95%</div>
            </div>
          </div>
          <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl flex justify-between items-center">
             <span className="text-sm text-ink/80">Regulatory Monitoring: <strong className="text-cream">All critical operational jurisdictions are fully compliant.</strong></span>
          </div>
        </div>

        {/* Enterprise Risk Heatmap / Internal Control Status */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-rose-400" /> Enterprise Risk Heatmap
          </h3>
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
               <span className="text-sm font-medium text-cream">Transaction Fraud</span>
               <span className="text-xs bg-rose-400/10 text-rose-400 px-2 py-1 rounded-full font-bold">High Risk</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
               <span className="text-sm font-medium text-cream">Account Takeover</span>
               <span className="text-xs bg-orange-400/10 text-orange-400 px-2 py-1 rounded-full font-bold">Medium Risk</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
               <span className="text-sm font-medium text-cream">Regulatory Breach</span>
               <span className="text-xs bg-emerald-400/10 text-emerald-400 px-2 py-1 rounded-full font-bold">Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Critical Alerts" value="3" trend="Needs Immediate Action" trendColor="text-rose-400" icon={ShieldAlert} />
        <KPICard title="Suspicious Activity" value="12" trend="Pending Review" trendColor="text-orange-400" icon={AlertTriangle} />
        <KPICard title="Active Investigations" value="8" trend="Across all departments" trendColor="text-blue-400" icon={Search} />
        <KPICard title="Internal Controls" value="Optimal" trend="All audits passed" trendColor="text-emerald-400" icon={CheckCircle} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Fraud Detection Dashboard / Suspicious Activity Queue */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
              <h3 className="font-heading text-lg font-semibold text-cream">Fraud Detection Dashboard</h3>
              <div className="flex gap-2">
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="bg-navy-900/50 border border-white/10 text-xs text-cream rounded-lg px-2 py-1"
                >
                  <option>All Alerts</option>
                  <option>Critical Only</option>
                  <option>Resolved</option>
                </select>
                <GhostButton className="h-9 w-9 p-0 flex items-center justify-center shrink-0"><Filter className="h-4 w-4" /></GhostButton>
              </div>
            </div>
            <DataTable
              data={[
                { id: 'INC-001', type: 'Multiple failed login attempts', target: 'Admin: john.doe@luxora.com', severity: 'Critical', sevColor: 'text-rose-400 bg-rose-400/10' },
                { id: 'INC-002', type: 'Suspicious IP location (Russia)', target: 'Owner: OWN-904', severity: 'Medium', sevColor: 'text-orange-400 bg-orange-400/10' },
                { id: 'INC-003', type: 'Abnormal transaction volume', target: 'Agency: Crest & Crown', severity: 'High', sevColor: 'text-orange-400 bg-orange-400/10' }
              ]}
              keyExtractor={(inc) => inc.id}
              columns={[
                {
                  header: "Incident ID",
                  render: (inc) => <span className="font-medium text-cream">{inc.id}</span>
                },
                {
                  header: "Type",
                  render: (inc) => <span className="text-cream">{inc.type}</span>
                },
                {
                  header: "Target Entity",
                  render: (inc) => <span className="text-ink/60">{inc.target}</span>
                },
                {
                  header: "Severity",
                  render: (inc) => <span className={`${inc.sevColor} px-2 py-1 rounded-full text-[10px] uppercase font-bold`}>{inc.severity}</span>
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: () => (
                    <GhostButton className="text-xs h-8 px-3">Investigate</GhostButton>
                  )
                }
              ]}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Investigation Tracker */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-400" /> Investigation Tracker
            </h3>
            <div className="space-y-3">
              {investigations.map((inv, idx) => (
                <div key={idx} className="p-4 bg-navy-900/50 border border-white/5 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-cream text-sm">{inv.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${inv.status === 'Resolved' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gold-400/10 text-gold-400'}`}>{inv.status}</span>
                  </div>
                  <div className="text-xs text-ink/60">ID: {inv.id} • Assigned to: {inv.assignee}</div>
                </div>
              ))}
            </div>
            <GhostButton className="w-full mt-4 text-xs">View All Investigations</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}
