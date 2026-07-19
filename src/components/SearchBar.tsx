import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-white/25 focus-within:bg-white/[0.05] transition-all shadow-2xl">
        
        {/* Search icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-4.5 w-4.5 text-white/40" />
        </div>

        {/* Real input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search inspiration by title, notes, platform..."
          className="block w-full rounded-xl bg-transparent py-4 pl-11 pr-20 text-sm text-[#EDEDED] placeholder-white/20 outline-none"
        />

        {/* Interactive action badges */}
        <div className="absolute inset-y-0 right-4 flex items-center gap-2">
          {value && (
            <button
              onClick={handleClear}
              className="rounded-md p-1 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="pointer-events-none flex select-none items-center gap-1">
            <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/40 font-mono">⌘</span>
            <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/40 font-mono">K</span>
          </div>
        </div>

      </div>
    </div>
  );
}
