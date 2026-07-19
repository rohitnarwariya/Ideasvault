-- Migration to add AI system support columns to the 'ideas' table
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_tags TEXT[];
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_platform TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_content_type TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_keywords TEXT[];
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_status TEXT DEFAULT 'pending';
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS ai_last_processed TIMESTAMPTZ;

-- Backfill existing rows to ensure 'ai_status' defaults to 'pending'
UPDATE ideas SET ai_status = 'pending' WHERE ai_status IS NULL;
