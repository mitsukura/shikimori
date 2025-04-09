'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase/client';

export function useIsAdmin() {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAdminStatus = useCallback(async () => {
    if (!isLoaded || !user) {
      // Clerkのユーザー情報が読み込み中または存在しない場合
      setIsLoading(!isLoaded); // isLoadedがfalseの間はローディング中
      if (isLoaded && !user) { // 読み込み完了したがユーザーなし
        setIsAdmin(false);
        setIsLoading(false);
      }
      return;
    }

    // Clerkユーザー情報はあるが、管理者ステータスをこれから取得
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('clerk_id', user.id)
        .single();

      if (error) {
        // Supabaseにユーザーが見つからない、または他のエラー
        console.warn('Admin status check failed:', error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin === true);
      }
    } catch (err) {
      console.error('Unexpected error fetching admin status:', err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]); // useCallbackでメモ化された関数を依存配列に入れる

  return { isAdmin, isLoading };
}
