import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Collection, Idea, Platform } from '../types';

const STORAGE_KEYS = {
  COLLECTIONS: 'ideavault_collections',
  IDEAS: 'ideavault_ideas',
  FAVORITES: 'ideavault_favorites',
};

// Default collections that every user receives
export const DEFAULT_COLLECTIONS: Omit<Collection, 'id'>[] = [
  { name: 'Random Ideas', icon: '💡', is_default: true },
  { name: 'YouTube', icon: '🎥', is_default: true },
  { name: 'Instagram', icon: '📸', is_default: true },
  { name: 'Pinterest', icon: '📌', is_default: true },
];

// Helper to generate IDs for local storage items
const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard mock / sandbox user
export const SANDBOX_USER = {
  id: 'sandbox-user-123',
  email: 'creator@ideavault.io',
  user_metadata: {
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    full_name: 'Inspiration Creator',
  },
};

// Helper function to upload audio file to Supabase Storage and return its public URL
export async function uploadVoiceNote(userId: string, ideaId: string, base64Audio: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    // base64Audio looks like: "data:audio/webm;base64,..."
    const parts = base64Audio.split(',');
    if (parts.length < 2) return null;
    const mimeType = parts[0].split(';')[0].split(':')[1] || 'audio/webm';
    const base64Data = parts[1];

    // Convert base64 to binary buffer
    const binaryStr = atob(base64Data);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const ext = mimeType.split('/')[1] || 'webm';
    const fileName = `${userId}/${ideaId}-${Date.now()}.${ext}`;

    // Try standard bucket names (e.g. voice-notes, voice_notes, audio, ideavault)
    const bucketsToTry = ['voice-notes', 'voice_notes', 'audio', 'ideavault'];
    let lastError: any = null;

    for (const bucket of bucketsToTry) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, bytes.buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
          return publicUrl;
        } else if (error) {
          lastError = error;
        }
      } catch (err) {
        lastError = err;
      }
    }

    console.warn('All bucket uploads failed, fallback to local storage only. Last error:', lastError);
    return null;
  } catch (err) {
    console.error('Error in uploadVoiceNote:', err);
    return null;
  }
}

export const dbService = {
  // --- AUTH SECTION ---
  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
      } catch (err) {
        console.warn('Supabase auth failed, using sandbox session:', err);
        return SANDBOX_USER;
      }
    }
    return SANDBOX_USER;
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // For sandbox, just reload
    window.location.reload();
  },

  // --- COLLECTIONS SECTION ---
  async getCollections(userId: string): Promise<Collection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // If user has no collections, initialize default ones for them
        if (!data || data.length === 0) {
          const initialized = await this.initializeDefaultCollections(userId);
          return initialized;
        }

        return data as Collection[];
      } catch (err) {
        console.warn('Failed to fetch collections from Supabase, falling back to local:', err);
      }
    }

    // Local fallback
    const local = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (!local) {
      return this.initializeLocalDefaultCollections(userId);
    }
    const allCollections = JSON.parse(local) as Collection[];
    const userCollections = allCollections.filter(c => c.user_id === userId);
    if (userCollections.length === 0) {
      return this.initializeLocalDefaultCollections(userId);
    }
    return userCollections;
  },

  async initializeDefaultCollections(userId: string): Promise<Collection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = DEFAULT_COLLECTIONS.map(c => ({
          user_id: userId,
          name: c.name,
          icon: c.icon,
          is_default: c.is_default,
          created_at: new Date().toISOString(),
        }));

        const { data, error } = await supabase
          .from('collections')
          .insert(payload)
          .select();

        if (error) throw error;
        return data as Collection[];
      } catch (err) {
        console.warn('Failed to initialize default collections in Supabase:', err);
      }
    }
    return this.initializeLocalDefaultCollections(userId);
  },

  initializeLocalDefaultCollections(userId: string): Collection[] {
    const list: Collection[] = DEFAULT_COLLECTIONS.map(c => ({
      id: generateId(),
      user_id: userId,
      name: c.name,
      icon: c.icon,
      is_default: c.is_default,
      created_at: new Date().toISOString(),
    }));
    const local = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    const existing = local ? JSON.parse(local) as Collection[] : [];
    const filteredExisting = existing.filter(c => c.user_id !== userId);
    const updated = [...filteredExisting, ...list];
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
    return list;
  },

  async createCollection(userId: string, name: string, icon: string): Promise<Collection> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('collections')
          .insert({
            user_id: userId,
            name,
            icon,
            is_default: false,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data as Collection;
      } catch (err) {
        console.warn('Failed to create collection in Supabase, using local:', err);
      }
    }

    // Local
    const local = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    const allCollections = local ? JSON.parse(local) as Collection[] : [];
    const newCollection: Collection = {
      id: generateId(),
      user_id: userId,
      name,
      icon,
      is_default: false,
      created_at: new Date().toISOString(),
    };
    allCollections.push(newCollection);
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(allCollections));
    return newCollection;
  },

  async deleteCollection(userId: string, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('collections')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Failed to delete collection from Supabase, using local:', err);
      }
    }

    // Local
    const local = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (local) {
      const allCollections = JSON.parse(local) as Collection[];
      const updated = allCollections.filter(c => !(c.id === id && c.user_id === userId));
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
    }
    return true;
  },

  // --- IDEAS SECTION ---
  async getIdeas(userId: string): Promise<Idea[]> {
    // Get favorites list from local storage to merge with ideas
    const favsLocal = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favoriteIds: string[] = favsLocal ? JSON.parse(favsLocal) : [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Load any locally cached voice notes to merge in case Supabase column was missing
        const voiceCache = localStorage.getItem('ideavault_voice_notes') || '{}';
        const cacheObj = JSON.parse(voiceCache);

        return (data as Idea[]).map(idea => {
          const cached = cacheObj[idea.id] || {};
          const cachedNote = typeof cached === 'string' ? cached : cached.voice_note;
          const cachedUrl = typeof cached === 'object' ? cached.voice_url : undefined;
          const cachedTranscript = typeof cached === 'object' ? cached.voice_transcript : undefined;
          const cachedDuration = typeof cached === 'object' ? cached.voice_duration : undefined;

          return {
            ...idea,
            voice_note: idea.voice_note || cachedNote,
            voice_url: idea.voice_url || cachedUrl,
            voice_transcript: idea.voice_transcript || cachedTranscript,
            voice_duration: idea.voice_duration || cachedDuration,
            is_favorite: favoriteIds.includes(idea.id) || (idea as any).is_favorite || false,
          };
        });
      } catch (err) {
        console.warn('Failed to fetch ideas from Supabase, falling back to local:', err);
      }
    }

    // Local
    const local = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (!local) return [];
    
    const ideas = JSON.parse(local) as Idea[];
    const userIdeas = ideas.filter(idea => idea.user_id === userId);
    return userIdeas.map(idea => ({
      ...idea,
      is_favorite: favoriteIds.includes(idea.id),
    }));
  },

  async createIdea(
    userId: string,
    title: string,
    whySaved: string,
    url: string,
    platform: Platform,
    collectionId: string,
    voiceNote?: string,
    voiceTranscript?: string,
    voiceDuration?: number
  ): Promise<Idea> {
    let voiceUrl: string | null = null;

    if (isSupabaseConfigured && supabase && voiceNote) {
      try {
        const tempId = Math.random().toString(36).substring(2, 11);
        const uploadedUrl = await uploadVoiceNote(userId, tempId, voiceNote);
        if (uploadedUrl) {
          voiceUrl = uploadedUrl;
        }
      } catch (err) {
        console.warn('Error uploading voice note during idea creation:', err);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Enforce user_id equals current user ID retrieved from Supabase auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const activeUserId = authUser?.id || userId;

        const { data, error } = await supabase
          .from('ideas')
          .insert({
            user_id: activeUserId,
            title,
            why_saved: whySaved,
            url,
            platform,
            collection_id: collectionId,
            voice_note: voiceNote,
            voice_url: voiceUrl || undefined,
            voice_transcript: voiceTranscript,
            voice_duration: voiceDuration,
            created_at: new Date().toISOString(),
            ai_status: 'pending',
          })
          .select()
          .single();

        if (error) {
          // If any of the new columns don't exist, fallback to basic insert
          console.warn('Supabase table missing columns, trying fallback:', error.message);
          const { data: dataFallback, error: errorFallback } = await supabase
            .from('ideas')
            .insert({
              user_id: activeUserId,
              title,
              why_saved: whySaved,
              url,
              platform,
              collection_id: collectionId,
              created_at: new Date().toISOString(),
              ai_status: 'pending',
            })
            .select()
            .single();

          if (errorFallback) throw errorFallback;
          
          const returnedIdea = dataFallback as Idea;
          // Store voice details locally in localStorage so that we preserve them even if columns are missing
          const voiceCache = localStorage.getItem('ideavault_voice_notes') || '{}';
          const cacheObj = JSON.parse(voiceCache);
          cacheObj[returnedIdea.id] = {
            voice_note: voiceNote,
            voice_url: voiceUrl,
            voice_transcript: voiceTranscript,
            voice_duration: voiceDuration,
          };
          localStorage.setItem('ideavault_voice_notes', JSON.stringify(cacheObj));

          returnedIdea.voice_note = voiceNote;
          returnedIdea.voice_url = voiceUrl || undefined;
          returnedIdea.voice_transcript = voiceTranscript;
          returnedIdea.voice_duration = voiceDuration;
          return returnedIdea;
        }

        return data as Idea;
      } catch (err) {
        console.warn('Failed to create idea in Supabase, using local:', err);
      }
    }

    // Local
    const local = localStorage.getItem(STORAGE_KEYS.IDEAS);
    const allIdeas = local ? JSON.parse(local) as Idea[] : [];
    const newIdea: Idea = {
      id: generateId(),
      user_id: userId,
      title,
      why_saved: whySaved,
      url,
      platform,
      collection_id: collectionId,
      created_at: new Date().toISOString(),
      voice_note: voiceNote,
      voice_url: voiceUrl || undefined,
      voice_transcript: voiceTranscript,
      voice_duration: voiceDuration,
      ai_status: 'pending',
    };
    allIdeas.unshift(newIdea);
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(allIdeas));
    return newIdea;
  },

  async deleteIdea(userId: string, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('ideas')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Failed to delete idea from Supabase, using local:', err);
      }
    }

    // Local
    const local = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (local) {
      const allIdeas = JSON.parse(local) as Idea[];
      const updated = allIdeas.filter(i => !(i.id === id && i.user_id === userId));
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(updated));
    }
    return true;
  },

  async updateIdeaAI(userId: string, id: string, updates: Partial<Idea>): Promise<Idea | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .update(updates)
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data as Idea;
      } catch (err) {
        console.warn('Failed to update idea in Supabase, using local:', err);
      }
    }

    // Local
    const local = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (local) {
      const allIdeas = JSON.parse(local) as Idea[];
      const ideaIndex = allIdeas.findIndex(i => i.id === id && i.user_id === userId);
      if (ideaIndex !== -1) {
        allIdeas[ideaIndex] = {
          ...allIdeas[ideaIndex],
          ...updates,
        };
        localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(allIdeas));
        return allIdeas[ideaIndex];
      }
    }
    return null;
  },

  // Toggle favorite (stored in localStorage to be schema-safe in case DB doesn't have the column)
  async toggleFavorite(ideaId: string): Promise<boolean> {
    const favsLocal = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    let favoriteIds: string[] = favsLocal ? JSON.parse(favsLocal) : [];

    let isFav = false;
    if (favoriteIds.includes(ideaId)) {
      favoriteIds = favoriteIds.filter(id => id !== ideaId);
    } else {
      favoriteIds.push(ideaId);
      isFav = true;
    }

    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
    return isFav;
  },
};
