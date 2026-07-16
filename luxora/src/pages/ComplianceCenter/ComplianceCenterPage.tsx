import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function ComplianceCenterPage() {
  return (
    <DashboardLayout activeTab="Compliance Center">
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-navy-800 rounded-2xl border border-white/10 mt-6">
        <h2 className="mb-2 text-2xl font-bold text-cream">Compliance Center</h2>
        <p className="text-ink/70">Regulatory and legal compliance workspace.</p>
      </div>
    </DashboardLayout>
  );
}