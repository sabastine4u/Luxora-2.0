import { useState } from 'react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { ListingTable } from '../../../components/dashboard/shared/tables/ListingTable';
import { adminListings } from '../../../data/adminData';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Network, ShieldAlert, Clock, Building2 } from 'lucide-react';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import type { AdminListing } from '../../../types/admin';

export default function AssignmentOversight() {
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetListing, setTargetListing] = useState<AdminListing | null>(null);

  const readyForAssignment = adminListings.filter(l => l.assignment?.status === 'Ready for Agency Assignment');

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Assignment Oversight"
        subtitle="Global visibility into agency workload, assignment SLA tracking, and emergency reassignment."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Unassigned" value="84" icon={Building2} trend="Platform-wide" trendColor="text-blue-400" />
        <KPICard title="Assignment SLA Breaches" value="4" icon={Clock} trend="Action Required" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Active Agencies" value="126" icon={Network} trend="Taking Assignments" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Emergency Reassignments" value="2" icon={ShieldAlert} trend="Past 30 days" trendColor="text-gold-400" iconColor="text-gold-400" />
      </div>

      <div className="mt-8">
        <h3 className="font-heading text-lg font-bold text-cream mb-4">Agency Assignment Governance</h3>
        <ListingTable 
          data={readyForAssignment}
          mode="oversight"
          onReview={(item) => console.log('Review Assignment', item.id)}
          onOverride={(item) => {
            setTargetListing(item);
            setOverrideModalOpen(true);
          }}
        />
      </div>

      <ConfirmationModal
        isOpen={overrideModalOpen}
        onClose={() => {
          setOverrideModalOpen(false);
          setTargetListing(null);
        }}
        onConfirm={() => {
          console.log('Force Reassignment executed on', targetListing?.id);
          setOverrideModalOpen(false);
          setTargetListing(null);
        }}
        title="Enterprise Assignment Override"
        message={`Are you sure you want to forcibly reassign ${targetListing?.title}? This bypasses standard load balancing logic.`}
        confirmText="Force Reassign"
      />
    </div>
  );
}
