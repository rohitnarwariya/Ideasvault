import React, { useState, useEffect, useRef } from 'react';
import { X, Smile, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, icon: string) => Promise<void>;
}

const PRESET_EMOJIS = [
  '💡', '🎥', '📸', '📌', '🚀', '🪝', '📖', '📣', 
  '🔍', '💼', '🎨', '💻', '✍️', '🎵', '📈', '🧠',
  '🔥', '🛠️', '🎯', '⚡', '🔒', '📦', '🌍', '❤️'
];

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💡');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('💡');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    try {
      await onCreate(name.trim(), icon);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create collection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-6 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-lg">
              {icon}
            </div>
            <h3 className="text-base font-semibold text-[#EDEDED]">Create Inspiration Board</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Collection Name */}
            <div>
              <label htmlFor="board-name" className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Collection Name
              </label>
              <input
                ref={inputRef}
                type="text"
                id="board-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Copywriting Hooks, Startup Pitch, Storytelling..."
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 focus:border-white/25 focus:bg-white/[0.05] outline-none px-3.5 py-2.5 text-sm text-[#EDEDED] placeholder-white/20 transition-all"
                maxLength={40}
              />
            </div>

            {/* Select Icon / Emoji */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                Select Emoji Icon
              </label>
              <div className="grid grid-cols-8 gap-2 rounded-xl bg-white/[0.01] border border-white/5 p-3 max-h-[140px] overflow-y-auto">
                {PRESET_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all hover:bg-white/10 ${
                      icon === emoji 
                        ? 'bg-white/10 ring-1 ring-white/25 scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-full bg-white text-black hover:bg-white/90 px-5 py-2 text-xs font-medium shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Board</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
