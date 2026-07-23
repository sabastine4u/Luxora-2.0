import { useState } from 'react';
import { Landmark, ArrowDownRight, ArrowUpRight, Activity, Wallet, AlertTriangle, Download, DollarSign, ShieldCheck } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export default function Finance() {
  const [activeView, setActiveView] = useState('Operating');
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; type: 'gl' | 'pack' | 'transfer' | null}>({ isOpen: false, type: null });

  const cashFlow = [
    { label: 'Operating Capital', value: 65, color: 'bg-emerald-400' },
    { label: 'Escrow (Client Funds)', value: 20, color: 'bg-blue-400' },
    { label: 'Strategic Reserves', value: 15, color: 'bg-gold-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Enterprise Financial Center" 
        subtitle="Executive oversight of treasury, cash flow, corporate risk, and outstanding transactions."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'gl' })}>
              <Activity className="h-4 w-4" /> View GL
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'pack' })}>
              <Download className="h-4 w-4" /> Financial Pack
            </GoldButton>
          </div>
        }
      />

      {/* Enterprise Cash Flow & Financial Risk */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">Enterprise Cash Flow Dashboard</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Inflow (30d)</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1"><ArrowUpRight className="h-4 w-4" /> ₦2.4B</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Outflow (30d)</div>
              <div className="text-xl font-bold text-rose-400 flex items-center gap-1"><ArrowDownRight className="h-4 w-4" /> ₦850M</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Net Cash Flow</div>
              <div className="text-xl font-bold text-emerald-400">₦1.55B</div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
              <div className="text-sm text-ink/60 mb-1">Runway</div>
              <div className="text-xl font-bold text-cream">42 Mo</div>
            </div>
          </div>
          <SegmentedProgressBar title="Treasury Allocation Overview" segments={cashFlow} />
        </div>

        {/* Financial Risk Dashboard */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gold-400" /> Financial Risk Monitor
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <span className="text-ink/80">Liquidity Ratio</span>
                <span className="text-emerald-400 font-medium">3.2x (Healthy)</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <span className="text-ink/80">Debt-to-Equity</span>
                <span className="text-emerald-400 font-medium">0.15</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <span className="text-ink/80">Accounts Receivable Risk</span>
                <span className="text-emerald-400 font-medium">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Operating Capital" value="₦4.2B" trend="+12% YoY" trendColor="text-emerald-400" icon={Landmark} />
        <KPICard title="A/R (30 Days)" value="₦850M" trend="Healthy Collection" trendColor="text-emerald-400" icon={ArrowUpRight} />
        <KPICard title="A/P (30 Days)" value="₦210M" trend="Optimal Output" trendColor="text-emerald-400" icon={ArrowDownRight} />
        <KPICard title="Payment Health" value="99.8%" trend="Success Rate" trendColor="text-emerald-400" icon={ShieldCheck} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold text-cream">Connected Treasury Accounts</h3>
            <select 
              value={activeView}
              onChange={(e) => setActiveView(e.target.value)}
              className="bg-navy-900/50 border border-white/10 text-xs text-cream rounded-lg px-2 py-1"
            >
              <option>Operating</option>
              <option>Escrow</option>
              <option>Reserves</option>
            </select>
          </div>
          <div className="p-6 space-y-4 flex-1">
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
              <div>
                <div className="font-semibold text-cream flex items-center gap-2"><Landmark className="h-4 w-4 text-emerald-400" /> Zenith Bank</div>
                <div className="text-sm text-ink/60 mt-1">Corporate Main (**** 1234)</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-cream text-lg">₦3.8B</div>
                <div className="text-xs text-emerald-400 mt-1">Primary Operating</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02]">
              <div>
                <div className="font-semibold text-cream flex items-center gap-2"><Landmark className="h-4 w-4 text-blue-400" /> GTBank</div>
                <div className="text-sm text-ink/60 mt-1">Escrow Funds (**** 5678)</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-cream text-lg">₦400M</div>
                <div className="text-xs text-blue-400 mt-1">Client Funds</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
            <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold-400" /> Commission & Expense Analytics
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-xs text-ink/60 mb-1">Total Commissions Paid (YTD)</div>
                <div className="text-xl font-bold text-cream">₦1.2B</div>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-xs text-ink/60 mb-1">Total OPEX (YTD)</div>
                <div className="text-xl font-bold text-cream">₦450M</div>
              </div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl flex items-center justify-between mt-auto">
              <div>
                <div className="text-sm font-medium text-cream">Outstanding Transactions Monitor</div>
                <div className="text-xs text-ink/60 mt-1">2 large transfers pending clearance</div>
              </div>
              <GhostButton className="text-xs h-8">Review</GhostButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={() => setConfirmModal({ isOpen: false, type: null })}
        title={
          confirmModal.type === 'gl' ? 'Access General Ledger' : 
          confirmModal.type === 'pack' ? 'Generate Financial Pack' : 
          'Initiate Wire Transfer'
        }
        message={
          confirmModal.type === 'gl' ? 'Accessing the raw General Ledger requires a cryptographic signature. Proceed?' : 
          confirmModal.type === 'pack' ? 'Compile the current EOM financial pack? This will include all P&L statements and balance sheets.' : 
          'Initiate an enterprise wire transfer? This requires dual authorization from the CFO.'
        }
        confirmText={
          confirmModal.type === 'gl' ? 'Sign & Access' : 
          confirmModal.type === 'pack' ? 'Compile Pack' : 
          'Initialize Transfer'
        }
        isDestructive={false}
      />
    </div>
  );
}
