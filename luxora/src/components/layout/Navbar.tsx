import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, Crown, Bell, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoldButton } from '../ui/ui';
import { Container } from './index';
import { ROUTES, getDashboardRoute, isDashboardRoute } from '../../constants/routes';
import { useSession } from '../../contexts/SessionContext';
import { navLinks } from '../../data/uiData';
import NotificationPanel from '../dashboard/NotificationPanel';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (link: string) => {
    switch(link) {
      case 'Buy': navigate(`${ROUTES.PROPERTIES}?listingType=buy`); break;
      case 'Rent': navigate(`${ROUTES.PROPERTIES}?listingType=rent`); break;
      case 'Lease': navigate(`${ROUTES.PROPERTIES}?listingType=lease`); break;
      case 'Search': navigate(ROUTES.SEARCH); break;
      case 'Agencies': navigate(ROUTES.AGENCIES); break;
      case 'Services': 
        if (location.pathname === ROUTES.HOME) {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', '/#services');
        } else {
          navigate('/#services');
        }
        break;
      case 'About': navigate(ROUTES.ABOUT); break;
      case 'Contact': navigate(ROUTES.CONTACT); break;
      default: navigate(`/#${link.toLowerCase().replace(/\s+/g, '-')}`); break;
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-navy-900/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <button onClick={() => navigate(ROUTES.HOME)} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient shadow-gold">
            <Crown className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-cream">
            Luxora<span className="gold-text"> 2.0</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = link === 'Search' && location.pathname === ROUTES.SEARCH;
            return (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-cream ${
                  isActive ? 'text-gold-400' : 'text-ink/80'
                }`}
              >
                {link}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && user ? (
            <>
              <button 
                onClick={() => {
                  const dashboardRoute = getDashboardRoute(user.role);
                  if (isDashboardRoute(location.pathname)) {
                    navigate(ROUTES.HOME);
                  } else {
                    navigate(dashboardRoute);
                  }
                }} 
                className="text-sm font-medium text-ink/80 transition-colors hover:text-cream"
              >
                {isDashboardRoute(location.pathname) ? 'Back to Website' : 'Dashboard'}
              </button>
              <button 
                onClick={() => setNotificationsOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink/70 transition-colors hover:text-cream"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink/70 transition-colors hover:text-cream">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </button>
              <GoldButton size="sm" onClick={() => {
                logout();
                navigate(ROUTES.HOME);
              }}>
                Logout
                <LogOut className="h-3.5 w-3.5 ml-2" />
              </GoldButton>
            </>
          ) : (
            <>
              <button onClick={() => navigate(ROUTES.LOGIN)} className="text-sm font-medium text-ink/80 transition-colors hover:text-cream">
                Login
              </button>
              <button onClick={() => navigate(ROUTES.REGISTER)} className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-ink transition-all hover:border-gold-400/50 hover:text-cream">
                Register
              </button>
              <GoldButton size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                List Property
                <ChevronDown className="h-3.5 w-3.5" />
              </GoldButton>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-navy-900/95 backdrop-blur-xl lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => {
              const isActive = link === 'Search' && location.pathname === ROUTES.SEARCH;
              return (
                <button
                  key={link}
                  onClick={() => {
                    setOpen(false);
                    handleNavClick(link);
                  }}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-white/5 hover:text-cream ${
                    isActive ? 'text-gold-400 bg-white/5' : 'text-ink/80'
                  }`}
                >
                  {link}
                </button>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
              {isAuthenticated && user ? (
                <>
                  <button onClick={() => { 
                    setOpen(false); 
                    const dashboardRoute = getDashboardRoute(user.role);
                    if (isDashboardRoute(location.pathname)) {
                      navigate(ROUTES.HOME);
                    } else {
                      navigate(dashboardRoute);
                    }
                  }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                    {isDashboardRoute(location.pathname) ? 'Back to Website' : 'Dashboard'}
                  </button>
                  <button onClick={() => { setOpen(false); setNotificationsOpen(true); }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Notifications
                  </button>
                  <button onClick={() => { setOpen(false); }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Profile
                  </button>
                  <GoldButton size="md" onClick={() => { setOpen(false); logout(); navigate(ROUTES.HOME); }}>
                    Logout
                  </GoldButton>
                </>
              ) : (
                <>
                  <button onClick={() => { setOpen(false); navigate(ROUTES.LOGIN); }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Login
                  </button>
                  <button onClick={() => { setOpen(false); navigate(ROUTES.REGISTER); }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Register
                  </button>
                  <GoldButton size="md" onClick={() => { setOpen(false); navigate(ROUTES.REGISTER); }}>
                    List Property
                  </GoldButton>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
      <NotificationPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </header>
  );
}
