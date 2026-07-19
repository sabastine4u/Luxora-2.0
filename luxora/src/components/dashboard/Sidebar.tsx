import {
  LayoutDashboard, Building2, ShieldCheck, Landmark, Users, Wallet,
  Package, Brain, KeyRound, Wrench, Handshake, UserCircle, Shield,
  FileBarChart, Settings, Crown, ChevronLeft, LogOut, Heart, MessageSquare, Eye, FileCheck, Home, TrendingUp, Calendar, AlertCircle, Activity, Banknote, Briefcase, ShoppingCart, ShieldAlert, UserCog, PieChart, Megaphone, ChartBar, Calculator, LineChart, MapPin, Map, FileText
} from 'lucide-react';
import { sidebarNav, ROLE_NAV_MAP } from '../../data/luxoraData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Building2, ShieldCheck, Landmark, Users, Wallet,
  ChartBar, Package, Brain, KeyRound, Wrench, Handshake, UserCircle, Shield,
  FileBarChart, Settings, Crown, ChevronLeft, LogOut, Heart, MessageSquare, Eye, FileCheck, Home, TrendingUp, Calendar, AlertCircle, Activity, Banknote, Briefcase, ShoppingCart, ShieldAlert, UserCog, PieChart, Megaphone, Calculator, LineChart, MapPin, Map, FileText, Sparkles: Brain, Truck: Briefcase, Paintbrush: Wrench, Zap: Activity, Droplet: Activity, PenTool: Wrench, Palette: Heart, Armchair: Building2, Wifi: Activity, Leaf: Heart
};

import { useSession } from '../../contexts/SessionContext';

export default function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: string;
  onSelect: (label: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useSession();

  // Helper to get initials
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navItems = user?.role && ROLE_NAV_MAP[user.role] 
    ? ROLE_NAV_MAP[user.role] 
    : sidebarNav;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-navy-950 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <button className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient">
              <Crown className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-heading text-base font-extrabold text-cream">
                Luxora<span className="gold-text"> 2.0</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gold-300/70">Command Center</div>
            </div>
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-ink/60 lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink/30">
            Main
          </div>
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                onClick={() => onSelect(item.label)}
                className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'border border-gold-400/20 bg-gold-400/10 text-gold-200'
                    : 'border border-transparent text-ink/60 hover:bg-white/5 hover:text-cream'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-gold-400' : ''}`} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-ink/60">
                    {item.badge}
                  </span>
                )}
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-navy-900">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-cream">{user?.name || 'Guest'}</div>
              <div className="truncate text-[10px] text-ink/50">{user?.role || 'Visitor'}</div>
            </div>
            <button onClick={logout} className="text-ink/40 transition-colors hover:text-rose-400">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
