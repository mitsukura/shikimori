import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from '../components/ProfileClient';
import { isAdmin } from '@/lib/authUtils';

export const metadata = {
  title: 'プロフィール | 四季森',
  description: 'ユーザープロフィール情報',
};

export default async function ProfilePage({ params }: { params: { clerkId: string } }) {
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
  
  if (error || !user) {
    notFound();
  }
  
  const isOwnProfile = userId === targetUserId;
  const userIsAdmin = await isAdmin();
  
  if (!isOwnProfile && !userIsAdmin) {
    notFound();
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 prose prose-sm dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
      <Suspense fallback={<div>読み込み中...</div>}>
        <ProfileClient mode="view" targetUserId={targetUserId} />
      </Suspense>
    </div>
  );
}
