import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // フォームデータからファイルを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが提供されていません' },
        { status: 400 }
      );
    }
    
    // 画像ファイルかどうかチェック
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '画像ファイルを選択してください' },
        { status: 400 }
      );
    }
    
    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      );
    }
    
    // バケット名
    const bucket = 'blog-images';
    
    // ファイル名を一意にするためにUUIDを使用
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    
    // Supabaseのストレージにアップロード
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('画像のアップロードに失敗しました:', error);
      return NextResponse.json(
        { error: `画像のアップロードに失敗しました: ${error.message}` },
        { status: 500 }
      );
    }
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('画像のアップロード中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '画像のアップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
