import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ | 四季守',
  description: 'お問い合わせページです。'
}

export default function Page() {
  return (
    <div className='container prose prose-sm mx-auto p-6 dark:prose-invert'>
      <div className='mt-10 flex flex-col items-center justify-center gap-4 p-4'>
        <div className='min-h-[721px] w-full max-w-2xl'>
          <h1 className='heading2'>お問い合わせ</h1>
          <p className='mb-10'>
            お見積りのお問い合わせなどこちらからお問い合わせください。
          </p>
          <form
            action='https://ssgform.com/s/uV0iqmPuFyP0'
            method='post'
            className='flex flex-col gap-4'
          >
            <label htmlFor='name' className='space-y-1'>
              <span>お名前</span>
              <Input type='text' name='name' id='name' required />
            </label>
            <label htmlFor='email' className='space-y-1'>
              <span>メールアドレス</span>
              <Input type='email' name='email' id='email' required />
            </label>
            <label htmlFor='message' className='space-y-1'>
              <span>お問い合わせ内容</span>
              <Textarea name='message' id='message' required />
            </label>
            <Button className='mt-4' variant='default' type='submit'>
              送信する
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
