'use client';

import { useForm } from 'react-hook-form';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type ProfileFormData = {
  bio: string;
  phone: string;
  address: string;
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // まずユーザーIDを取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', user.id)
      .single();
      
    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      setLoading(false);
      return;
    }
    
    // プロフィール情報を取得
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.id)
      .single();
      
    if (!error && data) {
      setProfile(data);
      setValue('bio', data.bio || '');
      setValue('phone', data.phone || '');
      setValue('address', data.address || '');
    }
    
    setLoading(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    
    // ユーザーIDを取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', user.id)
      .single();
      
    if (userError || !userData) {
      toast.error('ユーザー情報の取得に失敗しました');
      setLoading(false);
      return;
    }
    
    // プロフィール情報を更新
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userData.id,
        bio: data.bio,
        phone: data.phone,
        address: data.address,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });
      
    if (error) {
      toast.error('プロフィールの更新に失敗しました');
    } else {
      toast.success('プロフィールを更新しました');
      fetchProfile();
    }
    
    setLoading(false);
  };

  if (!isLoaded || loading) {
    return <div className="container mx-auto py-8">読み込み中...</div>;
  }

  if (!user) {
    return <div className="container mx-auto py-8">ログインしてください</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">ユーザー情報</h2>
          <p>名前: {user.firstName} {user.lastName}</p>
          <p>メールアドレス: {user.primaryEmailAddress?.emailAddress}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">自己紹介</label>
              <Textarea
                {...register('bio')}
                placeholder="自己紹介を入力してください"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">電話番号</label>
              <Input
                {...register('phone')}
                placeholder="電話番号を入力してください"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">住所</label>
              <Input
                {...register('address')}
                placeholder="住所を入力してください"
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : 'プロフィールを保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}