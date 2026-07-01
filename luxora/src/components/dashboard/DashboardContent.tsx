import {
  TrendingUp, TrendingDown, Building2, CheckCircle2, Users, ArrowUpRight,
  ArrowDownRight, ShieldAlert, Clock, FileCheck, MessageSquare, Wallet,
  Package, KeyRound, Activity, MoreHorizontal, Star, AlertTriangle,
  CheckCircle, XCircle, Eye,
} from 'lucide-react';
import {
  kpis, revenueMonths, revenueData, agencyRankings, agentPerformance,
  fraudAlerts, verificationQueue, complaints, dealPipeline,
  userGrowthMonths, userGrowthData,
} from '../../data/luxoraData';

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Building2, CheckCircle2, Users,
};

export default function DashboardContent() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = kpiIcons[k.icon] ?? TrendingUp;
          return (
            <div key={k.label} className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {k.delta}
                </span>
              </div>
              <div className="mt-4 font-heading text-2xl font-bold text-cream">{k.value}</div>
              <div className="text-xs text-ink/50">{k.label}</div>
              {/* Sparkline */}
              <div className="mt-3 flex h-8 items-end gap-0.5">
                {k.spark.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-gold-600/30 to-gold-400/60"
                    style={{ height: `${(h / 85) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue + Business Health */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <BusinessHealth />
      </div>

      {/* Deal Pipeline + User Growth */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DealPipeline />
        <UserGrowth />
      </div>

      {/* Agency Rankings + Agent Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AgencyRankings />
        <AgentPerformance />
      </div>

      {/* Fraud + Verification */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FraudAlerts />
        <VerificationQueue />
      </div>

      {/* Complaints + Mortgage + Procurement */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ComplaintsCenter />
        <MortgageActivity />
        <ProcurementActivity />
      </div>

      {/* Property Management Metrics */}
      <PropertyManagement />
    </div>
  );
}

/* ---------- Revenue Chart ---------- */
function RevenueChart() {
  const max = Math.max(...revenueData);
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 lg:col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-cream">Revenue Overview</h3>
          <p className="text-xs text-ink/50">Monthly revenue (₦M)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            +18.2% YoY
          </span>
        </div>
      </div>
      <div className="flex h-48 items-end gap-2">
        {revenueData.map((v, i) => (
          <div key={i} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t bg-gradient-to-t from-gold-600/40 to-gold-400 transition-all duration-300 group-hover:from-gold-500/60 group-hover:to-gold-300"
                style={{ height: `${(v / max) * 100}%` }}
              />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-navy-700 px-2 py-1 text-[10px] font-semibold text-cream opacity-0 transition-opacity group-hover:opacity-100">
                ₦{v}M
              </div>
            </div>
            <span className="text-[10px] text-ink/40">{revenueMonths[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Business Health Score ---------- */
function BusinessHealth() {
  const score = 87;
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-gold-400" />
        <h3 className="font-heading text-base font-semibold text-cream">Business Health</h3>
      </div>
      <div className="flex flex-col items-center">
        {/* Circular gauge */}
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none" stroke="url(#goldGrad)" strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 327} 327`}
            />
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E4C766" />
                <stop offset="100%" stopColor="#B8932B" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl font-bold text-cream">{score}</span>
            <span className="text-[10px] uppercase tracking-wider text-ink/50">/ 100</span>
          </div>
        </div>
        <div className="mt-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Excellent
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { label: 'Revenue Growth', val: 92, color: 'bg-emerald-400' },
          { label: 'User Retention', val: 85, color: 'bg-gold-400' },
          { label: 'Deal Velocity', val: 78, color: 'bg-blue-400' },
          { label: 'Risk Score', val: 88, color: 'bg-emerald-400' },
        ].map((m) => (
          <div key={m.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-ink/60">{m.label}</span>
              <span className="font-semibold text-cream">{m.val}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Deal Pipeline ---------- */
function DealPipeline() {
  const maxCount = Math.max(...dealPipeline.map((d) => d.count));
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-cream">Live Deal Pipeline</h3>
          <p className="text-xs text-ink/50">Active deals by stage</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
        </span>
      </div>
      <div className="space-y-3">
        {dealPipeline.map((d, i) => (
          <div key={d.stage} className="group">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-[10px] font-bold text-ink/60">{i + 1}</span>
                <span className="text-sm font-medium text-cream">{d.stage}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-ink/50">{d.count} deals</span>
                <span className="font-semibold text-gold-300">{d.value}</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-600/50 to-gold-400 transition-all duration-500"
                style={{ width: `${(d.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- User Growth ---------- */
function UserGrowth() {
  const max = Math.max(...userGrowthData);
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-cream">User Growth Analytics</h3>
          <p className="text-xs text-ink/50">Total active users (K)</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
          <ArrowUpRight className="h-3 w-3" /> +9.7%
        </span>
      </div>
      {/* Line chart approximation */}
      <div className="relative h-40">
        <svg className="h-full w-full" viewBox="0 0 300 140" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(212,175,55,0.3)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            points={userGrowthData.map((v, i) => `${(i / (userGrowthData.length - 1)) * 300},${140 - (v / max) * 120}`).join(' ')}
          />
          <polygon
            fill="url(#areaGrad)"
            points={`0,140 ${userGrowthData.map((v, i) => `${(i / (userGrowthData.length - 1)) * 300},${140 - (v / max) * 120}`).join(' ')} 300,140`}
          />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-ink/40">
        {userGrowthMonths.map((m, i) => (
          i % 2 === 0 ? <span key={m}>{m}</span> : null
        ))}
      </div>
    </div>
  );
}

/* ---------- Agency Rankings ---------- */
function AgencyRankings() {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-cream">Agency Rankings</h3>
        <button className="text-ink/40 hover:text-cream"><MoreHorizontal className="h-5 w-5" /></button>
      </div>
      <div className="space-y-2">
        {agencyRankings.map((a, i) => (
          <div key={a.name} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-gold-400/20">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${i === 0 ? 'bg-gold-gradient text-navy-900' : 'bg-white/5 text-ink/60'}`}>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-cream">{a.name}</div>
              <div className="flex items-center gap-3 text-xs text-ink/50">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold-400 text-gold-400" /> {a.rating}</span>
                <span>{a.deals} deals</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gold-300">{a.revenue}</div>
              {a.trend === 'up' ? (
                <TrendingUp className="ml-auto h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="ml-auto h-3.5 w-3.5 text-rose-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Agent Performance ---------- */
function AgentPerformance() {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-cream">Agent Performance</h3>
        <button className="text-ink/40 hover:text-cream"><MoreHorizontal className="h-5 w-5" /></button>
      </div>
      <div className="space-y-3">
        {agentPerformance.map((a, i) => (
          <div key={a.name} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="relative">
              <img src={a.avatar} alt={a.name} className="h-10 w-10 rounded-full object-cover" />
              {i === 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-gradient text-[8px] font-bold text-navy-900">1</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-cream">{a.name}</div>
              <div className="truncate text-xs text-ink/50">{a.agency}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-cream">{a.deals}</div>
              <div className="text-[10px] uppercase tracking-wider text-ink/40">deals</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold gold-text">{a.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-ink/40">volume</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Fraud Alerts ---------- */
function FraudAlerts() {
  const sevConfig = {
    critical: { color: 'text-rose-400', bg: 'border-rose-400/20 bg-rose-400/10', icon: XCircle },
    high: { color: 'text-orange-400', bg: 'border-orange-400/20 bg-orange-400/10', icon: AlertTriangle },
    medium: { color: 'text-yellow-400', bg: 'border-yellow-400/20 bg-yellow-400/10', icon: AlertTriangle },
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-400" />
          <h3 className="font-heading text-base font-semibold text-cream">Fraud Alerts</h3>
        </div>
        <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">
          {fraudAlerts.length} Active
        </span>
      </div>
      <div className="space-y-3">
        {fraudAlerts.map((f, i) => {
          const cfg = sevConfig[f.severity as keyof typeof sevConfig];
          return (
            <div key={i} className={`rounded-xl border p-4 ${cfg.bg}`}>
              <div className="flex items-start gap-3">
                <cfg.icon className={`h-5 w-5 shrink-0 ${cfg.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-cream">{f.title}</div>
                  <div className="text-xs text-ink/60">{f.detail}</div>
                  <div className="mt-1 text-[10px] text-ink/40">{f.time}</div>
                </div>
                <button className={`rounded-lg border border-white/10 px-3 py-1 text-xs font-medium ${cfg.color} hover:bg-white/5`}>
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Verification Queue ---------- */
function VerificationQueueCard() {
  const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'Pending' },
    review: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', label: 'In Review' },
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-gold-400" />
          <h3 className="font-heading text-base font-semibold text-cream">Verification Queue</h3>
        </div>
        <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300">
          {verificationQueue.length} Pending
        </span>
      </div>
      <div className="space-y-2">
        {verificationQueue.map((v) => {
          const cfg = statusConfig[v.status as keyof typeof statusConfig];
          return (
            <div key={v.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-gold-400/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gold-400">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-cream">{v.property}</div>
                <div className="flex items-center gap-2 text-xs text-ink/50">
                  <span>{v.id}</span><span>·</span><span>{v.type}</span><span>·</span><span>{v.submitted}</span>
                </div>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
              <button className="text-ink/40 hover:text-cream"><Eye className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Re-export with the name used in the grid
function VerificationQueue() { return <VerificationQueueCard />; }

/* ---------- Complaints Center ---------- */
function ComplaintsCenter() {
  const priConfig = {
    high: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };
  const statusConfig = {
    open: 'text-rose-400',
    progress: 'text-yellow-400',
    resolved: 'text-emerald-400',
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gold-400" />
          <h3 className="font-heading text-base font-semibold text-cream">Complaints</h3>
        </div>
      </div>
      <div className="space-y-2">
        {complaints.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink/50">{c.id}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priConfig[c.priority as keyof typeof priConfig]}`}>
                {c.priority}
              </span>
            </div>
            <div className="mt-1 text-sm font-medium text-cream">{c.subject}</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-ink/50">{c.user}</span>
              <span className={`text-xs font-semibold capitalize ${statusConfig[c.status as keyof typeof statusConfig]}`}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Mortgage Activity ---------- */
function MortgageActivity() {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-gold-400" />
          <h3 className="font-heading text-base font-semibold text-cream">Mortgage Activity</h3>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Applications', value: '342', delta: '+12%', color: 'text-emerald-400' },
          { label: 'Pre-Approved', value: '198', delta: '+8%', color: 'text-emerald-400' },
          { label: 'Disbursed', value: '₦2.1B', delta: '+15%', color: 'text-emerald-400' },
          { label: 'Avg. Rate', value: '13.5%', delta: '-0.3%', color: 'text-emerald-400' },
        ].map((m) => (
          <div key={m.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <span className="text-sm text-ink/60">{m.label}</span>
            <div className="flex items-center gap-3">
              <span className="font-heading text-base font-bold text-cream">{m.value}</span>
              <span className={`text-xs font-semibold ${m.color}`}>{m.delta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Procurement Activity ---------- */
function ProcurementActivity() {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gold-400" />
          <h3 className="font-heading text-base font-semibold text-cream">Procurement</h3>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Active Orders', value: '128', sub: 'in transit' },
          { label: 'Suppliers', value: '64', sub: 'verified' },
          { label: 'Order Value', value: '₦890M', sub: 'this quarter' },
          { label: 'On-Time Rate', value: '94%', sub: 'delivery' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">{m.label}</span>
              <span className="font-heading text-base font-bold text-cream">{m.value}</span>
            </div>
            <div className="mt-0.5 text-xs text-ink/40">{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Property Management ---------- */
function PropertyManagement() {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-gold-400" />
          <h3 className="font-heading text-base font-semibold text-cream">Property Management Metrics</h3>
        </div>
        <button className="text-ink/40 hover:text-cream"><MoreHorizontal className="h-5 w-5" /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Units Managed', value: '8,420', icon: Building2, delta: '+124' },
          { label: 'Occupancy Rate', value: '94.2%', icon: CheckCircle, delta: '+1.8%' },
          { label: 'Maintenance Tickets', value: '312', icon: Activity, delta: '48 open' },
          { label: 'Rent Collected', value: '₦1.8B', icon: Wallet, delta: '+11%' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-400/20 bg-gold-400/5 text-gold-400">
                <m.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-400">{m.delta}</span>
            </div>
            <div className="font-heading text-xl font-bold text-cream">{m.value}</div>
            <div className="text-xs text-ink/50">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
