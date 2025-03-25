'use client';

import { useForm } from 'react-hook-form';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type ProfileFormData = {
  displayName: string;
  phone: string;
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  
  // errors と formState は現在使用されていないため、分割代入から除外
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({defaultValues: {
    displayName: '',
    phone: ''
  }});

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // ユーザー情報を取得
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();
      console.log('User data:', userData, 'User error:', userError);
      
      // ユーザーが存在しない場合は作成する
      if (userError || !userData) {
        console.log('User not found, creating new user record');
        
        // 基本的なユーザー情報を取得
        const email = user.primaryEmailAddress?.emailAddress || '';
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const displayName = `${firstName} ${lastName}`;
        
        try {
          // ユーザーを作成
          const { error: createError } = await supabase
            .from('users')
            .insert({
              clerk_id: user.id,
              email,
              first_name: firstName,
              last_name: lastName,
              phone: '',
              // created_at と updated_at はデフォルト値を使用するため省略
            });
          
          if (createError) {
            console.error('Error creating user:', createError);
            toast.error(`ユーザー情報の作成に失敗しました: ${createError.message}`);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Unexpected error creating user:', err);
          toast.error('予期せぬエラーが発生しました');
          setLoading(false);
          return;
        }
        
        // フォームの値をリセット
        setValue('displayName', displayName);
        setValue('phone', '');
        setLoading(false);
        return;
      }
      
      // ユーザーが存在する場合はフォームに値をセット
      setValue('displayName', `${userData.first_name} ${userData.last_name}`);
      setValue('phone', userData.phone || '');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [user, setValue]);

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      if (user) {
        fetchProfile();
      }
    }
  }, [user, fetchProfile]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // ユーザー情報を更新
      const { error } = await supabase
        .from('users')
        .update({
          phone: data.phone,
          // updated_at はデフォルト値を使用するため省略
        })
        .eq('clerk_id', user.id);
        
      if (error) {
        console.error('Error updating user:', error);
        toast.error('プロフィールの更新に失敗しました');
      } else {
        toast.success('プロフィールを更新しました');
        fetchProfile();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return <div className="container mx-auto py-8">読み込み中.....</div>;
  }

  if (!user) {
    return <div className="container mx-auto py-8">ログインしてください</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">基本情報</h2>
          <p>名前: {user.firstName} {user.lastName}</p>
          <p>メールアドレス: {user.primaryEmailAddress?.emailAddress}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">プロフィール情報</h3>
              
              <div>
                <label htmlFor="displayName-input" className="block text-sm font-medium mb-1">表示名 <span className="text-red-500">*</span></label>
                <Input
                  id="displayName-input"
                  {...register('displayName', { required: '表示名は必須です' })}
                  placeholder="表示名を入力してください"
                />
                {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone-input" className="block text-sm font-medium mb-1">電話番号</label>
                <Input
                  id="phone-input"
                  {...register('phone')}
                  placeholder="電話番号を入力してください"
                />
              </div>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '保存中...' : 'プロフィールを保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}