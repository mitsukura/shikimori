import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from '../../components/ProfileClient';
import { isAdmin } from '@/lib/authUtils';

export const metadata = {
  title: 'プロフィール編集 | 四季森',
  description: 'ユーザープロフィール情報の編集',
};

export default async function ProfileEditPage({ params }: { params: { clerkId: string } }) {
  const { userId } = await auth();
  const { clerkId } = await params;
  const targetUserId = clerkId;
  
  // ユーザーが存在するか確認
  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', targetUserId)
    .single();
  
  // ユーザーが見つからない場合は404
  if (error || !user) {
    notFound();
  }
  
  // 自分自身のプロフィールか管理者かどうかをチェック
  const isOwnProfile = userId === targetUserId;
  const userIsAdmin = await isAdmin();
  
  // 権限チェック（自分のプロフィールか管理者のみ編集可能）
  if (!isOwnProfile && !userIsAdmin) {
    // 権限がない場合は404を返す
    notFound();
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 prose prose-sm dark:prose-invert">

      <Suspense fallback={<div>読み込み中...</div>}>
        <ProfileClient mode="edit" targetUserId={targetUserId} />
      </Suspense>
    </div>
  );
}
