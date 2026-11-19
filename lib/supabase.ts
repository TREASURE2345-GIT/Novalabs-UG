import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';

const sessionStorageAdapter = typeof window !== 'undefined' ? window.sessionStorage : undefined;

export const hasSupabaseConfig = isSupabaseConfigured;

export const supabase = hasSupabaseConfig
  ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
      auth: {
        storage: sessionStorageAdapter,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
