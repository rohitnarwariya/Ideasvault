import React from 'react';
import { Plus } from 'lucide-react';
import { Collection, Idea } from '../types';

interface CollectionBarProps {
  collections: Collection[];
  ideas: Idea[];
  selectedCollectionId: string | null; // null for "All"
  onSelectCollection: (id: string | null) => void;
  onOpenCreateModal: () => void;
}

export default function CollectionBar({
  collections,
  ideas,
  selectedCollectionId,
  onSelectCollection,
  onOpenCreateModal,
}: CollectionBarProps) {
  
  // Calculate count for "All"
  const totalCount = ideas.length;

  // Helper to count ideas for a specific collection or matching standard defaults
  const getIdeaCountForCollection = (collection: Collection) => {
    // If it's a default collection, we can match by either ID or name in case schemas differ
    return ideas.filter(idea => {
      if (idea.collection_id === collection.id) return true;
      
      // Secondary fallback match: if collection is default and name matches platform or collection name
      const collNameLower = collection.name.toLowerCase();
      if (collection.is_default) {
        if (collNameLower === 'youtube' && idea.platform === 'youtube') return true;
        if (collNameLower === 'instagram' && idea.platform === 'instagram') return true;
        if (collNameLower === 'pinterest' && idea.platform === 'pinterest') return true;
        if ((collNameLower === 'ideas' || collNameLower === 'random ideas') && (idea.collection_id === collection.id || !idea.collection_id)) return true;
      }
      return false;
    }).length;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Collections
        </h2>
      </div>

      {/* Horizontal scrollable container */}
      <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        
        {/* ⭐ All Chip */}
        <button
          onClick={() => onSelectCollection(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
            selectedCollectionId === null
              ? 'bg-white/15 text-[#EDEDED] border-white/20 shadow-sm'
              : 'bg-white/[0.03] text-white/50 border-white/5 hover:text-white/85 hover:bg-white/[0.06] hover:border-white/10'
          }`}
        >
          <span>⭐</span>
          <span>All</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${
            selectedCollectionId === null ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/30'
          }`}>
            {totalCount}
          </span>
        </button>

        {/* Dynamic Collections Chips */}
        {collections.map((collection) => {
          const isSelected = selectedCollectionId === collection.id;
          const count = getIdeaCountForCollection(collection);
          
          return (
            <button
              key={collection.id}
              onClick={() => onSelectCollection(collection.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-white/15 text-[#EDEDED] border-white/20 shadow-sm'
                  : 'bg-white/[0.03] text-white/50 border-white/5 hover:text-white/85 hover:bg-white/[0.06] hover:border-white/10'
              }`}
            >
              <span className="text-sm leading-none">{collection.icon || '📁'}</span>
              <span>{collection.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${
                isSelected ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/30'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

        {/* Create button chip (last chip as requested) */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-transparent text-white/30 hover:text-white/50 border border-dashed border-white/5 hover:border-white/10 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>➕</span>
          <span>New Collection</span>
        </button>

      </div>
    </div>
  );
}
