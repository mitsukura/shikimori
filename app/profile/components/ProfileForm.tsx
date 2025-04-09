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
import { supabase } from '@/lib/supabase/client';
import type { ProfileFormData, ProfileFormProps } from '@/types/profile';

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const { user } = useUser();
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
    if (!user) {
      toast.error('ユーザー情報が取得できません');
      return;
    }
    
    setLoading(true);
    
    try {
      // データベース更新用のオブジェクトを作成
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
        .eq('clerk_id', user.id);
        
      if (error) {
        console.error('プロフィール更新エラー:', error.message);
        toast.error('プロフィールの更新に失敗しました');
        return;
      }
      
      toast.success('プロフィールを更新しました');
      if (onSuccess) onSuccess();
      
      router.push('/profile');
    } catch (error) {
      console.error('予期せぬエラー:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-slate-800">
      <h1 className="text-2xl font-bold mb-6">プロフィール{initialData ? '編集' : '登録'}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
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
            onClick={() => router.push('/profile')}
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
