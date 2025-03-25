# Supabase RLS（Row Level Security）のトラブルシューティング

## RLSとは

Row Level Security（RLS）は、データベースの行レベルでセキュリティポリシーを適用する機能です。これにより、ユーザーは特定の条件を満たす行のみにアクセスできるようになります。Supabaseでは、デフォルトでRLSが有効になっており、適切なポリシーを設定しないとデータの読み書きができません。

## 一般的なRLSエラー

### 1. 新規レコード作成時のエラー

```
new row violates row-level security policy for table "テーブル名"
```

このエラーは、ユーザーが特定のテーブルに新しい行を挿入しようとしたときに、そのテーブルに対する`INSERT`権限がない場合に発生します。

### 2. レコード更新時のエラー

```
update or delete on table "テーブル名" violates row-level security policy
```

このエラーは、ユーザーが行を更新または削除しようとしたときに、その行に対する`UPDATE`または`DELETE`権限がない場合に発生します。

### 3. レコード読み取り時のエラー

```
permission denied for table "テーブル名"
```

このエラーは、ユーザーがテーブルからデータを読み取ろうとしたときに、そのテーブルに対する`SELECT`権限がない場合に発生します。

## 対処法

### 1. SQLエディターでポリシーを追加する

もっとも一般的な解決策は、Supabaseダッシュボードの「SQL」セクションでSQLコマンドを使用してポリシーを追加することです。

#### INSERTポリシーの追加例

```sql
-- 認証されたユーザーが新しいレコードを作成できるようにする
CREATE POLICY "認証ユーザーがレコードを作成できる" ON テーブル名
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

#### SELECT/UPDATEポリシーの追加例

```sql
-- ユーザーが自分のレコードのみを読み取り・更新できるようにする
CREATE POLICY "ユーザーは自分のデータのみ閲覧・更新可能" ON テーブル名
  FOR SELECT, UPDATE
  TO authenticated
  USING (user_id = auth.uid());
```

### 2. Supabaseダッシュボードで設定する

Supabaseダッシュボードの「Authentication > Policies」セクションからGUIを使ってポリシーを設定することもできます。

1. 対象のテーブルを選択
2. 「New Policy」をクリック
3. テンプレートを選択するか、カスタムポリシーを作成
4. 権限（SELECT, INSERT, UPDATE, DELETE）を選択
5. ポリシー条件を設定

### 3. 一時的にRLSを無効化する（開発中のみ）

開発中のみの対応策として、一時的にRLSを無効化することも可能です。

```sql
-- RLSを一時的に無効化
ALTER TABLE テーブル名 DISABLE ROW LEVEL SECURITY;

-- 作業が終わったらRLSを再度有効化
ALTER TABLE テーブル名 ENABLE ROW LEVEL SECURITY;
```

⚠️ **注意**: 本番環境ではRLSを無効化しないでください。セキュリティ上のリスクがあります。

### 4. サービスロールを使用する

特定の操作のためにRLSをバイパスする必要がある場合、サービスロールを使用できます。ただし、これはサーバーサイドのコードでのみ使用してください。

```typescript
// supabase.ts
import { createClient } from '@supabase/supabase-js';

// 注意: サービスロールキーは公開しないでください
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// RLSをバイパスするクライアント
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
```

これを使って特定の操作を行うサーバーサイド関数を作成します。

### 5. PostgreSQLロールとユーザー権限を理解する

RLSの問題を根本的に解決するには、PostgreSQLのロールとユーザー権限システムを理解することが重要です：

- `anon`: 未認証ユーザー用のロール
- `authenticated`: 認証済みユーザー用のロール
- `service_role`: すべての権限を持つスーパーユーザー

## テーブル別のポリシー設定例

### usersテーブルのポリシー例

```sql
-- ユーザー自身のレコードのみ閲覧可能
CREATE POLICY "ユーザーは自分のプロフィールのみ閲覧可能" ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- ユーザー自身のレコードのみ更新可能
CREATE POLICY "ユーザーは自分のプロフィールのみ更新可能" ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- 新規ユーザー作成を許可
CREATE POLICY "新規ユーザー作成を許可" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 管理者はすべてのユーザーデータにアクセス可能
CREATE POLICY "管理者はすべてのユーザーデータにアクセス可能" ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );
```

## デバッグ方法

RLSの問題をデバッグする際は、以下の手順が役立ちます：

1. ログを確認: Supabaseダッシュボードの「Storage > Logs」でエラーを確認
2. SQLエディターでポリシーを確認: `SELECT * FROM pg_policies WHERE tablename = 'テーブル名';`
3. 一時的にRLSを無効化して問題が解決するか確認（開発環境のみ）
4. 認証情報が正しく渡されているか確認

## まとめ

RLSはデータセキュリティのための重要な機能ですが、適切に設定しないとアプリケーションが正常に動作しなくなる可能性があります。エラーが発生した場合は、このドキュメントを参考にして適切なポリシーを設定してください。
