import { useState } from 'react';
import { 
  TrendingUp, Activity, PieChart, ShieldAlert, FileText, Bell, Sparkles, MapPin, Brain
} from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseDetailDrawer } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

export default function Overview() {
  const { showToast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{id: string, event: string, location: string, time: string, severity: string} | null>(null);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const recentActivity = [
    { id: '1', event: 'Price Drop Alert', location: 'Lekki Phase 1', time: '2 hours ago', severity: 'Medium' },
    { id: '2', event: 'New High ROI Property', location: 'Eko Atlantic', time: '5 hours ago', severity: 'Low' },
    { id: '3', event: 'Demand Spike', location: 'Maitama, Abuja', time: '1 day ago', severity: 'High' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Intelligence Overview</h2>
          <p className="text-sm text-ink/60">Executive command center for property analytics and market health.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton onClick={() => handleAction('Generate Market Report')}>
            <FileText className="h-4 w-4 mr-2" /> Report
          </GhostButton>
          <GoldButton onClick={() => handleAction('Run AI Insight')}>
            <Brain className="h-4 w-4 mr-2" /> Run Analysis
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Market Health Score"
          value="84/100"
          icon={Activity}
          trend="+2.4% vs last quarter"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
          backgroundColor="bg-emerald-400/10"
        />
        <KPICard 
          title="Avg Rental Yield"
          value="6.2%"
          icon={PieChart}
          trend="+0.3% YoY"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="Demand Index"
          value="High"
          icon={TrendingUp}
          trend="Surging in Lagos"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
        <KPICard 
          title="Risk Index"
          value="Medium-Low"
          icon={ShieldAlert}
          trend="Stable"
          trendColor="text-ink/60"
          iconColor="text-amber-400"
          backgroundColor="bg-amber-400/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
               <Bell className="h-5 w-5 text-gold-400" /> Recent Alerts & Activity
             </h3>
             <GhostButton size="sm" onClick={() => handleAction('View All Alerts')}>View All</GhostButton>
          </div>
          
          <div className="flex-1 overflow-hidden">
             <DataTable 
               data={recentActivity}
               keyExtractor={(item) => item.id}
               onRowClick={(item) => { setSelectedActivity(item); setIsDrawerOpen(true); }}
               columns={[
                 {
                   header: "Event",
                   render: (item) => <div className="font-medium text-cream">{item.event}</div>
                 },
                 {
                   header: "Location",
                   render: (item) => <div className="text-ink/60 flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</div>
                 },
                 {
                   header: "Time",
                   render: (item) => <div className="text-ink/60">{item.time}</div>
                 }
               ]}
             />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-gold-400" /> Top Investment Opportunities
             </h3>
             <GhostButton size="sm" onClick={() => handleAction('View All Opportunities')}>View All</GhostButton>
          </div>
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-gold-400/30 cursor-pointer transition-colors" onClick={() => handleAction(`View Opportunity ${i}`)}>
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold">
                         9{i}
                      </div>
                      <div>
                         <div className="font-semibold text-cream">Luxury Villa - Banana Island</div>
                         <div className="text-xs text-ink/60">Estimated ROI: 12.5%</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-gold-400 font-bold">₦850M</div>
                      <div className="text-xs text-emerald-400">Buy</div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      <EnterpriseDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Activity Details"
        subtitle={selectedActivity?.event}
      >
        {selectedActivity && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
               <h4 className="text-sm font-semibold text-cream mb-2">Alert Summary</h4>
               <p className="text-sm text-ink/80">Location: {selectedActivity.location}</p>
               <p className="text-sm text-ink/80">Time: {selectedActivity.time}</p>
               <p className="text-sm text-ink/80">Severity: {selectedActivity.severity}</p>
            </div>
            <GoldButton className="w-full" onClick={() => { handleAction('Acknowledge Alert'); setIsDrawerOpen(false); }}>
               Acknowledge Alert
            </GoldButton>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}
