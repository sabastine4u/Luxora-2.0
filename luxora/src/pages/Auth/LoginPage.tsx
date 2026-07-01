import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { PageLayout, Container, Section } from '../../components/layout';
import { GoldButton } from '../../components/ui/ui';
import { useSession } from '../../contexts/SessionContext';
import type { UserRole } from '../../contexts/SessionContext';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(ROLES.BUYER);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      // Mock Login
      login({
        name: `${role} User`,
        email: email || `demo.${role.toLowerCase()}@luxora.com`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
        role,
      });

      // Redirect based on role
      switch (role) {
        case ROLES.BUYER:
          navigate(ROUTES.BUYER_DASHBOARD);
          break;
        case ROLES.OWNER:
          navigate(ROUTES.OWNER_DASHBOARD);
          break;
        case ROLES.AGENT:
          navigate(ROUTES.AGENT_DASHBOARD);
          break;
        case ROLES.AGENCY:
          navigate(ROUTES.AGENCY_DASHBOARD);
          break;
        case ROLES.ADMIN:
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        case ROLES.SUPER_ADMIN:
          navigate(ROUTES.SUPER_ADMIN_DASHBOARD);
          break;
        case ROLES.MANAGER:
          navigate(ROUTES.MANAGEMENT_DASHBOARD);
          break;
        case ROLES.PROCUREMENT:
          navigate(ROUTES.PROCUREMENT_DASHBOARD);
          break;
        case ROLES.FINANCE:
          navigate(ROUTES.FINANCE_DASHBOARD);
          break;
        case ROLES.ANALYST:
          navigate(ROUTES.INTELLIGENCE_DASHBOARD);
          break;
        case ROLES.PROPERTY_MANAGER:
          navigate(ROUTES.PROPERTY_MANAGEMENT_DASHBOARD);
          break;
        case ROLES.SERVICE_ADMIN:
          navigate(ROUTES.HOME_SERVICES_DASHBOARD);
          break;
        default:
          navigate(ROUTES.HOME);
      }
    }, 800);
  };

  return (
    <PageLayout>
      <Section className="min-h-screen flex items-center justify-center py-20 relative">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy-900/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover"
          />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-md">
            
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl font-bold text-cream mb-2">Welcome Back</h1>
              <p className="text-ink/70">Sign in to access your Luxora dashboard</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-navy-800/80 p-8 backdrop-blur-xl shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Role Selector (For Mocking Purposes) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70 flex items-center justify-between">
                    <span>Mock Login Role</span>
                    <span className="text-xs text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full">Demo Only</span>
                  </label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-4 pr-10 text-cream focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                  >
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-11 pr-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium text-ink/70">Password</label>
                    <Link to="#" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-11 pr-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                    />
                  </div>
                </div>

                <GoldButton 
                  type="submit"
                  size="lg" 
                  className="w-full justify-center mt-2 relative" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-navy-900 border-t-transparent animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <LogIn className="h-4 w-4" />
                    </span>
                  )}
                </GoldButton>

              </form>
            </div>

            <p className="mt-8 text-center text-sm text-ink/70">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="font-semibold text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1">
                Create one now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>

          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
