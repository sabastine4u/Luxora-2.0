import { Menu, Search, Bell, ChevronDown, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useSession } from '../../contexts/SessionContext';

export default function Topbar({
  title,
  onMenu,
  onToggleNotifications,
}: {
  title: string;
  onMenu: () => void;
  onToggleNotifications?: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useSession();

  // Helper to get initials
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-navy-900/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-heading text-lg font-bold text-cream md:text-xl">{title}</h1>
          <p className="hidden text-xs text-ink/50 sm:block">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-40 bg-transparent text-sm text-cream placeholder:text-ink/40 focus:outline-none lg:w-56"
          />
        </div>

        {/* Home */}
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink/70 transition-colors hover:text-cream"
          title="Back to site"
        >
          <Crown className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button 
          onClick={onToggleNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink/70 transition-colors hover:text-cream"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-navy-900" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:border-gold-400/30">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-navy-900">
              {getInitials(user?.name)}
            </div>
          )}
          <span className="hidden text-sm font-medium text-cream sm:block">
            {user?.name ? user.name.split(' ')[0] : 'Profile'}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-ink/50 sm:block" />
        </button>
      </div>
    </header>
  );
}
