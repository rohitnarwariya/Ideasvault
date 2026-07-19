import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { dbService } from './services/dbService';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize router state with popstate (back/forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // Toast notifier
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Auth Initialization on Mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          // Check active session
          const { data: { user: sbUser }, error } = await supabase.auth.getUser();
          if (sbUser) {
            setUser(sbUser);
          } else {
            setUser(null);
          }

          // Monitor session transitions
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser(session.user);
            } else {
              setUser(null);
            }
          });

          unsubscribe = () => subscription.unsubscribe();
        } else {
          // Sandbox Mode: Check for simulated local session
          const cached = localStorage.getItem('ideavault_sandbox_user');
          if (cached) {
            setUser(JSON.parse(cached));
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle Redirect Rules
  useEffect(() => {
    if (isLoading) return;

    // 1. Private Dashboard Check: Redirect unauthenticated visitors to Landing
    if (!user && currentPath === '/dashboard') {
      navigate('/');
    }

    // 2. Active Session Auth Checks: Redirect logged-in users away from Login/Signup to Dashboard
    if (user && (currentPath === '/login' || currentPath === '/signup')) {
      navigate('/dashboard');
    }
  }, [user, currentPath, isLoading]);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    if (!isSupabaseConfigured) {
      localStorage.setItem('ideavault_sandbox_user', JSON.stringify(loggedInUser));
    }
    showToast("Successfully unlocked your IdeaVault! ✨");
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        localStorage.removeItem('ideavault_sandbox_user');
      }
      setUser(null);
      navigate('/');
      showToast("Vault locked. See you soon! 🔒");
    } catch (err) {
      console.error("Logout failed:", err);
      showToast("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading Screen
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#060606] text-[#EDEDED] font-sans flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-6 w-6 animate-spin text-white/20" />
        <span className="text-xs font-mono tracking-widest uppercase text-white/40">Securing Workspace...</span>
      </div>
    );
  }

  // Router View Selector
  const renderView = () => {
    switch (currentPath) {
      case '/':
        return (
          <LandingPage 
            onNavigate={navigate} 
          />
        );
      case '/login':
        return (
          <AuthPage 
            initialMode="login" 
            onNavigate={navigate} 
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case '/signup':
        return (
          <AuthPage 
            initialMode="signup" 
            onNavigate={navigate} 
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case '/dashboard':
        if (!user) return null; // Let the redirect effect run
        return (
          <DashboardPage 
            user={user} 
            onLogout={handleLogout}
          />
        );
      default:
        // Fallback for custom links or unresolved addresses
        return (
          <LandingPage 
            onNavigate={navigate} 
          />
        );
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 shadow-2xl text-xs font-semibold text-[#EDEDED] backdrop-blur-md"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewport */}
      {renderView()}
    </>
  );
}
