import { createClient } from '@/lib/supabase/server'

import Hero from './components/Hero'
import Achievements from './components/Achievements'
import Contact from './components/contact'

export default async function Home() {
  let data = null;
  let error = null;
  
  try {
    console.log('Supabaseクライアントを作成中...')
    const supabase = await createClient()
    console.log('Supabaseクライアント作成完了')
    
    console.log('itemsテーブルからデータを取得中...')
    const result = await supabase.from('items').select()
    console.log("result", result)
    data = result.data;
    error = result.error;
    
    console.log('取得結果:', data, 'エラー:', error)
    
    if (error) {
      console.error('Supabaseエラー:', error)
    }
  } catch (e) {
    console.error('予期せぬエラーが発生しました:', e)
  }
  
  return (
    <main className='flex flex-col max-w-4xl gap-16 px-6 py-12'>
      <Hero />
      <Achievements />
      <Contact />
    </main>
  )
}
