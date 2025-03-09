# React HooksとTypeScriptのLintエラー解決方法

## 発生したエラー

デプロイ時に以下のエラーが発生：

```
Failed to compile.
./app/profile/page.tsx
20:10  Error: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
24:45  Error: 'formState' is assigned a value but never used.  @typescript-eslint/no-unused-vars
30:6  Warning: React Hook useEffect has a missing dependency: 'fetchProfile'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
```

## 原因

1. 未使用変数の存在: `profile`変数と`formState`が定義されているが使用されていない
2. React Hooksの依存配列の不備: `useEffect`で`fetchProfile`を使用しているが依存配列に含まれていない

## 解決策

### 1. 未使用変数の削除

- `profile`変数を`useState`から削除
- `formState`を`useForm`の分割代入から削除

```tsx
// 修正前
const [profile, setProfile] = useState<ProfileFormData | null>(null);
const { register, handleSubmit, setValue, formState } = useForm<ProfileFormData>();

// 修正後
const { register, handleSubmit, setValue } = useForm<ProfileFormData>();
```

### 2. `fetchProfile`関数の適切な処理

`fetchProfile`関数は`useEffect`内で使用されているが、関数の位置と依存配列の問題がありました：

#### 問題点
- 関数がレンダリングごとに再作成される
- 関数が宣言前に使用されている
- `useEffect`の依存配列に関数が含まれていない

#### 解決方法
1. `useCallback`を使用して関数をメモ化
2. 関数の宣言位置を`useEffect`の前に移動
3. 関数内で使用している変数をすべて依存配列に追加

```tsx
// 修正前
useEffect(() => {
  if (user) {
    fetchProfile();
  }
}, [user]);

const fetchProfile = async () => {
  // ...関数の実装
};

// 修正後
const fetchProfile = useCallback(async () => {
  // ...関数の実装
}, [user, setValue]);

useEffect(() => {
  if (user) {
    fetchProfile();
  }
}, [user, fetchProfile]);
```

## 重要なポイント

### React Hooksの依存配列の扱い方

1. **フックが使用するすべての変数を依存配列に含める**
   - `useEffect`、`useCallback`、`useMemo`などのHooksは、依存配列内のいずれかの値が変更されたときに再実行される
   - 依存配列に含まれていない値を使用すると、古い値を参照し続けるバグの原因になる

2. **関数を依存配列に含める場合**
   - コンポーネント内で定義された関数は毎回のレンダリングで再作成されるため、そのまま依存配列に含めると無限ループの原因になる
   - `useCallback`を使ってメモ化することで、依存配列の値が変わらない限り関数の参照も変わらなくなる

### Lintエラー防止のベストプラクティス

1. 未使用変数は宣言しない
2. React Hooksを使用する際は`eslint-plugin-react-hooks`のルールに従う
3. コンポーネント内の関数で外部の状態を参照する場合は`useCallback`を使用
4. Hooksの依存配列は慎重に設定し、必要なすべての依存関係を含める

## 参考リンク

- [React公式: フックのルール](https://ja.reactjs.org/docs/hooks-rules.html)
- [ESLint: react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [React公式: useCallback](https://ja.reactjs.org/docs/hooks-reference.html#usecallback)
- [TypeScript: 未使用変数](https://typescript-eslint.io/rules/no-unused-vars)
