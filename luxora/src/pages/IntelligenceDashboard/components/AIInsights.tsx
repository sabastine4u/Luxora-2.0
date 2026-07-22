import { useState } from 'react';
import { Brain, Bookmark, Sparkles, Filter } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge, EnterpriseExportMenu } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { AIInsight } from '../types';

export default function AIInsights() {
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const generateInsight = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      handleAction('Generate AI Insight');
    }, 1500);
  };

  const insights: AIInsight[] = [
    { id: 'AI-1', title: 'Emerging Tech Hub in Yaba', description: 'Recent zoning approvals and corporate lease signings suggest a 15% appreciation in commercial real estate over the next 18 months.', confidence: 89, impact: 'High', dateGenerated: 'Just now', category: 'Growth' },
    { id: 'AI-2', title: 'Oversupply Risk in Lekki', description: 'Analysis of ongoing construction permits indicates a potential 8% oversupply of luxury apartments by Q4.', confidence: 74, impact: 'Medium', dateGenerated: '2 hours ago', category: 'Risk' },
    { id: 'AI-3', title: 'Optimal Rental Pricing', description: 'Adjusting 3-bedroom unit asking prices down by 2% correlates with a 40% reduction in vacancy time in Victoria Island.', confidence: 92, impact: 'Medium', dateGenerated: '1 day ago', category: 'Optimization' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
             <Brain className="h-6 w-6 text-gold-400" /> AI Market Insights
          </h2>
          <p className="text-sm text-ink/60">Machine-learning generated market observations and predictions.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Insights as ${f.toUpperCase()}`)} />
          <GoldButton onClick={generateInsight} disabled={isGenerating}>
            {isGenerating ? 'Analyzing Market...' : <><Sparkles className="h-4 w-4 mr-2" /> Generate Insight</>}
          </GoldButton>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
         <GhostButton size="sm" onClick={() => handleAction('Filter: All Categories')}><Filter className="h-4 w-4 mr-2" /> All Categories</GhostButton>
         <GhostButton size="sm" className="text-ink/40" onClick={() => handleAction('Filter: Growth')}>Growth</GhostButton>
         <GhostButton size="sm" className="text-ink/40" onClick={() => handleAction('Filter: Risk')}>Risk</GhostButton>
         <GhostButton size="sm" className="text-ink/40" onClick={() => handleAction('Filter: Optimization')}>Optimization</GhostButton>
      </div>

      <div className="grid gap-6">
        {insights.map((insight) => (
           <div key={insight.id} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <EnterpriseStatusBadge status={insight.category} />
                       <span className="text-xs text-ink/40">{insight.dateGenerated}</span>
                    </div>
                    <h3 className="text-lg font-bold text-cream mb-1">{insight.title}</h3>
                 </div>
                 <div className="flex items-center gap-2">
                    <GhostButton size="sm" className="text-ink/40 hover:text-gold-400" onClick={() => handleAction('Save Insight')}><Bookmark className="h-4 w-4" /></GhostButton>
                 </div>
              </div>
              
              <p className="text-ink/80 text-sm leading-relaxed max-w-3xl">
                 {insight.description}
              </p>
              
              <div className="flex items-center gap-6 mt-2 pt-4 border-t border-white/5">
                 <div>
                    <div className="text-xs text-ink/60 mb-1">Confidence Score</div>
                    <div className="font-semibold text-emerald-400 flex items-center gap-1">
                       {insight.confidence}%
                    </div>
                 </div>
                 <div>
                    <div className="text-xs text-ink/60 mb-1">Potential Impact</div>
                    <div className="font-semibold text-cream">{insight.impact}</div>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
