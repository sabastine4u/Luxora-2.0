import { useState } from 'react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { ComplaintTable } from '../../../components/dashboard/shared/tables/ComplaintTable';
import { adminComplaints } from '../../../data/adminData';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { AlertTriangle, ShieldAlert, Users, Clock } from 'lucide-react';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import type { AdminComplaint } from '../../../types/admin';

export default function ComplaintOversight() {
  const [localComplaints, setLocalComplaints] = useState<AdminComplaint[]>(adminComplaints);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetTicket, setTargetTicket] = useState<AdminComplaint | null>(null);
  const [overrideCount, setOverrideCount] = useState(2);

  const openTickets = localComplaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const escalatedTickets = localComplaints.filter(c => c.priority === 'High' || c.status === 'Escalated').length;

  const handleForceOverride = () => {
    if (!targetTicket) return;
    setLocalComplaints(prev => prev.map(c => c.id === targetTicket.id ? { ...c, status: 'Resolved' } : c));
    setOverrideCount(prev => prev + 1);
    setOverrideModalOpen(false);
    setTargetTicket(null);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Complaint Oversight"
        subtitle="Enterprise visibility into user disputes, escalated incidents, and executive resolution."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Open Tickets" value={openTickets} icon={Users} trend="Platform-wide" trendColor="text-blue-400" />
        <KPICard title="Escalated to Exec" value={escalatedTickets} icon={AlertTriangle} trend="High Priority" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Avg Resolution Time" value="4.2h" icon={Clock} trend="-1.5h vs last week" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Executive Overrides" value={overrideCount} icon={ShieldAlert} trend="Past 7 days" trendColor="text-gold-400" iconColor="text-gold-400" />
      </div>

      <div className="mt-8">
        <h3 className="font-heading text-lg font-bold text-cream mb-4">Enterprise Complaint Governance</h3>
        <ComplaintTable 
          data={localComplaints}
          mode="oversight"
          onReview={(item) => console.log('Oversight Review', item.id)}
          onOverride={(item) => {
            setTargetTicket(item);
            setOverrideModalOpen(true);
          }}
        />
      </div>

      <ConfirmationModal
        isOpen={overrideModalOpen}
        onClose={() => {
          setOverrideModalOpen(false);
          setTargetTicket(null);
        }}
        onConfirm={handleForceOverride}
        title="Enterprise Complaint Override"
        message={`Are you sure you want to forcibly resolve or escalate ticket ${targetTicket?.id}? This overrides the assigned administrator's control.`}
        confirmText="Force Override"
      />
    </div>
  );
}
