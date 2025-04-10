'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
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



export default function ProfileView({ userData }: ProfileViewProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', user.id);
        
      if (error) {
        console.log('Error deleting profile:', error);
        toast.error('プロフィールの削除に失敗しました');
      } else {
        toast.success('プロフィールを削除しました');
        window.location.reload();
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
          <p>{userData.first_name} {userData.last_name}</p>
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
          <Link href="/profile/edit">
            <Button>プロフィールを編集</Button>
          </Link>
          
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
        </div>
      </div>
    </div>
  );
}
