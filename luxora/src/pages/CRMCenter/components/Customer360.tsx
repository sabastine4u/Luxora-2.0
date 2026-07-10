import { useCRMCenter } from '../hooks/useCRMCenter';
import { Focus, Building2, CalendarCheck, FileText, Wallet, ArrowRight } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';

export const Customer360 = () => {
  const { selectedContact, setActiveWorkspace } = useCRMCenter();

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-ink-dark">
        <div className="text-center max-w-md">
          <Focus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Customer 360 Workspace</h2>
          <p className="text-gray-500 mb-6">Select a contact from the directory to view their complete enterprise profile, relationships, and history.</p>
          <GhostButton onClick={() => setActiveWorkspace('directory')}>View Directory</GhostButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Focus className="w-6 h-6 mr-3 text-gold-500" />
            Customer 360: {selectedContact.firstName} {selectedContact.lastName}
          </h2>
          <p className="text-gray-500 mt-1">Single source of truth for all enterprise interactions and relationships.</p>
        </div>
        <GhostButton onClick={() => setActiveWorkspace('profile')}>Back to Profile</GhostButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KPICard title="Properties Owned" value={selectedContact.type === 'Owner' ? '3' : '0'} icon={Building2} trend="View Portfolio" trendColor="text-blue-500 cursor-pointer" />
        <KPICard title="Active Deals" value="1" icon={Wallet} trend="₦850M Pipeline" trendColor="text-emerald-500" />
        <KPICard title="Appointments" value="2" icon={CalendarCheck} trend="1 Upcoming" trendColor="text-emerald-500" />
        <KPICard title="Documents" value="14" icon={FileText} trend="3 Pending Review" trendColor="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Relationship Overview */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Relationship Graph</h3>
            <GhostButton size="sm">View Full Graph <ArrowRight className="w-4 h-4 ml-1" /></GhostButton>
          </div>
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-100 dark:border-ink-light rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">C</div>
              <div className="h-0.5 w-12 bg-gray-200 dark:bg-ink-light" />
              <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center font-bold"><Building2 className="w-5 h-5" /></div>
            </div>
            <p className="text-sm text-gray-400 mt-6">Interactive force-directed graph placeholder.</p>
          </div>
        </div>

        {/* Unified Timeline Preview */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Unified Timeline</h3>
            <GhostButton size="sm">View All Activities</GhostButton>
          </div>
          <div className="space-y-6 pl-4 border-l-2 border-gray-100 dark:border-ink-light">
            <div className="relative">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-ink" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Signed NDA Document</div>
              <div className="text-xs text-gray-500 mt-1">Today at 10:30 AM via Document Center</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-ink" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Completed Property Viewing</div>
              <div className="text-xs text-gray-500 mt-1">Yesterday at 2:00 PM • Azure Tower</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-ink" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Workflow Initiated: Buyer Verification</div>
              <div className="text-xs text-gray-500 mt-1">July 7 at 9:15 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
