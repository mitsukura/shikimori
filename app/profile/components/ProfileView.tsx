'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ProfileViewProps } from '@/types/profile';



export default function ProfileView({ userData, targetUserId }: ProfileViewProps) {
  const { user, isLoaded } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    // 削除対象のユーザーID
    const userIdToDelete = targetUserId || (user?.id ? user.id : null);
    
    if (!userIdToDelete) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', userIdToDelete);
        
      if (error) {
        console.log('Error deleting profile:', error);
        toast.error('プロフィールの削除に失敗しました');
      } else {
        toast.success('プロフィールを削除しました');
        
        // 管理者ダッシュボードのユーザー一覧ページにリダイレクト
        router.push('/admin/users');
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };
  return (
    <div className="max-w-4xl mt-10 mx-auto p-4 bg-white dark:bg-slate-900/20 rounded-lg shadow dark:shadow-slate-800/80">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">名前</h2>
          <p>{userData.last_name} {userData.first_name}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">メールアドレス</h2>
          <p>{userData.email}</p>
        </div>
        
        {userData.address && (
          <div>
            <h2 className="text-lg font-semibold">住所</h2>
            <p>{userData.address}</p>
          </div>
        )}
        
        {userData.phone && (
          <div>
            <h2 className="text-lg font-semibold">電話番号</h2>
            <p>{userData.phone}</p>
          </div>
        )}
        
        {userData.bio && (
          <div>
            <h2 className="text-lg font-semibold">自己紹介</h2>
            <p className="whitespace-pre-wrap">{userData.bio}</p>
          </div>
        )}
        
        <div className="pt-4 flex gap-4">
          {/* 編集ボタンはユーザー自身または管理者のみ表示 */}
          {isLoaded && !isAdminLoading && (() => {
            const isOwner = user && user.id === targetUserId;
            const canEdit = isOwner || isAdmin;
            
            if (canEdit) {
              return (
                <Link href={targetUserId ? `/profile/${targetUserId}/edit` : '/profile/edit'}>
                  <Button>プロフィールを編集</Button>
                </Link>
              );
            }
            return null;
          })()}
          
          {/* 削除ボタンはユーザー自身または管理者のみ表示 */}
          {isLoaded && !isAdminLoading && (() => {
            const isOwner = user && user.id === targetUserId;
            const canDelete = isOwner || isAdmin;
            
            if (canDelete) {
              return (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">プロフィールを削除</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>プロフィールを削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。プロフィール情報がすべて削除されます。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={loading}>
                        {loading ? '削除中...' : '削除する'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}
