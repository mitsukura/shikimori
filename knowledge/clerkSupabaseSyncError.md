# Clerkユーザー情報とSupabaseの同期エラー

## 問題：「Error fetching user: {}」

このエラーは、アプリケーション内でClerkで認証されたユーザー情報がSupabaseデータベースから取得できない場合に発生します。主に`profile/page.tsx`のようなページで、ユーザー情報を取得する際に表示されます。

## 発生原因

1. **ユーザーデータの不足**: Clerkで認証されたユーザーに対応するレコードがSupabaseの`users`テーブルに存在しない
2. **Webhook設定の問題**: ClerkからSupabaseへのユーザー情報同期用のWebhookが正しく設定されていないか、動作していない
3. **データベーステーブル構造の不一致**: テーブル名やカラム名が期待されるものと異なる
4. **権限の問題**: Supabaseの権限設定によりデータにアクセスできない
5. **クエリエラー**: Supabaseクエリの構文またはパラメーターが不正確

## 解決策

### 1. ユーザーレコードの自動作成

```tsx
// Clerkユーザーが存在するのにSupabaseに対応するレコードがない場合、自動作成する
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
  
  // エラーハンドリング
  if (createError || !newUser) {
    console.error('Error creating user:', createError);
    return;
  }
  
  // 関連するプロフィールも作成する
  // ...
}
```

### 2. Webhookの設定確認

1. Clerk管理画面でWebhookが設定されていることを確認
2. Webhook URLが正しく、アクセス可能であることを確認
3. 環境変数`CLERK_WEBHOOK_SECRET`が設定されていることを確認
4. Webhookイベント（`user.created`、`user.updated`など）が適切に設定されていることを確認

### 3. エラーハンドリングの改善

```tsx
try {
  // ユーザー情報取得
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', user.id)
    .single();
  
  console.log('User data:', userData, 'User error:', userError);
  
  // エラーハンドリング
  if (userError) {
    // 詳細なエラー情報をログに記録
    console.error('Specific error details:', userError.code, userError.message, userError.details);
    // ...
  }
} catch (error) {
  console.error('Unexpected error:', error);
  // ...
}
```

### 4. データベーステーブル構造の確認

Supabaseの`users`テーブルが以下の構造を持つことを確認：

- `id`: 主キー（通常はUUID、PostgreSQLで自動生成）
- `clerk_id`: Clerkのユーザーを一意に識別するID
- `email`: ユーザーのメールアドレス
- `first_name`: ユーザーの名
- `last_name`: ユーザーの姓
- `created_at`: 作成日時
- `updated_at`: 更新日時

### 5. Webhookエンドポイントの実装例

```tsx
export async function POST(req: Request) {
  // Webhookシークレットの検証
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  // リクエストの検証とイベント処理
  // ...

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses[0]?.email_address;

    try {
      // Supabaseにユーザーを作成/更新
      const { error } = await supabase
        .from('users')
        .upsert({
          clerk_id: id,
          email,
          first_name: first_name || '',
          last_name: last_name || '',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'clerk_id'
        });

      if (error) {
        console.error('Error upserting user:', error);
        return new Response(`Error upserting user: ${error.message}`, { status: 500 });
      }

      return NextResponse.json({ success: true, event: eventType });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(`Error processing webhook: ${error}`, { status: 500 });
    }
  }
}
```

## 推奨事項

1. **エラーログの強化**: 詳細なエラー情報をコンソールに出力し、問題の解析を容易にする
2. **段階的な対応**: まずはクエリが正しいか確認し、次にデータベース構造、最後にWebhook設定を確認する
3. **テスト用のユーザー作成**: テスト用のClerkアカウントを作成し、Webhookが正しく動作していることを確認
4. **フォールバックメカニズム**: ユーザーデータが見つからない場合の代替処理を実装

## 結論

「Error fetching user: {}」エラーは主にClerkとSupabaseの同期問題によって発生します。上記の解決策を実装することで、新規ユーザーでも初回ログイン時に自動的に必要なレコードが作成され、ユーザーエクスペリエンスの中断を防止できます。
