import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function CRMCenterPage() {
  return (
    <DashboardLayout activeTab="CRM Center">
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-navy-800 rounded-2xl border border-white/10 mt-6">
        <h2 className="mb-2 text-2xl font-bold text-cream">CRM Center</h2>
        <p className="text-ink/70">Client Relationship Management workspace.</p>
      </div>
    </DashboardLayout>
  );
}