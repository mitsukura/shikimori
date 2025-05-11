'use client'

import { Button } from '@/components/ui/button'
import { navListItems } from '@/data/navigations'
import Link from 'next/link'
import MobileNav from './mobile-nav'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs'
import { useIsAdmin } from '@/lib/hooks/useIsAdmin' // 管理者判定フックをインポート
import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
  const { isAdmin, isLoading } = useIsAdmin(); // 管理者判定フックを使用
  return (
    <header className='flex h-16 items-center justify-between border-b px-4'>
      <Button variant='ghost' asChild>
        <Link href='/' className="text-3xl font-bold text-black dark:text-white">四季守</Link>
      </Button>
      <div className='flex-1' />
      <nav className='hidden md:block'>
        <ul className='flex list-none items-center'>
          {navListItems.map(item => (
            <li key={item.href}>
              <Button variant='ghost' asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <SignedOut>
        <SignInButton
          mode='modal'
          appearance={{
            elements: {
              rootBox: 'mx-1',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700'
            },
            variables: {
              colorPrimary: '#4f46e5'
            }
          }}
        >
          <Button variant='ghost'>ログイン</Button>
        </SignInButton>
        <SignUpButton
          mode='modal'
          appearance={{
            elements: {
              rootBox: 'mx-1',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700'
            },
            variables: {
              colorPrimary: '#4f46e5'
            }
          }}
        >
          <Button variant='ghost'>登録</Button>
        </SignUpButton>
      </SignedOut>
      {/* ダッシュボードリンク（常時表示） */}
      <SignedIn>
        {!isLoading && isAdmin && (
          <Button variant='ghost' asChild>
            <Link href='/admin'>ダッシュボード</Link>
          </Button>
        )}
        <Button variant='ghost' asChild>
          <Link href='/profile'>プロフィール</Link>
        </Button>
      </SignedIn>
      <div className='md:hidden'>
        <MobileNav />
      </div>
      <div className='ml-4 selection:items-center hidden md:block'>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className='ml-6'>
        <ModeToggle />
      </div>
    </header>
  )
}
