import { Server, ShieldCheck, Box } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Procurement() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Procurement & Vendors</h2>
          <p className="text-sm text-ink/60">Manage platform infrastructure costs and third-party SaaS vendors.</p>
        </div>
        <GhostButton>Add Vendor</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Monthly Cost</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-medium text-cream flex items-center gap-3">
                <Server className="h-4 w-4 text-ink/40" /> Amazon Web Services
              </td>
              <td className="px-6 py-4 text-ink/60">Cloud Hosting & Database</td>
              <td className="px-6 py-4 font-semibold text-cream">$42,500</td>
              <td className="px-6 py-4"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-[10px] uppercase font-semibold">Active</span></td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-medium text-cream flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-ink/40" /> Paystack
              </td>
              <td className="px-6 py-4 text-ink/60">Payment Gateway</td>
              <td className="px-6 py-4 font-semibold text-cream">1.5% per tx</td>
              <td className="px-6 py-4"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-[10px] uppercase font-semibold">Active</span></td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-medium text-cream flex items-center gap-3">
                <Box className="h-4 w-4 text-ink/40" /> Salesforce
              </td>
              <td className="px-6 py-4 text-ink/60">CRM</td>
              <td className="px-6 py-4 font-semibold text-cream">$12,000</td>
              <td className="px-6 py-4"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-[10px] uppercase font-semibold">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
