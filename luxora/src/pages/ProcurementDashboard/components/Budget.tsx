import { PieChart, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function Budget() {
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

  const handleAction = (action: string, context?: string) => {
    setConfirmationState({
      isOpen: true,
      title: action,
      description: context ? `Are you sure you want to ${action.toLowerCase()} for ${context}?` : `Are you sure you want to ${action.toLowerCase()}?`,
      confirmText: action.split(' ')[0],
      onConfirm: () => showWorkflowToast(action)
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Procurement Budget Allocation</h2>
          <p className="text-sm text-ink/60">Monitor departmental spending against allocated budgets.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="rounded-xl border border-white/10 bg-navy-900/80 py-2 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none cursor-pointer"
            onChange={(e) => handleAction(`Filter Budget`, e.target.value)}
          >
            <option>Q4 2025</option>
            <option>Q3 2025</option>
            <option>FY 2025</option>
          </select>
          <GoldButton onClick={() => handleAction('Download Budget Report')}>
            <Download className="h-4 w-4 mr-2 inline-block" /> Report
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Procurement Budget (Q4)</div>
           <div className="font-heading text-3xl font-bold text-cream">₦150.0M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Spent</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦84.5M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Remaining Balance</div>
           <div className="font-heading text-3xl font-bold text-gold-400">₦65.5M</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
           <PieChart className="h-5 w-5 text-gold-400" /> Departmental Breakdown
         </h3>
         
         <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 items-center">
                <span className="text-cream font-medium">IT & Infrastructure</span>
                <div className="flex items-center gap-4">
                  <span className="text-ink/60">₦45.0M / ₦60.0M <span className="text-emerald-400 ml-2">(75%)</span></span>
                  <button onClick={() => handleAction('View Budget Details', 'IT & Infrastructure')} className="text-gold-400 hover:text-gold-300 p-1"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[75%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2 items-center">
                <span className="text-cream font-medium">Marketing & Events</span>
                <div className="flex items-center gap-4">
                  <span className="text-ink/60">₦28.5M / ₦30.0M <span className="text-rose-400 ml-2">(95%)</span></span>
                  <button onClick={() => handleAction('View Budget Details', 'Marketing & Events')} className="text-gold-400 hover:text-gold-300 p-1"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-400 w-[95%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2 items-center">
                <span className="text-cream font-medium">Facilities & Maintenance</span>
                <div className="flex items-center gap-4">
                  <span className="text-ink/60">₦11.0M / ₦40.0M <span className="text-emerald-400 ml-2">(27.5%)</span></span>
                  <button onClick={() => handleAction('View Budget Details', 'Facilities & Maintenance')} className="text-gold-400 hover:text-gold-300 p-1"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 w-[27.5%]"></div>
              </div>
            </div>
         </div>
      </div>
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
