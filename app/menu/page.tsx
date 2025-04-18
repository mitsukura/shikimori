
import { createClient } from '@/lib/supabase/server';
import type { Item } from '@/types/item';
import type { Metadata } from 'next';
import MenuListClient from './components/MenuListClient';

export const metadata: Metadata = {
  title: 'メニュー | 四季守',
  description: '当店で提供している美味しいメニューの一覧をご覧いただけます。',
};

export default async function Page() {
  let items: Item[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    items = data || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    fetchError = '商品の読み込み中にエラーが発生しました。';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="heading2">メニュー一覧</h1>
      <p className="text-sm text-muted-foreground mb-10">
        以下の商品は、当店で提供している商品です。
      </p>

      {fetchError && <p className="text-red-500">{fetchError}</p>}

      {!fetchError && (!items || items.length === 0) && (
        <p>現在、表示できる商品はありません。</p>
      )}

      {items && items.length > 0 && (
        <MenuListClient items={items} />
      )}
    </div>
  );
}