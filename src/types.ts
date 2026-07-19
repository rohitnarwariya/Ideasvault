export type Platform = 'youtube' | 'instagram' | 'pinterest' | 'reddit' | 'x' | 'website' | 'other';

export interface Collection {
  id: string;
  user_id?: string;
  name: string;
  icon: string; // Emoji character or icon name
  is_default: boolean;
  created_at?: string;
}

export interface Idea {
  id: string;
  user_id?: string;
  title: string;
  why_saved: string;
  url: string;
  platform: Platform;
  collection_id: string;
  is_favorite?: boolean;
  created_at?: string;
  voice_note?: string; // Base64 Audio data URL
  voice_url?: string;
  voice_transcript?: string;
  voice_duration?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_platform?: string;
  ai_content_type?: string;
  ai_keywords?: string[];
  ai_status?: string;
  ai_last_processed?: string;
}
