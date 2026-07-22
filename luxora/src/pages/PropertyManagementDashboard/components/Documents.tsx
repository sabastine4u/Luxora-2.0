import { useState } from 'react';
import { Upload, Download, FileCheck, Trash2 } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';
import { UploadModal } from './modals/UploadModal';
import { ConfirmationModal } from './modals/ConfirmationModal';



export default function Documents() {
  const { showToast } = useToast();
  const [modalState, setModalState] = useState<'upload' | 'delete' | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string, name: string, type: string, property: string, uploaded: string } | null>(null);

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'success'
    });
    setModalState(null);
  };

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
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('upload')}><Upload className="h-4 w-4" /> Upload File</GoldButton>
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
            render: (doc) => (
              <div className="flex items-center justify-end gap-2">
                <button className="p-2 text-ink/40 hover:text-gold-400 transition-colors" onClick={() => handleAction(`Download ${doc.name}`)}>
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-ink/40 hover:text-rose-400 transition-colors" onClick={() => { setSelectedDoc(doc); setModalState('delete'); }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          }
        ]}
      />

      <UploadModal 
        isOpen={modalState === 'upload'}
        onClose={() => setModalState(null)}
        title="Upload Document"
        onSubmit={(data) => handleAction(`Upload Document: ${data.name}`)}
      />

      <ConfirmationModal 
        isOpen={modalState === 'delete'}
        onClose={() => { setModalState(null); setSelectedDoc(null); }}
        title="Delete Document"
        description={`Are you sure you want to delete "${selectedDoc?.name}"? This action cannot be undone.`}
        confirmText="Delete Document"
        danger={true}
        onConfirm={() => handleAction(`Delete Document ${selectedDoc?.name}`)}
      />
    </div>
  );
}
