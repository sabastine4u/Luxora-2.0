import { useCRMCenter } from '../hooks/useCRMCenter';
import { PIPELINE_STAGES } from '../constants/crmConstants';
import { Kanban, Plus, MoreHorizontal } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { MOCK_CONTACTS } from '../data/mockData';

export const LeadPipeline = () => {
  const { opportunities } = useCRMCenter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'NGN' }).format(value);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark overflow-hidden">
      <div className="p-6 pb-4 shrink-0 flex items-center justify-between bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Kanban className="w-5 h-5 mr-3 text-gold-500" />
            Lead Pipeline
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enterprise opportunity and deal tracking kanban board.
          </p>
        </div>
        <GoldButton>
          <Plus className="w-4 h-4 mr-2" /> New Opportunity
        </GoldButton>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
        <div className="flex space-x-6 h-full pb-4 items-start">
          {PIPELINE_STAGES.map(stage => {
            const stageOpps = opportunities.filter(opp => opp.stage === stage.id);
            const stageTotal = stageOpps.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div key={stage.id} className="flex flex-col w-80 shrink-0 h-full max-h-full">
                <div className={`border-t-4 ${stage.color} bg-white dark:bg-ink rounded-t-xl p-4 border-x border-b border-gray-200 dark:border-ink-light mb-3 shadow-sm`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{stage.label}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-ink-light text-gray-600 dark:text-gray-400">
                      {stageOpps.length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {formatCurrency(stageTotal)}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                  {stageOpps.map(opp => {
                    const contact = MOCK_CONTACTS.find(c => c.id === opp.contactId);
                    return (
                      <div key={opp.id} className="bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab group">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 pr-4">{opp.title}</h4>
                          <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                          {formatCurrency(opp.value)}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-ink-light">
                          <div className="flex items-center space-x-2">
                            {contact?.avatar ? (
                              <img src={contact.avatar} alt="Avatar" className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {contact?.firstName?.[0] || 'U'}
                              </div>
                            )}
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                              {contact?.firstName} {contact?.lastName}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {opp.probability}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {stageOpps.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 dark:border-ink-light rounded-xl h-24 flex items-center justify-center text-gray-400 text-sm">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
