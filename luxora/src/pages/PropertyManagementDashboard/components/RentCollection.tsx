import { useCallback, useState } from 'react';
import { Banknote } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { GhostButton } from '../../../components/ui/ui';
import { propertyManagementApi } from '../../../api/property-management.api';
import { usePropertyManagementResource } from '../usePropertyManagementResource';
const money = (n: number) => `₦${Number(n || 0).toLocaleString()}`;
const date = (d?: string) => d ? new Date(d).toLocaleDateString() : '—';
export default function RentCollection() {
  const load = useCallback(async () => (await propertyManagementApi.list('payments') as any).payments || [], []);
  const { data, loading, error, refresh } = usePropertyManagementResource<any[]>(load, [load]); const [selected, setSelected] = useState<any>(null);
  if (loading) return <div className="h-80 animate-pulse rounded-2xl bg-white/10" />;
  if (error) return <div className="text-rose-200">{error} <GhostButton onClick={() => void refresh()}>Retry</GhostButton></div>;
  const payments = data!; const paid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount || 0), 0); const overdue = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + Number(p.amount || 0), 0);
  return <div className="space-y-6 max-w-5xl"><div className="flex justify-between"><div><h2 className="font-heading text-2xl font-bold text-cream">Rent Collection</h2><p className="text-sm text-ink/60">Portfolio-scoped rental payments.</p></div><GhostButton disabled title="Creating payments is not available from Property Management">Log Payment</GhostButton></div><div className="grid gap-4 sm:grid-cols-3"><Metric label="Collected" value={money(paid)} /><Metric label="Outstanding / Overdue" value={money(overdue)} /><Metric label="Payment records" value={String(payments.length)} /></div><DataTable data={payments} keyExtractor={p => p._id} emptyState={<p className="text-center text-ink/60">No rent payments are available for this portfolio.</p>} columns={[{ header: 'Tenant', render: p => <span className="font-semibold text-cream"><Banknote className="mr-2 inline h-4 w-4" />{p.tenant?.fullName || p.tenant?.email || '—'}</span> }, { header: 'Property', render: p => p.property?.title || '—' }, { header: 'Amount', render: p => money(p.amount) }, { header: 'Period', render: p => p.paymentPeriod }, { header: 'Status', render: p => <EnterpriseStatusBadge status={p.status} /> }]} onRowClick={setSelected} /><EnterpriseDetailDrawer isOpen={!!selected} onClose={() => setSelected(null)} title="Payment Details">{selected && <div className="space-y-3 text-ink/80"><p>Amount: <strong className="text-cream">{money(selected.amount)}</strong></p><p>Period: {selected.paymentPeriod}</p><p>Reference: {selected.reference || '—'}</p><p>Paid: {date(selected.paidAt)}</p><GhostButton disabled title="Receipts are not supported by this API">Resend Receipt</GhostButton></div>}</EnterpriseDetailDrawer></div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6"><div className="text-sm text-ink/60">{label}</div><div className="mt-1 font-heading text-2xl font-bold text-cream">{value}</div></div>; }
