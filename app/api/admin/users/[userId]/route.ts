import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  const userId = params.userId;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
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
  { params }: { params: { userId: string } }
) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  const userId = params.userId;

  try {
    const body = await request.json();
    
    // 更新データの検証
    if (!body || typeof body !== 'object') {
      return new NextResponse(JSON.stringify({ error: '無効なリクエストデータ' }), { status: 400 });
    }

    // 更新時刻を追加
    const updateData = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
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
  request: Request,
  { params }: { params: { userId: string } }
) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: '許可されていません' }), { status: 403 });
  }

  const userId = params.userId;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
