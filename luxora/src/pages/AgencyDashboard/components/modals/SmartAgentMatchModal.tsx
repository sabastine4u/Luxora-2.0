import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { Brain, MapPin, Activity, Star, Clock, CheckCircle2 } from 'lucide-react';
import { agencyAgents } from '../../../../data/agencyData';
import type { AgencyAgent } from '../../../../types/agency';

interface SmartAgentMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
}

export function SmartAgentMatchModal({ isOpen, onClose, propertyTitle, propertyLocation }: SmartAgentMatchModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Mock scoring logic for demonstration
  const getMatchScore = (agent: AgencyAgent) => {
    if (agent.department === 'Luxury') return 95;
    if (agent.department === 'Residential') return 88;
    return 70;
  };

  const sortedAgents = [...agencyAgents].sort((a, b) => getMatchScore(b) - getMatchScore(a)).slice(0, 4);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Smart Agent Match" 
      size="2xl"
      actionButton={
        <div className="flex gap-3">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <GoldButton disabled={!selectedAgentId}>Confirm Assignment</GoldButton>
        </div>
      }
    >
      <div className="space-y-6 min-h-[400px]">
        {/* Header Info */}
        <div className="bg-navy-900 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
          <div className="h-12 w-12 rounded-full bg-blue-400/20 border border-blue-400/30 flex items-center justify-center">
            <Brain className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cream">AI Engine Analysis Complete</h3>
            <p className="text-xs text-ink/60">Matching agents for <span className="text-cream font-medium">{propertyTitle}</span> in {propertyLocation}</p>
          </div>
        </div>

        {/* Algorithm Weights */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">Proximity</div>
            <div className="text-xs font-bold text-emerald-400">40% Weight</div>
          </div>
          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">Specialty</div>
            <div className="text-xs font-bold text-blue-400">30% Weight</div>
          </div>
          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">Capacity</div>
            <div className="text-xs font-bold text-yellow-400">20% Weight</div>
          </div>
          <div className="bg-navy-950 rounded-lg p-2 text-center border border-white/5">
            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wider mb-1">Success</div>
            <div className="text-xs font-bold text-gold-400">10% Weight</div>
          </div>
        </div>

        {/* Matches */}
        <div className="space-y-3">
          {sortedAgents.map((agent, i) => {
            const score = getMatchScore(agent);
            const isSelected = selectedAgentId === agent.id;
            
            return (
              <div 
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-gold-400/10 border-gold-400/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                    : 'bg-navy-900 border-white/5 hover:border-white/20'
                }`}
              >
                {/* Score Badge */}
                <div className="shrink-0 flex flex-col items-center justify-center h-14 w-14 rounded-full border-4 border-navy-950 bg-emerald-400/20">
                  <span className="text-[10px] text-emerald-400 font-bold block leading-none">Match</span>
                  <span className="text-sm font-black text-emerald-400">{score}%</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-cream text-sm flex items-center gap-2">
                      {agent.name}
                      {i === 0 && <span className="bg-gold-400/20 text-gold-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Top Pick</span>}
                    </h4>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-gold-400" />}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-ink/80">
                      <MapPin className="h-3 w-3 text-ink/40" /> 1.2km from property
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/80">
                      <Activity className="h-3 w-3 text-ink/40" /> Capacity: {100 - (agent.capacity || 80)}% Available
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/80">
                      <Star className="h-3 w-3 text-ink/40" /> Success Rate: {agent.score}%
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/80">
                      <Clock className="h-3 w-3 text-ink/40" /> Avg Response: {agent.avgResponseTime || '15m'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
