export default function Header() {
  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6'>
    <h1 className='text-md font-bold tracking-wide'>四季守</h1>
    <nav className='flex gap-4 text-sm'>
      <ul className="flex gap-4 list-none">
        <li>四季守とは</li>
        <li>メニュー</li>
        <li>お問い合わせ</li>
        <li>登録</li>
        <li>ログイン</li>
      </ul>
    </nav>
  </header>
  )
}