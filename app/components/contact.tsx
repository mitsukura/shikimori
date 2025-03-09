'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  return (
    <div className='container mx-auto prose prose-sm'>
      <div className='flex flex-col gap-4 p-4'>
        <h2>お問い合わせ</h2>
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
          <Button variant='default' type='submit'>
            送信する
          </Button>
        </form>
      </div>
    </div>
  )
}
