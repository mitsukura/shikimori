import { supabase } from '../supabase';
import type { Database } from '@/types/supabase';

export type Post = Database['public']['Tables']['posts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

/**
 * 記事一覧を取得する
 * @param limit 取得件数
 * @param offset オフセット
 * @returns 記事一覧
 */
export async function getPosts(limit = 10, offset = 0): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('記事一覧の取得に失敗しました:', error);
    return [];
  }

  return data || [];
}

/**
 * カテゴリ別の記事一覧を取得する
 * @param categoryId カテゴリID
 * @param limit 取得件数
 * @param offset オフセット
 * @returns カテゴリ別の記事一覧
 */
export async function getPostsByCategory(categoryId: number, limit = 10, offset = 0): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('categoryId', categoryId)
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(`カテゴリID ${categoryId} の記事一覧の取得に失敗しました:`, error);
    return [];
  }

  return data || [];
}

/**
 * 記事の詳細を取得する
 * @param id 記事ID
 * @returns 記事の詳細
 */
export async function getPostById(id: number): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`記事ID ${id} の詳細の取得に失敗しました:`, error);
    return null;
  }

  return data;
}

/**
 * カテゴリ一覧を取得する
 * @returns カテゴリ一覧
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('カテゴリ一覧の取得に失敗しました:', error);
    return [];
  }

  return data || [];
}
