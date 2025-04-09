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
    <header className='flex h-16 items-center justify-between border-b px-6'>
      <h1 className='font-bold'>
        <Button variant='ghost' asChild>
          <Link href='/'>四季守</Link>
        </Button>
      </h1>
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
          {/* 管理者リンクの条件付き表示 */}
          <SignedIn>
            {!isLoading && isAdmin && (
              <li>
                <Button variant='ghost' asChild>
                  <Link href='/admin'>ダッシュボード</Link>
                </Button>
              </li>
            )}
          </SignedIn>
        </ul>
      </nav>
      <SignedIn>
        <div className='mr-4'>
          <Button variant='ghost' asChild>
            <Link href='/profile'>プロフィール登録</Link>
          </Button>
        </div>
      </SignedIn>
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
      <div className='items-center hidden md:block'>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className='md:hidden'>
        <MobileNav />
      </div>
      <div className='ml-2'>
        <ModeToggle />
      </div>
    </header>
  )
}
