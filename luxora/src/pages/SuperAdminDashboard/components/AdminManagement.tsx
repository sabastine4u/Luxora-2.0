import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function AdminManagement() {
  const admins = [
    { id: 'ADM-001', name: 'John Doe', email: 'john.doe@luxora.com', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago' },
    { id: 'ADM-002', name: 'Jane Smith', email: 'jane.smith@luxora.com', role: 'Admin', status: 'Active', lastLogin: '1 hour ago' },
    { id: 'ADM-003', name: 'Chidi Okafor', email: 'chidi.o@luxora.com', role: 'Admin', status: 'Suspended', lastLogin: '2 months ago' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Admin Management</h2>
          <p className="text-sm text-ink/60">Create, manage, and suspend internal administrator accounts.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create Admin</GoldButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Admin ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role Level</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Last Login</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {admins.map((admin) => (
               <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                 <td className="px-6 py-4 font-medium text-cream">{admin.id}</td>
                 <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center text-xs font-bold">
                      {admin.name.charAt(0)}
                    </div>
                    {admin.name}
                 </td>
                 <td className="px-6 py-4 text-ink/60">{admin.email}</td>
                 <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${admin.role === 'Super Admin' ? 'bg-gold-400/20 text-gold-400' : 'bg-blue-400/20 text-blue-400'}`}>
                      {admin.role}
                    </span>
                 </td>
                 <td className="px-6 py-4">
                    {admin.status === 'Active' ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-xs"><CheckCircle className="h-3 w-3" /> Active</span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 text-xs"><XCircle className="h-3 w-3" /> Suspended</span>
                    )}
                 </td>
                 <td className="px-6 py-4 text-ink/60 text-xs">{admin.lastLogin}</td>
                 <td className="px-6 py-4 text-right">
                   {admin.role !== 'Super Admin' && (
                     <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors" title="Suspend Admin">
                       <Trash2 className="h-4 w-4" />
                     </button>
                   )}
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
