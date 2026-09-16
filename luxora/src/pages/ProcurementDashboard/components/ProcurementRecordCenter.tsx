import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { notifyProcurementDataChanged, procurementApi } from '../../../api/procurement.api';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EmptyState } from '../../../components/layout/EmptyState';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';

type RecordType = 'vendor' | 'rfq' | 'request' | 'order' | 'contract' | 'inventory' | 'asset' | 'invoice' | 'budget' | 'payment';
type ProcurementRecord = { id: string; name: string; description: string; status: string; category: string; department: string; amount: number; currency: string; quantity: number | null; dueDate: string | null; vendorName: string; createdAt: string };

const copy: Record<RecordType, { title: string; description: string; create: string }> = {
  vendor: { title: 'Vendor Directory', description: 'Manage registered suppliers and service providers.', create: 'Add Vendor' },
  rfq: { title: 'Request for Quotes (RFQs)', description: 'Manage bidding processes and supplier quotes.', create: 'Create RFQ' },
  request: { title: 'Purchase Requests (PR)', description: 'Review internal departmental procurement requests.', create: 'Create Request' },
  order: { title: 'Purchase Orders (PO)', description: 'Track orders issued to approved vendors.', create: 'Create PO' },
  contract: { title: 'Contracts', description: 'Maintain procurement contract records.', create: 'Add Contract' },
  inventory: { title: 'Inventory', description: 'Track procurement inventory records.', create: 'Add Inventory Item' },
  asset: { title: 'Assets', description: 'Maintain acquired asset records.', create: 'Add Asset' },
  invoice: { title: 'Invoices', description: 'Track vendor invoices received by procurement.', create: 'Add Invoice' },
  budget: { title: 'Budget', description: 'Record approved procurement budget allocations.', create: 'Add Budget' },
  payment: { title: 'Payments', description: 'Track procurement payment requests and statuses.', create: 'Create Payment Request' },
};
const formatMoney = (amount: number, currency = 'NGN') => new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
const initialForm = { name: '', description: '', status: 'Draft', category: '', department: '', amount: '', quantity: '', dueDate: '', vendorName: '' };

export function ProcurementRecordCenter({ recordType }: { recordType: RecordType }) {
  const content = copy[recordType];
  const [records, setRecords] = useState<ProcurementRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selected, setSelected] = useState<ProcurementRecord | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response: any = await procurementApi.list(recordType);
      setRecords(Array.isArray(response?.records) ? response.records : []);
    } catch (requestError: any) {
      setError(requestError?.message || 'Unable to load procurement records.');
    } finally { setIsLoading(false); }
  }, [recordType]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setSelected(null); setForm(initialForm); setFormError(''); }, [recordType]);

  const visibleRecords = useMemo(() => records.filter((record) => `${record.id} ${record.name} ${record.vendorName} ${record.department}`.toLowerCase().includes(search.toLowerCase())), [records, search]);
  const openCreate = () => { setForm(initialForm); setFormError(''); setIsModalOpen(true); };
  const updateForm = (key: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    if (!form.name.trim()) { setFormError('A name or title is required.'); return; }
    setIsSaving(true); setFormError('');
    try {
      await procurementApi.create(recordType, { ...form, amount: form.amount === '' ? 0 : Number(form.amount), quantity: form.quantity === '' ? null : Number(form.quantity), dueDate: form.dueDate || null });
      notifyProcurementDataChanged();
      setIsModalOpen(false); await load();
    } catch (requestError: any) { setFormError(requestError?.message || 'Unable to create this record.'); }
    finally { setIsSaving(false); }
  };
  const changeStatus = async (record: ProcurementRecord, status: string) => {
    try { await procurementApi.update(recordType, record.id, { status }); notifyProcurementDataChanged(); await load(); setSelected(null); }
    catch (requestError: any) { setError(requestError?.message || 'Unable to update this record.'); }
  };
  const statusClass = (status: string) => /approved|active|fulfilled|paid|awarded/i.test(status) ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : /rejected|cancelled|overdue/i.test(status) ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-gold-300 bg-gold-400/10 border-gold-400/20';

  return <div className="space-y-6 max-w-5xl">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h2 className="font-heading text-2xl font-bold text-cream">{content.title}</h2><p className="text-sm text-ink/60">{content.description}</p></div><GoldButton onClick={openCreate} className="flex items-center gap-2"><Plus className="h-4 w-4" />{content.create}</GoldButton></div>
    <DataTableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder={`Search ${content.title.toLowerCase()}...`} showRefresh onRefresh={() => void load()} />
    {error && <div className="flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-200"><AlertCircle className="h-4 w-4" />{error}<button className="ml-auto underline" onClick={() => void load()}>Retry</button></div>}
    <DataTable isLoading={isLoading} data={visibleRecords} keyExtractor={(record) => record.id} onRowClick={setSelected} emptyState={<EmptyState title={`No ${content.title.toLowerCase()} yet`} description="No records have been created in Luxora yet." actionLabel={content.create} onAction={openCreate} />} columns={[
      { header: 'Reference', render: (record) => <span className="font-medium text-gold-400">{record.id}</span> },
      { header: 'Name', render: (record) => <div><p className="font-semibold text-cream">{record.name}</p>{record.vendorName && <p className="text-xs text-ink/50">{record.vendorName}</p>}</div> },
      { header: 'Department / Category', render: (record) => <span className="text-ink/60">{record.department || record.category || '—'}</span> },
      { header: 'Amount', render: (record) => <span className="font-bold text-gold-400">{formatMoney(record.amount, record.currency)}</span> },
      { header: 'Status', render: (record) => <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${statusClass(record.status)}`}>{record.status}</span> },
      { header: '', className: 'text-right', render: () => <ChevronRight className="ml-auto h-4 w-4 text-gold-400" /> },
    ]} />
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={content.create} actionButton={<GoldButton size="sm" onClick={() => void save()} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save record'}</GoldButton>}><div className="grid gap-4"><Input label="Name / title" value={form.name} onChange={(event) => updateForm('name', event.target.value)} error={formError} /><Input label="Description" value={form.description} onChange={(event) => updateForm('description', event.target.value)} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="Status" value={form.status} onChange={(event) => updateForm('status', event.target.value)} /><Input label="Department" value={form.department} onChange={(event) => updateForm('department', event.target.value)} /></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="Category" value={form.category} onChange={(event) => updateForm('category', event.target.value)} /><Input label="Vendor name" value={form.vendorName} onChange={(event) => updateForm('vendorName', event.target.value)} /></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Input label="Amount" type="number" min="0" value={form.amount} onChange={(event) => updateForm('amount', event.target.value)} /><Input label="Quantity" type="number" min="0" value={form.quantity} onChange={(event) => updateForm('quantity', event.target.value)} /><Input label="Due date" type="date" value={form.dueDate} onChange={(event) => updateForm('dueDate', event.target.value)} /></div></div></Modal>
    <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.id || 'Procurement record'} actionButton={selected ? <div className="flex gap-2"><GhostButton size="sm" onClick={() => void changeStatus(selected, 'Cancelled')}>Cancel</GhostButton><GoldButton size="sm" onClick={() => void changeStatus(selected, 'Completed')}>Mark completed</GoldButton></div> : undefined}>{selected && <div className="space-y-3 text-sm"><p className="text-cream font-semibold">{selected.name}</p><p className="text-ink/60">{selected.description || 'No description provided.'}</p><div className="grid grid-cols-2 gap-3 text-ink/60"><span>Status: {selected.status}</span><span>Amount: {formatMoney(selected.amount, selected.currency)}</span><span>Category: {selected.category || '—'}</span><span>Vendor: {selected.vendorName || '—'}</span></div></div>}</Modal>
  </div>;
}

export function ProcurementOverview() {
  const [overview, setOverview] = useState<any>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setOverview(await procurementApi.getOverview()); } catch (requestError: any) { setError(requestError?.message || 'Unable to load procurement overview.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  const summary = overview?.overview?.summary;
  return <div className="space-y-6 max-w-5xl"><div className="flex justify-between gap-4"><div><h2 className="font-heading text-2xl font-bold text-cream">Procurement Overview</h2><p className="text-sm text-ink/60">Live procurement operations from Luxora records.</p></div><GhostButton size="sm" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</GhostButton></div>{error && <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-rose-200">{error}</div>}{loading ? <div className="py-20 text-center text-ink/50">Loading procurement overview…</div> : <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Active Vendors', summary?.activeVendors], ['Pending Requests', summary?.pendingRequests], ['Open RFQs', summary?.openRfqs], ['Open Orders', summary?.openOrders]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-navy-800/50 p-5"><p className="text-xs uppercase text-ink/50">{label}</p><p className="mt-2 text-3xl font-bold text-gold-400">{value ?? 0}</p></div>)}</div><DataTable data={overview?.overview?.recentActivity || []} keyExtractor={(record: ProcurementRecord) => record.id} emptyState={<EmptyState title="No procurement activity" description="Create a procurement record to begin tracking operations." />} columns={[{ header: 'Recent activity', render: (record: ProcurementRecord) => <span className="font-semibold text-cream">{record.name}</span> }, { header: 'Type', render: (record: any) => <span className="text-ink/60">{record.recordType}</span> }, { header: 'Status', render: (record: ProcurementRecord) => <span className="text-ink/60">{record.status}</span> }]} /></>}</div>;
}

export function ProcurementReports() {
  const [report, setReport] = useState<any>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setReport(await procurementApi.getReport()); } catch (requestError: any) { setError(requestError?.message || 'Unable to load the procurement report.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  return <div className="space-y-6 max-w-5xl"><div className="flex justify-between gap-4"><div><h2 className="font-heading text-2xl font-bold text-cream">Procurement Reports</h2><p className="text-sm text-ink/60">Live operational totals calculated from procurement records.</p></div><GhostButton size="sm" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</GhostButton></div>{error && <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-rose-200">{error}</div>}<DataTable isLoading={loading} data={report?.report?.breakdown || []} keyExtractor={(row: any) => row.recordType} emptyState={<EmptyState title="No procurement records to report" description="Report totals will appear as operational records are created." />} columns={[{ header: 'Record type', render: (row: any) => <span className="font-semibold capitalize text-cream">{row.recordType}</span> }, { header: 'Records', render: (row: any) => <span className="text-ink/60">{row.count}</span> }, { header: 'Recorded amount', render: (row: any) => <span className="font-bold text-gold-400">{formatMoney(row.totalAmount, row.currency)}</span> }]} /></div>;
}
