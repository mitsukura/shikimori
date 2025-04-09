import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils';

export async function GET(
  _request: Request,
  { params }: { params: { itemId: string } }
) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  const itemId = params.itemId;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  const itemId = params.itemId;

  try {
    const body = await request.json();
    
    // 更新データの検証
    if (!body || typeof body !== 'object') {
      return new NextResponse(JSON.stringify({ error: '無効なリクエストデータ' }), { status: 400 });
    }

    // データベース用の更新オブジェクトを作成
    const updateData = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.imageUrl !== undefined && { image_url: body.imageUrl }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.isAvailable !== undefined && { is_available: body.isAvailable }),
      ...(body.stock !== undefined && { stock: body.stock }),
      updated_at: new Date().toISOString()
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { itemId: string } }
) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  const itemId = params.itemId;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
