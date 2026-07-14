import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton } from '../ui/ui';
import { Container } from './index';
import { ROUTES } from '../../constants/routes';
import { navLinks } from '../../data/uiData';

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (link: string) => {
    switch(link) {
      case 'Buy': navigate(`${ROUTES.PROPERTIES}?type=buy`); break;
      case 'Rent': navigate(`${ROUTES.PROPERTIES}?type=rent`); break;
      case 'Lease': navigate(`${ROUTES.PROPERTIES}?type=lease`); break;
      case 'List Property': navigate(ROUTES.REGISTER); break;
      case 'Agencies': navigate(ROUTES.AGENCIES); break;
      case 'Services': navigate('/#services'); break;
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
      <Container className="flex h-16 items-center justify-between md:h-20 section-pad">
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
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-white/5 hover:text-cream"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-3 lg:flex">
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
          <div className="section-pad flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setOpen(false);
                  handleNavClick(link);
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-ink/80 transition-colors hover:bg-white/5 hover:text-cream"
              >
                {link}
              </button>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
              <button onClick={() => { setOpen(false); navigate(ROUTES.LOGIN); }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                Login
              </button>
              <button onClick={() => { setOpen(false); navigate(ROUTES.REGISTER); }} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink">
                Register
              </button>
              <GoldButton size="md" onClick={() => { setOpen(false); navigate(ROUTES.REGISTER); }}>
                List Property
              </GoldButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
