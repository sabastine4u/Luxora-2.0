import { AlertTriangle, ShieldAlert, DollarSign, Briefcase } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const ExecutiveDashboard = () => {
  const criticalAlerts = MOCK_NOTIFICATIONS.filter(n => n.priority === 'critical');
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Executive Priority Dashboard</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Top Risks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-red-900 dark:text-red-400">Compliance Risks</h3>
            </div>
            <p className="text-2xl font-bold text-red-900 dark:text-red-300 mb-1">3 Active</p>
            <p className="text-sm text-red-700 dark:text-red-500">Requires immediate attention</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/50 p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-400">Financial Anomalies</h3>
            </div>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-300 mb-1">1 Detected</p>
            <p className="text-sm text-orange-700 dark:text-orange-500">Deal #8492 flagged</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-400">High-Value Deals</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">12 Pending</p>
            <p className="text-sm text-blue-700 dark:text-blue-500">Awaiting final approval</p>
          </div>
        </div>

        {/* Critical Alerts Feed */}
        <div className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-ink-light flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Critical Executive Alerts</h3>
          </div>
          
          <div className="divide-y divide-gray-50 dark:divide-ink-light/50">
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="p-6 flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
                    <span className="text-xs font-medium text-gray-500">{formatMessageTime(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-ink-light rounded text-gray-600 dark:text-gray-300">
                      Source: {alert.source}
                    </span>
                    <button className="text-xs font-semibold text-gold-500 hover:text-gold-600 transition-colors">
                      Take Action →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
