import { EnterpriseLayout } from '../../components/layout/EnterpriseLayout';

export default function DocumentCenterPage() {
  return (
    <EnterpriseLayout activeTab="Document Center">
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-navy-800 rounded-2xl border border-white/10 mt-6">
        <h2 className="mb-2 text-2xl font-bold text-cream">Document Center</h2>
        <p className="text-ink/70">Document management and compliance workspace.</p>
      </div>
    </EnterpriseLayout>
  );
}