import { createBrowserClient } from '@supabase/ssr'

// クライアントサイドで使用するためのsupabaseインスタンスを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 環境変数が設定されているか確認（実行時）
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Supabase URLまたはAnon Keyが設定されていません。.env.localファイルを確認してください。')
}

// 直接使用できるsupabaseインスタンスをエクスポート
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// 関数としても提供（必要に応じて使用）
export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}