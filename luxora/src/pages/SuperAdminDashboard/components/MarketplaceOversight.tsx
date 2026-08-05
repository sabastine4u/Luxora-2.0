import { useState } from 'react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { ListingTable } from '../../../components/dashboard/shared/tables/ListingTable';
import { adminListings } from '../../../data/adminData';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Activity, ShieldAlert, BarChart3, Clock } from 'lucide-react';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import type { AdminListing } from '../../../types/admin';

export default function MarketplaceOversight() {
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetListing, setTargetListing] = useState<AdminListing | null>(null);

  const moderationQueue = adminListings.filter(l => l.verification?.status === 'Under Review' || l.status === 'Flagged');

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Marketplace Oversight"
        subtitle="Executive monitoring of listing quality, moderation queues, and platform integrity."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Platform Avg Quality" value="88%" icon={BarChart3} trend="Stable" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Moderation Backlog" value="42" icon={Clock} trend="Action Required" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
        <KPICard title="Flagged Listings" value="12" icon={Activity} trend="Requires Investigation" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Moderation Overrides" value="5" icon={ShieldAlert} trend="Past 30 days" trendColor="text-gold-400" iconColor="text-gold-400" />
      </div>

      <div className="mt-8">
        <h3 className="font-heading text-lg font-bold text-cream mb-4">Moderation Queue Governance</h3>
        <ListingTable 
          data={moderationQueue}
          mode="oversight"
          onReview={(item) => console.log('Review Listing', item.id)}
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
          console.log('Force Moderation Decision executed on', targetListing?.id);
          setOverrideModalOpen(false);
          setTargetListing(null);
        }}
        title="Enterprise Moderation Override"
        message={`Are you sure you want to forcibly override the moderation status of ${targetListing?.title}? This bypasses standard quality checks.`}
        confirmText="Force Override"
      />
    </div>
  );
}
