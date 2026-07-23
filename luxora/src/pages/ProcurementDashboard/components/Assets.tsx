import { Wrench, Building2, Filter, Eye, History } from 'lucide-react';
import { useState } from 'react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function Assets() {
  const { showWorkflowToast } = useWorkflowToast();
  
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const handleAction = (action: string, tag?: string) => {
    setConfirmationState({
      isOpen: true,
      title: action,
      description: tag ? `Are you sure you want to ${action.toLowerCase()} for Asset ${tag}?` : `Are you sure you want to ${action.toLowerCase()}?`,
      confirmText: action.split(' ')[0],
      onConfirm: () => showWorkflowToast(action)
    });
  };
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
        <GoldButton onClick={() => handleAction('Register Asset')}>Register Asset</GoldButton>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search by tag or name..."
        actions={
          <button 
            className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors"
            onClick={() => handleAction('Category Filter')}
          >
            <Filter className="h-4 w-4 mr-2" /> Category
          </button>
        }
      />

      <DataTable
        data={assets}
        keyExtractor={(ast) => ast.tag}
        columns={[
          {
            header: "Asset Tag",
            render: (ast) => <span className="font-medium text-cream">{ast.tag}</span>
          },
          {
            header: "Name",
            render: (ast) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-ink/40" /> {ast.name}
              </div>
            )
          },
          {
            header: "Category",
            render: (ast) => <span className="text-ink/60">{ast.category}</span>
          },
          {
            header: "Location",
            render: (ast) => <span className="text-ink/60">{ast.location}</span>
          },
          {
            header: "Status",
            render: (ast) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${ast.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {ast.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (ast) => (
              <div className="flex justify-end gap-2">
                <button 
                  className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => handleAction('Asset Details', ast.tag)}
                ><Eye className="h-4 w-4" /></button>
                <button 
                  className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => handleAction('Assignment History', ast.tag)}
                ><History className="h-4 w-4" /></button>
                <button 
                  className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"
                  onClick={() => handleAction('Schedule Maintenance', ast.tag)}
                ><Wrench className="h-4 w-4" /></button>
              </div>
            )
          }
        ]}
      />
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
      />
    </div>
  );
}
