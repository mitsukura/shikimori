import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URLまたはAnon Keyが設定されていません。.env.localファイルを確認してください。')
  }
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}