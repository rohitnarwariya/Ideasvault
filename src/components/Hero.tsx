import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenSaveModal: () => void;
}

export default function Hero({ onOpenSaveModal }: HeroProps) {
  return (
    <div id="hero-section" className="relative border-b border-white/10 bg-[#0A0A0A] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-semibold tracking-tight text-[#EDEDED]"
          >
            Inspiration Vault
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-white/40 mt-1.5 text-lg font-normal"
          >
            Save. Remember. Create.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="shrink-0"
        >
          <button
            onClick={onOpenSaveModal}
            className="group flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/90 active:scale-95 transition-all shadow-md"
          >
            <Plus className="h-4.5 w-4.5 transition-transform group-hover:rotate-90 stroke-[2.5px]" />
            <span>Save Inspiration</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
