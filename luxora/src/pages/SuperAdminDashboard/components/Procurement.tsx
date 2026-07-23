import { useState } from 'react';
import { Server, ShieldCheck, Box, Lightbulb, Target, TrendingUp, AlertCircle, ShoppingCart, RefreshCw, Activity } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export default function Procurement() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; type: 'renewals' | 'new_vendor' | 'action' | null}>({ isOpen: false, type: null });

  const recommendations = [
    { text: 'AWS reserved instances renewal due in 45 days. Renewing now saves 18% annually.', icon: Lightbulb, color: 'text-gold-400' },
    { text: 'Marketing software stack has 3 overlapping tools. Consolidate to save ₦2.4M/mo.', icon: Target, color: 'text-blue-400' }
  ];

  const renewals = [
    { title: 'Amazon Web Services', desc: 'Enterprise Support & Hosting', time: '45 Days', icon: Server, color: 'text-orange-400' },
    { title: 'Salesforce CRM', desc: 'Annual License Renewal', time: '60 Days', icon: Box, color: 'text-gold-400' },
    { title: 'Paystack Gateway', desc: 'Rate Renegotiation Window', time: '90 Days', icon: ShieldCheck, color: 'text-emerald-400' }
  ];

  const budgetUtilization = [
    { label: 'Infrastructure', value: 45, color: 'bg-emerald-400' },
    { label: 'SaaS Software', value: 30, color: 'bg-blue-400' },
    { label: 'Contractors', value: 20, color: 'bg-purple-400' },
    { label: 'Other', value: 5, color: 'bg-ink/20' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Procurement Intelligence" 
        subtitle="Strategic oversight of vendor performance, budgets, and enterprise supply chain."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'renewals' })}>
              <RefreshCw className="h-4 w-4" /> Renewals
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'new_vendor' })}>
              <ShoppingCart className="h-4 w-4" /> New Vendor
            </GoldButton>
          </div>
        }
      />

      {/* Strategic Opportunity Scanner & AI Recommendations */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">Strategic Opportunity Scanner</h3>
          </div>
          <p className="text-sm text-ink/80 mb-6 max-w-lg">
            AI analysis has identified <strong>₦14.5M</strong> in potential annualized savings through vendor consolidation and proactive contract renegotiation.
          </p>
          <div className="space-y-3 relative z-10">
            {recommendations.map((item, idx) => (
              <div key={idx} className="flex gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-colors" onClick={() => setConfirmModal({ isOpen: true, type: 'action' })}>
                <div className="pt-0.5"><item.icon className={`h-5 w-5 ${item.color}`} /></div>
                <div className="text-sm text-cream/90 leading-relaxed">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Supplier Health Score
            </h3>
            <div className="bg-navy-900/50 p-6 rounded-xl border border-white/5 text-center mb-4">
              <div className="text-4xl font-bold text-emerald-400">94/100</div>
              <div className="text-sm text-ink/60 mt-1">Excellent Standing</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-ink/80">Compliance Adherence</span>
                <span className="text-emerald-400">98%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink/80">SLA Performance</span>
                <span className="text-emerald-400">99.5%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink/80">Cost Efficiency</span>
                <span className="text-gold-400">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Active Vendors" value="42" trend="+3 This Quarter" trendColor="text-emerald-400" icon={Box} />
        <KPICard title="Procurement Spend (YTD)" value="₦1.2B" trend="Under Budget" trendColor="text-emerald-400" icon={TrendingUp} />
        <KPICard title="Budget Utilization" value="78%" trend="Optimal" trendColor="text-emerald-400" icon={Activity} />
        <KPICard title="Pending Renewals" value="3" trend="Next 90 Days" trendColor="text-orange-400" icon={AlertCircle} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-heading text-lg font-semibold text-cream">Vendor Performance Dashboard</h3>
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-navy-900/50 border border-white/10 text-xs text-cream rounded-lg px-2 py-1"
              >
                <option>All</option>
                <option>Infrastructure</option>
                <option>SaaS Software</option>
              </select>
            </div>
            <DataTable
              data={[
                { id: 1, vendor: 'Amazon Web Services', icon: <Server className="h-4 w-4 text-orange-400" />, service: 'Cloud Infrastructure', cost: '₦18.5M/mo', perf: '99.99%', status: 'Active' },
                { id: 2, vendor: 'Paystack', icon: <ShieldCheck className="h-4 w-4 text-blue-400" />, service: 'Payment Gateway', cost: '1.5% per tx', perf: '100%', status: 'Active' },
                { id: 3, vendor: 'Salesforce', icon: <Box className="h-4 w-4 text-blue-400" />, service: 'Enterprise CRM', cost: '₦5.2M/mo', perf: '99.9%', status: 'Active' },
              ]}
              keyExtractor={(item) => item.id.toString()}
              columns={[
                {
                  header: "Vendor",
                  render: (item) => (
                    <div className="font-medium text-cream flex items-center gap-3">
                      <div className="p-1.5 bg-white/5 rounded-lg">{item.icon}</div>
                      {item.vendor}
                    </div>
                  )
                },
                {
                  header: "Monthly Cost",
                  render: (item) => <span className="font-semibold text-cream">{item.cost}</span>
                },
                {
                  header: "SLA Perf",
                  render: (item) => <span className="text-emerald-400">{item.perf}</span>
                },
                {
                  header: "Status",
                  render: (item) => <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-[10px] uppercase font-semibold">{item.status}</span>
                }
              ]}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <SegmentedProgressBar title="Procurement Spending Analytics (YTD)" segments={budgetUtilization} />
          </div>
        </div>

        <div className="space-y-6">
          <ActivityTimeline title="Contract Renewal Tracker" items={renewals} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={() => setConfirmModal({ isOpen: false, type: null })}
        title={
          confirmModal.type === 'renewals' ? 'Process Renewals' : 
          confirmModal.type === 'new_vendor' ? 'Onboard New Vendor' : 
          'Execute Strategic Action'
        }
        message={
          confirmModal.type === 'renewals' ? 'Initialize batch processing for all upcoming vendor renewals?' : 
          confirmModal.type === 'new_vendor' ? 'Start the onboarding workflow for a new enterprise vendor?' : 
          'Execute this AI-recommended strategic action? This will notify the procurement team to begin implementation.'
        }
        confirmText={
          confirmModal.type === 'renewals' ? 'Process' : 
          confirmModal.type === 'new_vendor' ? 'Onboard' : 
          'Execute Action'
        }
        isDestructive={false}
      />
    </div>
  );
}
