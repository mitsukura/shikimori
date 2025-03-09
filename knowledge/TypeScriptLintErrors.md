# TypeScript Lintエラー対応ガイド

Next.jsプロジェクトでよく遭遇するTypeScriptのLintエラーとその解決方法についてまとめています。

## 1. 未使用変数のエラー (`@typescript-eslint/no-unused-vars`)

### 発生例

```
Error: 'profile' is assigned a value but never used. @typescript-eslint/no-unused-vars
Error: 'errors' is assigned a value but never used. @typescript-eslint/no-unused-vars
```

### 原因

変数やインポートを宣言したが、コード内で一度も使用していない場合に発生します。これはコードの品質を向上させるためのルールで、不要なメモリ使用や潜在的なバグを防ぐために重要です。

### 対処法

1. **変数が実際に不要な場合**：

   変数定義を削除するか、使用しない変数の名前を`_`（アンダースコア）で始めることで、意図的に使用しないことを示します。

   ```typescript
   // 修正前
   const { data, error } = await fetchData();
   // error を使用していない場合の修正
   const { data, _error } = await fetchData();
   // または
   const { data } = await fetchData();
   ```

2. **分割代入でのスキップ**：

   オブジェクトから必要なプロパティのみを取り出します。

   ```typescript
   // 修正前
   const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
   // errorsを使用していない場合
   const { register, handleSubmit, setValue, formState } = useForm<FormData>();
   ```

3. **変数が間接的に使用される場合**：

   直接参照はなくても、関連するセッター関数が使用されている場合は変数を保持する必要があります。

   ```typescript
   // useState のセッターのみを使用しているケース
   const [profile, setProfile] = useState(null);
   // profile は直接参照されていなくても、setProfile が使用されている場合は削除しない
   ```

## 2. 未使用インポートのエラー

### 発生例

```
Error: 'headers' is defined but never used. @typescript-eslint/no-unused-vars
```

### 原因

モジュールをインポートしたが、コード内で一度も使用していない場合に発生します。

### 対処法

1. **インポート文の削除**：

   ```typescript
   // 修正前
   import { Webhook } from 'svix';
   import { headers } from 'next/headers';
   import type { WebhookEvent } from '@clerk/nextjs/server';
   
   // 修正後（未使用のインポートを削除）
   import { Webhook } from 'svix';
   import type { WebhookEvent } from '@clerk/nextjs/server';
   ```

2. **インポートの仕方を変更**：

   特定のプロパティだけを使用する場合は、インポート文を最適化します。

   ```typescript
   // 修正前（全体をインポート）
   import * as React from 'react';
   
   // 修正後（必要なものだけをインポート）
   import { useState, useEffect } from 'react';
   ```

## 3. 型定義エラー

### 発生例

```
Type '{ children: string; }' is not assignable to type 'IntrinsicAttributes'
```

### 原因

コンポーネントに渡すpropsの型が定義と一致していない場合に発生します。

### 対処法

1. **正しい型定義の作成**：

   ```typescript
   // コンポーネントの型定義
   type ButtonProps = {
     children: React.ReactNode;
     onClick?: () => void;
   };
   
   // 型を適用したコンポーネント
   const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
     return <button onClick={onClick}>{children}</button>;
   };
   ```

2. **オプショナルプロパティの活用**：

   ```typescript
   type ProfileProps = {
     name: string;
     bio?: string; // オプショナルプロパティ
   };
   ```

## ベストプラクティス

1. **コード書き込み前の検討**：
   - 変数を宣言する前に、実際に使用するか考える
   - 必要最小限のインポートのみを行う

2. **定期的なLintチェック**：
   - `npm run lint` または `bun run lint` でプロジェクト全体をチェック
   - エディターにESLintプラグインを導入し、リアルタイムでエラーを確認

3. **型安全性の確保**：
   - 適切な型定義を行い、型の不一致を防ぐ
   - `any` 型の使用を最小限に抑える

4. **コードレビュー**：
   - マージ前にLintエラーがないことを確認
   - 自動チェックの仕組みをCI/CDに組み込む

## トラブルシューティング

1. **ルール違反の一時的な無効化**：
   - 特定の行のみルールを無効化したい場合：
     ```typescript
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const tempVar = calculateSomething();
     ```

2. **プロジェクト設定の調整**：
   - `.eslintrc.js` でプロジェクト全体のルールをカスタマイズ：
     ```javascript
     module.exports = {
       rules: {
         '@typescript-eslint/no-unused-vars': ['error', { 
           argsIgnorePattern: '^_',
           varsIgnorePattern: '^_' 
         }]
       }
     };
     ```

これらの対応を適切に行うことで、TypeScriptの型安全性を維持しながら、クリーンで効率的なコードベースを構築できます。
