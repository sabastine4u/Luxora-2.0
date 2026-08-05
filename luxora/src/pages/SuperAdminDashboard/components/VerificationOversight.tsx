import { useState } from 'react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { VerificationTable } from '../../../components/dashboard/shared/tables/VerificationTable';
import { adminVerifications } from '../../../data/adminData';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Clock, ShieldAlert, Activity, Users } from 'lucide-react';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import type { AdminVerification } from '../../../types/admin';

export default function VerificationOversight() {
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetVerification, setTargetVerification] = useState<AdminVerification | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Verification Oversight"
        subtitle="Executive governance, SLA monitoring, and emergency override for platform identity verification."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Processed (30d)" value="3,245" icon={Users} trend="Platform-wide" trendColor="text-blue-400" />
        <KPICard title="SLA Breaches" value="12" icon={Clock} trend="Escalation Required" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Avg Resolution" value="4.2h" icon={Activity} trend="Within Target (<6h)" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Emergency Overrides" value="3" icon={ShieldAlert} trend="Past 7 days" trendColor="text-gold-400" iconColor="text-gold-400" />
      </div>

      <div className="mt-8">
        <h3 className="font-heading text-lg font-bold text-cream mb-4">Verification Queue Governance</h3>
        <VerificationTable 
          data={adminVerifications}
          mode="oversight"
          onReview={(item) => console.log('Oversight Review', item.id)}
          onOverride={(item) => {
            setTargetVerification(item);
            setOverrideModalOpen(true);
          }}
        />
      </div>

      <ConfirmationModal
        isOpen={overrideModalOpen}
        onClose={() => {
          setOverrideModalOpen(false);
          setTargetVerification(null);
        }}
        onConfirm={() => {
          console.log('Force Override executed on', targetVerification?.id);
          setOverrideModalOpen(false);
          setTargetVerification(null);
        }}
        title="Enterprise Verification Override"
        message={`Are you sure you want to forcibly override the verification status for ${targetVerification?.title}? This action bypasses the standard operational queue and requires executive clearance.`}
        confirmText="Force Verification"
      />
    </div>
  );
}
