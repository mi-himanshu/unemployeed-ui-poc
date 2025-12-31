/**
 * @deprecated This file is deprecated. All authentication now goes through the API Gateway.
 * The frontend should use the API Gateway endpoints instead of directly calling Supabase.
 * 
 * This file is kept for reference but should not be used in new code.
 * See: web-app/contexts/AuthContext.tsx for the new authentication implementation.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

