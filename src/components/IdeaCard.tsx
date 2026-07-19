import React, { useState } from 'react';
import { Star, ExternalLink, Calendar, Trash2, Check, X, Folder } from 'lucide-react';
import { Idea, Collection } from '../types';
import { getPlatformConfig } from '../utils/platform';
import { motion } from 'motion/react';

import { getAIStatusBadgeStyle } from '../lib/ai/status';

interface IdeaCardProps {
  key?: any;
  idea: Idea;
  collections: Collection[];
  onToggleFavorite: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onSelectCard: (idea: Idea) => void;
}

export default function IdeaCard({
  idea,
  collections,
  onToggleFavorite,
  onDelete,
  onSelectCard,
}: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const platformConfig = getPlatformConfig(idea.platform);
  const Icon = platformConfig.icon;

  const aiBadge = getAIStatusBadgeStyle(idea.ai_status);

  // Format date nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  // Find collection name
  const collection = collections.find(c => c.id === idea.collection_id);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(true);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(false);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(idea.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.12)' }}
      onClick={() => onSelectCard(idea)}
      className="group relative flex flex-col h-full rounded-2xl bg-white/[0.02] border border-white/5 p-5 cursor-pointer select-none transition-all duration-300 shadow-2xl hover:bg-white/[0.04]"
    >
      
      {/* Platform & Favorite Top Row */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${platformConfig.color}`}>
            <Icon className="h-3 w-3" />
            <span>{platformConfig.label}</span>
          </div>

          <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${aiBadge.bg}`}>
            <span>{aiBadge.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 z-10">
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(idea.id);
            }}
            className={`rounded-lg p-1.5 border transition-all ${
              idea.is_favorite
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-white/5 border-white/5 text-white/40 hover:text-white/80'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${idea.is_favorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Idea Title */}
      <h4 className="text-sm font-semibold tracking-tight text-[#EDEDED] line-clamp-1 group-hover:text-white transition-colors mb-2">
        {idea.title}
      </h4>

      {/* "Why I Saved This" - Core Value section styled beautifully */}
      <div className="flex-1 rounded-xl bg-white/[0.01] border border-white/5 p-3.5 mb-4 group-hover:bg-white/[0.02] transition-colors">
        <p className="text-xs font-normal leading-relaxed text-white/40 italic line-clamp-4">
          &ldquo;{idea.why_saved}&rdquo;
        </p>
      </div>

      {/* Card Footer: Metadata and External links */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-white/30">
        
        {/* Collection & Date */}
        <div className="flex flex-col gap-1">
          {collection && (
            <div className="flex items-center gap-1 text-white/50 font-medium">
              <Folder className="h-3 w-3 text-white/30" />
              <span className="text-[10px]">{collection.icon} {collection.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1 font-mono text-[10px] text-white/20">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(idea.created_at)}</span>
          </div>
        </div>

        {/* Action Controls (External Link & Delete) */}
        <div className="flex items-center gap-1.5 z-10">
          {idea.url && (
            <a
              href={idea.url}
              target="_blank"
              rel="noopener noreferrer referrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white p-1.5 text-white/40 transition-all"
              title="Open source URL"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {/* Delete action */}
          {isConfirming ? (
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-md p-1 bg-red-950 hover:bg-red-900 text-red-400 transition-colors"
                title="Confirm delete"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                onClick={handleCancelDelete}
                className="rounded-md p-1 hover:bg-white/5 text-white/40 transition-colors"
                title="Cancel"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="opacity-0 group-hover:opacity-100 rounded-lg bg-white/5 hover:bg-red-950 hover:text-red-400 border border-white/5 p-1.5 text-white/30 transition-all"
              title="Delete inspiration"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

      </div>

    </motion.div>
  );
}
