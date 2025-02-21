import { Button } from '@/components/ui/button'
import { footerNavListItems } from '@/data/navigations'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='sticky top-full items-center border-t p-6 text-sm'>
      <div className='flex flex-col items-center justify-center gap-2 pb-8 text-muted-foreground'>
        <h2>四季守</h2>
        <ul className='flex list-none gap-4'>
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
