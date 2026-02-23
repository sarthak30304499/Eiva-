// src/lib/supabase.ts
// Client-side Supabase instance (uses anon key only — safe to expose)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase env vars missing. Auth will not work until you set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env')
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '')
