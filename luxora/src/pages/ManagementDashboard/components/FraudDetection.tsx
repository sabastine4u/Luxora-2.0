import { ShieldAlert, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

export default function FraudDetection() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Fraud Detection</h2>
          <p className="text-sm text-ink/60">Real-time monitoring of suspicious listings and payment anomalies.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 flex items-center gap-4">
           <ShieldAlert className="h-8 w-8 text-rose-400" />
           <div>
             <div className="text-2xl font-bold text-rose-400">1</div>
             <div className="text-sm text-rose-400/80">Critical Alerts</div>
           </div>
        </div>
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 flex items-center gap-4">
           <AlertTriangle className="h-8 w-8 text-yellow-400" />
           <div>
             <div className="text-2xl font-bold text-yellow-400">8</div>
             <div className="text-sm text-yellow-400/80">Suspicious Activity</div>
           </div>
        </div>
      </div>

      <DataTable
        data={[
          { id: 'INC-001', type: 'Multiple failed login attempts', target: 'Admin: john.doe@luxora.com', severity: 'Critical' },
          { id: 'INC-002', type: 'Suspicious IP location', target: 'Owner: OWN-904', severity: 'Medium' }
        ]}
        keyExtractor={(inc) => inc.id}
        columns={[
          {
            header: "Incident ID",
            render: (inc) => <span className="font-medium text-cream">{inc.id}</span>
          },
          {
            header: "Type",
            render: (inc) => <span className="text-cream">{inc.type}</span>
          },
          {
            header: "Target User/Listing",
            render: (inc) => <span className="text-ink/60">{inc.target}</span>
          },
          {
            header: "Severity",
            render: (inc) => (
              <span className={`${inc.severity === 'Critical' ? 'text-rose-400 bg-rose-400/10' : 'text-yellow-400 bg-yellow-400/10'} px-2 py-1 rounded-full text-[10px] uppercase font-semibold`}>
                {inc.severity}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (inc) => (
              inc.severity === 'Critical' ? (
                <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors" title="Lock Account">
                  <XCircle className="h-5 w-5" />
                </button>
              ) : (
                <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors" title="Resolve">
                  <CheckCircle className="h-5 w-5" />
                </button>
              )
            )
          }
        ]}
      />
    </div>
  );
}
