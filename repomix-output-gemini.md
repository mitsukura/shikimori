了解しました。管理者用ダッシュボード（ユーザー管理・商品管理）を実装するための手順書を、コーディングエージェント向けに作成します。

管理者用ダッシュボード 実装手順書
1. 目的

既存のNext.jsアプリケーション（四季守）に、以下の機能を持つ管理者用ダッシュボードを追加します。

ユーザー管理: 登録ユーザーの一覧表示、詳細確認、権限（管理者フラグ）変更、削除

商品管理: 登録商品の一覧表示、新規作成、編集、削除

2. 前提条件

フレームワーク: Next.js 15 (App Router)

認証: Clerk

データベース: Supabase (PostgreSQL)

ORM/クライアント: @supabase/supabase-js (Prismaは定義のみで使用、データ操作はSupabase Client経由)

UIライブラリ: shadcn/ui (既存コンポーネントを活用)

スタイリング: Tailwind CSS

言語: TypeScript

3. 実装ステップ
ステップ 1: 管理者権限の判定ロジック実装

Supabase users テーブル確認:

users テーブルに is_admin (Boolean型、デフォルトfalse) カラムが存在することを確認します。(既存の prisma/schema.prisma に基づく)

必要に応じて、特定のユーザーを手動で管理者 (is_admin = true) に設定しておきます（Supabase Studio等で）。

Clerk Webhook の確認/修正 (任意):

app/api/webhook/clerk/route.ts で user.created イベント時に、デフォルトで is_admin = false でユーザーが作成されることを確認します。

将来的にClerk側で管理者ロールを管理する場合は、WebhookでClerkのメタデータやロール情報を読み取り、Supabaseの is_admin に同期するロジックを追加します。（今回は手動設定を前提）

管理者判定ヘルパー関数の作成:

サーバーサイドで現在のユーザーが管理者かどうかを判定する関数を作成します。

ファイル: lib/authUtils.ts (新規作成)

// lib/authUtils.ts
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server'; // サーバーサイド用Supabaseクライアント

export async function isAdmin(): Promise<boolean> {
  const { userId } = auth();
  if (!userId) {
    return false; // 未認証ユーザーは管理者ではない
  }

  try {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('clerk_id', userId) // clerk_idで検索
      .single();

    if (error || !user) {
      console.error('Error fetching user admin status:', error?.message);
      return false;
    }

    return user.is_admin === true;
  } catch (err) {
    console.error('Unexpected error in isAdmin:', err);
    return false;
  }
}

ステップ 2: 管理者用UIレイアウトとルーティング

管理者用ディレクトリ作成:

app/admin ディレクトリを作成します。

管理者用レイアウト作成:

ファイル: app/admin/layout.tsx (新規作成)

このレイアウトで管理者権限をチェックし、非管理者からのアクセスを制限します。

サイドバーナビゲーションを含みます。

// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/authUtils';
import AdminSidebar from './components/AdminSidebar'; // 後で作成

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    redirect('/'); // 管理者でなければトップページなどにリダイレクト
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

サイドバーコンポーネント作成:

ファイル: app/admin/components/AdminSidebar.tsx (新規作成)

// app/admin/components/AdminSidebar.tsx
'use client'; // クライアントコンポーネントとしてLinkを使用

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Users, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'ダッシュボード', icon: Home },
  { href: '/admin/users', label: 'ユーザー管理', icon: Users },
  { href: '/admin/items', label: '商品管理', icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">管理メニュー</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
       {/* 必要であればフッターや他の要素を追加 */}
    </aside>
  );
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

管理者用ダッシュボードページ作成:

ファイル: app/admin/page.tsx (新規作成)

// app/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード</h1>
      <p>ここに統計情報などを表示します。</p>
      {/* 今後の拡張用 */}
    </div>
  );
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

ユーザー管理・商品管理ページのプレースホルダ作成:

app/admin/users/page.tsx

app/admin/items/page.tsx

// app/admin/users/page.tsx (同様に items も作成)
export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ユーザー管理</h1>
      {/* ここにユーザー一覧テーブルなどを実装 */}
      <p>ユーザー管理機能を実装します。</p>
    </div>
  );
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END
ステップ 3: APIエンドポイントの作成 (Supabase連携)

注意: APIエンドポイント内でも必ず管理者権限をチェックしてください。

ユーザー管理API:

app/api/admin/users/route.ts (GET: ユーザー一覧取得)

app/api/admin/users/[userId]/route.ts (PUT: ユーザー更新 - is_admin等, DELETE: ユーザー削除)

// 例: app/api/admin/users/route.ts (GET)
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils'; // 管理者チェック

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*') // 必要に応じてカラムを選択
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

PUT, DELETE も同様に isAdmin() チェックとSupabase Clientを使った操作を実装します。[userId] はSupabaseの id (UUID) を想定しますが、clerk_id を使う場合はパスパラメータやリクエストボディで受け取るように調整してください。

商品管理API:

app/api/admin/items/route.ts (GET: 商品一覧取得, POST: 商品新規作成)

app/api/admin/items/[itemId]/route.ts (PUT: 商品更新, DELETE: 商品削除)

実装方法はユーザー管理APIと同様です。isAdmin() チェックを忘れずに行います。

ステップ 4: ユーザー管理画面の実装

ユーザー一覧テーブルコンポーネント作成:

ファイル: app/admin/users/components/UserTable.tsx (新規作成)

'use client' を指定し、useEffect でAPI (/api/admin/users) からデータをフェッチします。

shadcn/uiの Table コンポーネントを使用してユーザー情報を表示します。

各行に「編集」「削除」ボタンを配置します。

ユーザー編集モーダル作成:

ファイル: app/admin/users/components/EditUserDialog.tsx (新規作成)

shadcn/uiの Dialog を使用します。

フォーム (React Hook Form + shadcn/ui Input, Checkbox for is_admin など) を作成します。

Submit時にPUT API (/api/admin/users/[userId]) を呼び出して更新します。

ユーザー削除確認ダイアログ作成:

ファイル: app/admin/users/components/DeleteUserAlert.tsx (新規作成)

shadcn/uiの AlertDialog を使用します。

削除実行時にDELETE API (/api/admin/users/[userId]) を呼び出します。

ユーザー管理ページ本体の実装:

ファイル: app/admin/users/page.tsx (修正)

UserTable コンポーネントを呼び出し、編集・削除ボタンのクリックイベントで対応するモーダル/アラートダイアログを開くロジックを実装します。

データ更新後の再フェッチロジック（例: SWRやReact Queryのキャッシュ無効化、または手動再フェッチ）を実装します。

ステップ 5: 商品管理画面の実装

商品一覧テーブルコンポーネント作成:

ファイル: app/admin/items/components/ItemTable.tsx (新規作成)

ユーザー管理と同様にAPIからデータをフェッチし、Table で表示。「新規作成」「編集」「削除」ボタンを配置します。

商品作成/編集フォームモーダル作成:

ファイル: app/admin/items/components/EditItemDialog.tsx (新規作成)

新規作成と編集で共用できるフォームコンポーネントを作成します。

shadcn/uiの Dialog, Input, Textarea, Checkbox (is_available), Input type="number" (price, stock) などを使用します。

Submit時にPOST (/api/admin/items) またはPUT (/api/admin/items/[itemId]) APIを呼び出します。

商品削除確認ダイアログ作成:

ファイル: app/admin/items/components/DeleteItemAlert.tsx (新規作成)

ユーザー管理と同様に AlertDialog を使用し、DELETE API (/api/admin/items/[itemId]) を呼び出します。

商品管理ページ本体の実装:

ファイル: app/admin/items/page.tsx (修正)

ItemTable と 新規作成ボタンを配置。テーブル内のボタンクリックで編集モーダルや削除アラートを開くロジックを実装。

データ更新後の再フェッチロジックを実装します。

ステップ 6: 状態管理とエラーハンドリング

各クライアントコンポーネント (UserTable, ItemTable など) で useState を使用してローディング状態やエラー状態を管理し、ユーザーにフィードバックを表示します。

API呼び出し部分では try...catch を使用してエラーを捕捉し、sonner (既存) を使ってエラーメッセージを表示します。

データ量が多い場合やリアルタイム更新が必要な場合は、SWRやReact Queryのようなデータフェッチングライブラリの導入を検討してください。現状は fetch と useState/useEffect で実装可能です。

ステップ 7: テスト

管理者アカウントと一般ユーザーアカウントでログインし、管理者ページへのアクセス制御が正しく機能することを確認します。

ユーザー管理、商品管理の各CRUD操作（作成、読み取り、更新、削除）が意図通りに動作することを確認します。

境界値や不正な入力に対するテストも行います。

この手順書に従って実装を進めてください。各コンポーネントやAPIエンドポイントの具体的なコードは、shadcn/uiのドキュメントや既存のコードを参考にしながら作成してください。不明点があれば再度質問してください。