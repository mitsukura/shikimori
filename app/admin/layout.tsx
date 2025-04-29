import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/authUtils';
import AdminSidebar from './components/AdminSidebar';
import MobileAdminNav from './components/MobileAdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* デスクトップ用サイドバー（md以上で表示） */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* モバイル用ナビゲーション（md未満で表示） */}
      <div className="md:hidden border-b sticky top-0 z-10 bg-background">
        <MobileAdminNav />
      </div>
      
      <main className="flex-1 p-4 md:p-6 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
