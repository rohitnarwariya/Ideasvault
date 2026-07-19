import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Database,
  Search,
  Eye,
  HelpCircle,
  Layers,
  Mic,
  Chrome,
  ExternalLink,
  ChevronRight,
  Volume2,
  Plus,
  Star,
  Compass,
  Terminal,
  X,
  Check,
  Zap,
  ArrowUpRight,
  Lock,
  ChevronDown,
  Quote,
  Flame,
  Layout,
  Globe,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Background slow particles
  const [particles] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -20,
    }))
  );

  // Mouse percent coordinates on hero section for interactive glow and fade effects
  const [mousePct, setMousePct] = useState({ x: -100, y: -100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePct({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePct({ x: -100, y: -100 });
  };

  const ambientCards = [
    {
      id: "instagram-reel",
      xPct: 11,
      yPct: 22,
      icon: Instagram,
      iconColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      title: "Reel by @creator",
      subtitle: "1.1M views · viral hook",
      body: "Pattern interrupt: opens with the exact objection viewers already have, then flips on beat 2."
    },
    {
      id: "linkedin-carousel",
      xPct: 15,
      yPct: 56,
      icon: Linkedin,
      iconColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      title: "LinkedIn Carousel by @founder",
      subtitle: "12 slides · 4.2K reactions",
      body: "Slide 1 — 'Why I stopped chasing the algorithm'. Clean spacing and bold serif header."
    },
    {
      id: "youtube-intro",
      xPct: 8,
      yPct: 84,
      icon: Youtube,
      iconColor: "bg-red-500/10 text-red-400 border-red-500/20",
      title: "YouTube Intro by @editor",
      subtitle: "Timestamp 0:14",
      body: "High-contrast text flash synced with custom bass swell audio effect."
    },
    {
      id: "tiktok-growth",
      xPct: 84,
      yPct: 18,
      icon: Zap,
      iconColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      title: "TikTok by @creator",
      subtitle: "2.3M views · hook breakdown",
      body: "\"Stop scrolling if you've been using the wrong moisturizer...\" Frame-by-frame analyzed."
    },
    {
      id: "pinterest-swipe",
      xPct: 87,
      yPct: 50,
      icon: Layers,
      iconColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      title: "Pinterest Swipe by @designer",
      subtitle: "Saved to Board: Visuals",
      body: "Bauhaus typography style with giant letterforms contrasted by tiny monospace detail text."
    },
    {
      id: "website-copy",
      xPct: 80,
      yPct: 80,
      icon: Chrome,
      iconColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      title: "SaaS Landing Page",
      subtitle: "Swipe: Stripe Billing",
      body: "Elegant interactive visual slider presenting immediate self-checkout value."
    }
  ];

  // Features list with custom design values
  const features = [
    {
      title: "Save Inspiration",
      desc: "Instantly capture YouTube videos, Pinterest images, Instagram reels, and website inspiration with a single click.",
      icon: Compass,
      color: "from-blue-500/10 to-indigo-500/10",
      borderColor: "group-hover:border-blue-500/30",
      iconColor: "text-blue-400",
      comingSoon: false,
    },
    {
      title: "Organize into Collections",
      desc: "Group references into custom visual boards tailored to your projects, channels, or design themes.",
      icon: Layers,
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "group-hover:border-purple-500/30",
      iconColor: "text-purple-400",
      comingSoon: false,
    },
    {
      title: "Instant Unified Search",
      desc: "Find references instantly by title, platform, notes, or tags. Never waste hours digging through bookmarks again.",
      icon: Search,
      color: "from-emerald-500/10 to-teal-500/10",
      borderColor: "group-hover:border-emerald-500/30",
      iconColor: "text-emerald-400",
      comingSoon: false,
    },
    {
      title: "AI Auto-Organization",
      desc: "AI intelligently tags, categorizes, and indexes your saved ideas based on the source metadata.",
      icon: Sparkles,
      color: "from-amber-500/10 to-orange-500/10",
      borderColor: "group-hover:border-amber-500/30",
      iconColor: "text-amber-400",
      comingSoon: true,
    },
    {
      title: "Chrome Extension",
      desc: "Save inspiration directly from your browser as you browse the web without opening the dashboard.",
      icon: Chrome,
      color: "from-sky-500/10 to-cyan-500/10",
      borderColor: "group-hover:border-sky-500/30",
      iconColor: "text-sky-400",
      comingSoon: true,
    },
    {
      title: "Voice Memo Capture",
      desc: "Dictate voice thoughts instantly while saving an idea to log exactly why you found it inspiring.",
      icon: Mic,
      color: "from-rose-500/10 to-pink-500/10",
      borderColor: "group-hover:border-rose-500/30",
      iconColor: "text-rose-400",
      comingSoon: true,
    },
  ];

  // Testimonials / Social Proof
  const testimonials = [
    {
      quote: "IdeaVault changed how I script my YouTube videos. I used to bookmark and forget; now I lock down exactly why a hook inspired me.",
      author: "Alex Rivers",
      role: "YouTube Creator • 420K Subs",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
      rating: 5,
    },
    {
      quote: "As a UI/UX designer, Pinterest and Instagram are my playgrounds, but saving is messy. IdeaVault acts as my secondary brain.",
      author: "Sofia Chen",
      role: "Lead Product Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
      rating: 5,
    },
    {
      quote: "The ability to save a reference and record a voice memo explaining my creative direction is incredibly helpful for content planning.",
      author: "Liam Becker",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
      rating: 5,
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "How does IdeaVault capture inspiration?",
      a: "Simply paste any URL from YouTube, Instagram, Pinterest, TikTok, or general websites. You can also upload screenshots or type a quick thought. Our system automatically fetches original metadata to parse it for analysis.",
    },
    {
      q: "How does the AI transcription process work?",
      a: "If you attach a voice note explaining your sudden burst of inspiration, our integrated Gemini AI transcriber converts it to text in real time. This transcription is then paired with the reference link, feeding our deeper analysis engine.",
    },
    {
      q: "What is Creative Intelligence?",
      a: "Instead of basic bookmarking, our server-side AI analyzes saved references to dissect the exact psychological hooks, emotional triggers, storytelling blueprints, and visual layout frameworks, so you can adapt them to your own niche.",
    },
    {
      q: "Will my data be secure?",
      a: "Absolutely. Your personal reference vaults, custom notes, audio recordings, and visual boards are fully encrypted and tied to your secured user profile.",
    },
    {
      q: "Can I use IdeaVault entirely for free?",
      a: "Yes! The standard Creator Sandbox is 100% free with unlimited local storage, collection boards, and standard AI credits. Pro cloud features will be introduced later for multi-user teams.",
    },
  ];

  // Use Cases
  const useCases = [
    {
      title: "Video Creators & Animators",
      description: "Deconstruct viral storytelling formulas, timestamp high-pacing video sections, and secure b-roll references with specific action tags.",
      badge: "YouTube / TikTok",
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "UI/UX & Graphic Designers",
      description: "Build curated digital swipe files of premium typography layout pairings, grid grids, cinematic color palettes, and motion presets.",
      badge: "Moodboards / Figma",
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Copywriters & Strategists",
      description: "Archive high-converting email headers, landing page hooks, micro-interactions, and persuasive structural outlines for clients.",
      badge: "SaaS Swipe Files",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const platforms = [
    {
      name: "YouTube",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: "Reddit",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-.416.924c.731.433 1.26.96 1.488 1.46.12.261.05.572-.172.756-.221.184-.541.205-.783.053-.29-.181-.782-.601-1.353-.941a5.619 5.619 0 0 0-3.32-.962c-1.22 0-2.37.331-3.23.931-.571.35-1.07.781-1.362.962-.243.153-.563.132-.783-.053-.221-.184-.291-.495-.172-.756.228-.5 1.26-1.027 1.488-1.46a1.252 1.252 0 0 1-.416-.924c0-.688.562-1.249 1.25-1.249.49 0 .914.285 1.115.698a12.186 12.186 0 0 1 3.25-.436c.05-.62.33-.11.45.15l1.01.21c.14-.37.5-.63.92-.63z"/>
        </svg>
      )
    },
    {
      name: "Articles",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      name: "Podcasts",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v10" />
          <path d="M17 5v4" />
          <path d="M7 5v4" />
          <path d="M2 9h20" />
          <path d="M22 15h-4a3 3 0 0 0-6 0H2" />
          <path d="M14 15a2 2 0 0 1-4 0" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    },
    {
      name: "Pinterest",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.27 1.042-1.002 2.35-1.492 3.146C9.27 23.812 10.584 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
        </svg>
      )
    },
    {
      name: "& More",
      icon: (
        <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#f4f4f5] font-sans overflow-x-hidden selection:bg-brand-accent/20 selection:text-white relative">
      
      {/* Subtle Noise Texture & Gradients Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none z-0" />
      
      {/* Soft Blue and Purple glow backlights behind the hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[25%] w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/8 blur-[110px] animate-pulse duration-[10s]" />
        <div className="absolute top-[-10%] right-[25%] w-[450px] h-[450px] rounded-full bg-[#3B82F6]/8 blur-[110px] animate-pulse duration-[14s]" />
        <div className="absolute top-[20%] left-[40%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      {/* Tiny slow floating background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: ["0%", "-40%", "0%"],
              x: ["0%", "8%", "0%"],
              opacity: [0.08, 0.35, 0.08],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 1. FLOATING GLASS NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-[#09090B]/60 backdrop-blur-xl border-b border-white/[0.04] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          {/* Elegant Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onNavigate("/")}
            id="nav-logo"
          >
            {/* Custom SVG vault/key icon matching the prompt mockup logo */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] p-[1px] shadow-lg group-hover:scale-105 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#09090B]">
                <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white font-display">
                IdeaVault
              </span>
              <span className="text-[8px] font-mono tracking-widest uppercase text-zinc-500 font-bold">
                CREATOR BLUEPRINTS
              </span>
            </div>
          </div>

          {/* Nav Items - Centered with minimal luxury style */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-wider uppercase font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#workflow" className="hover:text-white transition-colors duration-200">
              How It Works
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors duration-200">
              Extension
            </a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">
              FAQ
            </a>
          </nav>

          {/* Action Links & Premium Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("/login")}
              className="px-4 py-2 text-[11px] tracking-wider uppercase font-bold text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
              id="login-btn"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate("/signup")}
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] px-5 py-2 text-[11px] font-bold tracking-wider uppercase text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              id="signup-btn"
            >
              <span className="relative z-10 flex items-center gap-1">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. CENTERED HERO SECTION */}
      <section 
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-20 z-10 overflow-hidden" 
        id="hero-section"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Interactive Ambient Background Cards (with connection lines) */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
          {/* Subtle glow rays / light beams in the background */}
          <div className="absolute top-1/4 left-[8%] w-[200px] h-[650px] rounded-full bg-gradient-to-b from-[#8B5CF6]/15 via-blue-500/5 to-transparent blur-[85px] -rotate-12 pointer-events-none" />
          <div className="absolute top-1/3 right-[5%] w-[180px] h-[550px] rounded-full bg-gradient-to-b from-[#3B82F6]/10 via-[#8B5CF6]/5 to-transparent blur-[75px] rotate-12 pointer-events-none" />

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-35">
            <defs>
              <linearGradient id="glow-line-left" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="glow-line-right" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Left curve connecting reels -> LinkedIn -> YouTube */}
            <path d="M 11% 22% Q 16% 38% 15% 56%" fill="none" stroke="url(#glow-line-left)" strokeWidth="1.5" strokeDasharray="5,6" />
            <path d="M 15% 56% Q 12% 70% 8% 84%" fill="none" stroke="url(#glow-line-left)" strokeWidth="1.5" strokeDasharray="5,6" />
            
            {/* Right curve connecting TikTok -> Pinterest -> Website */}
            <path d="M 84% 18% Q 89% 34% 87% 50%" fill="none" stroke="url(#glow-line-right)" strokeWidth="1.5" strokeDasharray="5,6" />
            <path d="M 87% 50% Q 83% 65% 80% 80%" fill="none" stroke="url(#glow-line-right)" strokeWidth="1.5" strokeDasharray="5,6" />
          </svg>

          {/* Map and render each card with reactive mouse proximity styles */}
          {ambientCards.map((card) => {
            // Calculate distance to mouse cursor to determine custom opacity, scale, and box shadow
            const dx = card.xPct - mousePct.x;
            const dy = card.yPct - mousePct.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Proximity is 1 at exact position, sliding down to 0 at 28% distance
            const proximity = Math.max(0, 1 - distance / 28);
            const opacity = 0.08 + proximity * 0.77; // default subtle visibility, brightens when close
            const scale = 0.96 + proximity * 0.05; // very subtle grow
            const glowShadow = proximity > 0 
              ? `0 10px 40px -10px rgba(139, 92, 246, ${proximity * 0.25})` 
              : "none";
            const borderOpacity = 0.03 + proximity * 0.12;

            return (
              <div
                key={card.id}
                className="absolute w-[260px] rounded-2xl bg-[#09090b]/55 backdrop-blur-[6px] p-4 transition-all duration-300 ease-out flex flex-col gap-2.5"
                style={{
                  left: `${card.xPct}%`,
                  top: `${card.yPct}%`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  opacity,
                  boxShadow: glowShadow,
                  border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
                }}
              >
                {/* Header row with Icon and Title */}
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${card.iconColor}`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">{card.title}</span>
                    <span className="text-[9px] text-zinc-500 truncate">{card.subtitle}</span>
                  </div>
                </div>

                {/* Card Snippet Body */}
                <p className="text-[10px] text-zinc-400 font-normal leading-relaxed">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 flex flex-col justify-center items-center relative z-10" style={{ textAlign: "center", width: "100%", maxWidth: "1200px", paddingTop: "120px" }}>
          
          {/* Main Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            <h1 
              className="uppercase text-white select-none text-center whitespace-nowrap font-bebas"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "min(84.312px, 7.8vw)",
                lineHeight: "min(89.8432px, 8.5vw)",
                fontWeight: "normal",
                paddingLeft: "0px",
                width: "100%",
                maxWidth: "752.742px",
                textAlign: "center"
              }}
            >
              NEVER FORGET{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] bg-clip-text text-transparent">
                WHY YOU
              </span>{" "}
              SAVED IT
            </h1>
          </motion.div>

          {/* Subtitle Under the Headline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal text-center px-4"
          >
            Save YouTube videos, Instagram Reels, X posts, articles and voice notes. <br className="hidden md:inline" />
            IdeaVault uses AI to organize every inspiration so you always remember why you saved it.
          </motion.p>

          {/* CTAs with Premium Hover Animations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 pt-2"
          >
            <button
              onClick={() => onNavigate("/signup")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:brightness-110 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(139,92,246,0.2)] hover:shadow-[0_8px_40px_rgb(139,92,246,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-97 cursor-pointer"
              id="hero-get-started"
            >
              <span>Start For Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => setShowDemoVideo(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/25 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] active:scale-97 cursor-pointer"
              id="hero-watch-demo"
            >
              <Play className="h-3.5 w-3.5 fill-current text-[#8B5CF6]" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Premium Trust Section with User Avatar Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-2 pt-4"
          >
            <div className="flex items-center -space-x-2.5">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`User avatar ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-7.5 h-7.5 rounded-full border border-[#09090B] object-cover bg-zinc-800"
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span>4.9/5 from 1,200+ creators</span>
            </div>
          </motion.div>

          {/* 3. LOWER INFORMATION BAR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl pt-16"
          >
            {/* Centered text banner */}
            <div className="flex items-center justify-center gap-1.5 mb-5">
              <span className="text-[#8B5CF6] text-xs font-semibold">✦</span>
              <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-zinc-400 font-bold">
                Capture from anywhere
              </span>
            </div>
            
            {/* Horizontal platform row styled like a premium SaaS widget */}
            <div 
              className="rounded-full border border-white/[0.04] bg-[#111827]/15 backdrop-blur-md py-3.5 max-w-4xl mx-auto overflow-hidden relative"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
                maskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
              }}
            >
              <style>{`
                @keyframes marquee {
                  0% {
                    transform: translateX(0%);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-marquee-loop {
                  display: flex;
                  width: max-content;
                  animation: marquee 35s linear infinite;
                }
                .animate-marquee-loop:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="animate-marquee-loop flex items-center gap-x-12 text-zinc-500 text-xs font-semibold px-4">
                {/* Render the list twice for a seamless infinite scroll loop */}
                {[...platforms, ...platforms].map((platform, i) => (
                  <React.Fragment key={`${platform.name}-${i}`}>
                    <div className="flex items-center gap-2 hover:text-white transition-colors duration-200 select-none shrink-0">
                      <span className="opacity-75">{platform.icon}</span>
                      <span className="text-[11px] tracking-wide font-medium">{platform.name}</span>
                    </div>
                    <span className="text-zinc-800 font-normal select-none shrink-0">•</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 5. DASHBOARD PREVIEW */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative" id="dashboard-preview">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[9px] font-mono text-[#8B5CF6] tracking-[0.25em] uppercase font-bold px-3 py-1 bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 rounded-full">
            IMMEDIATE VISUAL SWIPE
          </span>
          <h2 
            className="uppercase text-white tracking-wide"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "min(75px, 12vw)",
              fontWeight: "normal",
              lineHeight: "1"
            }}
          >
            A Cinematic Digital Vault
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            Beautifully cataloged visual cards containing real-time source metadata, custom edited context notes, and advanced AI blueprints.
          </p>
        </div>

        {/* Dashboard Mockup Grid Frame */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.05] bg-[#0c0c0e] p-2.5 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group">
            {/* Top ambient color ring inside the preview border */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent" />
            
            {/* Mockup Bezel Browser bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-[#09090b]/60 rounded-t-xl text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
              </div>
              <div className="h-6 bg-[#09090b] rounded-lg px-12 text-[9px] font-mono flex items-center mx-auto border border-white/[0.04] text-zinc-400">
                app.ideavault.io/vault/creative-inspiration
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-indigo-500/20" />
              </div>
            </div>

            {/* Simulated Live Workspace UI */}
            <div className="bg-[#09090B] rounded-b-xl overflow-hidden p-5 sm:p-7 text-left select-none pointer-events-none space-y-6">
              
              {/* Top Filters & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/[0.04] text-[#8B5CF6]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Video Editing ReferenceSwipe</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">14 SAVED INSPIRATIONS • UPDATED 2 MINS AGO</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.04] text-[10px] text-zinc-400 font-mono">
                    All Platforms
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[10px] text-[#3B82F6] font-mono font-medium">
                    + Capture Link
                  </div>
                </div>
              </div>

              {/* Inspiration Cards Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Visual Card 1: YouTube */}
                <div className="rounded-xl border border-white/[0.04] bg-[#0c0c0e]/80 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-semibold text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                      YouTube Link
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">2m ago</span>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-white font-display">Cinematic Title Intro Zoom pacing</h5>
                    <p className="text-[10px] text-zinc-400 font-normal line-clamp-1">https://youtube.com/watch?v=F384k9d</p>
                  </div>
                  
                  {/* Edited Custom Note */}
                  <div className="bg-zinc-900/60 rounded-lg p-3 border border-white/[0.04]">
                    <span className="text-[9px] text-zinc-500 font-mono block mb-1">USER DIRECTIONS & WHY SAVED:</span>
                    <p className="text-[10px] text-zinc-400 leading-normal font-normal">
                      "I love how the screen stays completely pitch black for 2 seconds while a custom audio rumble sweeps in. Use this for video intros."
                    </p>
                  </div>

                  {/* AI Extracted tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">Storytelling</span>
                    <span className="text-[9px] font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">Intro Hook</span>
                  </div>
                </div>

                {/* Visual Card 2: Pinterest */}
                <div className="rounded-xl border border-white/[0.04] bg-[#0c0c0e]/80 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-semibold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">
                      Pinterest
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">15m ago</span>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-white font-display">Bauhaus Poster Color Schemes</h5>
                    <p className="text-[10px] text-zinc-400 font-normal line-clamp-1">https://pinterest.com/pin/28491028302</p>
                  </div>
                  
                  {/* Edited Custom Note */}
                  <div className="bg-zinc-900/60 rounded-lg p-3 border border-white/[0.04]">
                    <span className="text-[9px] text-zinc-500 font-mono block mb-1">USER DIRECTIONS & WHY SAVED:</span>
                    <p className="text-[10px] text-zinc-400 leading-normal font-normal">
                      "Note the stark contrasting font sizes. The primary display text is humongous, while supporting details are tiny. Beautiful balance."
                    </p>
                  </div>

                  {/* AI Extracted tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Color Palette</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Layout Grid</span>
                  </div>
                </div>

                {/* Visual Card 3: Instagram */}
                <div className="rounded-xl border border-white/[0.04] bg-[#0c0c0e]/80 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-semibold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                      Instagram Reel
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">1h ago</span>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-white font-display">Fast-Paced Motion Slide Transition</h5>
                    <p className="text-[10px] text-zinc-400 font-normal line-clamp-1">https://instagram.com/reel/C838v94Jd0s</p>
                  </div>
                  
                  {/* Edited Custom Note */}
                  <div className="bg-zinc-900/60 rounded-lg p-3 border border-white/[0.04]">
                    <span className="text-[9px] text-zinc-500 font-mono block mb-1">USER DIRECTIONS & WHY SAVED:</span>
                    <p className="text-[10px] text-zinc-400 leading-normal font-normal">
                      "The camera moves vertically downward as the next slide enters. Create a preset in After Effects for this movement."
                    </p>
                  </div>

                  {/* AI Extracted tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] font-mono text-pink-400 bg-pink-400/10 px-1.5 py-0.5 rounded">Transitions</span>
                    <span className="text-[9px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">Camera Rig</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES SYSTEM */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-[9px] font-mono text-[#3B82F6] tracking-[0.25em] uppercase font-bold px-3 py-1 bg-[#3B82F6]/5 border border-[#3B82F6]/15 rounded-full">
            CORE CAPABILITIES
          </span>
          <h2 
            className="uppercase text-white tracking-wide"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "min(75px, 12vw)",
              fontWeight: "normal",
              lineHeight: "1"
            }}
          >
            Every idea, securely anchored
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
            Engineered meticulously for creators, planners, and strategists who need zero friction and high retrievability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/50 p-6.5 hover:bg-[#0c0c0e] hover:border-white/[0.08] hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/[0.04] text-zinc-300">
                      <IconComp className="h-5 w-5" />
                    </div>
                    {feat.comingSoon && (
                      <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-amber-400 bg-amber-400/5 border border-amber-400/15 px-2 py-0.5 rounded-full">
                        AI BETA
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-white font-display">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">{feat.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. WORKFLOW / BLUEPRINT STEPS */}
      <section id="workflow" className="py-24 bg-[#0c0c0e]/30 border-y border-white/[0.03] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[9px] font-mono text-[#8B5CF6] tracking-[0.25em] uppercase font-bold px-3 py-1 bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 rounded-full">
              THE PIPELINE
            </span>
            <h2 
              className="uppercase text-white tracking-wide"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "min(75px, 12vw)",
                fontWeight: "normal",
                lineHeight: "1"
              }}
            >
              The Idea-to-Action Blueprint
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto font-normal leading-relaxed">
              How IdeaVault turns raw saved visual links into structured, production-ready blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3.5 relative">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.04] font-mono text-xs text-white font-bold">
                  01
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  Save Reference
                </h4>
              </div>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed pl-13">
                Paste any sudden creative link or file directly into your vault folder instantly.
              </p>
            </div>

            <div className="space-y-3.5 relative">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.04] font-mono text-xs text-white font-bold">
                  02
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  State Intention
                </h4>
              </div>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed pl-13">
                Write a quick description or record an audio memo outlining exactly why this inspired you.
              </p>
            </div>

            <div className="space-y-3.5 relative">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.04] font-mono text-xs text-white font-bold">
                  03
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  AI Decomposition
                </h4>
              </div>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed pl-13">
                Our Gemini AI isolates the underlying hooks, tags, structural pacing, and tags instantly.
              </p>
            </div>

            <div className="space-y-3.5 relative">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.04] font-mono text-xs text-white font-bold">
                  04
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  Content Launch
                </h4>
              </div>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed pl-13">
                Export the structured blueprint to script your next high-retention post or video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. USE CASES */}
      <section id="use-cases" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-[9px] font-mono text-[#3B82F6] tracking-[0.25em] uppercase font-bold px-3 py-1 bg-[#3B82F6]/5 border border-[#3B82F6]/15 rounded-full">
            DISCIPLINES
          </span>
          <h2 
            className="uppercase text-white tracking-wide"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "min(75px, 12vw)",
              fontWeight: "normal",
              lineHeight: "1"
            }}
          >
            Engineered for Creators
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto font-normal leading-relaxed">
            See how different high-output disciplines streamline references directly into practical workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/50 p-6.5 space-y-4 hover:bg-[#0c0c0e] hover:border-white/[0.08] transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${uc.accent}`}>
                  {uc.badge}
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </div>
              <h3 className="text-base font-bold text-white font-display">{uc.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">{uc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section id="testimonials" className="py-24 border-t border-white/[0.03] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-[9px] font-mono text-amber-400 tracking-[0.25em] uppercase font-bold px-3 py-1 bg-amber-400/5 border border-amber-400/15 rounded-full">
            COMMUNITY BUZZ
          </span>
          <h2 
            className="uppercase text-white tracking-wide"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "min(75px, 12vw)",
              fontWeight: "normal",
              lineHeight: "1"
            }}
          >
            Loved by elite visual thinkers
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto font-normal leading-relaxed">
            How content builders, art directors, and strategists leverage their visual swipe vaults daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/50 p-6 flex flex-col justify-between hover:bg-[#0c0c0e] hover:border-white/[0.08] transition-all duration-300"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-white/[0.04] pt-4 mt-6">
                <img
                  src={test.avatar}
                  alt={test.author}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-white/[0.06] object-cover bg-zinc-800"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{test.author}</span>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-wide">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. PRICING */}
      <section id="pricing" className="py-24 bg-[#0c0c0e]/30 border-y border-white/[0.03] relative z-10">
        <div className="max-w-xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <span className="text-[9px] font-mono text-[#8B5CF6] tracking-[0.25em] uppercase font-bold px-3 py-1 bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 rounded-full">
              SaaS PLANS
            </span>
            <h2 
              className="uppercase text-white tracking-wide"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "min(75px, 12vw)",
                fontWeight: "normal",
                lineHeight: "1"
              }}
            >
              Simple pricing
            </h2>
            <p className="text-sm text-zinc-400 font-normal leading-relaxed">
              IdeaVault is currently running a free local Sandbox database for independent early-adopters.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.05] bg-[#0c0c0e] p-6 sm:p-8 space-y-6 relative overflow-hidden text-left shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Top Indicator */}
            <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-500/10 border-l border-b border-emerald-500/20 px-3 py-1.5 text-[8px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              Active Sandbox Free
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-display">Creator Sandbox Tier</h3>
              <p className="text-xs text-zinc-400 font-normal">
                The absolute sandbox suite to secure, analyze, and tag custom inspiration entries.
              </p>
            </div>

            <div className="flex items-baseline gap-1 border-b border-white/[0.04] pb-6">
              <span className="text-4xl font-extrabold text-white font-display">$0</span>
              <span className="text-xs text-zinc-500 font-mono">/ Month (Free)</span>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300 font-sans">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Infinite Inspiration Vault Entries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Custom Organized Visual Boards</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant Voice Note capture & transcriptions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Secure server-side Gemini 3.5 AI Analysis</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 ml-1 mr-1 shrink-0" />
                <span>Pro Team Collaboration Workspace (Soon)</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/signup")}
              className="w-full rounded-xl bg-white text-[#09090B] hover:bg-zinc-200 py-3.5 text-xs font-bold transition-all cursor-pointer active:scale-97 shadow-md"
              id="pricing-cta-btn"
            >
              Get Started Instantly
            </button>
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-[9px] font-mono text-[#8B5CF6] tracking-[0.25em] uppercase font-bold px-3 py-1 bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 rounded-full">
            FAQ
          </span>
          <h2 
            className="uppercase text-white tracking-wide"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "min(75px, 12vw)",
              fontWeight: "normal",
              lineHeight: "1"
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto font-normal leading-relaxed">
            Everything you need to know about capturing and decomposing inspirations securely.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/50 overflow-hidden transition-all duration-300 hover:border-white/[0.08]"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm font-semibold text-white font-display">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3.5 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="py-24 sm:py-32 relative overflow-hidden z-10 border-t border-white/[0.03] bg-[#0c0c0e]/20" id="final-cta">
        {/* Soft center glow background */}
        <div className="absolute inset-0 bg-radial-gradient from-[#8B5CF6]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          <h2 
            className="uppercase leading-tight text-white tracking-wide"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "min(75px, 12vw)",
              fontWeight: "normal",
              color: "#ffffff"
            }}
          >
            Turn inspiration into <br />
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] bg-clip-text text-transparent">
              your next creator blueprint.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-normal leading-relaxed">
            Create collections, transcribe instant voice directions, and unlock deconstructed insights. No credit card required.
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => onNavigate("/signup")}
              className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:brightness-110 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(139,92,246,0.2)] transition-all duration-300 hover:scale-[1.03] active:scale-97 cursor-pointer flex items-center gap-2"
              id="final-cta-btn"
            >
              <span>Secure Your Private Vault</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 13. PREMIUM FOOTER */}
      <footer className="py-16 border-t border-white/[0.03] bg-[#09090B] relative z-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-12 border-b border-white/[0.04]">
            {/* Logo box */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("/")} id="footer-logo">
                <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-zinc-900 text-white border border-white/5">
                  <span className="font-display font-bold text-base">I</span>
                </div>
                <span className="text-sm font-bold text-white font-display">IdeaVault</span>
              </div>
              <p className="text-xs max-w-xs text-zinc-400 font-normal leading-relaxed">
                Securely anchor references, transcribe voice intentions, and analyze the strategy behind viral content with Gemini 3.5 AI.
              </p>
            </div>

            {/* Links Block */}
            <div className="flex flex-wrap gap-x-16 gap-y-8 text-xs">
              <div className="space-y-3.5">
                <h4 
                  className="uppercase text-white tracking-wider"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontWeight: "normal",
                    fontSize: "10px",
                    lineHeight: "13px"
                  }}
                >PRODUCT</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#features" className="hover:text-white transition-colors font-normal">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#workflow" className="hover:text-white transition-colors font-normal">
                      Workflow
                    </a>
                  </li>
                  <li>
                    <a href="#use-cases" className="hover:text-white transition-colors font-normal">
                      Use Cases
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3.5">
                <h4 
                  className="uppercase text-white tracking-wider"
                  style={{
                    color: "#ffffff",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontWeight: "normal",
                    fontSize: "10px",
                    lineHeight: "13px"
                  }}
                >SANDBOX</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#pricing" className="hover:text-white transition-colors font-normal">
                      Pricing Plans
                    </a>
                  </li>
                  <li>
                    <button onClick={() => onNavigate("/login")} className="hover:text-white transition-colors font-normal text-left cursor-pointer">
                      Login Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate("/signup")} className="hover:text-white transition-colors font-normal text-left cursor-pointer">
                      Create Sandbox
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3.5">
                <h4 
                  className="uppercase text-white tracking-wider"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontWeight: "normal",
                    fontSize: "10px",
                    lineHeight: "13px"
                  }}
                >CREATOR SWIPE</h4>
                <p className="text-xs max-w-[200px] leading-relaxed text-zinc-500 font-normal">
                  Transforming static bookmarks into responsive creator blueprint workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
            <span>IdeaVault &copy; 2026. Designed with ultimate architectural precision. All rights reserved.</span>
            <div className="flex items-center gap-2 text-zinc-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Made with Precision & Crafts for Digital Mindset.</span>
            </div>
          </div>

        </div>
      </footer>

      {/* WALKTHROUGH DEMO VIDEO MODAL */}
      <AnimatePresence>
        {showDemoVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            id="demo-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/[0.05] bg-[#0c0c0e] p-6 space-y-4 shadow-premium-lg"
              id="demo-modal-container"
            >
              <button
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
                id="close-demo-modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-[#8B5CF6] fill-current" />
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                  IdeaVault Walkthrough Playback
                </h3>
              </div>

              {/* simulated player */}
              <div className="aspect-video w-full rounded-xl bg-[#09090B] border border-white/[0.04] flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/5 to-transparent pointer-events-none" />
                <Volume2 className="h-10 w-10 text-zinc-600 animate-pulse" />
                <div className="space-y-1.5">
                  <p className="text-xs text-zinc-300 max-w-sm font-normal">
                    "Learn how to capture references from YouTube, Pinterest, or Instagram in 1-click, write notes on your sudden directions, and trigger full server-side Gemini deconstruction."
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    DURATION: 1 MIN 45 SECS
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full font-bold">
                  Demo Playback Connected
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setShowDemoVideo(false);
                    onNavigate("/signup");
                  }}
                  className="rounded-xl bg-white text-black hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold transition-all active:scale-97 cursor-pointer"
                  id="demo-modal-signup-btn"
                >
                  Start Saving Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
