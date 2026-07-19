import React, { useState } from 'react';
import { LogOut, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const email = user?.email || 'creator@ideavault.io';
  const name = user?.user_metadata?.full_name || 'Inspiration Creator';
  const avatar = user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';

  return (
    <header id="top-navbar" className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md animate-fade-in">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-[#EDEDED]">IdeaVault</span>
            <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase leading-none mt-0.5">Inspiration Vault</span>
          </div>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center gap-4">
          {/* User Avatar & Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-[#EDEDED] leading-none">{name}</span>
              <span className="text-[10px] text-white/40 leading-none mt-1 font-mono uppercase tracking-wider">Creator Plan</span>
            </div>

            <div className="relative group">
              <img 
                src={avatar} 
                alt={name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border border-white/10 object-cover ring-1 ring-white/10 group-hover:ring-white/25 transition-all"
              />
            </div>

            <button 
              onClick={onLogout}
              className="ml-1 rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
