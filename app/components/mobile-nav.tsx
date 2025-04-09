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
import { useState, useEffect } from 'react'
import { SignedIn } from '@clerk/nextjs'
import { useIsAdmin } from '@/lib/hooks/useIsAdmin'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAdmin, isLoading } = useIsAdmin()

  // クライアントサイドのみで実行
  useEffect(() => {
    setMounted(true)
  }, [])

  // サーバーサイドとクライアントサイドで一貫したコンテンツ
  const mobileMenuButton = (
    <Button size='icon' variant='outline'>
      <Menu size={18} />
    </Button>
  )

  // サーバーサイドレンダリング時は最小限の構造のみを返す
  if (!mounted) {
    return mobileMenuButton
  }

  // クライアントサイドでのみ完全なメニューを表示
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {mobileMenuButton}
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
          {/* 管理者リンクの条件付き表示 */}
          <SignedIn>
            {mounted && !isLoading && isAdmin && (
              <li className='my-2'>
                <Button variant='ghost' asChild onClick={() => setOpen(false)}>
                  <Link href='/admin'>管理</Link>
                </Button>
              </li>
            )}
          </SignedIn>
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
