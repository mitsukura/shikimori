'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { navListItems } from '@/data/navigations'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function MobileNav() {
const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='icon' variant='outline'>
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent>
      <SheetTitle>メニュー</SheetTitle>
        <ul className='flex list-none flex-col'>
          {navListItems.map(item => (
            <li key={item.href} className='my-2'>
              <Button variant='ghost' asChild onClick={() => setOpen(false)}>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <div className='grid grid-cols-2 gap-2 sticky top-full'>
          <Button variant='ghost' asChild onClick={() => setOpen(false)}>
            <Link href='/register'>登録</Link>
          </Button>
          <Button variant='ghost' asChild onClick={() => setOpen(false)}>
            <Link href='/login'>ログイン</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
