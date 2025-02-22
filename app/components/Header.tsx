import { Button } from '@/components/ui/button'
import { navListItems } from '@/data/navigations'
import Link from 'next/link'
import MobileNav from './mobile-nav'

export default function Header() {
  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-200 px-6'>
      <h1 className='font-bold'>
        <Button variant='ghost' asChild>
          <Link href='/'>四季守</Link>
        </Button>
      </h1>
      <div className='flex-1'>...</div>
      <nav className='md:block hidden'>
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
      <div className='flex items-center hidden md:block'>
        <Button variant='ghost' asChild>
          <Link href='/register'>登録</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/login'>ログイン</Link>
        </Button>
      </div>
      <div className='md:hidden'>
        <MobileNav />
      </div>
    </header>
  )
}
