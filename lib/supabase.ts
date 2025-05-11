import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabaseクライアントの初期化
// 環境変数から接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの作成
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
