import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Folder, ExternalLink, Trash2, Bot, Sparkles, Loader2, Play, Pause, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Idea, Collection } from '../types';
import { getPlatformConfig } from '../utils/platform';

interface IdeaDetailModalProps {
  isOpen: boolean;
  idea: Idea | null;
  onClose: () => void;
  collections: Collection[];
  onDelete: (id: string) => Promise<void>;
}

export default function IdeaDetailModal({
  isOpen,
  idea,
  onClose,
  collections,
  onDelete,
}: IdeaDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAIExpanded, setIsAIExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playing and reset on close/change
  useEffect(() => {
    if (isOpen) {
      setIsAIExpanded(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    };
  }, [isOpen, idea]);

  // Prevent background scrolling while modal is open, preserving dashboard scroll position
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';

      // Mobile touch-move prevention on background
      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const isInsideCard = target.closest('.relative.w-full.max-w-2xl');
        if (!isInsideCard) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener('touchmove', handleTouchMove);
        // Ensure scroll position is perfectly preserved
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const formatDuration = (secs?: number) => {
    if (!secs) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayback = () => {
    if (!idea) return;
    const audioSrc = idea.voice_url || idea.voice_note;
    if (!audioSrc) return;

    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.onended = () => {
        setIsPlaying(false);
      };
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Playback failed", err);
          setIsPlaying(false);
        });
    }
  };

  if (!isOpen || !idea) return null;

  const platformConfig = getPlatformConfig(idea.platform);
  const PlatformIcon = platformConfig.icon;
  const collection = collections.find(c => c.id === idea.collection_id);

  // Format date nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this inspiration?')) {
      setIsDeleting(true);
      try {
        await onDelete(idea.id);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Parse why_saved to extract optional image attachment metadata
  let cleanNotes = idea.why_saved || '';
  let attachedImageName: string | null = null;
  let attachedImageSize: string | null = null;

  const attachmentRegex = /\[Reference Image Attached:\s*(.*?)\s*\((.*?)\)\]/;
  const match = cleanNotes.match(attachmentRegex);
  if (match) {
    attachedImageName = match[1];
    attachedImageSize = match[2];
    cleanNotes = cleanNotes.replace(attachmentRegex, '').trim();
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 scrollbar-none modal-scrollable">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-0"
          id="idea-detail-backdrop"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-5xl rounded-3xl bg-[#09090B] border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] z-10 my-8 mx-auto modal-scrollable-content overflow-hidden"
          id="idea-detail-modal-container"
        >
          {/* Accent Glowing Top-Border */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 opacity-90" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-xl p-2 text-white/30 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
            id="idea-detail-close-btn"
          >
            <X className="h-5 w-5" />
          </button>

          {/* TOP BANNER: Platform and Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5" id="idea-detail-header-tags">
            <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${platformConfig.color}`}>
              <PlatformIcon className="h-3.5 w-3.5" />
              <span>{platformConfig.label} Reference</span>
            </div>

            {idea.ai_status === 'completed' && (
              <span className="flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[11px] font-bold tracking-wider text-violet-400 font-mono">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>GEMINI CO-PILOT ACTIVE</span>
              </span>
            )}
          </div>

          {/* TITLE */}
          <h3 className="text-xl sm:text-2xl md:text-3.5xl font-extrabold tracking-tight text-white leading-tight mb-8 max-w-[90%]" id="idea-detail-title">
            {idea.title}
          </h3>

          {/* BENTO DUAL COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="idea-detail-bento-grid">
            
            {/* LEFT COLUMN: Human Inspiration Profile (Notes, Links, Attachments, Boards) */}
            <div className="lg:col-span-5 space-y-6" id="idea-detail-human-section">
              
              {/* NOTES: "Why I Saved This" */}
              <div className="space-y-2.5" id="idea-detail-notes-block">
                <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                  Why I Saved This (Core Notes)
                </span>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-500 to-indigo-600" />
                  <p className="text-sm leading-relaxed text-white/90 font-normal italic pl-2">
                    &ldquo;{cleanNotes || 'No notes added for this inspiration.'}&rdquo;
                  </p>
                </div>
              </div>

              {/* ATTACHMENTS SECTION */}
              <div className="space-y-2.5" id="idea-detail-attachments-block">
                <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                  Attachments
                </span>

                {/* If there are no voice note and no attached screenshot */}
                {!(idea.voice_note || idea.voice_url) && !attachedImageName && (
                  <div className="rounded-xl border border-dashed border-white/5 bg-white/[0.005] p-4 text-center">
                    <span className="text-[11px] text-white/20 font-mono">No physical files attached</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Real-time Voice Memo Player */}
                  {(idea.voice_note || idea.voice_url) && (
                    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.01] overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-white/[0.04] bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlayback}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer"
                            title={isPlaying ? "Pause voice note" : "Play voice note"}
                          >
                            {isPlaying ? <Pause className="h-4 w-4 fill-current text-black" /> : <Play className="h-4 w-4 fill-current text-black ml-0.5" />}
                          </button>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                              Voice Note Memo
                            </span>
                            <span className="text-[10px] text-white/40 font-mono mt-0.5">
                              Duration: {formatDuration(idea.voice_duration)} • {isPlaying ? 'Playing recording...' : 'Ready'}
                            </span>
                          </div>
                        </div>

                        {/* Audio Wave Visualizer */}
                        {isPlaying ? (
                          <div className="flex items-end gap-[3px] h-5 px-1 shrink-0">
                            <motion.span className="w-[3px] bg-emerald-400 rounded-full h-3" animate={{ height: [4, 16, 4] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }} />
                            <motion.span className="w-[3px] bg-emerald-400 rounded-full h-5" animate={{ height: [8, 20, 8] }} transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }} />
                            <motion.span className="w-[3px] bg-emerald-400 rounded-full h-2" animate={{ height: [3, 10, 3] }} transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                            <motion.span className="w-[3px] bg-emerald-400 rounded-full h-4" animate={{ height: [6, 18, 6] }} transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
                          </div>
                        ) : (
                          <div className="flex items-end gap-[3px] h-5 px-1 opacity-25 shrink-0">
                            <span className="w-[3px] h-2 bg-white rounded-full" />
                            <span className="w-[3px] h-3 bg-white rounded-full" />
                            <span className="w-[3px] h-1.5 bg-white rounded-full" />
                            <span className="w-[3px] h-2.5 bg-white rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Display original speech transcript */}
                      {idea.voice_transcript && (
                        <div className="p-4 bg-black/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">
                              Voice Transcript
                            </span>
                            <span className="text-[9px] text-emerald-400/70 font-mono bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                              Verified Speech
                            </span>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed font-normal italic bg-white/[0.01] border border-white/5 rounded-xl p-3">
                            &ldquo;{idea.voice_transcript}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Redesigned Screenshot / Reference Image attached file representation */}
                  {attachedImageName && (
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/25 text-violet-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#EDEDED] truncate">{attachedImageName}</span>
                          <span className="text-[9px] text-white/35 font-mono mt-0.5">Reference Screenshot • {attachedImageSize || 'Unknown size'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full px-2 py-0.5 text-[9px] font-bold font-mono">
                        <span>ATTACHED</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ORIGINAL LINK SECTION */}
              {idea.url && (
                <div className="space-y-2.5" id="idea-detail-source-block">
                  <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                    Source URL
                  </span>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.01] px-4 py-3">
                    <span className="text-xs text-white/40 truncate font-mono flex-1">{idea.url}</span>
                    <a
                      href={idea.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white px-3.5 py-2 border border-white/10 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Visit Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* COLLECTION & SAVED DATE METADATA GRID */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4" id="idea-detail-meta-grid">
                {/* Collection */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                    <Folder className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">Board</span>
                    <span className="text-xs font-bold text-white truncate mt-0.5">
                      {collection ? `${collection.icon} ${collection.name}` : 'Ideas'}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                    <Calendar className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">Timestamp</span>
                    <span className="text-xs font-bold text-white font-mono truncate mt-0.5">
                      {formatDate(idea.created_at)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Intelligent AI Strategy (Dissected Summary, Blueprint, Reusable Framework) */}
            <div className="lg:col-span-7 space-y-6" id="idea-detail-ai-section">
              <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.01] p-6 space-y-6 shadow-inner relative overflow-hidden">
                {/* Backlighting effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header title */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 text-violet-400">
                      <Bot className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#EDEDED] tracking-tight">AI Insights & Content Strategy</h4>
                      <p className="text-[10px] text-white/45 font-mono uppercase tracking-widest mt-0.5">Gemini Dissection Engine</p>
                    </div>
                  </div>
                </div>

                {/* AI STATE MANAGER: LOADING, FAILED, PENDING OR SUCCESS */}
                <div className="space-y-6">
                  {idea.ai_status === 'processing' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Loader2 className="h-8 w-8 text-violet-400 mb-3 animate-spin" />
                      <h4 className="text-sm font-bold text-violet-300 mb-1">
                        AI Dissecting Inspiration...
                      </h4>
                      <p className="max-w-md text-xs text-white/40 font-normal leading-relaxed">
                        Gemini is actively parsing your reference source, studying engagement patterns, and crafting your strategic blueprint. This takes a brief moment.
                      </p>
                    </div>
                  )}

                  {idea.ai_status === 'failed' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Bot className="h-8 w-8 text-red-400 mb-3" />
                      <h4 className="text-sm font-bold text-red-300 mb-1">
                        Dissection Interrupted
                      </h4>
                      <p className="max-w-md text-xs text-white/40 font-normal leading-relaxed">
                        We could not securely complete the AI content analysis. Ensure your Gemini API Key is configured in the sandbox settings.
                      </p>
                    </div>
                  )}

                  {(!idea.ai_status || idea.ai_status === 'pending') && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Loader2 className="h-7 w-7 text-amber-400/50 mb-3 animate-spin" />
                      <h4 className="text-sm font-bold text-white/50 mb-1">
                        Analysis Queued
                      </h4>
                      <p className="max-w-md text-xs text-white/30 font-normal">
                        This item is currently in the secure pipeline queue. Gemini will begin analyzing this reference shortly.
                      </p>
                    </div>
                  )}

                  {idea.ai_status === 'completed' && (() => {
                    let aiData = null;
                    if (idea.ai_summary) {
                      try {
                        const parsed = JSON.parse(idea.ai_summary);
                        if (parsed && typeof parsed === 'object' && ('summary' in parsed || 'creative_insight' in parsed)) {
                          aiData = parsed;
                        }
                      } catch (e) {
                        // Fallback
                      }
                    }

                    if (!aiData) {
                      return (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5">
                          <p className="text-xs sm:text-sm leading-relaxed text-white/70">
                            {idea.ai_summary || "No AI insights generated yet."}
                          </p>
                        </div>
                      );
                    }

                    const creativeInsight = aiData.creative_insight || aiData.summary || '';
                    const whyItWorks = aiData.why_it_works || aiData.why_this_matters || '';
                    const howToReuse = aiData.how_to_reuse || aiData.key_takeaways || [];
                    const reusableFramework = aiData.reusable_framework || aiData.content_formula || [];
                    const tags = aiData.tags || [];
                    const keywords = aiData.keywords || [];

                    return (
                      <div className="space-y-6" id="idea-detail-ai-success-panel">
                        
                        {/* 1. Dashboard Badges Bar */}
                        <div className="flex flex-wrap gap-2">
                          {aiData.content_type && (
                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 text-xs text-white/80">
                              <span className="text-white/30 font-mono text-[10px] mr-1 uppercase">Format:</span>
                              <span className="font-bold">{aiData.content_type}</span>
                            </div>
                          )}
                          {aiData.creator && (
                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 text-xs text-white/80">
                              <span className="text-white/30 font-mono text-[10px] mr-1 uppercase">Style:</span>
                              <span className="font-bold">{aiData.creator}</span>
                            </div>
                          )}
                          {aiData.difficulty && (
                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 text-xs text-white/80">
                              <span className="text-white/30 font-mono text-[10px] mr-1 uppercase">Complexity:</span>
                              <span className="font-bold">{aiData.difficulty}</span>
                            </div>
                          )}
                        </div>

                        {/* 2. Executive Creative Summary / Why It Works Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {creativeInsight && (
                            <div className="rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-600/[0.04] to-indigo-600/[0.04] p-4.5 space-y-2">
                              <span className="text-[10px] font-bold uppercase text-violet-400 tracking-wider font-mono">Creative Insight</span>
                              <p className="text-xs leading-relaxed text-[#EDEDED] font-normal">
                                {creativeInsight}
                              </p>
                            </div>
                          )}

                          {whyItWorks && (
                            <div className="rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-600/[0.04] to-fuchsia-600/[0.04] p-4.5 space-y-2">
                              <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider font-mono">Why It Works</span>
                              <p className="text-xs leading-relaxed text-[#EDEDED] font-normal italic">
                                &ldquo;{whyItWorks}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 3. Reusable Framework Vertical Timeline */}
                        {reusableFramework && reusableFramework.length > 0 && (
                          <div className="space-y-3 pt-2" id="reusable-framework-timeline">
                            <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider block font-mono">
                              Sequential Content Blueprint
                            </span>
                            <div className="relative pl-6 border-l-2 border-white/[0.06] space-y-4 py-1.5 ml-2">
                              {reusableFramework.map((step: string, idx: number) => (
                                <div key={idx} className="relative space-y-1">
                                  {/* Step Ring */}
                                  <div className="absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full bg-[#09090B] border-2 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] flex items-center justify-center">
                                    <div className="h-1 w-1 rounded-full bg-violet-400" />
                                  </div>
                                  <p className="text-xs text-white/85 leading-relaxed font-normal">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. Actionable Content Blueprint: How to reuse */}
                        {howToReuse && howToReuse.length > 0 && (
                          <div className="space-y-3 pt-2" id="key-takeaways-block">
                            <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider block font-mono">
                              How to Adapt & Reuse
                            </span>
                            <div className="grid grid-cols-1 gap-2.5">
                              {howToReuse.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 text-xs text-white/80 font-normal leading-relaxed">
                                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-[10px] font-bold text-emerald-400 font-mono">
                                    {idx + 1}
                                  </div>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5. AI Suggested Tags / Keywords */}
                        {((tags && tags.length > 0) || (keywords && keywords.length > 0)) && (
                          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]" id="ai-tags-keywords-container">
                            {tags.map((tag: string, idx: number) => (
                              <span key={`tag-${idx}`} className="inline-flex items-center rounded-lg bg-violet-500/5 border border-violet-500/10 px-2.5 py-1 text-[11px] text-violet-300">
                                #{tag}
                              </span>
                            ))}
                            {keywords.map((kw: string, idx: number) => (
                              <span key={`kw-${idx}`} className="inline-flex items-center rounded-lg bg-white/5 border border-white/[0.04] px-2.5 py-1 text-[11px] text-white/50">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/[0.08]" id="idea-detail-modal-footer">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 px-4 py-2.5 transition-all cursor-pointer"
              id="idea-detail-delete-btn"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Delete Inspiration</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl bg-white hover:bg-white/90 text-xs font-bold text-black px-6 py-2.5 shadow-md transition-all active:scale-95 cursor-pointer"
              id="idea-detail-done-btn"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
