'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';
import { supabase } from '@/lib/supabase/client';
import type { ProfileClientProps } from '@/types/profile';

export default function ProfileClient({ mode }: ProfileClientProps) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    bio?: string;
    address?: string;
    created_at: string;
    updated_at: string;
  } | null>(null);
  const [needsCreate, setNeedsCreate] = useState(false);

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
      
      // ユーザーが存在しない場合は作成する
      if (userError || !userData) {
        console.log('User not found, needs creation');
        setNeedsCreate(true);
        setUserData(null);
      } else {
        setUserData(userData);
        setNeedsCreate(false);
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProfile = useCallback(async () => {
    if (!user || !needsCreate) return;
    
    setLoading(true);
    
    try {
      // 基本的なユーザー情報を取得
      const email = user.primaryEmailAddress?.emailAddress || '';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      
      // 現在の日時を取得
      const now = new Date().toISOString();
      
      // メールアドレスで既存ユーザーを確認
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        console.log('User with this email exists, updating clerk_id');
        
        // 既存ユーザーのclerk_idを更新
        const { error: updateError } = await supabase
          .from('users')
          .update({
            clerk_id: user.id,
            first_name: firstName,
            last_name: lastName,
            updated_at: now,
          })
          .eq('id', existingUser.id);
          
        if (updateError) {
          console.log('Error updating user:', updateError);
          toast.error(`ユーザー情報の更新に失敗しました: ${updateError.message}`);
          return;
        }
        
        toast.success('既存ユーザー情報を更新しました');
      } else {
        // ユーザーを新規作成
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: crypto.randomUUID(), // UUIDを手動で生成
            clerk_id: user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone: '',
            created_at: now,
            updated_at: now,
          });
        
        if (createError) {
          console.log('Error creating user:', createError);
          toast.error(`ユーザー情報の作成に失敗しました: ${createError.message}`);
          return;
        }
        
        toast.success('プロフィールを新規作成しました');
      }
      
      // プロフィールを再取得
      fetchProfile();
    } catch (err) {
      console.log('Unexpected error creating user:', err);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [user, needsCreate, fetchProfile]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user, fetchProfile]);

  useEffect(() => {
    if (needsCreate && mode !== 'create') {
      createProfile();
    }
  }, [needsCreate, mode, createProfile]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-slate-900/20 rounded-lg shadow dark:shadow-slate-800/80">
        <h1 className="heading2">プロフィール</h1>
        <p>プロフィールを表示するにはログインしてください。</p>
      </div>
    );
  }

  if (needsCreate || mode === 'create') {
    return <ProfileForm onSuccess={fetchProfile} />;
  }

  if (mode === 'edit' && userData) {
    return <ProfileForm initialData={userData} onSuccess={fetchProfile} />;
  }

  if (userData) {
    return <ProfileView userData={userData} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-slate-800">
      <h1 className="text-2xl font-bold mb-6">プロフィール</h1>
      <p>プロフィール情報の読み込み中にエラーが発生しました。</p>
    </div>
  );
}
