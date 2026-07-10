import { Home } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

export default function MortgageStatistics() {
  const mortgages = [
    { id: 'MTG-001', applicant: 'Chinedu Eze', bank: 'Zenith Bank', amount: '₦45,000,000', rate: '14.5%', status: 'Approved', date: 'Oct 02, 2025' },
    { id: 'MTG-002', applicant: 'Amina Bello', bank: 'GTBank', amount: '₦120,000,000', rate: '15.2%', status: 'Underwriting', date: 'Oct 05, 2025' },
    { id: 'MTG-003', applicant: 'Emeka Uzo', bank: 'Access Bank', amount: '₦35,000,000', rate: '16.0%', status: 'Declined', date: 'Sep 28, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Mortgage Statistics</h2>
          <p className="text-sm text-ink/60">Monitor loan applications routed through Luxora partner banks.</p>
        </div>
        <select className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
          <option>All Partner Banks</option>
          <option>Zenith Bank</option>
          <option>GTBank</option>
          <option>Access Bank</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Loan Volume Approved</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦2.4B</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Active Applications</div>
           <div className="font-heading text-3xl font-bold text-cream">45</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Average Approval Rate</div>
           <div className="font-heading text-3xl font-bold text-gold-400">68%</div>
        </div>
      </div>

      <DataTable
        data={mortgages}
        keyExtractor={(mtg) => mtg.id}
        columns={[
          {
            header: "App ID",
            render: (mtg) => <span className="font-medium text-cream">{mtg.id}</span>
          },
          {
            header: "Applicant",
            render: (mtg) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Home className="h-4 w-4 text-ink/40" /> {mtg.applicant}
              </div>
            )
          },
          {
            header: "Partner Bank",
            render: (mtg) => <span className="text-ink/60">{mtg.bank}</span>
          },
          {
            header: "Requested Amount",
            render: (mtg) => <span className="font-bold text-gold-400">{mtg.amount}</span>
          },
          {
            header: "Rate",
            render: (mtg) => <span className="text-ink/60">{mtg.rate}</span>
          },
          {
            header: <div className="text-right">Status</div>,
            className: "text-right",
            render: (mtg) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${mtg.status === 'Approved' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : mtg.status === 'Underwriting' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {mtg.status}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
