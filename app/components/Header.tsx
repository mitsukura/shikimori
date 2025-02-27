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

export default function Header() {
  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-200 px-6'>
      <h1 className='font-bold'>
        <Button variant='ghost' asChild>
          <Link href='/'>四季守</Link>
        </Button>
      </h1>
      <div className='flex-1'>...</div>
      <nav className='hidden md:block'>
        <ul className='flex list-none'>
          {navListItems.map(item => (
            <li key={item.href}>
              <Button variant='ghost' asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
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
      <div className='flex hidden items-center md:block'>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      {/* <div className='flex hidden items-center md:block'>
        <Button variant='ghost' asChild>
          <Link href='/register'>登録</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/login'>ログイン</Link>
        </Button>
      </div> */}
      <div className='md:hidden'>
        <MobileNav />
      </div>
    </header>
  )
}
