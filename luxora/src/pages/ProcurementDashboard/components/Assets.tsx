import { Building2, Search, Filter, Wrench } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Assets() {
  const assets = [
    { tag: 'AST-LND-001', name: 'Land Rover Defender', category: 'Vehicles', location: 'Lagos HQ', assignedTo: 'Operations', status: 'Active' },
    { tag: 'AST-IT-105', name: 'Server Rack A2', category: 'IT Infrastructure', location: 'Abuja Data Center', assignedTo: 'IT Dept', status: 'Active' },
    { tag: 'AST-FURN-22', name: 'Executive Desk (Oak)', category: 'Furniture', location: 'Lagos HQ', assignedTo: 'Management', status: 'Maintenance' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Fixed Assets Register</h2>
          <p className="text-sm text-ink/60">Manage company-owned vehicles, equipment, and large assets.</p>
        </div>
        <GoldButton>Register Asset</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by tag or name..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
          <Filter className="h-4 w-4 mr-2" /> Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Asset Tag</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {assets.map((ast) => (
              <tr key={ast.tag} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{ast.tag}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-ink/40" /> {ast.name}
                </td>
                <td className="px-6 py-4 text-ink/60">{ast.category}</td>
                <td className="px-6 py-4 text-ink/60">{ast.location}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${ast.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {ast.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors" title="Schedule Maintenance"><Wrench className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
