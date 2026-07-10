import { Building2, Filter, MoreHorizontal, CheckCircle, XCircle, Search, Activity, ShieldCheck, Star, AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export default function PropertyManagement() {

  const properties = [
    { id: 'PRP-1001', title: 'Skyline Penthouse', location: 'Victoria Island, Lagos', price: '₦450,000,000', status: 'Live', type: 'Sale', quality: '98%', flags: 0 },
    { id: 'PRP-1002', title: 'Oceanview Villa', location: 'Lekki Phase 1, Lagos', price: '₦8,000,000/yr', status: 'Pending Review', type: 'Rent', quality: '75%', flags: 1 },
    { id: 'PRP-1003', title: 'Maitama Mansion', location: 'Maitama, Abuja', price: '₦1,200,000,000', status: 'Live', type: 'Sale', quality: '100%', flags: 0 },
    { id: 'PRP-1004', title: 'Asokoro Heights', location: 'Asokoro, Abuja', price: '₦950,000,000', status: 'Flagged', type: 'Sale', quality: '42%', flags: 3 }
  ];

  const listingLifecycle = [
    { label: 'Draft', value: 5, color: 'bg-ink/20' },
    { label: 'Verification', value: 15, color: 'bg-blue-400' },
    { label: 'Live', value: 70, color: 'bg-emerald-400' },
    { label: 'Under Offer', value: 10, color: 'bg-gold-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Property Operations" 
        subtitle="Global listing quality control, verification progress, and lifecycle management."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Flagged (12)
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Moderation Queue
            </GoldButton>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Star className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">Listing Quality Dashboard</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-emerald-400">88%</div>
               <div className="text-xs text-ink/60 mt-1">Platform Avg Quality</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-blue-400">92%</div>
               <div className="text-xs text-ink/60 mt-1">Images Verified</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-gold-400">85%</div>
               <div className="text-xs text-ink/60 mt-1">Docs Verified</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-emerald-400">14%</div>
               <div className="text-xs text-ink/60 mt-1">Premium Tier</div>
            </div>
          </div>
          <SegmentedProgressBar title="Listing Lifecycle Distribution" segments={listingLifecycle} />
        </div>

        {/* Verification Progress */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-400" /> Verification Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Document Verification Queue</span>
                  <span className="text-gold-400">42 Pending</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[60%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">Physical Inspection Queue</span>
                  <span className="text-blue-400">18 Pending</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[28%] rounded-full"></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <GhostButton className="w-full text-xs">Process Queue</GhostButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Active Listings" value="12,418" trend="+1.2% MoM" trendColor="text-emerald-400" icon={Building2} />
        <KPICard title="High Value Monitor" value="384" trend="Properties >₦1B" trendColor="text-gold-400" icon={Star} />
        <KPICard title="Listing Moderation" value="42" trend="Awaiting Approval" trendColor="text-blue-400" icon={Activity} />
        <KPICard title="Flagged Listings" value="12" trend="Requires Action" trendColor="text-rose-400" icon={AlertTriangle} />
      </div>

      <div className="space-y-6">
        {/* Listing Moderation Queue / Property Oversight */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <h3 className="font-heading text-lg font-semibold text-cream">Listing Moderation Queue</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="text" placeholder="Search properties..." className="h-9 w-full sm:w-64 rounded-lg border border-white/10 bg-navy-900/50 pl-10 pr-4 text-sm text-cream focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
              <GhostButton className="h-9 w-9 p-0 flex items-center justify-center shrink-0"><Filter className="h-4 w-4" /></GhostButton>
            </div>
          </div>
          <DataTable
            data={properties}
            keyExtractor={(prop) => prop.id}
            columns={[
              {
                header: "Property",
                render: (prop) => (
                  <div>
                    <div className="font-semibold text-cream">{prop.title}</div>
                    <div className="text-xs text-ink/60 flex items-center gap-1 mt-0.5">
                      <Building2 className="h-3 w-3" /> {prop.location}
                    </div>
                  </div>
                )
              },
              {
                header: "Type & Price",
                render: (prop) => (
                  <div>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase mb-1 ${prop.type === 'Sale' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                      {prop.type}
                    </span>
                    <div className="font-bold text-cream text-sm">{prop.price}</div>
                  </div>
                )
              },
              {
                header: "Quality Score",
                render: (prop) => (
                   <span className={`font-bold ${prop.quality === '100%' || prop.quality === '98%' ? 'text-emerald-400' : prop.quality === '75%' ? 'text-gold-400' : 'text-rose-400'}`}>
                     {prop.quality}
                   </span>
                )
              },
              {
                header: "Status",
                render: (prop) => (
                  <span className={`font-semibold text-[10px] uppercase px-2 py-1 rounded-full ${
                    prop.status === 'Live' ? 'bg-emerald-400/10 text-emerald-400' : 
                    prop.status === 'Pending Review' ? 'bg-gold-400/10 text-gold-400' : 
                    'bg-rose-400/10 text-rose-400'
                  }`}>{prop.status} {prop.flags > 0 && `(${prop.flags} flags)`}</span>
                )
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (prop) => (
                  <div className="flex justify-end gap-2">
                    {prop.status === 'Pending Review' && (
                       <>
                         <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"><CheckCircle className="h-4 w-4" /></button>
                         <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"><XCircle className="h-4 w-4" /></button>
                       </>
                    )}
                    <button className="text-ink/40 hover:text-cream hover:bg-white/10 p-2 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
