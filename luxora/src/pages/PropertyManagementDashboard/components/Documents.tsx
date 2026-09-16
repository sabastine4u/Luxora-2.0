import { useCallback } from 'react';
import { Download, FileCheck, Upload } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { propertyManagementApi } from '../../../api/property-management.api';
import { usePropertyManagementResource } from '../usePropertyManagementResource';
export default function Documents() {
  const load = useCallback(async () => { const result: any = await propertyManagementApi.documents(); const documents = result.documents || {}; return ['propertyDocuments', 'leaseDocuments', 'inspectionDocuments'].flatMap(type => (documents[type] || []).map((document: any) => ({ ...document, source: type.replace('Documents', '') }))); }, []);
  const { data, loading, error, refresh } = usePropertyManagementResource<any[]>(load, [load]);
  if (loading) return <div className="h-80 animate-pulse rounded-2xl bg-white/10" />;
  if (error) return <div className="text-rose-200">{error} <GhostButton onClick={() => void refresh()}>Retry</GhostButton></div>;
  return <div className="space-y-6 max-w-5xl"><div className="flex items-center justify-between"><div><h2 className="font-heading text-2xl font-bold text-cream">Document Repository</h2><p className="text-sm text-ink/60">Read-only documents available to your portfolio.</p></div><GoldButton disabled title="Property Manager document upload is not supported"><Upload className="mr-2 h-4 w-4" />Upload File</GoldButton></div><DataTable data={data!} keyExtractor={(document, index) => document._id || `${document.url}-${index}`} emptyState={<p className="text-center text-ink/60">No portfolio documents are available.</p>} columns={[{ header: 'Document Name', render: d => <span className="font-semibold text-cream"><FileCheck className="mr-2 inline h-4 w-4" />{d.title}</span> }, { header: 'Source', render: d => d.source }, { header: 'Property', render: d => d.propertyTitle || d.property?.title || '—' }, { header: 'Uploaded', render: d => d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '—' }, { header: 'Action', render: d => <a className="text-gold-400 hover:text-gold-300" href={d.url} target="_blank" rel="noreferrer"><Download className="inline h-4 w-4" /> View</a> }]} /></div>;
}
