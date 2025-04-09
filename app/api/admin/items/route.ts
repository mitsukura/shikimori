import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils'; // 管理者チェック

export async function GET(_request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  try {
    const body = await request.json();
    
    // 必須フィールドの検証
    if (!body.name || typeof body.price !== 'number' || body.price < 0) {
      return new NextResponse(
        JSON.stringify({ error: '商品名と有効な価格が必要です' }), 
        { status: 400 }
      );
    }

    // 現在の日時を取得
    const now = new Date().toISOString();
    
    // データベース用のオブジェクトを作成
    const itemData = {
      id: crypto.randomUUID(), // UUIDを生成
      name: body.name,
      description: body.description || null,
      price: body.price,
      image_url: body.imageUrl || null,
      category: body.category || null,
      is_available: body.isAvailable !== undefined ? body.isAvailable : true,
      stock: body.stock || 0,
      created_at: now,
      updated_at: now
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
