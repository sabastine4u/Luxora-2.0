import { Upload, Download, FileCheck } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Documents() {
  const docs = [
    { id: 'DOC-901', name: 'Lease Agreement - T.Ayo Balogun.pdf', type: 'Contract', property: 'Victoria Island Villa', uploaded: 'Jan 02, 2025' },
    { id: 'DOC-902', name: 'Move-in Inspection Form.pdf', type: 'Inspection Form', property: 'Lekki Studio Apt', uploaded: 'Dec 05, 2024' },
    { id: 'DOC-903', name: 'HOA Regulations 2025.pdf', type: 'Compliance', property: 'Abuja Central Office', uploaded: 'Feb 10, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Document Repository</h2>
          <p className="text-sm text-ink/60">Secure storage for leases, compliance files, and property records.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload File</GoldButton>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search documents..."
      />

      <DataTable
        data={docs}
        keyExtractor={(doc) => doc.id}
        columns={[
          {
            header: "Document Name",
            render: (doc) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-ink/40" /> {doc.name}
              </div>
            )
          },
          {
            header: "Category",
            render: (doc) => (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-cream">
                {doc.type}
              </span>
            )
          },
          {
            header: "Associated Property",
            render: (doc) => <span className="text-ink/60">{doc.property}</span>
          },
          {
            header: "Upload Date",
            render: (doc) => <span className="text-ink/60">{doc.uploaded}</span>
          },
          {
            header: <div className="text-right">Action</div>,
            className: "text-right",
            render: () => (
              <button className="text-gold-400 hover:text-gold-300 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            )
          }
        ]}
      />
    </div>
  );
}
