import React from "react";

/**
 * ============================================================================
 * IDEAVAULT GLOBAL DESIGN SYSTEM TOKENS
 * Inspired by Linear, Vercel, and Raycast.
 * Fully optimized for a premium dark-mode developer-focused experience.
 * ============================================================================
 */

export const DESIGN_TOKENS = {
  // Brand colors & typography rules
  colors: {
    bg: "bg-brand-bg text-brand-primary",
    card: "bg-brand-card border border-brand-border text-brand-primary",
    cardHover: "hover:bg-brand-card-hover hover:border-brand-border-hover transition-all duration-300",
    popover: "bg-brand-popover border border-brand-border shadow-premium-lg rounded-xl",
    border: "border-brand-border",
    borderFocus: "focus:border-brand-border-glow focus:ring-1 focus:ring-brand-border-glow focus:outline-none",
    accent: "text-brand-accent",
    muted: "text-brand-secondary",
    dim: "text-brand-tertiary"
  },
  
  typography: {
    display: "font-display font-bold tracking-tight text-brand-primary",
    title: "font-display font-semibold tracking-tight text-brand-primary",
    body: "font-sans font-normal text-brand-secondary leading-relaxed",
    bodyStrong: "font-sans font-medium text-brand-primary",
    mono: "font-mono text-xs tracking-wider",
    heading1: "text-3xl md:text-4xl font-display font-extrabold tracking-tight",
    heading2: "text-2xl md:text-3xl font-display font-semibold tracking-tight",
    heading3: "text-xl md:text-2xl font-display font-semibold tracking-tight",
    subheading: "text-sm md:text-base text-brand-secondary font-sans font-normal"
  },

  radius: {
    sm: "rounded-sm", // 8px
    md: "rounded-md", // 12px
    lg: "rounded-lg", // 16px
    xl: "rounded-xl", // 20px
    xl2: "rounded-2xl", // 24px
    full: "rounded-full"
  },

  shadows: {
    sm: "shadow-premium-sm",
    md: "shadow-premium-md",
    lg: "shadow-premium-lg",
    glow: "shadow-premium-glow",
    purpleGlow: "shadow-purple-glow"
  },

  // Component states
  buttons: {
    primary: "px-4 py-2.5 bg-brand-primary text-brand-bg font-medium rounded-xl hover:bg-white active:scale-97 transition-all duration-200 shadow-premium-md font-sans text-sm inline-flex items-center justify-center gap-2 cursor-pointer",
    secondary: "px-4 py-2.5 bg-brand-card border border-brand-border text-brand-primary font-medium rounded-xl hover:bg-brand-card-hover hover:border-brand-border-hover active:scale-97 transition-all duration-200 font-sans text-sm inline-flex items-center justify-center gap-2 cursor-pointer",
    tertiary: "px-3 py-1.5 text-brand-secondary hover:text-brand-primary hover:bg-brand-card rounded-lg active:scale-97 transition-all duration-200 font-sans text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer",
    glass: "px-4 py-2.5 glass-panel border border-brand-border text-brand-primary rounded-xl hover:bg-brand-card hover:border-brand-border-glow active:scale-97 transition-all duration-200 font-sans text-sm inline-flex items-center justify-center gap-2 cursor-pointer",
    glow: "px-4 py-2.5 bg-brand-accent text-white font-semibold rounded-xl hover:bg-blue-500 hover:shadow-premium-glow active:scale-97 transition-all duration-200 font-sans text-sm inline-flex items-center justify-center gap-2 cursor-pointer",
    destructive: "px-4 py-2.5 bg-brand-rose/10 border border-brand-rose/25 text-brand-rose font-medium rounded-xl hover:bg-brand-rose/20 active:scale-97 transition-all duration-200 font-sans text-sm inline-flex items-center justify-center gap-2 cursor-pointer",
    icon: "p-2.5 bg-brand-card border border-brand-border text-brand-secondary hover:text-brand-primary rounded-xl hover:bg-brand-card-hover transition-all duration-200 inline-flex items-center justify-center cursor-pointer"
  },

  inputs: {
    text: "w-full px-4 py-3 bg-[#09090b] border border-brand-border rounded-xl text-brand-primary placeholder:text-brand-tertiary focus:border-brand-border-glow focus:ring-1 focus:ring-brand-border-glow focus:outline-none transition-all duration-200 font-sans text-sm shadow-premium-sm",
    file: "w-full p-6 bg-brand-card/40 border border-dashed border-brand-border hover:border-brand-border-glow rounded-xl text-center text-brand-secondary cursor-pointer transition-all duration-200",
    textarea: "w-full px-4 py-3 bg-[#09090b] border border-brand-border rounded-xl text-brand-primary placeholder:text-brand-tertiary focus:border-brand-border-glow focus:ring-1 focus:ring-brand-border-glow focus:outline-none transition-all duration-200 font-sans text-sm shadow-premium-sm resize-none min-h-[100px]"
  },

  cards: {
    standard: "bg-brand-card border border-brand-border rounded-xl p-5 shadow-premium-md relative overflow-hidden",
    interactive: "bg-brand-card border border-brand-border rounded-xl p-5 shadow-premium-md relative overflow-hidden hover:bg-brand-card-hover hover:border-brand-border-hover transition-all duration-300 hover:-translate-y-0.5 cursor-pointer",
    glass: "glass-panel rounded-xl p-5 shadow-premium-lg relative overflow-hidden border border-white/5"
  },

  badges: {
    base: "px-2.5 py-1 text-[11px] font-medium rounded-full inline-flex items-center gap-1 font-mono tracking-wide",
    primary: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
    accent: "bg-brand-accent/10 text-brand-accent border border-brand-accent/20",
    indigo: "bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20",
    emerald: "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20",
    amber: "bg-brand-amber/10 text-brand-amber border border-brand-amber/20",
    rose: "bg-brand-rose/10 text-brand-rose border border-brand-rose/20",
    glass: "bg-white/5 text-brand-secondary border border-white/10"
  },

  sidebar: {
    container: "w-64 bg-brand-bg border-r border-brand-border h-full flex flex-col justify-between p-5",
    link: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-secondary hover:text-brand-primary hover:bg-brand-card transition-all duration-200 text-sm font-sans",
    linkActive: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-primary bg-brand-card border border-brand-border transition-all duration-200 text-sm font-sans font-medium"
  },

  modal: {
    overlay: "fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto",
    container: "bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg shadow-premium-lg overflow-hidden flex flex-col relative z-50",
    header: "px-6 py-5 border-b border-brand-border flex items-center justify-between",
    body: "p-6 flex-1 overflow-y-auto space-y-4",
    footer: "px-6 py-4 border-t border-brand-border bg-brand-bg/50 flex items-center justify-end gap-3"
  }
};

/**
 * ============================================================================
 * HIGH FIDELITY DESIGN SYSTEM COMPONENTS
 * Reusable layout primitives to build premium digital interfaces.
 * ============================================================================
 */

// --- 1. REUSABLE BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "glass" | "glow" | "destructive" | "icon";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  children,
  className = "",
  ...props
}) => {
  const baseClass = DESIGN_TOKENS.buttons[variant] || DESIGN_TOKENS.buttons.secondary;
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- 2. REUSABLE CARD COMPONENT ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "standard" | "interactive" | "glass";
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "standard",
  children,
  className = "",
  ...props
}) => {
  const baseClass = DESIGN_TOKENS.cards[variant] || DESIGN_TOKENS.cards.standard;
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// --- 3. REUSABLE BADGE / TAG COMPONENT ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "indigo" | "emerald" | "amber" | "rose" | "glass";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "glass",
  children,
  className = "",
  ...props
}) => {
  const baseClass = `${DESIGN_TOKENS.badges.base} ${DESIGN_TOKENS.badges[variant]}`;
  return (
    <span className={`${baseClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

// --- 4. BEAUTIFUL ANIMATED SKELETON LOADER ---
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "card" | "badge";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  className = "",
  ...props
}) => {
  let sizeClass = "w-full h-4 rounded-md";
  if (variant === "circle") sizeClass = "w-12 h-12 rounded-full";
  if (variant === "card") sizeClass = "w-full h-32 rounded-xl";
  if (variant === "badge") sizeClass = "w-16 h-6 rounded-full";

  return (
    <div
      className={`skeleton-pulse opacity-75 ${sizeClass} ${className}`}
      {...props}
    />
  );
};

// --- 5. HIGH-FIDELITY SPINNER LOADER ---
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "indigo";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "accent",
  className = "",
  ...props
}) => {
  let sizeClass = "w-6 h-6 border-2";
  if (size === "sm") sizeClass = "w-4 h-4 border-2";
  if (size === "lg") sizeClass = "w-10 h-10 border-3";

  let colorClass = "border-brand-primary";
  if (variant === "accent") colorClass = "border-brand-accent";
  if (variant === "indigo") colorClass = "border-brand-purple";

  return (
    <div
      className={`premium-spinner rounded-full ${sizeClass} ${colorClass} ${className}`}
      {...props}
    />
  );
};

// --- 6. PREMIUM EMPTY STATE COMPONENT ---
interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-border rounded-2xl bg-brand-card/20 max-w-md mx-auto ${className}`}>
      <div className="p-4 bg-brand-card border border-brand-border rounded-2xl shadow-premium-md text-brand-secondary mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className={`${DESIGN_TOKENS.typography.title} text-lg mb-1.5`}>{title}</h3>
      <p className={`${DESIGN_TOKENS.typography.body} text-sm mb-5 max-w-sm`}>{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// --- 7. SKELETON GRID COMPONENT FOR IDEAS ---
export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`${DESIGN_TOKENS.cards.standard} space-y-4`}>
          <div className="flex items-center justify-between">
            <Skeleton variant="badge" />
            <Skeleton variant="badge" className="w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <div className="pt-2 flex gap-2">
            <Skeleton variant="badge" className="w-12" />
            <Skeleton variant="badge" className="w-12" />
            <Skeleton variant="badge" className="w-12" />
          </div>
          <div className="pt-2 border-t border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton variant="circle" className="w-6 h-6" />
              <Skeleton className="w-20 h-3" />
            </div>
            <Skeleton className="w-12 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 8. BEAUTIFUL TOAST WRAPPER SYSTEM ---
// Class strings to easily craft elegant toasts
export const TOAST_CLASSES = {
  container: "fixed bottom-5 right-5 z-100 flex flex-col gap-2.5 max-w-md w-full",
  base: "flex items-center gap-3 p-4 bg-brand-popover border border-brand-border rounded-xl shadow-premium-lg text-sm font-sans animate-slide-in",
  success: "border-brand-emerald/25 bg-brand-emerald/5 text-brand-primary",
  error: "border-brand-rose/25 bg-brand-rose/5 text-brand-primary",
  info: "border-brand-accent/25 bg-brand-accent/5 text-brand-primary"
};
