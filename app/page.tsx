import { createClient } from '@/lib/supabase/server'

import HeroSection from './components/Hero-section'
import { Features } from './components/Features'
import { TestimonialsSection } from './components/Testimonial-section'

import type { Metadata } from 'next';
import Newsletter from './components/Newsletter';

export const metadata: Metadata = {
  title: '四季守 トップページ',
  description: '四季を通じて地域をサポートするサービス'
};

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
    <main className='mx-auto flex flex-col gap-16'>
      <HeroSection />
      <Features />
      <TestimonialsSection />
      <Newsletter />
    </main>
  )
}
