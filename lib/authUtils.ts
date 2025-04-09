import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server'; // サーバーサイド用Supabaseクライアント

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) {
    return false; // 未認証ユーザーは管理者ではない
  }

  try {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('clerk_id', userId) // clerk_idで検索
      .single();

    if (error || !user) {
      console.error('Error fetching user admin status:', error?.message);
      return false;
    }

    return user.is_admin === true;
  } catch (err) {
    console.error('Unexpected error in isAdmin:', err);
    return false;
  }
}
