import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Library, RefreshCw, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import CollectionBar from '../components/CollectionBar';
import IdeaCard from '../components/IdeaCard';
import IdeaDetailModal from '../components/IdeaDetailModal';
import CreateCollectionModal from '../components/CreateCollectionModal';
import SaveInspirationModal from '../components/SaveInspirationModal';
import { dbService } from '../services/dbService';
import { Collection, Idea, Platform } from '../types';
import { aiQueue } from '../lib/ai/queue';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

// Sample seeds to populate the sandbox beautifully on first load
const SAMPLE_IDEAS_SEED = [
  {
    title: "Apple Style Kinetic Typography Hooks",
    url: "https://www.youtube.com/watch?v=kinetic-typography-sample",
    platform: "youtube" as Platform,
    why_saved: "This typography stretch transition in the first 2 seconds creates intense curiosity. The subtle bounce feels responsive, mirroring speech cadences.",
    boardName: "YouTube"
  },
  {
    title: "Linear App Dashboard Design Patterns",
    url: "https://linear.app",
    platform: "website" as Platform,
    why_saved: "The dark mode mesh grid background adds incredible depth without cluttering the UI. Floating card elements with glowing border paths feel premium.",
    boardName: "Random Ideas"
  },
  {
    title: "Minimalist Grid Layout & Photo Overlays",
    url: "https://pinterest.com/pin/bauhaus-grids",
    platform: "pinterest" as Platform,
    why_saved: "Brilliant combination of Bauhaus spacing rules and high-contrast color blocks. Ideal reference for styling a premium portfolio card grid.",
    boardName: "Pinterest"
  },
  {
    title: "Dynamic Swipe Transitions for Reels",
    url: "https://instagram.com/reel/creative-transition",
    platform: "instagram" as Platform,
    why_saved: "Using quick, matching frame focal movements. It keeps the viewer engaged during structural cuts, making simple concepts feel dramatic.",
    boardName: "Instagram"
  }
];

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Sort collections: first "Random Ideas", then "YouTube", then "Instagram", then "Pinterest", then custom collections
  const sortedCollections = React.useMemo(() => {
    const getSystemIndex = (name: string) => {
      const lower = name.toLowerCase();
      if (lower === 'random ideas' || lower === 'ideas') return 0;
      if (lower === 'youtube') return 1;
      if (lower === 'instagram') return 2;
      if (lower === 'pinterest') return 3;
      return -1;
    };

    return [...collections].sort((a, b) => {
      const aIndex = getSystemIndex(a.name);
      const bIndex = getSystemIndex(b.name);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });
  }, [collections]);
  
  // Loading & State
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals Open State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  // Load Collections and Ideas
  const loadData = async () => {
    setIsLoading(true);
    try {
      const userId = user?.id || 'sandbox-user';
      
      // Fetch collections
      const fetchedCollections = await dbService.getCollections(userId);
      setCollections(fetchedCollections);

      // Fetch ideas
      const fetchedIdeas = await dbService.getIdeas(userId);
      setIdeas(fetchedIdeas);

      // Start processing pending ideas
      aiQueue.processPending(userId, fetchedIdeas);
    } catch (err) {
      console.error("Error loading IdeaVault data:", err);
      showToast("Error loading workspace data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Register real-time AI processing queue listener
  useEffect(() => {
    if (!user) return;
    const userId = user.id || 'sandbox-user';
    aiQueue.setUserId(userId);

    const unsubscribe = aiQueue.registerListener(async (ideaId, status) => {
      try {
        const updatedIdeas = await dbService.getIdeas(userId);
        setIdeas(updatedIdeas);

        setSelectedIdea(prev => {
          if (prev && prev.id === ideaId) {
            return updatedIdeas.find(i => i.id === ideaId) || prev;
          }
          return prev;
        });
      } catch (err) {
        console.error('Error in queue update listener:', err);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Seeding Sample/Demo data
  const handleSeedDemoData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userId = user.id;
      
      // Ensure collections exist
      const activeCollections = collections.length > 0 
        ? collections 
        : await dbService.getCollections(userId);

      // Save each seed idea
      for (const seed of SAMPLE_IDEAS_SEED) {
        // Find matching collection ID
        const targetColl = activeCollections.find(
          c => c.name.toLowerCase() === seed.boardName.toLowerCase()
        ) || activeCollections[0];

        if (targetColl) {
          await dbService.createIdea(
            userId,
            seed.title,
            seed.why_saved,
            seed.url,
            seed.platform,
            targetColl.id
          );
        }
      }

      await loadData();
      showToast("Created sample inspirations! ✨");
    } catch (err) {
      console.error(err);
      showToast("Failed to seed sample data");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Creation of New Collection
  const handleCreateCollection = async (name: string, icon: string) => {
    if (!user) return;
    try {
      const newColl = await dbService.createCollection(user.id, name, icon);
      setCollections((prev) => [...prev, newColl]);
      showToast(`Board "${name}" created! 📁`);
    } catch (err) {
      console.error(err);
      showToast("Error creating collection");
    }
  };

  // Trigger Saving of New Inspiration
  const handleSaveInspiration = async (
    title: string,
    whySaved: string,
    url: string,
    platform: Platform,
    collectionId: string,
    voiceNote?: string,
    voiceTranscript?: string,
    voiceDuration?: number
  ) => {
    if (!user) return;
    try {
      const newIdea = await dbService.createIdea(
        user.id,
        title,
        whySaved,
        url,
        platform,
        collectionId,
        voiceNote,
        voiceTranscript,
        voiceDuration
      );
      setIdeas((prev) => [newIdea, ...prev]);
      showToast("Inspiration locked in the vault! 🔒");
      
      // Enqueue the newly created idea for background AI processing
      aiQueue.enqueue(newIdea.id);
    } catch (err) {
      console.error(err);
      showToast("Error saving inspiration");
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (ideaId: string) => {
    try {
      const isFav = await dbService.toggleFavorite(ideaId);
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, is_favorite: isFav } : idea
        )
      );
      showToast(isFav ? "Added to Favorites ⭐" : "Removed from Favorites");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Idea
  const handleDeleteIdea = async (ideaId: string) => {
    if (!user) return;
    try {
      await dbService.deleteIdea(user.id, ideaId);
      setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
      showToast("Inspiration removed from vault");
    } catch (err) {
      console.error(err);
      showToast("Error deleting idea");
    }
  };

  // Filter & Search Logic
  const filteredIdeas = ideas.filter((idea) => {
    // 1. Filter by Selected Board / Collection
    if (selectedCollectionId !== null) {
      const activeCollection = collections.find(c => c.id === selectedCollectionId);
      
      // Strict matching on custom collection ID
      if (idea.collection_id === selectedCollectionId) {
        return true;
      }

      // Secondary default fallback match if default boards are in play
      if (activeCollection && activeCollection.is_default) {
        const boardLowerName = activeCollection.name.toLowerCase();
        if (boardLowerName === 'youtube' && idea.platform === 'youtube') return true;
        if (boardLowerName === 'instagram' && idea.platform === 'instagram') return true;
        if (boardLowerName === 'pinterest' && idea.platform === 'pinterest') return true;
        if (boardLowerName === 'ideas' && idea.collection_id === selectedCollectionId) return true;
      }

      return false;
    }
    return true;
  }).filter((idea) => {
    // 2. Filter by search query
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesTitle = idea.title.toLowerCase().includes(query);
    const matchesWhy = idea.why_saved.toLowerCase().includes(query);
    const matchesPlatform = idea.platform.toLowerCase().includes(query);
    
    // Look up collection name for this idea
    const itemCollection = collections.find(c => c.id === idea.collection_id);
    const matchesCollection = itemCollection
      ? itemCollection.name.toLowerCase().includes(query)
      : false;

    return matchesTitle || matchesWhy || matchesPlatform || matchesCollection;
  });

  // Global keyboard shortcuts listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in inputs or textareas
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (key === 'n') {
        e.preventDefault();
        setIsSaveModalOpen(true);
      } else if (key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      } else if (key === 'f') {
        e.preventDefault();
        // Cycle boards or clear board
        setSelectedCollectionId(null);
        showToast("Cleared filters: Viewing all boards");
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [collections]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col font-sans selection:bg-white/10 selection:text-[#EDEDED]">
      
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 shadow-2xl text-xs font-semibold text-[#EDEDED] backdrop-blur-md"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <Header 
        user={user} 
        onLogout={onLogout} 
      />

      {/* Hero Panel */}
      <Hero onOpenSaveModal={() => setIsSaveModalOpen(true)} />

      {/* Primary Dashboard Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Search Bar section */}
        <section className="max-w-2xl mx-auto w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {/* Collection Bar section */}
        <section className="w-full">
          <CollectionBar 
            collections={sortedCollections}
            ideas={ideas}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={setSelectedCollectionId}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        </section>

        {/* Content Area - Grid Panel */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {selectedCollectionId 
                ? `${sortedCollections.find(c => c.id === selectedCollectionId)?.icon || '📁'} ${sortedCollections.find(c => c.id === selectedCollectionId)?.name} Board`
                : '⭐ All Locked Inspirations'}
            </h3>
            
            <span className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/10 rounded-md px-2.5 py-0.5">
              Showing {filteredIdeas.length} of {ideas.length}
            </span>
          </div>

          {isLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-white/25" />
              <span className="text-xs font-mono tracking-wider uppercase">Unlocking Vault...</span>
            </div>
          ) : filteredIdeas.length > 0 ? (
            /* Ideas Responsive Bento Grid */
            <motion.div 
              id="ideas-grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    collections={sortedCollections}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteIdea}
                    onSelectCard={setSelectedIdea}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty state when no ideas exist */
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
              <Library className="h-8 w-8 text-white/15 mb-3" />
              <h4 className="text-sm font-semibold text-white/70">
                {searchQuery ? 'No matching search results' : 'Your Inspiration Vault is empty'}
              </h4>
              <p className="mt-1 text-xs text-white/40 max-w-xs font-light leading-relaxed">
                {searchQuery 
                  ? 'Try adjusting your terms or browse a different board category.' 
                  : 'Start capturing reference ideas from YouTube, Instagram, and more, and record exactly WHY they matter.'}
              </p>
              
              {!searchQuery && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="rounded-full bg-white text-black hover:bg-white/90 px-4 py-2 text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    + Save Inspiration
                  </button>
                  <button
                    onClick={handleSeedDemoData}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white px-4 py-2 text-xs font-medium transition-all cursor-pointer hover:bg-white/10"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    <span>Load Demo Sandbox Data</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Bottom Shortcut Legend */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="px-4 py-2 border border-white/5 rounded-full bg-white/[0.02] flex items-center gap-6 select-none shadow-sm">
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/60 leading-none">N</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-medium">New Inspiration</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/60 leading-none">F</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-medium">Reset Filters</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/60 leading-none">/</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-medium">Search</span>
            </div>
          </div>
        </div>

      </main>

      {/* Subtle Premium Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-[11px] text-white/30 bg-[#0A0A0A] select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>IdeaVault &copy; 2026. Made with Precision for Creators.</span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-white/20">v1.0.0 (Clean Architecture)</span>
          </div>
        </div>
      </footer>

      {/* MODALS ENSEMBLE */}
      
      {/* 1. Save Inspiration Modal */}
      <SaveInspirationModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        collections={sortedCollections}
        onSave={handleSaveInspiration}
        onTriggerCreateCollection={() => {
          setIsSaveModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />

      {/* 2. Create Custom Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCollection}
      />

      {/* 3. Detailed View Modal */}
      <IdeaDetailModal
        isOpen={selectedIdea !== null}
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
        collections={sortedCollections}
        onDelete={handleDeleteIdea}
      />

    </div>
  );
}
