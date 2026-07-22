import { Menu, Search, Bell, ChevronDown, Crown, LogOut, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ROUTES } from '../../constants/routes';
import { useSession } from '../../contexts/SessionContext';

export default function Topbar({
  title,
  onMenu,
  onToggleNotifications,
  onToggleCommunication,
  onProfile,
  breadcrumb,
  actions,
}: {
  title?: string;
  onMenu: () => void;
  onToggleNotifications?: () => void;
  onToggleCommunication?: () => void;
  onProfile?: () => void;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {breadcrumb ? (
            breadcrumb
          ) : (
            <>
              <h1 className="font-heading text-lg font-bold text-cream md:text-xl">{title}</h1>
              <p className="hidden text-xs text-ink/50 sm:block">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</p>
            </>
          )}
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

        {/* Communications */}
        {onToggleCommunication && (
          <button 
            onClick={onToggleCommunication}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink/70 transition-colors hover:text-cream"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        )}

        {/* Custom Actions */}
        {actions && <div className="hidden md:flex items-center gap-2">{actions}</div>}

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:border-gold-400/30"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || 'Profile'} className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-navy-900">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="hidden text-sm font-medium text-cream sm:block">
              {user?.name ? user.name.split(' ')[0] : 'Profile'}
            </span>
            <ChevronDown className={`hidden h-4 w-4 text-ink/50 sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-navy-800 p-2 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/10 px-3 pb-3 pt-2">
                <p className="truncate text-sm font-semibold text-cream">{user?.name || 'Guest'}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {user?.role && (
                    <span className="inline-flex rounded-full bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gold-200">
                      {user.role}
                    </span>
                  )}
                  {user?.department && (
                    <span className="inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ink/70">
                      {user.department}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onProfile) onProfile();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-white/5 hover:text-cream"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate(ROUTES.HOME);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-400/80 transition-colors hover:bg-rose-400/10 hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
