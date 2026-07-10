import { X, Mail, Phone, Activity, FileText, CheckCircle2, UserCircle, ChevronRight, Home, DollarSign, MessageSquare } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string; name: string; email: string; phone: string; type: string; status: string;
    transactions: number; agent: string; lastComm: string;
  } | null;
}

export function ClientDetailModal({ isOpen, onClose, client }: ClientDetailModalProps) {
  if (!isOpen || !client) return null;

  const transactionTimeline = [
    { title: 'Purchased The Continental', time: 'Oct 2024', desc: '₦450M • Completed', icon: Home, color: 'text-emerald-400' },
    { title: 'Sold Victoria Island Office', time: 'Jan 2024', desc: '₦850M • Completed', icon: DollarSign, color: 'text-gold-400' },
    { title: 'First Inquiry', time: 'Nov 2023', desc: 'Contacted Sarah James', icon: MessageSquare, color: 'text-blue-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-navy-900 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-navy-950 flex items-center justify-center font-bold text-2xl text-cream border-2 border-white/10">
              {client.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-gold-400">{client.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${client.type === 'Buyer' ? 'bg-blue-400/20 text-blue-400' : 'bg-emerald-400/20 text-emerald-400'}`}>
                  {client.type}
                </span>
                <StatusBadge status={client.status} />
                {client.transactions > 2 && <span className="bg-gold-400 text-navy-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded">VIP</span>}
              </div>
              <h2 className="text-2xl font-heading font-bold text-cream">{client.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-ink/60">
                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {client.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {client.phone}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-ink/60 hover:text-cream rounded-lg hover:bg-white/5 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Col: Overview & Transactions */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Client Value Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="text-xs text-ink/60 uppercase tracking-widest font-bold mb-1">Total Lifetime Value</div>
                  <div className="text-xl font-bold text-emerald-400">₦1.3B</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="text-xs text-ink/60 uppercase tracking-widest font-bold mb-1">Transactions</div>
                  <div className="text-xl font-bold text-cream">{client.transactions}</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="text-xs text-ink/60 uppercase tracking-widest font-bold mb-1">Client Since</div>
                  <div className="text-xl font-bold text-cream">2023</div>
                </div>
              </div>

              {/* Transaction Timeline */}
              <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-gold-400" /> Client Journey & Transactions</h4>
                <ActivityTimeline items={transactionTimeline} />
              </div>

              {/* Saved Properties / Preferences */}
              <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><Home className="h-4 w-4 text-blue-400" /> Active Interests & Saved Properties</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-navy-950 rounded-lg border border-white/5">
                    <div className="w-16 h-12 bg-navy-900 rounded border border-white/10 flex items-center justify-center">
                      <Home className="h-4 w-4 text-ink/40" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-cream">Banana Island Plot</div>
                      <div className="text-xs text-emerald-400 font-bold">₦500M</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-navy-950 rounded-lg border border-white/5">
                    <div className="w-16 h-12 bg-navy-900 rounded border border-white/10 flex items-center justify-center">
                      <Home className="h-4 w-4 text-ink/40" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-cream">Lekki Phase 1 Villa</div>
                      <div className="text-xs text-emerald-400 font-bold">₦350M</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Communication & Agent */}
            <div className="space-y-6">
              
              {/* Primary Agent */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-gold-400" /> Primary Agent
                </h4>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-950">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-navy-900 flex items-center justify-center font-bold text-xs text-cream border border-gold-400/30">
                      {client.agent?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-cream">{client.agent}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink/40" />
                </div>
              </div>

              {/* Quick Communication Log */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-cream flex items-center gap-2"><MessageSquare className="h-4 w-4 text-emerald-400" /> Recent Comms</h4>
                  <span className="text-[10px] text-ink/60">{client.lastComm}</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-white/5 bg-navy-950">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-cream">Call with Agent</span>
                      <span className="text-ink/60">Oct 15</span>
                    </div>
                    <div className="text-sm text-ink/80">Client requested an update on the Ikoyi listing.</div>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-navy-950">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-cream">Email Sent</span>
                      <span className="text-ink/60">Oct 10</span>
                    </div>
                    <div className="text-sm text-ink/80">Monthly market report delivered.</div>
                  </div>
                </div>
                <GhostButton className="w-full mt-4 text-xs flex items-center gap-2 justify-center">
                  <FileText className="h-3 w-3" /> View Full Log
                </GhostButton>
              </div>

              {/* Documents & KYC */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4">Documents & KYC</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-2 bg-navy-950 rounded">
                    <span className="text-cream">ID Document</span>
                    <span className="text-emerald-400"><CheckCircle2 className="h-4 w-4" /></span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-navy-950 rounded">
                    <span className="text-cream">Proof of Funds</span>
                    <span className="text-emerald-400"><CheckCircle2 className="h-4 w-4" /></span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-navy-950 rounded border border-yellow-400/20">
                    <span className="text-cream">Contract Update</span>
                    <span className="text-yellow-400 text-xs font-bold">Pending</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between gap-3 bg-navy-900 sticky bottom-0 z-10">
           <GhostButton className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">Archive Client</GhostButton>
           <div className="flex gap-3">
            <GhostButton onClick={onClose}>Close</GhostButton>
            <GoldButton>New Transaction</GoldButton>
          </div>
        </div>

      </div>
    </div>
  );
}
