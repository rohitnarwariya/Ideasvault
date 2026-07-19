import { createClient } from '@supabase/supabase-js';

// Read from environment variables, or fallback to localStorage if they've configured it in-app
const getSupabaseCredentials = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, source: 'env' };
  }
  
  const localUrl = localStorage.getItem('ideavault_supabase_url') || '';
  const localKey = localStorage.getItem('ideavault_supabase_key') || '';
  
  if (localUrl && localKey) {
    return { url: localUrl, key: localKey, source: 'local' };
  }
  
  return null;
};

const creds = getSupabaseCredentials();

export const isSupabaseConfigured = creds !== null;
export const credentialsSource = creds?.source || null;

export const supabase = isSupabaseConfigured && creds
  ? createClient(creds.url, creds.key)
  : null;

// Helper to save manual credentials and reload
export const saveCredentials = (url: string, key: string) => {
  if (!url || !key) {
    localStorage.removeItem('ideavault_supabase_url');
    localStorage.removeItem('ideavault_supabase_key');
  } else {
    localStorage.setItem('ideavault_supabase_url', url);
    localStorage.setItem('ideavault_supabase_key', key);
  }
  window.location.reload();
};
