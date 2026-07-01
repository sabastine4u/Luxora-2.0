import { ShieldAlert, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

export default function FraudAlerts() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Fraud & Security Alerts</h2>
          <p className="text-sm text-ink/60">Real-time monitoring of suspicious listings and payment anomalies.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 flex items-center gap-4">
           <ShieldAlert className="h-8 w-8 text-rose-400" />
           <div>
             <div className="text-2xl font-bold text-rose-400">3</div>
             <div className="text-sm text-rose-400/80">Critical Alerts</div>
           </div>
        </div>
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 flex items-center gap-4">
           <AlertTriangle className="h-8 w-8 text-yellow-400" />
           <div>
             <div className="text-2xl font-bold text-yellow-400">12</div>
             <div className="text-sm text-yellow-400/80">Suspicious Activity</div>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Incident ID</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Target User/Listing</th>
              <th className="px-6 py-4 font-semibold">Severity</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-medium text-cream">INC-001</td>
              <td className="px-6 py-4 text-cream">Multiple failed login attempts</td>
              <td className="px-6 py-4 text-ink/60">Admin: john.doe@luxora.com</td>
              <td className="px-6 py-4"><span className="text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full text-[10px] uppercase font-semibold">Critical</span></td>
              <td className="px-6 py-4 text-right">
                <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors" title="Lock Account">
                  <XCircle className="h-5 w-5" />
                </button>
              </td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-medium text-cream">INC-002</td>
              <td className="px-6 py-4 text-cream">Suspicious IP location (Russia)</td>
              <td className="px-6 py-4 text-ink/60">Owner: OWN-904</td>
              <td className="px-6 py-4"><span className="text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full text-[10px] uppercase font-semibold">Medium</span></td>
              <td className="px-6 py-4 text-right">
                <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors" title="Resolve">
                  <CheckCircle className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
