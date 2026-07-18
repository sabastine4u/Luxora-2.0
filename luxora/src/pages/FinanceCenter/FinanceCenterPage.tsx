import { EnterpriseLayout } from '../../components/layout/EnterpriseLayout';

export default function FinanceCenterPage() {
  return (
    <EnterpriseLayout activeTab="Finance Center">
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-navy-800 rounded-2xl border border-white/10 mt-6">
        <h2 className="mb-2 text-2xl font-bold text-cream">Finance Center</h2>
        <p className="text-ink/70">Financial operations and analytics workspace.</p>
      </div>
    </EnterpriseLayout>
  );
}