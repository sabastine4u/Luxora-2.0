import { Bot, Lightbulb, CheckCircle2, Zap } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

interface AIAssistantPanelProps {
  onClose: () => void;
  onApplyTemplate: (text: string) => void;
}

export const AIAssistantPanel = ({ onClose, onApplyTemplate }: AIAssistantPanelProps) => {
  return (
    <div className="w-72 flex flex-col h-full bg-white dark:bg-ink border-l border-gray-100 dark:border-ink-light shadow-sm">
      <div className="p-4 border-b border-gray-100 dark:border-ink-light flex items-center justify-between bg-gold-50/50 dark:bg-gold-900/10">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-gold-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
        </div>
        <GhostButton size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full text-gray-400">
          <span className="sr-only">Close</span>
          &times;
        </GhostButton>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Suggested Replies */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <Lightbulb className="w-3.5 h-3.5 mr-1" />
            Suggested Replies
          </h3>
          <div className="space-y-2">
            {[
              "I can schedule a viewing for Saturday at 2 PM.",
              "Yes, the property is still available.",
              "I'll send over the floor plans right away."
            ].map((reply, i) => (
              <button 
                key={i}
                onClick={() => onApplyTemplate(reply)}
                className="w-full text-left p-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-ink-light rounded-xl hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700 dark:hover:text-gold-400 transition-colors border border-transparent hover:border-gold-200 dark:hover:border-gold-800"
              >
                "{reply}"
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Summary */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1" />
            Insights
          </h3>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              The client is highly interested but waiting on financing approval. Follow up next Tuesday.
            </p>
          </div>
        </div>

        {/* Action Items */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Detected Action Items
          </h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2 p-2">
              <input type="checkbox" className="mt-1 rounded text-gold-500 focus:ring-gold-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Send property brochure</span>
            </div>
            <div className="flex items-start space-x-2 p-2">
              <input type="checkbox" className="mt-1 rounded text-gold-500 focus:ring-gold-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Confirm viewing time</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
