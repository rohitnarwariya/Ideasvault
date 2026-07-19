-- =========================================================================
-- SUPABASE INITIAL SETUP SCRIPT FOR IDEAVAULT
-- Run this script in the SQL Editor of your Supabase Dashboard:
-- https://supabase.com/dashboard/project/_/sql/new
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'collections' Table
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create 'ideas' Table
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    why_saved TEXT,
    url TEXT,
    platform TEXT NOT NULL,
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    voice_note TEXT, -- Base64 encoded audio
    voice_url TEXT,  -- Public URL from Storage
    voice_transcript TEXT,
    voice_duration NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- AI Analysis system support columns
    ai_status TEXT DEFAULT 'pending',
    ai_summary TEXT,
    ai_tags TEXT[],
    ai_platform TEXT,
    ai_content_type TEXT,
    ai_keywords TEXT[],
    ai_last_processed TIMESTAMPTZ
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for Collections
CREATE POLICY "Users can manage their own collections" ON collections
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Create RLS Policies for Ideas
CREATE POLICY "Users can manage their own ideas" ON ideas
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Auto-Provision the 'voice-notes' Storage Bucket
-- (Ensures base64 audio uploads succeed and can be publicly resolved)
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-notes', 'voice-notes', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Allow users to upload and manage their voice files inside the 'voice-notes' bucket
CREATE POLICY "Authenticated users can upload voice notes" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'voice-notes');

CREATE POLICY "Users can manage their own voice notes" ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'voice-notes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can read voice notes" ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'voice-notes');
