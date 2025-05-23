import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * 画像をSupabaseのストレージにアップロードする
 * @param file アップロードするファイル
 * @param bucket バケット名（デフォルト: 'images'）
 * @returns アップロードされた画像のURL
 */
export async function uploadImage(file: File, bucket = 'images'): Promise<string | null> {
  try {
    // バケットが存在するか確認
    const { data: buckets } = await supabase.storage.listBuckets();
    console.log('利用可能なバケット:', buckets?.map(b => b.name));
    
    // バケットが存在しない場合は作成を試みる
    const bucketExists = buckets?.some(b => b.name === bucket);
    if (!bucketExists) {
      console.log(`バケット '${bucket}' が存在しないため作成を試みます`);
      try {
        const { data, error } = await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
        if (error) {
          console.error(`バケット '${bucket}' の作成に失敗しました:`, error);
        } else {
          console.log(`バケット '${bucket}' を作成しました`);
        }
      } catch (err) {
        console.error(`バケット '${bucket}' の作成中にエラーが発生しました:`, err);
      }
    }
    
    // ファイル名を一意にするためにUUIDを使用
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`ファイル '${filePath}' をバケット '${bucket}' にアップロードします`);
    
    // Supabaseのストレージにアップロード
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('画像のアップロードに失敗しました:', error);
      return null;
    }

    console.log('アップロード成功:', data);
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('取得した公開URL:', urlData?.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('画像のアップロード中にエラーが発生しました:', error);
    return null;
  }
}

/**
 * 画像をSupabaseのストレージから削除する
 * @param url 削除する画像のURL
 * @param bucket バケット名（デフォルト: 'images'）
 * @returns 削除が成功したかどうか
 */
export async function deleteImage(url: string, bucket = 'images'): Promise<boolean> {
  try {
    // URLからファイル名を抽出
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Supabaseのストレージから削除
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('画像の削除に失敗しました:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('画像の削除中にエラーが発生しました:', error);
    return false;
  }
}
