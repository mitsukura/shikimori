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
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // errors は現在使用されていないため、分割代入から除外
  const { register, handleSubmit, setValue, formState } = useForm<ProfileFormData>();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // まずユーザーIDを取得
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
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
        
        // ユーザーを作成
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (createError || !newUser) {
          console.error('Error creating user:', createError);
          toast.error('ユーザー情報の作成に失敗しました');
          setLoading(false);
          return;
        }
        
        // 新しく作成したユーザーIDを使用
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: newUser.id,
            bio: '',
            phone: '',
            address: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error('プロフィール情報の作成に失敗しました');
          setLoading(false);
          return;
        }
        
        // 空のプロフィールデータをセット
        setProfile({
          bio: '',
          phone: '',
          address: ''
        });
        setValue('bio', '');
        setValue('phone', '');
        setValue('address', '');
        setLoading(false);
        return;
      }
      
      // プロフィール情報を取得
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        
        // プロフィールが存在しない場合は作成
        if (error.code === 'PGRST116') {
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: userData.id,
              bio: '',
              phone: '',
              address: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
            toast.error('プロフィール情報の作成に失敗しました');
          } else {
            setProfile({
              bio: '',
              phone: '',
              address: ''
            });
            setValue('bio', '');
            setValue('phone', '');
            setValue('address', '');
          }
        } else {
          toast.error('プロフィール情報の取得に失敗しました');
        }
      } else if (data) {
        setProfile(data);
        setValue('bio', data.bio || '');
        setValue('phone', data.phone || '');
        setValue('address', data.address || '');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
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
        console.error('Error updating profile:', error);
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
              <label htmlFor="bio-input" className="block text-sm font-medium mb-1">自己紹介</label>
              <Textarea
                id="bio-input"
                {...register('bio')}
                placeholder="自己紹介を入力してください"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="phone-input" className="block text-sm font-medium mb-1">電話番号</label>
              <Input
                id="phone-input"
                {...register('phone')}
                placeholder="電話番号を入力してください"
              />
            </div>
            
            <div>
              <label htmlFor="address-input" className="block text-sm font-medium mb-1">住所</label>
              <Input
                id="address-input"
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