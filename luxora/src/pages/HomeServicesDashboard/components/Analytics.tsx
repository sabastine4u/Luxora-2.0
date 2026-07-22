import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseExportMenu } from '../../../components/enterprise/EnterpriseExportMenu';
import { useToast } from '../../../contexts/ToastContext';
import { Sparkles, Star, CheckCircle2, Smile } from 'lucide-react';

export default function Analytics() {
  const { showToast } = useToast();

  const handleExport = (format: string) => {
    showToast({ title: 'Success', description: `Analytics report exported as ${format}`, type: 'success' });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Service Intelligence</h2>
          <p className="text-sm text-ink/60">Performance metrics and service analytics.</p>
        </div>
        <EnterpriseExportMenu onExport={handleExport} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Most Requested" 
          value="Cleaning" 
          trend="35% share" 
          icon={Sparkles} 
        />
        <KPICard 
          title="Avg Provider Rating" 
          value="4.8/5.0" 
          trend="+0.2" 
          icon={Star} 
        />
        <KPICard 
          title="Request Completion Rate" 
          value="94.2%" 
          trend="+1.5%" 
          icon={CheckCircle2} 
        />
        <KPICard 
          title="Customer Satisfaction" 
          value="96%" 
          trend="+2%" 
          icon={Smile} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-ink/60">Category Distribution Chart Component</p>
        </div>
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-ink/60">Revenue Trends Chart Component</p>
        </div>
      </div>
    </div>
  );
}
