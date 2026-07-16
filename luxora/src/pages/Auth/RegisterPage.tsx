import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, Building, Eye, EyeOff, Crown, ShieldCheck, Star } from 'lucide-react';
import { PageLayout } from '../../components/layout';
import { GoldButton } from '../../components/ui/ui';
import { useSession } from '../../contexts/SessionContext';
import type { UserRole } from '../../contexts/SessionContext';
import { ROLES } from '../../constants/roles';
import { ROUTES, ROLE_DASHBOARD_MAP } from '../../constants/routes';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useSession();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>(ROLES.BUYER);
  
  // Step 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 2 State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getPasswordValidation = () => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    const v = getPasswordValidation();
    let strength = 0;
    if (v.length) strength += 20;
    if (v.uppercase) strength += 20;
    if (v.lowercase) strength += 20;
    if (v.number) strength += 20;
    if (v.special) strength += 20;
    return strength;
  };

  const handleNextStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Valid email is required';
    if (role === ROLES.OWNER && !phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    const newErrors: { [key: string]: string } = {};
    const v = getPasswordValidation();
    
    if (!v.length || !v.uppercase || !v.lowercase || !v.number) {
      newErrors.password = 'Password does not meet minimum requirements';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the Terms & Conditions';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        const newUser = register({
          name: name || `${role} User`,
          email: email || `demo.${role.toLowerCase()}@luxora.com`,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
          role,
        });

        setIsLoading(false);
        setIsSuccess(true);

        setTimeout(() => {
          const dashboardRoute = ROLE_DASHBOARD_MAP[newUser.role] || ROUTES.HOME;
          navigate(dashboardRoute);
        }, 1200);
      }, 1500);
    }
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
        <div className="w-full lg:w-[40%] flex flex-col p-4 sm:p-8 lg:p-12 bg-navy-950 md:bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000')] md:bg-cover md:bg-center lg:bg-none relative overflow-hidden">
          <div className="absolute inset-0 bg-navy-950 md:bg-navy-950/85 lg:bg-navy-950 z-0" />
          
          <div className="w-full h-full flex flex-col relative z-10">
            
            {/* Header Section */}
            <div className="flex-1 flex flex-col justify-end w-full max-w-md mx-auto pb-4 sm:pb-6">
              <div>
                <Link 
                  to={ROUTES.HOME} 
                  className="lg:hidden inline-flex items-center text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors mb-4"
                >
                  &larr; Go to Homepage
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-6 w-6 text-gold-400" />
                  <span className="text-xl tracking-wider uppercase font-semibold text-cream">Luxora</span>
                </div>
                
                {/* Role Badge and Title */}
                <div className="relative pt-6 mb-4">
                  <div className="absolute top-0 left-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-gold-400/10 border border-gold-400/20 px-2 py-0.5 rounded-md transition-all duration-300">
                      {role}
                    </span>
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-cream">Create Your Account</h1>
                </div>
                
                {/* Premium Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-ink/70">
                    <span>{step === 1 ? 'Personal Information' : 'Account Security'}</span>
                    <span>Step {step} of 2</span>
                  </div>
                  <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-navy-900/50">
                    <div className={`h-full bg-gold-400 transition-all duration-500 ease-out ${step === 1 ? 'w-1/2' : 'w-full'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-[2.5] flex flex-col justify-start w-full max-w-md mx-auto relative overflow-hidden">
              
              {/* Success Overlay */}
              <div 
                className={`absolute inset-0 z-50 flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out bg-navy-950 ${
                  isSuccess ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="h-16 w-16 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 mb-6 mx-auto">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cream mb-2">✓ Welcome to Luxora!</h2>
                <p className="text-ink/70 text-sm max-w-[280px] leading-relaxed">
                  Your {role.toLowerCase()} account has been created successfully.
                </p>
              </div>

              {/* Step 1 Form */}
              <div 
                className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col ${
                  step === 1 && !isSuccess ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 -translate-x-8 z-0 pointer-events-none'
                }`}
              >
                {/* Role Selection Tabs */}
                <div className="shrink-0">
                  <div className="flex rounded-xl bg-navy-900/50 p-1 mb-2 border border-white/5">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => { setRole(ROLES.BUYER); setErrors({}); }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                        role === ROLES.BUYER 
                          ? 'bg-gold-gradient text-navy-900 shadow-gold' 
                          : 'text-ink/70 hover:text-cream hover:bg-white/5'
                      }`}
                    >
                      <UserIcon className="h-4 w-4" />
                      Buyer
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => { setRole(ROLES.OWNER); setErrors({}); }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                        role === ROLES.OWNER 
                          ? 'bg-gold-gradient text-navy-900 shadow-gold' 
                          : 'text-ink/70 hover:text-cream hover:bg-white/5'
                      }`}
                    >
                      <Building className="h-4 w-4" />
                      Owner
                    </button>
                  </div>
                  
                  {/* Contextual Role Description */}
                  <div className="h-8 relative w-full mb-2">
                    <p className={`absolute inset-0 text-xs text-ink/60 transition-opacity duration-300 ${role === ROLES.BUYER ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      Find verified properties, save favourites, and connect with trusted agents.
                    </p>
                    <p className={`absolute inset-0 text-xs text-ink/60 transition-opacity duration-300 ${role === ROLES.OWNER ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      List your property through trusted agencies and manage enquiries securely.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 overflow-y-auto pb-4 pr-1">
                  <div className="space-y-1 group">
                    <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                      <input 
                        type="text" 
                        disabled={disabled}
                        value={name}
                        onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: ''}); }}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-1 group">
                    <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                      <input 
                        type="email"
                        disabled={disabled} 
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: ''}); }}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {role === ROLES.OWNER && (
                    <div className="space-y-1 group transition-all duration-300">
                      <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                        <input 
                          type="tel"
                          disabled={disabled} 
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); if(errors.phone) setErrors({...errors, phone: ''}); }}
                          placeholder="Enter your phone number"
                          className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-2 shrink-0">
                  <div className="flex gap-3">
                    <Link to={ROUTES.HOME} className="flex-1">
                      <button type="button" disabled={disabled} className="w-full justify-center h-12 text-sm rounded-xl font-medium text-cream border border-white/10 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed">
                        Cancel
                      </button>
                    </Link>
                    <GoldButton type="button" onClick={handleNextStep} disabled={disabled} size="lg" className="flex-1 justify-center h-12 text-sm rounded-xl group">
                      Continue &rarr;
                    </GoldButton>
                  </div>
                  <p className="mt-4 text-center text-sm text-ink/70">
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} className="font-semibold text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>

              {/* Step 2 Form */}
              <div 
                className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col ${
                  step === 2 && !isSuccess ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 translate-x-8 z-0 pointer-events-none'
                }`}
              >
                <form onSubmit={handleRegister} className="flex flex-col h-full">
                  <div className="space-y-4 overflow-y-auto pb-4 pr-1">
                    
                    <div className="space-y-1 group">
                      <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          disabled={disabled}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: ''}); }}
                          placeholder="Create a secure password"
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
                      
                      {password && (() => {
                        const v = getPasswordValidation();
                        return (
                          <div className="bg-navy-900/40 p-3 rounded-lg border border-white/5 mt-2 space-y-2 shadow-inner">
                            <div className="flex h-1 w-full overflow-hidden rounded-full bg-white/10 mb-2">
                              <div 
                                className={`h-full transition-all duration-500 ease-out ${
                                  getPasswordStrength() < 40 ? 'bg-red-500' :
                                  getPasswordStrength() < 80 ? 'bg-gold-400' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.max(getPasswordStrength(), 5)}%` }}
                              />
                            </div>
                            <ul className="text-xs space-y-1.5 font-medium">
                              <li className={`flex items-center gap-2 transition-colors ${v.length ? 'text-green-400' : 'text-ink/50'}`}>
                                {v.length ? '✓' : '○'} Minimum 8 characters
                              </li>
                              <li className={`flex items-center gap-2 transition-colors ${v.uppercase ? 'text-green-400' : 'text-ink/50'}`}>
                                {v.uppercase ? '✓' : '○'} Uppercase letter
                              </li>
                              <li className={`flex items-center gap-2 transition-colors ${v.lowercase ? 'text-green-400' : 'text-ink/50'}`}>
                                {v.lowercase ? '✓' : '○'} Lowercase letter
                              </li>
                              <li className={`flex items-center gap-2 transition-colors ${v.number ? 'text-green-400' : 'text-ink/50'}`}>
                                {v.number ? '✓' : '○'} Number
                              </li>
                              <li className={`flex items-center gap-2 transition-colors ${v.special ? 'text-green-400' : 'text-ink/50'}`}>
                                {v.special ? '✓' : '○'} Special character (Recommended)
                              </li>
                            </ul>
                          </div>
                        );
                      })()}
                      {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-1 group">
                      <label className="text-xs font-medium text-ink/70 group-focus-within:text-gold-400 transition-colors">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50 group-focus-within:text-gold-400 transition-colors" />
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          disabled={disabled}
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); if(errors.confirmPassword) setErrors({...errors, confirmPassword: ''}); }}
                          placeholder="Confirm your password"
                          className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-10 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:bg-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="pt-2">
                      <div className="flex items-start gap-3">
                        <div className="relative flex items-center pt-0.5">
                          <input
                            type="checkbox"
                            id="terms"
                            disabled={disabled}
                            checked={acceptedTerms}
                            onChange={(e) => { setAcceptedTerms(e.target.checked); if(errors.terms) setErrors({...errors, terms: ''}); }}
                            className="peer h-4 w-4 shrink-0 rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/50 focus:ring-offset-navy-950 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <label htmlFor="terms" className={`text-xs leading-relaxed transition-colors ${disabled ? 'text-ink/40' : 'text-ink/70 cursor-pointer'}`}>
                          By creating an account, you agree to our{' '}
                          <Link to={ROUTES.TERMS} className={`transition-colors ${disabled ? 'text-gold-400/50' : 'text-gold-400 hover:underline'}`}>Terms of Service</Link> and{' '}
                          <Link to={ROUTES.PRIVACY} className={`transition-colors ${disabled ? 'text-gold-400/50' : 'text-gold-400 hover:underline'}`}>Privacy Policy</Link>.
                        </label>
                      </div>
                      {errors.terms && <p className="text-xs text-red-400 mt-2">{errors.terms}</p>}
                    </div>

                  </div>

                  <div className="mt-auto pt-2 shrink-0">
                    <div className="flex gap-3">
                      <button type="button" disabled={disabled} onClick={() => { setStep(1); setErrors({}); }} className="flex-1 justify-center h-12 text-sm rounded-xl font-medium text-cream border border-white/10 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed">
                        &larr; Back
                      </button>
                      <GoldButton type="submit" disabled={disabled} size="lg" className="flex-1 justify-center h-12 text-sm rounded-xl relative overflow-hidden group">
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-navy-900 border-t-transparent animate-spin" />
                            Creating...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center relative z-10 w-full">
                            Create {role === ROLES.BUYER ? 'Buyer' : 'Owner'} Account
                          </span>
                        )}
                      </GoldButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
    </PageLayout>
  );
}
