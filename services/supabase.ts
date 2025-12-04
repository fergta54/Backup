import { createClient } from '@supabase/supabase-js';

// NOTA: En un entorno real, estas variables vendrían de process.env
// Como es un prototipo, dejamos strings vacíos para evitar crash inicial.
// La App usará el modo "Mock" si detecta que no hay keys.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = () => !!supabase;