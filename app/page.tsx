import { createClient } from '@/lib/supabase/server'

import Hero from './components/Hero'
import Achievements from './components/Achievements'
import Contact from './components/contact'

export default async function Home() {
  let data = null
  let error = null

  try {
    const supabase = await createClient()
    console.log('Supabaseクライアント作成成功')

    const result = await supabase.from('items').select('*')
    data = result.data
    error = result.error

    if (error) {
      console.error('Supabaseエラー:', error)
    } else {
      console.log('データ取得成功:', data ? `${data.length}件のアイテム` : 'データなし')
    }
  } catch (e) {
    console.error('予期せぬエラーが発生しました:', e)
  }

  return (
    <main className='flex max-w-4xl flex-col gap-16 px-6 py-12'>
      <Hero />
      <Achievements />
      <Contact />
    </main>
  )
}
