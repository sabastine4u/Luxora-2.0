import { Briefcase, Building, Users } from 'lucide-react';

export default function Management() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Corporate Management</h2>
          <p className="text-sm text-ink/60">Global workforce and corporate entity management.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div className="font-heading text-3xl font-bold text-cream">245</div>
          <div className="text-sm text-ink/60 mt-1">Internal Employees</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
            <Building className="h-6 w-6" />
          </div>
          <div className="font-heading text-3xl font-bold text-cream">4</div>
          <div className="text-sm text-ink/60 mt-1">Global Offices</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="font-heading text-3xl font-bold text-cream">12</div>
          <div className="text-sm text-ink/60 mt-1">Open Requisitions</div>
        </div>
      </div>
    </div>
  );
}
