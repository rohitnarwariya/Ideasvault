import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Mail, Lock, ArrowRight, ArrowLeft, RefreshCw, 
  Eye, EyeOff, CheckCircle, Info, Star, Compass, Layers, ShieldCheck, HelpCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SANDBOX_USER } from '../services/dbService';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: any) => void;
}

const GoogleIcon = () => (
  <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export default function AuthPage({ initialMode, onNavigate, onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode state with prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      // Real Supabase Auth Flow
      try {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
              data: {
                full_name: fullName.trim() || email.split('@')[0],
                avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`
              }
            }
          });

          if (error) throw error;

          if (data.user) {
            // Check if confirmation is required or if logged in automatically
            if (data.session) {
              onLoginSuccess(data.user);
              onNavigate('/dashboard');
            } else {
              setSuccessMessage('Verification email sent! Check your inbox to confirm your account.');
            }
          }
        } else {
          // Login Flow
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password
          });

          if (error) throw error;

          if (data.user) {
            onLoginSuccess(data.user);
            onNavigate('/dashboard');
          }
        }
      } catch (err: any) {
        console.error('Auth action failed:', err);
        setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sandbox Simulated Flow
      setTimeout(() => {
        const customSandboxUser = {
          ...SANDBOX_USER,
          email: email.trim(),
          user_metadata: {
            ...SANDBOX_USER.user_metadata,
            full_name: fullName.trim() || email.split('@')[0] || SANDBOX_USER.user_metadata.full_name
          }
        };
        
        onLoginSuccess(customSandboxUser);
        onNavigate('/dashboard');
        setIsLoading(false);
      }, 800);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } catch (err: any) {
        console.error('Google login failed:', err);
        setErrorMessage(err.message || 'Google authentication failed.');
        setIsGoogleLoading(false);
      }
    } else {
      // Sandbox Simulated Flow
      setTimeout(() => {
        const customSandboxUser = {
          ...SANDBOX_USER,
          email: 'google.creator@ideavault.io',
          user_metadata: {
            ...SANDBOX_USER.user_metadata,
            full_name: 'Google Creator',
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          }
        };
        onLoginSuccess(customSandboxUser);
        onNavigate('/dashboard');
        setIsGoogleLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary font-sans flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden select-none">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-30 overflow-hidden -z-10">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-brand-accent/10 to-brand-purple/5 blur-[150px]" />
      </div>

      {/* Grid Pattern overlay for tech aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#181822_1px,transparent_1px),linear-gradient(to_bottom,#181822_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 -z-20 pointer-events-none" />

      {/* Left side (Cinematic Product panel) - Only shown on desktop */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#09090c] border-r border-brand-border flex-col justify-between p-12 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 cursor-pointer group z-10" onClick={() => onNavigate('/')} id="auth-sidebar-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-brand-bg shadow-premium-md group-hover:scale-105 transition-all duration-300">
            <span className="font-display font-black text-xl tracking-tighter">I</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-brand-primary font-display">
              IdeaVault
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-brand-tertiary">
              Inspiration Base
            </span>
          </div>
        </div>

        {/* Dynamic Display / Content */}
        <div className="my-auto space-y-10 z-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-3.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-brand-purple uppercase shadow-premium-sm">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Creator Swipe Suite
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-brand-primary leading-tight">
              A second brain <br />
              for visual thinkers.
            </h1>
            <p className="text-xs text-brand-secondary max-w-sm leading-relaxed font-normal">
              Deconstruct viral pacing, screenshot UI layouts, and transcribe sudden bursts of inspiration with Gemini 3.5.
            </p>
          </div>

          {/* Floating High-fidelity Card Mockup */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="rounded-xl border border-brand-border-hover bg-brand-card/80 p-5 space-y-4 shadow-premium-lg max-w-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                PINTEREST PIN
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-glow" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-glow animate-ping" />
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold text-brand-primary font-display">Minimalist Swiss Typographic Grids</h5>
              <p className="text-[9px] text-brand-tertiary font-mono">pinterest.com/pin/28491038</p>
            </div>

            <div className="bg-brand-bg/50 rounded-lg p-3 border border-brand-border text-[10px] text-brand-secondary leading-normal font-normal">
              <span className="text-[8px] text-brand-tertiary font-mono block mb-1">STATED CREATIVE INTENTION:</span>
              "I love the extreme sizing contrast. Massive display title, tiny details. Use this exact balance for the pricing hero header."
            </div>

            <div className="flex items-center justify-between pt-1 text-[9px] text-brand-tertiary font-mono">
              <div className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-brand-accent" />
                <span>Extracted 4 AI Tags</span>
              </div>
              <span className="text-brand-emerald">Analyzed ✓</span>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-brand-tertiary font-mono border-t border-brand-border/40 pt-4 z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald" />
            <span>Secure Enterprise Encryption</span>
          </div>
          <span>v1.4 Sandbox Enabled</span>
        </div>
      </div>

      {/* Right side (Beautiful Interactive Form container) */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        
        {/* Navigation Home backlink for mobile users */}
        <button 
          onClick={() => onNavigate('/')}
          className="absolute top-6 left-6 lg:top-12 lg:left-12 flex items-center gap-2 rounded-full border border-brand-border bg-brand-card/40 hover:bg-brand-card-hover text-brand-secondary hover:text-brand-primary px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-premium-sm interactive-action"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="w-full max-w-[420px] space-y-8 z-10">
          
          {/* Mobile-only logo display */}
          <div className="lg:hidden text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-brand-bg shadow-premium-md mx-auto mb-4">
              <span className="font-display font-black text-xl tracking-tighter">I</span>
            </div>
          </div>

          {/* Title Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-brand-primary">
              {mode === 'login' ? 'Welcome back' : 'Create sandbox profile'}
            </h2>
            <p className="text-xs text-brand-secondary leading-relaxed font-normal">
              {mode === 'login' 
                ? 'Sign in below to unlock your digital visual swipe files.' 
                : 'Join high-output designers and creators building vaults today.'}
            </p>
          </div>

          {/* Form wrapper */}
          <div className="rounded-2xl border border-brand-border bg-brand-card/75 backdrop-blur-md p-6 sm:p-8 shadow-premium-lg relative overflow-hidden">
            {/* Soft border accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-accent/25 to-transparent" />
            
            {/* Top Loading progress line */}
            {isLoading && (
              <div className="absolute top-0 inset-x-0 h-[2px] bg-brand-accent overflow-hidden">
                <div className="h-full bg-brand-purple w-1/3 animate-pulse" style={{ animationDuration: '0.8s' }} />
              </div>
            )}

            {/* Error & Success Messages with gorgeous glowing borders */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 rounded-xl border border-brand-rose/20 bg-brand-rose/5 p-3.5 text-brand-rose text-xs flex items-start gap-2.5 shadow-premium-sm"
                >
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-normal">{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 rounded-xl border border-brand-emerald/25 bg-brand-emerald/5 p-3.5 text-brand-emerald text-xs flex items-start gap-2.5 shadow-premium-sm"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-normal">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-card-hover py-3 text-xs font-bold text-brand-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-premium-sm interactive-action hover:border-brand-border-hover"
            >
              {isGoogleLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-brand-accent" />
              ) : (
                <GoogleIcon />
              )}
              <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-brand-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0c0c0e] px-3.5 text-brand-tertiary font-mono text-[9px] tracking-widest font-bold">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-brand-secondary uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Inspiration Creator"
                    className="w-full rounded-xl bg-brand-bg/40 border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25 outline-none px-4 py-3 text-xs text-brand-primary placeholder-brand-tertiary transition-all font-sans"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-brand-secondary uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@ideavault.io"
                    className="w-full rounded-xl bg-brand-bg/40 border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25 outline-none pl-11 pr-4 py-3 text-xs text-brand-primary placeholder-brand-tertiary transition-all font-mono"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-brand-secondary uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-tertiary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl bg-brand-bg/40 border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25 outline-none pl-11 pr-11 py-3 text-xs text-brand-primary placeholder-brand-tertiary transition-all font-mono"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-tertiary hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-brand-bg hover:bg-white py-3.5 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-premium-md interactive-action cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-brand-bg" />
                    <span>{mode === 'login' ? 'Securing Session...' : 'Creating Vault...'}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>

            {/* Switch Mode Footer link */}
            <div className="mt-6 pt-5 border-t border-brand-border text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-brand-secondary hover:text-brand-primary transition-all cursor-pointer underline hover:no-underline font-normal"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign Up Free" 
                  : "Already have an account? Log In Instead"}
              </button>
            </div>

          </div>

          {/* Reassurance text */}
          <div className="text-center text-[10px] text-brand-tertiary leading-relaxed font-mono flex items-center justify-center gap-1.5">
            <span>✓ No credit card required</span>
            <span>•</span>
            <span>✓ Instant sandbox activation</span>
          </div>

        </div>
      </div>
    </div>
  );
}
