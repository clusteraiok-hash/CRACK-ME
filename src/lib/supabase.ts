import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are missing. Check your .env file.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        credentials: 'omit',
      });
    },
  },
});

export async function testSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('goals').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { connected: false, error: error.message };
    }
    console.log('Supabase connected successfully');
    return { connected: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Supabase connection test threw:', err);
    return { connected: false, error: message };
  }
}
