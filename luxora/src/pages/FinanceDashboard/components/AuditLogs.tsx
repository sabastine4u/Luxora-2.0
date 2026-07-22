import { useState } from 'react';
import { ShieldCheck, History, Monitor } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useToast } from '../../../contexts/ToastContext';

interface LogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  module: string;
  status: string;
  date: string;
  ip: string;
}

export default function AuditLogs() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const logs = [
    { id: 'LOG-8821', user: 'Admin User', action: 'Approved Refund', target: 'REF-0881', module: 'Disputes & Refunds', status: 'Success', date: 'Oct 06, 2026 14:30', ip: '192.168.1.45' },
    { id: 'LOG-8822', user: 'System Auto', action: 'Processed Payroll', target: 'Oct 2026 Batch', module: 'Payroll', status: 'Success', date: 'Oct 06, 2026 12:00', ip: '10.0.0.1' },
    { id: 'LOG-8823', user: 'Jane Doe', action: 'Failed Login Attempt', target: 'Finance Dashboard', module: 'Auth', status: 'Failed', date: 'Oct 06, 2026 09:15', ip: '197.210.64.12' },
    { id: 'LOG-8824', user: 'Admin User', action: 'Modified Budget Allocation', target: 'Marketing Dept', module: 'Budget', status: 'Success', date: 'Oct 05, 2026 16:45', ip: '192.168.1.45' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">System Audit Logs</h2>
          <p className="text-sm text-ink/60">Immutable record of all financial actions, modifications, and system events.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Audit Trail as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => handleAction('Run Security Scan')}>
            <ShieldCheck className="h-4 w-4 mr-2" /> Security Scan
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard 
          title="Total Events (24h)"
          value="1,425"
          icon={History}
          trend="Normal Activity"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="Failed Actions / Access"
          value="12"
          icon={Monitor}
          trend="Requires Review"
          trendColor="text-rose-400"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />
        <KPICard 
          title="Active Admins"
          value="4"
          icon={ShieldCheck}
          trend="Currently Online"
          trendColor="text-blue-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by user, action, or target..."
          showFilter
          onFilter={() => handleAction('Filter Audit Logs')}
        />

        <DataTable
          data={logs.filter(l => l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(log) => log.id}
          onRowClick={(log) => { setSelectedLog(log); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Log ID",
              render: (log) => <span className="font-medium text-cream">{log.id}</span>
            },
            {
              header: "Timestamp",
              render: (log) => <span className="text-ink/60">{log.date}</span>
            },
            {
              header: "User/System",
              render: (log) => <span className="font-medium text-cream">{log.user}</span>
            },
            {
              header: "Action",
              render: (log) => <span className="text-ink/60">{log.action}</span>
            },
            {
              header: "Target",
              render: (log) => <span className="text-ink/60">{log.target}</span>
            },
            {
              header: "Status",
              render: (log) => (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${log.status === 'Success' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                  {log.status}
                </span>
              )
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Event Log Details"
        subtitle={selectedLog?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Flag Event')}>Flag as Suspicious</GhostButton>
            <GoldButton onClick={() => handleAction('View JSON Payload')}>View JSON Payload</GoldButton>
          </>
        }
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${selectedLog.status === 'Success' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {selectedLog.status}
              </span>
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Timestamp</span>
                <span className="text-sm font-medium text-cream">{selectedLog.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">User/Actor</span>
                <span className="text-sm font-medium text-cream">{selectedLog.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">IP Address</span>
                <span className="text-sm font-medium text-cream">{selectedLog.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Module</span>
                <span className="text-sm font-medium text-cream">{selectedLog.module}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Action Performed</span>
                <span className="text-sm font-bold text-gold-400 text-right">{selectedLog.action} on {selectedLog.target}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Context Data</h4>
              <div className="rounded-xl border border-white/5 bg-black/40 p-4 overflow-x-auto">
                 <pre className="text-xs text-ink/60 font-mono">
                   {`{
  "eventId": "${selectedLog.id}",
  "actor": {
    "type": "${selectedLog.user === 'System Auto' ? 'system' : 'human'}",
    "identifier": "${selectedLog.user}"
  },
  "action": "${selectedLog.action}",
  "resource": "${selectedLog.target}",
  "metadata": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "authorized": true
  }
}`}
                 </pre>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}
