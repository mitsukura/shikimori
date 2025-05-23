'use client'; // クライアントコンポーネントとしてLinkを使用

import { Button } from '@/components/ui/button';
import { Home, Package, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'ホーム', icon: Home },
  { href: '/admin/users', label: 'ユーザー管理', icon: Users },
  { href: '/admin/items', label: '商品管理', icon: Package },
  { href: '/admin/blog', label: 'ブログ記事管理', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">ダッシュボード</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      {/* 必要であればフッターや他の要素を追加 */}
    </aside>
  );
}
