import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 초기화
 * .env 파일에서 URL과 anon key를 읽어옴
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
