'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';
import { supabase } from '@/lib/supabase/client';
import type { ProfileFormData, ProfileFormProps } from '@/types/profile';

export default function ProfileForm({ initialData, onSuccess, targetUserId }: ProfileFormProps) {
  const { user } = useUser();
  const { isAdmin } = useIsAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: initialData?.first_name || '',
      lastName: initialData?.last_name || '',
      phone: initialData?.phone || '',
      bio: initialData?.bio || '',
      address: initialData?.address || '',
    }
  });

  /**
   * プロフィール情報を更新する
   */
  const onSubmit = async (data: ProfileFormData) => {
    // 編集対象のユーザーID（指定されていなければ現在のユーザー）
    const userIdToUpdate = targetUserId || user?.id;
    
    if (!userIdToUpdate) {
      toast.error('ユーザー情報が取得できませんでした');
      return;
    }
    
    // 自分自身のプロフィールか管理者でない場合は編集不可
    const isOwnProfile = user && user.id === userIdToUpdate;
    if (!isOwnProfile && !isAdmin) {
      toast.error('このプロフィールを編集する権限がありません');
      return;
    }

    setLoading(true);

    try {
      // 更新するデータを準備
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        bio: data.bio,
        address: data.address,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('clerk_id', userIdToUpdate);
        
      if (error) {
        console.error('プロフィール更新エラー:', error.message);
        toast.error('プロフィールの更新に失敗しました');
        return;
      }
      
      toast.success('プロフィールを更新しました');
      if (onSuccess) onSuccess();
      
      // ユーザー詳細ページに戻る
      if (targetUserId) {
        router.push(`/profile/${targetUserId}`);
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('予期せぬエラー:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mt-10 mx-auto p-4 bg-white dark:bg-slate-900/20 rounded-lg shadow dark:shadow-slate-800/80">      <h1 className="heading2">プロフィール{initialData ? '編集' : '登録'}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lastName">姓</Label>
            <Input
              id="lastName"
              autoComplete='off'
              {...register('lastName', { required: '姓は必須です' })}
              placeholder="姓"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstName">名</Label>
            <Input
              id="firstName"
              autoComplete='off'
              {...register('firstName', { required: '名は必須です' })}
              placeholder="名"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">住所</Label>
          <Input
            id="address"
            autoComplete='off'
            {...register('address')}
            placeholder="住所"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete='off'
            {...register('phone')}
            placeholder="電話番号"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">自己紹介</Label>
          <Textarea
            id="bio"
            autoComplete='off'
            {...register('bio')}
            placeholder="自己紹介"
            rows={4}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              // キャンセル時はユーザー詳細ページに戻る
              if (targetUserId) {
                router.push(`/profile/${targetUserId}`);
              } else {
                router.push('/profile');
              }
            }}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'プロフィールを保存中...' : 'プロフィールを保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
