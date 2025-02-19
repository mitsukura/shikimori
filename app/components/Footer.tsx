import Link from "next/link";

export default function Footer() {
  return (
    <footer className='sticky top-full items-center border-t p-6 text-sm'>
      <div className='flex flex-col items-center justify-center gap-2 pb-8'>
        <h2>四季守</h2>
        <ul className="flex gap-4 list-none">
          <li>
            
            <Link href="/about">四季守とは</Link>
          </li>
          <li>重機除雪</li>
          <li>重機草刈り（準備中）</li>
          <li>お問い合わせ</li>
        </ul>
        <p>&copy; 2025 Shikimori All Rights Reserved.</p>
      </div>
    </footer>
  )
}
