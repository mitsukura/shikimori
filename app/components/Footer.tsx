import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { footerNavListItems } from '@/data/navigations'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='sticky top-full w-full border-t mt-10'>
      <div className='flex flex-col items-center justify-center text-muted-foreground p-6 text-sm'>
        <h2>四季守</h2>
        <ul className='flex flex-wrap list-none py-4'>
          {footerNavListItems.map(item => (
            <li key={item.href}>
              <Button variant='ghost' asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <p>&copy; 2025 Shikimori All Rights Reserved.</p>
      </div>
    </footer>
  )
}
