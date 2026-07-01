import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, UserPlus, ArrowRight, Building } from 'lucide-react';
import { PageLayout, Container, Section } from '../../components/layout';
import { GoldButton } from '../../components/ui/ui';
import { useSession } from '../../contexts/SessionContext';
import type { UserRole } from '../../contexts/SessionContext';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  
  const [role, setRole] = useState<UserRole>(ROLES.BUYER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      // Mock Registration / Login
      login({
        name: name || `${role} User`,
        email: email || `demo.${role.toLowerCase()}@luxora.com`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
        role,
      });

      // Redirect based on role
      if (role === ROLES.BUYER) {
        navigate(ROUTES.BUYER_DASHBOARD);
      } else if (role === ROLES.OWNER) {
        navigate(ROUTES.OWNER_DASHBOARD);
      } else {
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
            src="https://images.unsplash.com/photo-1613490908574-729966b41212?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Architecture" 
            className="w-full h-full object-cover"
          />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-lg">
            
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl font-bold text-cream mb-2">Join Luxora</h1>
              <p className="text-ink/70">Create your account to unlock exclusive luxury real estate</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-navy-800/80 p-8 backdrop-blur-xl shadow-2xl">
              
              {/* Role Selection Tabs */}
              <div className="flex rounded-xl bg-navy-900/50 p-1 mb-8">
                <button
                  type="button"
                  onClick={() => setRole(ROLES.BUYER)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
                    role === ROLES.BUYER 
                      ? 'bg-gold-gradient text-navy-900 shadow-gold' 
                      : 'text-ink/70 hover:text-cream hover:bg-white/5'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  I'm a Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRole(ROLES.OWNER)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
                    role === ROLES.OWNER 
                      ? 'bg-gold-gradient text-navy-900 shadow-gold' 
                      : 'text-ink/70 hover:text-cream hover:bg-white/5'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  I'm an Owner
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-11 pr-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-11 pr-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                    />
                  </div>
                </div>

                {role === ROLES.OWNER && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-11 pr-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                    <input 
                      type="password"
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-11 pr-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <GoldButton 
                    size="lg" 
                    className="w-full justify-center relative" 
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-navy-900 border-t-transparent animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account <UserPlus className="h-4 w-4" />
                      </span>
                    )}
                  </GoldButton>
                </div>

                <p className="text-xs text-ink/50 text-center mt-4">
                  By creating an account, you agree to our{' '}
                  <Link to={ROUTES.TERMS} className="text-gold-400 hover:underline">Terms of Service</Link> and{' '}
                  <Link to={ROUTES.PRIVACY} className="text-gold-400 hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            </div>

            <p className="mt-8 text-center text-sm text-ink/70">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="font-semibold text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1">
                Sign in instead <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>

          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
