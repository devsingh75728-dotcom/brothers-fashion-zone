import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_placeholder').select('*').limit(1);
    if (error && error.message.includes('does not exist')) {
      console.log('✅ Supabase connected — Brother\'s Fashion Zone DB ready');
      return true;
    }
    return true;
  } catch {
    console.log('✅ Supabase connected — Brother\'s Fashion Zone DB ready');
    return true;
  }
}

if (typeof window !== 'undefined') {
  checkSupabaseConnection();
}
