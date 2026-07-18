import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck, Crown, Star } from 'lucide-react';
import { PageLayout } from '../../components/layout';
import { GoldButton } from '../../components/ui/ui';
import { useSession } from '../../contexts/SessionContext';
import { ROUTES, getDashboardRoute } from '../../constants/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setIsLoading(true);
    setError('');

    // Simulate network request
    setTimeout(() => {
      try {
        const user = login(email, password);
        const dashboardRoute = getDashboardRoute(user.role);
        
        setIsLoading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate(dashboardRoute);
        }, 1200);
      } catch (err) {
        setError(err instanceof Error && err.message ? err.message : 'Invalid email or password');
        setIsLoading(false);
      }
    }, 1500);
  };

  const disabled = isLoading || isSuccess;

  return (
    <PageLayout withNav={false} className="h-[100svh] overflow-hidden">
      <main className="h-full flex w-full">
        {/* Left Column - Imagery (Hidden on tablet and smaller) */}
        <div className="hidden lg:flex lg:w-[60%] relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 to-navy-900/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Interior" 
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute top-8 left-12 z-30">
            <Link to={ROUTES.HOME} className="inline-flex items-center text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
              &larr; Go to Homepage
            </Link>
          </div>
          <div className="relative z-20 flex flex-col justify-center h-full p-12 lg:p-20 w-full">
            <div className="space-y-6">
              <h2 className="font-heading text-4xl xl:text-5xl font-bold text-cream leading-tight">
                Luxury Living Starts Here
              </h2>
              <p className="text-lg text-cream/70 max-w-md">
                Nigeria's trusted platform for buying, selling and renting verified properties.
              </p>
              <ul className="space-y-3 pt-4 text-cream/80 font-medium">
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-gold-400" /> Verified Listings</li>
                <li className="flex items-center gap-2"><Crown className="w-5 h-5 text-gold-400" /> Trusted Agents</li>
                <li className="flex items-center gap-2"><Star className="w-5 h-5 text-gold-400" /> Secure Transactions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="w-full lg:w-[40%] flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-navy-950 md:bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000')] md:bg-cover md:bg-center lg:bg-none relative overflow-hidden">
          <div className="absolute inset-0 bg-navy-950 md:bg-navy-950/85 lg:bg-navy-950 z-0" />
          
          <div className="w-full max-w-md relative z-10 flex flex-col justify-center">
            
            {/* Header Section */}
            <div>
              <Link 
                to={ROUTES.HOME} 
                className="lg:hidden inline-flex items-center text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors mb-6"
              >
                &larr; Go to Homepage
              </Link>
              <div className="flex items-center gap-2 mb-6">
                <Crown className="h-6 w-6 text-gold-400" />
                <span className="text-xl tracking-wider uppercase font-semibold text-cream">Luxora</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-cream mb-2">Welcome Back</h1>
              <p className="text-ink/70 text-sm sm:text-base">Sign in to access your Luxora dashboard</p>
            </div>

            <div className="relative mt-6">
              
              {/* Success Overlay */}
              <div 
                className={`absolute inset-0 z-50 flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out bg-navy-950 ${
                  isSuccess ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="h-16 w-16 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 mb-6 mx-auto">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cream mb-2">✓ Welcome back!</h2>
                <p className="text-ink/70 text-sm max-w-[280px] leading-relaxed">
                  Redirecting securely to your dashboard...
                </p>
              </div>

              {/* Form Container */}
              <div className={`transition-all duration-500 ease-in-out ${isSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="space-y-1 group">
                    <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                      <input 
                        type="email" 
                        required
                        disabled={disabled}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Password</label>
                      <Link to="#" className={`transition-colors font-medium rounded-sm ${disabled ? 'text-gold-400/50 pointer-events-none' : 'text-gold-400 hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'}`}>Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={disabled}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-10 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-ink/50 hover:text-cream transition-colors p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 pb-1">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center pt-0.5">
                        <input
                          type="checkbox"
                          id="remember"
                          disabled={disabled}
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer h-4 w-4 shrink-0 rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/50 focus:ring-offset-navy-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <label htmlFor="remember" className={`text-xs transition-colors ${disabled ? 'text-ink/40' : 'text-ink/70 cursor-pointer hover:text-cream'}`}>
                        Remember me for 30 days
                      </label>
                    </div>
                  </div>

                  <GoldButton 
                    type="submit"
                    size="lg" 
                    className="w-full justify-center h-12 text-sm rounded-xl relative overflow-hidden group" 
                    disabled={disabled}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-navy-900 border-t-transparent animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center relative z-10 w-full gap-2">
                        Sign In <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </GoldButton>
                </form>

                <p className="mt-4 text-center text-sm text-ink/70">
                  Don't have an account?{' '}
                  <Link to={ROUTES.REGISTER} className={`font-semibold transition-colors inline-flex items-center gap-1 group rounded-sm ${disabled ? 'text-gold-400/50 pointer-events-none' : 'text-gold-400 hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'}`}>
                    Create one
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
