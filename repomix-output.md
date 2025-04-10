This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
app/
  about/
    page.tsx
  admin/
    components/
      AdminSidebar.tsx
      MobileAdminNav.tsx
    items/
      components/
        DeleteItemAlert.tsx
        ItemFormDialog.tsx
        ItemTableWrapper.tsx
      page.tsx
    users/
      components/
        UserTableWrapper.tsx
      page.tsx
    layout.tsx
    page.tsx
  api/
    admin/
      items/
        [itemId]/
          route.ts
        route.ts
      users/
        [userId]/
          route.ts
        route.ts
    webhook/
      clerk/
        route.ts
  components/
    Achievements.tsx
    contact.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    mobile-nav.tsx
    Procedure.tsx
  contact/
    page.tsx
  legalNotice/
    page.tsx
  menu/
    [itemId]/
      page.tsx
    components/
      ItemCard.tsx
    page.tsx
  privacy/
    page.tsx
  profile/
    components/
      ProfileClient.tsx
      ProfileForm.tsx
      ProfileView.tsx
    edit/
      page.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  ui/
    accordion.tsx
    alert-dialog.tsx
    badge.tsx
    button.tsx
    card.tsx
    checkbox.tsx
    dialog.tsx
    dropdown-menu.tsx
    input.tsx
    label.tsx
    sheet.tsx
    skeleton.tsx
    table.tsx
    textarea.tsx
  mode-toggle.tsx
  theme-provider.tsx
data/
  achievement.ts
  navigations.ts
docs/
  create_tables.sql
  er.md
  insert_sample_data.sql
knowledge/
  clerkSupabaseSyncError.md
  HydrationError.md
  ReactHooksLintErrors.md
  site_status.md
  supabase_rls_troubleshooting.md
  TypeScriptLintErrors.md
  user_registration_profile.md
lib/
  hooks/
    useIsAdmin.ts
  supabase/
    client.ts
    server.ts
  authUtils.ts
  utils.ts
prisma/
  migrations/
    20250326121500_init/
      migration.sql
    20250407144308_add_clerk_id/
      migration.sql
    20250407151755_add_bio_and_address_fields/
      migration.sql
    migration_lock.toml
  schema.prisma
  seed.ts
public/
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
types/
  item.ts
  profile.ts
  types.ts
  user.ts
.eslintrc.js
.gitignore
.prettierrc
.textlintrc
components.json
eslint.config.mjs
middleware.ts
next.config.js
next.config.ts
package.json
postcss.config.mjs
README.md
tailwind.config.ts
tsconfig.json
```

# Files

## File: app/menu/[itemId]/page.tsx
````typescript
import { createClient } from '@/lib/supabase/server';
import type { Item } from '@/types/item';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { itemId: string };
};

// 動的メタデータ
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const itemId = params.itemId;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('items')
    .select('name, description')
    .eq('id', itemId)
    .single();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: item ? `${item.name} | メニュー | 四季守` : '商品詳細 | 四季守',
    description: item?.description?.substring(0, 100) || '商品の詳細情報ページです。', // 説明を100文字に制限
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { itemId } = params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', itemId)
    .single<Item>(); // 型を指定

  if (error || !item) {
    console.error('Error fetching item or item not found:', error?.message);
    notFound(); // 404ページをレンダリング
  }

  const priceNumber = typeof item.price === 'number' ? item.price : Number(item.price);
  const imageUrl = item.image_url
    ? item.image_url.startsWith('http') || item.image_url.startsWith('/')
      ? item.image_url
      : `/${item.image_url}`
    : '/placeholder-image.png'; // プレースホルダー画像が存在することを確認

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-8 lg:gap-12">
        {/* 左カラム（詳細、注意事項、手順） */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">商品詳細</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {item.description || '詳細な説明はありません。'}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">ご購入にあたっての注意事項</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ul>
                <li>サービスの提供エリアをご確認ください。</li>
                <li>天候により作業日程が変更になる場合があります。</li>
                <li>キャンセルポリシーは別途ご案内いたします。</li>
                <li>作業範囲や内容によって追加料金が発生する場合があります。</li>
                <li>お客様の立ち会いが必要な作業もございます。</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">ご契約・サービス利用手順</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ol>
                <li>当ページ下部のボタンより購入手続きへ進みます。</li>
                <li>決済情報を入力し、注文を確定します。</li>
                <li>担当者より日程調整のご連絡を差し上げます。</li>
                <li>指定日時にサービスを実施します。</li>
                <li>完了確認をもって終了となります。</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">よくあるご質問</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>サービスの対応エリアはどこですか？</AccordionTrigger>
                <AccordionContent>
                  現在、東京都、神奈川県、埼玉県、千葉県の一部地域で対応しております。詳細なエリアについては、お問い合わせください。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>キャンセルはいつまで可能ですか？</AccordionTrigger>
                <AccordionContent>
                  サービス実施日の3日前までであれば、キャンセル料は発生しません。2日前からはキャンセル料が発生しますので、ご了承ください。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>支払い方法は何がありますか？</AccordionTrigger>
                <AccordionContent>
                  クレジットカード、銀行振込、コンビニ決済に対応しております。法人のお客様は請求書払いも可能です。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>サービス内容のカスタマイズは可能ですか？</AccordionTrigger>
                <AccordionContent>
                  はい、可能です。ご要望に応じてカスタマイズいたしますので、お問い合わせフォームよりご連絡ください。追加料金が発生する場合がございます。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>作業時に立ち会いは必要ですか？</AccordionTrigger>
                <AccordionContent>
                  サービス内容によって異なります。基本的には初回と最終確認時の立ち会いをお願いしております。詳細は担当者からご連絡いたします。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* 右カラム（画像、タイトル、価格、ボタン） */}
        <div className="md:col-span-1 mt-8 md:mt-0 sticky top-24 h-fit border rounded-lg p-6 shadow">
          <div className="relative aspect-video w-full mb-4">
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
          <p className="text-xl font-semibold text-primary mb-6">
            {priceNumber.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
          </p>
          <Button className="w-full" size="lg" disabled> {/* ボタンは現在無効 */}
            購入手続きへ
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">現在、購入機能は準備中です。</p>
        </div>
      </div>
    </div>
  );
}
````

## File: components/ui/accordion.tsx
````typescript
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
````

## File: app/admin/components/AdminSidebar.tsx
````typescript
'use client'; // クライアントコンポーネントとしてLinkを使用

import { Button } from '@/components/ui/button';
import { Home, Package, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'ホーム', icon: Home },
  { href: '/admin/users', label: 'ユーザー管理', icon: Users },
  { href: '/admin/items', label: '商品管理', icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">ダッシュボード</h2>
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
````

## File: app/admin/components/MobileAdminNav.tsx
````typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Home, Package, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { href: '/admin', label: 'ホーム', icon: Home },
  { href: '/admin/users', label: 'ユーザー管理', icon: Users },
  { href: '/admin/items', label: '商品管理', icon: Package },
];

export default function MobileAdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="font-semibold">ダッシュボード</h1>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>ダッシュボード</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="justify-start"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
````

## File: app/admin/items/components/DeleteItemAlert.tsx
````typescript
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { DeleteItemAlertProps } from '@/types/item';

export default function DeleteItemAlert({
  isOpen,
  setIsOpen,
  itemId,
  itemName,
  onConfirm,
}: DeleteItemAlertProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!itemId) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '商品の削除中にエラーが発生しました');
      }
      
      toast.success('商品を削除しました');
      onConfirm();
      setIsOpen(false);
    } catch (error: unknown) {
      console.error('商品削除エラー:', error);
      toast.error(error instanceof Error ? error.message : '商品の削除中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>商品を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? `「${itemName}」` : '選択された商品'}を削除します。この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? '削除中...' : '削除する'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
````

## File: app/admin/items/components/ItemFormDialog.tsx
````typescript
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import type { ItemFormData, ItemFormProps } from '@/types/item';

export default function ItemFormDialog({ 
  initialData, 
  onSuccess, 
  isOpen, 
  setIsOpen 
}: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors } 
  } = useForm<ItemFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      isAvailable: true,
      stock: 0
    }
  });

  // 初期データが変更されたらフォームをリセット
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description || '');
      setValue('price', Number(initialData.price));
      setValue('imageUrl', initialData.image_url || '');
      setValue('category', initialData.category || '');
      setValue('isAvailable', initialData.is_available);
      setValue('stock', initialData.stock);
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        isAvailable: true,
        stock: 0
      });
    }
  }, [initialData, setValue, reset]);

  const onSubmit = async (data: ItemFormData) => {
    setLoading(true);
    
    try {
      const url = initialData 
        ? `/api/admin/items/${initialData.id}` 
        : '/api/admin/items';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '商品の保存中にエラーが発生しました');
      }
      
      toast.success(initialData ? '商品を更新しました' : '商品を作成しました');
      
      if (onSuccess) {
        onSuccess();
      }
      
      setIsOpen(false);
    } catch (error: unknown) {
      console.error('商品保存エラー:', error);
      toast.error(error instanceof Error ? error.message : '商品の保存中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '商品を編集' : '新しい商品を作成'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">商品名 <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              {...register('name', { required: '商品名は必須です' })}
              placeholder="商品名"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="商品の説明"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">価格 <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                {...register('price', { 
                  required: '価格は必須です',
                  min: { value: 0, message: '価格は0以上である必要があります' },
                  valueAsNumber: true
                })}
                placeholder="価格"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">在庫数</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                {...register('stock', { 
                  required: '在庫数は必須です',
                  min: { value: 0, message: '在庫数は0以上である必要があります' },
                  valueAsNumber: true
                })}
                placeholder="在庫数"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="カテゴリ"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">画像URL</Label>
            <Input
              id="imageUrl"
              {...register('imageUrl')}
              placeholder="画像URL"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              {...register('isAvailable')}
            />
            <Label htmlFor="isAvailable">販売可能</Label>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">キャンセル</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: app/admin/items/components/ItemTableWrapper.tsx
````typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import ItemFormDialog from './ItemFormDialog';
import DeleteItemAlert from './DeleteItemAlert';
import type { Item } from '@/types/item';

export default function ItemTableWrapper() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/items');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '商品データの取得中にエラーが発生しました');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (error: unknown) {
      console.error('商品データ取得エラー:', error);
      setError(error instanceof Error ? error.message : '商品データの取得中にエラーが発生しました');
      toast.error(error instanceof Error ? error.message : '商品データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  const handleAddNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };
  
  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setIsAlertOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">商品一覧</h2>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>
      
      {loading ? (
        <div className="py-8 text-center">
          <p className="mt-2 text-sm text-muted-foreground">商品データを読み込み中...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" onClick={fetchItems} className="mt-2">
            再読み込み
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center border rounded-lg">
          <p className="text-muted-foreground">商品がありません。「新規作成」から商品を追加してください。</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名</TableHead>
                <TableHead>価格</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>在庫</TableHead>
                <TableHead>販売状態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {typeof item.price === 'number'
                      ? item.price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })
                      : Number(item.price).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
                  </TableCell>
                  <TableCell>{item.category || '-'}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    {item.is_available ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>販売中</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span>停止中</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">編集</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <ItemFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={selectedItem}
        onSuccess={fetchItems}
      />
      
      <DeleteItemAlert
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        itemId={selectedItem?.id || null}
        itemName={selectedItem?.name}
        onConfirm={fetchItems}
      />
    </div>
  );
}
````

## File: app/admin/items/page.tsx
````typescript
import ItemTableWrapper from './components/ItemTableWrapper';

export default function AdminItemsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">商品管理</h1>
      <ItemTableWrapper />
    </div>
  );
}
````

## File: app/admin/users/components/UserTableWrapper.tsx
````typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { User } from '@/types/user';



export default function UserTableWrapper() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザーデータの取得中にエラーが発生しました');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error: unknown) {
      console.error('ユーザーデータ取得エラー:', error);
      setError(error instanceof Error ? error.message : 'ユーザーデータの取得中にエラーが発生しました');
      toast.error(error instanceof Error ? error.message : 'ユーザーデータの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ユーザー一覧</h2>
        <Button onClick={() => fetchUsers()} variant="outline" size="sm">
          更新
        </Button>
      </div>
      
      {loading ? (
        <div className="py-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">ユーザーデータを読み込み中...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => fetchUsers()} className="mt-4">再試行</Button>
        </div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center border rounded-md">
          <p className="text-muted-foreground">ユーザーが見つかりませんでした</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>メール</TableHead>
                <TableHead>登録日</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.lastName} {user.firstName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.created_at ? format(new Date(user.created_at), 'yyyy年MM月dd日', { locale: ja }) : '不明'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${user.clerkId}`}>詳細</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
````

## File: app/admin/users/page.tsx
````typescript
import UserTableWrapper from './components/UserTableWrapper';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ユーザー管理</h1>
      <UserTableWrapper />
    </div>
  );
}
````

## File: app/admin/layout.tsx
````typescript
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/authUtils';
import AdminSidebar from './components/AdminSidebar';
import MobileAdminNav from './components/MobileAdminNav';

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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* デスクトップ用サイドバー（md以上で表示） */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* モバイル用ナビゲーション（md未満で表示） */}
      <div className="md:hidden border-b sticky top-0 z-10 bg-background">
        <MobileAdminNav />
      </div>
      
      <main className="flex-1 p-4 md:p-6 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
````

## File: app/admin/page.tsx
````typescript
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード</h1>
      <p>ここに統計情報などを表示します。</p>
      {/* 今後の拡張用 */}
    </div>
  );
}
````

## File: app/api/admin/items/[itemId]/route.ts
````typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils';

export async function GET(_request: Request, { params }: { params: { itemId: string } }) {
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

export async function PUT(request: Request, { params }: { params: { itemId: string } }) {
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

export async function DELETE(_request: Request, { params }: { params: { itemId: string } }) {
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
````

## File: app/api/admin/items/route.ts
````typescript
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
````

## File: app/api/admin/users/[userId]/route.ts
````typescript
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
````

## File: app/api/admin/users/route.ts
````typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils'; // 管理者チェック

export async function GET(_request: Request) {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
````

## File: app/components/Procedure.tsx
````typescript
export default function Procedure() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold mb-2'>雪かき、草刈りサービスの利用方法</h2>
      <ol className='list-decimal list-inside space-y-4'>
        <li>
          <span className='font-bold'>サービスを選ぶ</span>
          <p className='ml-6 mt-1'>まず、雪かき（冬期間）か草刈り（夏期間）のどちらをお願いしたいか選びます。</p>
        </li>
        <li>
          <span className='font-bold'>ユーザー登録</span>
          <p className='ml-6 mt-1'>サービスを選んだら、初めのみお名前や住所、作業場所などを登録します。これは、あなたのお家や連絡先を教えてもらうためです。</p>
        </li>
        <li>
          <span className='font-bold'>注文と支払い</span>
          <p className='ml-6 mt-1'>住所の登録が終わったら、雪かきや草刈りをしてほしい日時を選びます。日時が決まったら、料金を支払います。現在は。クレジットカードのみです。</p>
        </li>
        <li>
          <span className='font-bold'>サービス当日</span>
          <p className='ml-6 mt-1'>予約した日時に、専門の業者があなたの家に来て、雪かきや草刈りをしてくれます。</p>
        </li>
        <li>
          <span className='font-bold'>完了</span>
          <p className='ml-6 mt-1'>作業が終わったら、確認をして完了となります。</p>
        </li>
      </ol>
      <h2 className='text-2xl font-bold mb-2'>ポイント</h2>
      <ul className='list-disc list-inside space-y-4'>
        <li>登録や注文は、スマホやパソコンから簡単にできます。</li>
        <li>わからないことがあれば、いつでも質問できます。</li>
      </ul>
      <h2 className='text-2xl font-bold mb-2'>注意事項</h2>
      <ul className='list-disc list-inside space-y-4'>
        <li>雪かきや草刈りの料金は、予約日によって変わる場合があります。</li>
        <li>予約が込み合っている場合は、希望の日時に予約できないことがあります。</li>
      </ul>
    </div>
  )
}
````

## File: app/menu/components/ItemCard.tsx
````typescript
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Item } from '@/types/item';

type ItemCardProps = {
  item: Item;
};

export default function ItemCard({ item }: ItemCardProps) {
  // 価格が数値であることを確認
  const priceNumber = typeof item.price === 'number' ? item.price : Number(item.price);

  // 画像URLの処理: 相対パスの場合は先頭にスラッシュを追加
  const imageUrl = item.image_url
    ? item.image_url.startsWith('http') || item.image_url.startsWith('/')
      ? item.image_url
      : `/${item.image_url}`
    : '/placeholder-image.png';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <CardTitle className="mb-2 text-lg">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {item.description || '説明はありません。'}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <span className="font-semibold">
          {priceNumber.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
        </span>
        <Badge variant={item.is_available ? 'default' : 'secondary'}>
          {item.is_available ? '販売中' : '準備中'}
          {/* オプションでストック数を表示: {item.stock} */}
        </Badge>
      </CardFooter>
    </Card>
  );
}
````

## File: app/profile/edit/page.tsx
````typescript
'use client';

import ProfileClient from '../components/ProfileClient';

export default function ProfileEditPage() {
  return <ProfileClient mode="edit" />;
}
````

## File: components/ui/alert-dialog.tsx
````typescript
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
````

## File: components/ui/badge.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
````

## File: components/ui/button.tsx
````typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
````

## File: components/ui/card.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
````

## File: components/ui/checkbox.tsx
````typescript
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
````

## File: components/ui/dialog.tsx
````typescript
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
````

## File: components/ui/dropdown-menu.tsx
````typescript
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
````

## File: components/ui/input.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
````

## File: components/ui/label.tsx
````typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
````

## File: components/ui/sheet.tsx
````typescript
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
````

## File: components/ui/skeleton.tsx
````typescript
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
````

## File: components/ui/table.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
````

## File: components/ui/textarea.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
````

## File: components/mode-toggle.tsx
````typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
````

## File: components/theme-provider.tsx
````typescript
"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
````

## File: data/achievement.ts
````typescript
import type { Achievement } from '@/types/types'


export const achievements: Achievement[] = [
  {
    id: 'snow-removal',
    title: '除雪',
    imageSrc: '/images/snow-removal.jpg',
    alt: '除雪',
    date: '2023/03/02'
  },
  {
    id: 'grass-cutting',
    title: '草刈り',
    imageSrc: '/images/grass-cutting.jpg',
    alt: '草刈り',
    date: '2024/08/02'
  }
]
````

## File: docs/create_tables.sql
````sql
-- テーブル作成SQL

-- usersテーブル
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- itemsテーブル
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(50),
  is_available BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- paymentsテーブル
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  stripe_intent_id VARCHAR(255),
  stripe_authorized_amount DECIMAL(10, 2),
  stripe_authorizer_id VARCHAR(255),
  stripe_captured_amount DECIMAL(10, 2),
  stripe_captured_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- mapsテーブル
CREATE TABLE maps (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  name VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ordersテーブル
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  map_id INTEGER REFERENCES maps(id),
  payment_id INTEGER REFERENCES payments(id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- order_itemsテーブル
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  item_id INTEGER REFERENCES items(id),
  quantity INTEGER NOT NULL,
  price_at_order DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- refundsテーブル
CREATE TABLE refunds (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER REFERENCES payments(id),
  amount DECIMAL(10, 2) NOT NULL,
  refund_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 外部キー制約の修正（循環参照を解決）
ALTER TABLE payments ADD COLUMN order_id INTEGER;
ALTER TABLE payments ADD CONSTRAINT fk_payments_orders FOREIGN KEY (order_id) REFERENCES orders(id);
````

## File: docs/insert_sample_data.sql
````sql
-- サンプルデータ挿入SQL

-- usersテーブルのサンプルデータ
INSERT INTO users (is_admin, first_name, last_name, email, phone) VALUES
(TRUE, '太郎', '山田', 'taro.yamada@example.com', '090-1234-5678'),
(FALSE, '花子', '佐藤', 'hanako.sato@example.com', '080-8765-4321'),
(FALSE, '一郎', '鈴木', 'ichiro.suzuki@example.com', '070-2345-6789');

-- itemsテーブルのサンプルデータ
INSERT INTO items (name, description, price, image_url, category, is_available, stock) VALUES
('ローダー除雪サービス', '四季守では、秋田県内の、ローダー除雪、排雪の予約ができます。', 50000.00, '/images/snow-removal.jpg', '除雪', TRUE, 10),
('ダンプ排雪サービス', '積もった雪をダンプで効率的に排雪します。', 75000.00, '/images/snow-dumping.jpg', '除雪', TRUE, 5),
('庭木の剪定', 'プロによる庭木の剪定サービスです。', 30000.00, '/images/garden-pruning.jpg', '庭園', TRUE, 20),
('草刈りサービス', '広い敷地の草刈りを効率的に行います。', 25000.00, '/images/grass-cutting.jpg', '庭園', TRUE, 15),
('害虫駆除', '家屋や庭の害虫を安全に駆除します。', 35000.00, '/images/pest-control.jpg', '害虫', TRUE, 8);

-- mapsテーブルのサンプルデータ
INSERT INTO maps (address, name, image) VALUES
('秋田県秋田市中央1-1-1', '秋田市中央公園', '/images/map1.jpg'),
('秋田県横手市横手町1-2-3', '横手市役所前', '/images/map2.jpg'),
('秋田県大仙市大曲上栄町1-3-5', '大曲駅前広場', '/images/map3.jpg');

-- paymentsテーブルのサンプルデータ
INSERT INTO payments (method, status, stripe_intent_id, stripe_authorized_amount) VALUES
('credit_card', 'completed', 'pi_1234567890', 50000.00),
('bank_transfer', 'pending', NULL, 75000.00),
('credit_card', 'completed', 'pi_0987654321', 30000.00);

-- ordersテーブルのサンプルデータ
-- 注意: payment_idとmap_idは後で更新する必要があります
INSERT INTO orders (user_id, status) VALUES
(1, 'completed'),
(2, 'pending'),
(3, 'processing');

-- 外部キーの更新
UPDATE orders SET payment_id = 1, map_id = 1 WHERE id = 1;
UPDATE orders SET payment_id = 2, map_id = 2 WHERE id = 2;
UPDATE orders SET payment_id = 3, map_id = 3 WHERE id = 3;

-- paymentsテーブルの外部キー更新
UPDATE payments SET order_id = 1 WHERE id = 1;
UPDATE payments SET order_id = 2 WHERE id = 2;
UPDATE payments SET order_id = 3 WHERE id = 3;

-- order_itemsテーブルのサンプルデータ
INSERT INTO order_items (order_id, item_id, quantity, price_at_order) VALUES
(1, 1, 1, 50000.00),
(2, 2, 1, 75000.00),
(3, 3, 2, 30000.00),
(1, 4, 1, 25000.00);

-- refundsテーブルのサンプルデータ
INSERT INTO refunds (payment_id, amount) VALUES
(1, 10000.00);
````

## File: knowledge/clerkSupabaseSyncError.md
````markdown
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
````

## File: knowledge/HydrationError.md
````markdown
# Next.jsにおけるHydrationエラーの解決方法

## 問題の概要

メニューページにて以下のエラーが発生しました：

```
Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
```

このエラーは、サーバーサイドレンダリング（SSR）とクライアントサイドレンダリング（CSR）の出力が一致しない場合に発生します。Next.jsでは、サーバーで生成されたHTMLとクライアントでのレンダリング結果が完全に一致する必要があります。

## 原因

Hydrationエラーの主な原因として考えられるのは：

1. クライアント側でのみ利用可能なAPIや変数を使用している
2. 日付や時間のような環境依存の値を使用している
3. ランダムな値や動的なコンテンツがある

本プロジェクトでは、`Hero`コンポーネントがクライアントコンポーネント（`'use client'`）として定義されていましたが、サーバーサイドとクライアントサイドでのレンダリング結果が一致しない要素が含まれていました。

## 解決策

この問題を解決するために以下の手順を実施しました：

1. `useState`と`useEffect`を使用して、コンポーネントのマウント状態を管理
2. 初期レンダリング時（サーバーサイド）では最小限のプレースホルダーを表示
3. クライアントサイドでマウント完了後に実際のコンテンツを表示

具体的な実装は以下の通りです：

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  // クライアントサイドのマウント状態を管理
  const [isMounted, setIsMounted] = useState(false)

  // コンポーネントがマウントされた後にのみtrueにする
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // マウントされる前は最小限の構造を表示（サーバーサイドレンダリング時）
  if (!isMounted) {
    return <div className="min-h-[300px]">Loading...</div>
  }

  // クライアントサイドでのみ表示される実際のコンテンツ
  return (
    // 実際のコンポーネントの内容
  )
}
```

## メリット

この解決策には以下のメリットがあります：

1. サーバーサイドとクライアントサイドでのレンダリング結果の差異を防ぐ
2. Hydrationエラーを解消
3. ユーザー体験を向上（初期ローディング中にプレースホルダーを表示）

## その他の解決策

Hydrationエラーを解決するための他のアプローチとしては：

1. `next/dynamic`を使用したコンポーネントの動的インポート（`{ ssr: false }`オプション付き）
2. `suppressHydrationWarning`属性を使用する（HTMLの不一致を無視するため、推奨されない）
3. フォーマットや日付表示に関する問題なら、特定のフォーマット関数を両環境で同じように動作するよう統一する

## まとめ

Hydrationエラーは、Next.jsでSSRとCSRを併用する際の一般的な問題です。とくにクライアント依存のAPIや環境依存の値を使用する場合に発生しやすいです。`useEffect`と`useState`を活用してコンポーネントのレンダリングを制御することで、この問題を効果的に解決できます。
````

## File: knowledge/ReactHooksLintErrors.md
````markdown
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
````

## File: knowledge/site_status.md
````markdown
# 四季守サイトの現状

## プロジェクト概要
四季守（Shikimori）は、Next.js 15を使用して開発されたWebアプリケーションです。ユーザー認証、プロフィール管理などの機能を提供することを目的としています。

## 技術スタック
- **フレームワーク**: Next.js 15.1.4
- **言語**: TypeScript
- **UIライブラリ**: React 19
- **スタイリング**: Tailwind CSS
- **認証**: Clerk
- **データベース**: Supabase
- **パッケージマネージャー**: Bun
- **その他のライブラリ**:
  - Radix UI（ダイアログ、スロットなどのコンポーネント）
  - Lucide React（アイコン）
  - React Hook Form（フォーム管理）
  - Sonner（通知）
  - Tailwind CSS関連 (class-variance-authority, tailwind-merge, tailwindcss-animate)

## プロジェクト構造
- **app/**: Next.jsのApp Routerを使用したページとコンポーネント
  - components/: ページ内で使用するコンポーネント
  - api/: APIエンドポイント
  - about/:「About」ページ
  - contact/:「お問い合わせ」ページ
  - legalNotice/:「法的通知」ページ
  - menu/: メニューページ
  - privacy/: プライバシーポリシーページ
  - profile/: ユーザープロフィールページ
- **components/**: 共通UIコンポーネント
- **data/**: ナビゲーションなどの静的データ
- **docs/**: プロジェクトドキュメント
- **lib/**: ユーティリティ関数とヘルパー
- **public/**: 静的アセット（画像など）

## 現在の機能
1. **認証システム**:
   - Clerkを使用したユーザー登録・ログイン機能
   - ユーザープロフィールの表示

2. **UI要素**:
   - ヘッダー（デスクトップ・モバイル対応のナビゲーション）
   - フッター
   - ヒーローセクション
   - 実績セクション
   - お問い合わせフォーム

3. **レスポンシブデザイン**:
   - モバイルとデスクトップ両方に対応したレイアウト

## データモデル
ERダイアグラムによると、以下のエンティティが計画されています：
- ユーザー (users)
- 注文 (orders)
- 地図/作業場所 (maps)
- 支払い (payments)
- 返金 (refunds)

これらのエンティティは相互に関連しており、ユーザーが注文し、注文には地図と支払いが関連付けられ、支払いには返金が関連付けられるという構造になっています。

## 課題と今後の展開
1. コメントアウトされたコードの存在（Headerコンポーネント内など）から、認証システムの実装やUIの詳細はまだ調整中である可能性があります。
2. ERダイアグラムに示されているデータモデルが現在のアプリケーション機能とどのように統合されているかは、さらなる調査が必要です。
3. 本番環境へのデプロイ方法については、READMEでは基本的なVercelでのデプロイが推奨されています。

## 開発環境
- 開発サーバーの起動： `bun dev`
- ビルド： `bun build`
- リント： `bun lint`

## 注意点
- Supabaseを使用していますが、具体的なテーブル構造やAPIエンドポイントの実装詳細は確認が必要です。
- Clerkによる認証は実装されていますが、権限管理や特定のユーザーロールについては確認が必要です。
````

## File: knowledge/supabase_rls_troubleshooting.md
````markdown
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
````

## File: knowledge/TypeScriptLintErrors.md
````markdown
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
````

## File: knowledge/user_registration_profile.md
````markdown
# ユーザープロフィール登録機能について

## 概要

プロフィール登録画面からユーザー情報をSupabaseに登録する機能について説明します。この機能は`/app/profile/page.tsx`に実装されています。

## 実装内容

### テーブル構造

Supabaseには以下のテーブルが利用されています：

**users テーブル**
   - id（PK）
   - clerk_id（Clerkとの連携ID）
   - email
   - first_name
   - last_name
   - phone（電話番号）
   - address（住所）
   - created_at
   - updated_at

### フロー

1. ユーザーがログインすると、Clerkから認証情報を取得
2. `clerk_id`を使ってSupabaseの`users`テーブルを検索
3. ユーザーが存在しない場合は新規作成し、基本情報を保存
4. フォームにユーザー情報を表示
5. ユーザーが情報を更新し、保存すると`users`テーブルを直接更新

### フォーム項目

プロフィールフォームでは以下の情報を編集できます：

- **表示名**: 必須項目（編集不可、Clerkの`first_name`と`last_name`から自動生成）
- **電話番号 (phone)**: 任意
- **住所 (address)**: 任意

### バリデーション

- 表示名は必須項目として設定
- React Hook Formを使用したフォーム管理とバリデーション

### 実装のポイント

1. **Clerk と Supabase の連携**：
   - ClerkからユーザーIDを取得し、Supabaseのデータと紐づけ
   - ユーザーが存在しない場合は自動的に作成
   - 表示名は`first_name`と`last_name`から自動生成

2. **エラーハンドリング**：
   - API呼び出しのエラーをキャッチし、トーストメッセージで表示
   - 不正な状態の回復処理

3. **UI/UX**：
   - レスポンシブデザイン（モバイル対応）
   - 読み込み中の表示
   - ボタンの無効化（処理中）

## 注意点

- ユーザー情報はClerk認証と連携していますが、拡張データ（電話番号、住所など）はSupabaseに保存
- 基本的なユーザー情報（メールアドレス、名前）はClerkから自動取得され、Supabaseにも同期
- 設計をシンプルにするため、プロフィール情報を別テーブルに分けず`users`テーブルに直接保存

## 今後の拡張可能性

- プロフィール画像のアップロード機能
- 独自の表示名設定機能
- より詳細なプロフィール情報の追加（プロフィールテーブルの導入検討）
````

## File: lib/hooks/useIsAdmin.ts
````typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase/client';

export function useIsAdmin() {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAdminStatus = useCallback(async () => {
    if (!isLoaded || !user) {
      // Clerkのユーザー情報が読み込み中または存在しない場合
      setIsLoading(!isLoaded); // isLoadedがfalseの間はローディング中
      if (isLoaded && !user) { // 読み込み完了したがユーザーなし
        setIsAdmin(false);
        setIsLoading(false);
      }
      return;
    }

    // Clerkユーザー情報はあるが、管理者ステータスをこれから取得
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('clerk_id', user.id)
        .single();

      if (error) {
        // Supabaseにユーザーが見つからない、または他のエラー
        console.warn('Admin status check failed:', error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin === true);
      }
    } catch (err) {
      console.error('Unexpected error fetching admin status:', err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]); // useCallbackでメモ化された関数を依存配列に入れる

  return { isAdmin, isLoading };
}
````

## File: lib/supabase/client.ts
````typescript
import { createBrowserClient } from '@supabase/ssr'

// クライアントサイドで使用するためのsupabaseインスタンスを作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 環境変数が設定されているか確認（実行時）
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Supabase URLまたはAnon Keyが設定されていません。.env.localファイルを確認してください。')
}

// 直接使用できるsupabaseインスタンスをエクスポート
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// 関数としても提供（必要に応じて使用）
export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
````

## File: lib/supabase/server.ts
````typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase環境変数が設定されていません')
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
````

## File: lib/authUtils.ts
````typescript
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server'; // サーバーサイド用Supabaseクライアント

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
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
````

## File: lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: prisma/migrations/20250326121500_init/migration.sql
````sql
-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "image_url" TEXT,
    "category" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps" (
    "id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stripe_intent_id" TEXT,
    "stripe_authorized_amount" DECIMAL(10,2),
    "stripe_authorizer_id" TEXT,
    "stripe_captured_amount" DECIMAL(10,2),
    "stripe_captured_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "map_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_order" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "refund_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_id_key" ON "orders"("payment_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
````

## File: prisma/migrations/20250407144308_add_clerk_id/migration.sql
````sql
/*
  Warnings:

  - A unique constraint covering the columns `[clerk_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "clerk_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");
````

## File: prisma/migrations/20250407151755_add_bio_and_address_fields/migration.sql
````sql
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT;
````

## File: prisma/migrations/migration_lock.toml
````toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
````

## File: prisma/schema.prisma
````
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ユーザーモデル
model User {
  id        String   @id @default(uuid()) @db.Uuid
  clerkId   String?  @unique @map("clerk_id")
  isAdmin   Boolean  @default(false) @map("is_admin")
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  email     String   @unique
  phone     String?
  bio       String?  @db.Text
  address   String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // リレーション
  orders    Order[]
  
  @@map("users")
}

// 商品モデル
model Item {
  id          String   @id @default(uuid()) @db.Uuid
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String?  @map("image_url")
  category    String?
  isAvailable Boolean  @default(true) @map("is_available")
  stock       Int      @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // リレーション
  orderItems  OrderItem[]
  
  @@map("items")
}

// 地図/場所モデル
model Map {
  id        String   @id @default(uuid()) @db.Uuid
  address   String
  name      String?
  image     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // リレーション
  orders    Order[]
  
  @@map("maps")
}

// 支払いモデル
model Payment {
  id                     String    @id @default(uuid()) @db.Uuid
  method                 String
  status                 String
  stripeIntentId         String?   @map("stripe_intent_id")
  stripeAuthorizedAmount Decimal?  @map("stripe_authorized_amount") @db.Decimal(10, 2)
  stripeAuthorizerId     String?   @map("stripe_authorizer_id")
  stripeCapturedAmount   Decimal?  @map("stripe_captured_amount") @db.Decimal(10, 2)
  stripeCapturedAt       DateTime? @map("stripe_captured_at")
  createdAt              DateTime  @default(now()) @map("created_at")
  updatedAt              DateTime  @updatedAt @map("updated_at")
  
  // リレーション
  order                  Order?
  refunds                Refund[]
  
  @@map("payments")
}

// 注文モデル
model Order {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  mapId     String   @map("map_id") @db.Uuid
  paymentId String   @unique @map("payment_id") @db.Uuid
  orderDate DateTime @default(now()) @map("order_date")
  status    String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // リレーション
  user      User     @relation(fields: [userId], references: [id])
  map       Map      @relation(fields: [mapId], references: [id])
  payment   Payment  @relation(fields: [paymentId], references: [id])
  orderItems OrderItem[]
  
  @@map("orders")
}

// 注文商品モデル
model OrderItem {
  id           String   @id @default(uuid()) @db.Uuid
  orderId      String   @map("order_id") @db.Uuid
  itemId       String   @map("item_id") @db.Uuid
  quantity     Int
  priceAtOrder Decimal  @map("price_at_order") @db.Decimal(10, 2)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  
  // リレーション
  order        Order    @relation(fields: [orderId], references: [id])
  item         Item     @relation(fields: [itemId], references: [id])
  
  @@map("order_items")
}

// 返金モデル
model Refund {
  id        String   @id @default(uuid()) @db.Uuid
  paymentId String   @map("payment_id") @db.Uuid
  amount    Decimal  @db.Decimal(10, 2)
  refundAt  DateTime @default(now()) @map("refund_at")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // リレーション
  payment   Payment  @relation(fields: [paymentId], references: [id])
  
  @@map("refunds")
}
````

## File: prisma/seed.ts
````typescript
import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/ja'; // 日本語ロケールのFakerを使用

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- ユーザーデータの生成と挿入 ---
  const usersData: Prisma.UserCreateInput[] = [];
  for (let i = 1; i <= 30; i++) {
    const isAdmin = i <= 3; // 最初の3人を管理者とする
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(); // 一意性を高めるため小文字に
    const clerkId = `user_test_${String(i).padStart(3, '0')}`;

    usersData.push({
      // id: Prismaが自動生成 (UUID)
      clerkId: clerkId,
      isAdmin: isAdmin,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: Math.random() < 0.7 ? `090-${faker.string.numeric(4)}-${faker.string.numeric(4)}` : undefined, // 約70%で電話番号を設定
      bio: Math.random() < 0.5 ? faker.lorem.sentence() : undefined, // 約50%でBioを設定
      address: Math.random() < 0.6 ? faker.location.streetAddress(true) : undefined, // 約60%で住所を設定
      // createdAt, updatedAt: Prismaが自動設定
    });
  }

  // createManyで一括挿入 (エラーがあればスキップ)
  // 注意: email/clerkIdが重複するとエラーになる可能性あり。シーケンスで生成しているので通常は問題ないはず。
  console.log(`Seeding ${usersData.length} users...`);
  const createdUsers = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true, // 重複エラーをスキップする場合（開発初期に便利）
  });
  console.log(`Seeded ${createdUsers.count} users.`);


  // --- 商品データの生成と挿入 ---
  const itemCategories = ['除雪', '排雪', '草刈り', '剪定', 'その他'];
  const itemsData: Prisma.ItemCreateInput[] = [];
  for (let i = 1; i <= 30; i++) {
    const category = faker.helpers.arrayElement(itemCategories);
    let name = '';
    switch (category) {
      case '除雪': name = faker.helpers.arrayElement(['標準ローダー除雪', '広範囲除雪', '屋根雪下ろし']); break;
      case '排雪': name = faker.helpers.arrayElement(['軽トラック排雪', '2tダンプ排雪', '4tダンプ排雪']); break;
      case '草刈り': name = faker.helpers.arrayElement(['庭 草刈り', '空き地 草刈り', '法面 草刈り']); break;
      case '剪定': name = faker.helpers.arrayElement(['低木剪定', '高木剪定', '生垣剪定']); break;
      default: name = faker.commerce.productName(); break;
    }
    name += ` (${faker.number.int({ min: 1, max: 5 })}時間)`; // 例として時間を追加

    const isAvailable = i <= 25; // 最初の25件を販売可能に

    itemsData.push({
      // id: Prismaが自動生成 (UUID)
      name: name,
      description: Math.random() < 0.7 ? faker.lorem.paragraph() : undefined, // 約70%で説明を設定
      price: new Prisma.Decimal(faker.commerce.price({ min: 1000, max: 50000, dec: 0 })), // Decimal型で価格を設定
      imageUrl: Math.random() < 0.6 ? faker.image.urlLoremFlickr({ category: 'nature' }) : undefined, // 約60%で画像URL設定
      category: category,
      isAvailable: isAvailable,
      stock: isAvailable ? faker.number.int({ min: 0, max: 50 }) : 0,
      // createdAt, updatedAt: Prismaが自動設定
    });
  }

  console.log(`Seeding ${itemsData.length} items...`);
  const createdItems = await prisma.item.createMany({
    data: itemsData,
    skipDuplicates: true, // 商品名等で重複する可能性は低いが念のため
  });
  console.log(`Seeded ${createdItems.count} items.`);


  console.log("Seeding finished.");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
````

## File: public/file.svg
````
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: types/item.ts
````typescript
import type { Decimal } from '@prisma/client/runtime/library';

// Supabaseから取得する商品データの型
export type Item = {
  id: string; // uuid
  name: string;
  description?: string | null;
  price: number | Decimal;
  image_url?: string | null;
  category?: string | null;
  is_available: boolean;
  stock: number;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
};

// 商品フォームで使用するデータの型
export type ItemFormData = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isAvailable: boolean;
  stock: number;
};

// 商品フォームのプロパティ型
export type ItemFormProps = {
  initialData?: Item | null;
  onSuccess?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

// 商品削除ダイアログのプロパティ型
export type DeleteItemAlertProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemId: string | null;
  itemName?: string;
  onConfirm: () => void;
};
````

## File: types/profile.ts
````typescript
export type ProfileClientProps = {
  mode: 'view' | 'edit' | 'create';
};

export type ProfileViewProps = {
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bio?: string;
    address?: string;
  };
};

// データベースのユーザー型
export type UserRecord = {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio?: string;
  address?: string;
  created_at: string;
  updated_at: string;
};

// コンポーネントのProps型
export type ProfileFormProps = {
  initialData?: Partial<UserRecord>;
  onSuccess?: () => void;
};

// フォーム入力用の型定義
export type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  address: string;
};
````

## File: types/types.ts
````typescript
export type Achievement = {
  id: string
  title: string
  imageSrc: string
  alt: string
  date: string
}
````

## File: types/user.ts
````typescript
// ユーザー型定義
export type User = {
  id: string;
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  address: string | null;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
};
````

## File: .eslintrc.js
````javascript
module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/ban-types': 'off',
    'react/no-unescaped-entities': 'off',
    'typescript-eslint/no-explicit-any': 'off'
  }
};
````

## File: .prettierrc
````
{
  "arrowParens": "avoid",
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "none",
  "tabWidth": 2,
  "semi": false,
  "proseWrap": "always",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
````

## File: .textlintrc
````
{
  "rules": {
    "preset-jtf-style": true,
    "no-space-between-full-width": true,
    "no-space-around-parentheses": true,
    "no-mixed-zenkaku-and-hankaku": {
      "space": "always",
      "alphabet": "always",
      "number": "always",
      "parentheses": "always"
    }
  }
}
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
````

## File: middleware.ts
````typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
````

## File: postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: app/api/webhook/clerk/route.ts
````typescript
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Webhookシークレットの検証
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  // リクエストヘッダーの取得
  const headersList = req.headers;
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // リクエストボディの取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Webhookの検証
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // イベントタイプに基づいた処理
  const eventType = evt.type;
  console.log(`Webhook event type: ${eventType}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses[0]?.email_address;
    const phone = phone_numbers[0]?.phone_number;

    if (!email) {
      return new Response('Error: No email found', { status: 400 });
    }

    try {
      // Supabaseにユーザーを作成/更新
      const { error } = await supabase
        .from('users')
        .upsert({
          clerk_id: id,
          email,
          first_name: first_name || '',
          last_name: last_name || '',
          phone: phone || '',
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
  } else if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Supabaseからユーザーを削除
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', id);

      if (error) {
        console.error('Error deleting user:', error);
        return new Response(`Error deleting user: ${error.message}`, { status: 500 });
      }

      return NextResponse.json({ success: true, event: eventType });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(`Error processing webhook: ${error}`, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, message: 'Webhook received' });
}
````

## File: app/components/Achievements.tsx
````typescript
'use client'

import Image from 'next/image'
import { achievements } from '@/data/achievement'
import type { Achievement } from '@/types/types'

export default function Achievements() {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <h2>実績</h2>
        <div className='flex gap-4'>
          {achievements.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className='rounded border-2 border-gray-200 bg-muted p-4'
            >
              <div className='relative aspect-video w-60 rounded-sm border-2 border-muted'>
                <Image
                  src={achievement.imageSrc}
                  alt={achievement.alt}
                  fill
                  className='rounded-sm object-cover object-top'
                />
              </div>
              <div className='my-2 text-sm font-semibold'>
                {achievement.title}
              </div>
              <div className='font-mono text-xs'>{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
````

## File: data/navigations.ts
````typescript
export const navListItems = [
  {
    label: '四季守とは',
    href: '/about'
  },
  {
    label: 'メニュー',
    href: '/menu'
  },
  {
    label: 'お問い合わせ',
    href: '/contact'
  }
]

export const footerNavListItems = [
  {
    label: '四季守とは',
    href: '/about'
  },
  {
    label: 'メニュー',
    href: '/menu'
  },
  {
    label: 'プライバシー・ポリシー',
    href: '/privacy'
  },
  {
    label: '特定商取引法に基づく表記',
    href: '/legalNotice'
  },
  {
    label: 'お問い合わせ',
    href: '/contact'
  }
]
````

## File: docs/er.md
````markdown
## ER 図

```mermaid
erDiagram

%% エンティティ定義
users ||--o{ orders : "注文"
orders ||--|| maps : "作業場所"
orders ||--|| payments : "支払い"
payments ||--|| refunds : "返金"
orders ||--o{ order_items : "含む"
order_items }o--|| items : "参照"

%% エンティティ詳細
users {
  int id PK
  boolean is_admin
  string first_name
  string last_name
  string email
  string phone
  date createdAt
  date updatedAt
}

orders {
  int id PK
  int user_id FK
  int map_id FK
  int payment_id FK
  date order_date
  enum status
  date createdAt
  date updatedAt
}

maps{
  int id PK
  int order_id FK
  string address
  string name
  string image
  date createdAt
  date updatedAt
}

refunds {
  int id PK
  int order_id FK
  number amount
  date refundAt
  date createdAt
  date updatedAt
}

payments {
  int id PK
  int order_id FK
  enum method
  enum status
  string stripe_intent_id
  number stripe_authorized_amount
  string stripe_authorizer_id
  number stripe_captured_amount
  string stripe_capturedAt
  date createdAt
  date updatedAt
}

items {
  int id PK
  string name
  string description
  number price
  string image_url
  enum category
  boolean is_available
  int stock
  date createdAt
  date updatedAt
}

order_items {
  int id PK
  int order_id FK
  int item_id FK
  int quantity
  number price_at_order
  date createdAt
  date updatedAt
}
````

## File: eslint.config.mjs
````
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  }
];

export default eslintConfig;
````

## File: next.config.js
````javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ビルド時の型チェックを一時的に無効化
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintチェックを一時的に無効化
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['loremflickr.com'],
  
  },
};

module.exports = nextConfig;
````

## File: app/components/contact.tsx
````typescript
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  return (
    <div className='container mx-auto prose prose-sm'>
      <div className='flex flex-col gap-4 p-4'>
        <h2>お問い合わせ</h2>
        <form
          action='https://ssgform.com/s/uV0iqmPuFyP0'
          method='post'
          className='flex flex-col gap-4'
        >
          <label htmlFor='name' className='space-y-1'>
            <span>お名前</span>
            <Input type='text' name='name' id='name' required />
          </label>
          <label htmlFor='email' className='space-y-1'>
            <span>メールアドレス</span>
            <Input type='email' name='email' id='email' required />
          </label>
          <label htmlFor='message' className='space-y-1'>
            <span>お問い合わせ内容</span>
            <Textarea name='message' id='message' required />
          </label>
          <Button variant='default' type='submit'>
            送信する
          </Button>
        </form>
      </div>
    </div>
  )
}
````

## File: app/components/Hero.tsx
````typescript
'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  // クライアントサイドのマウント状態を管理
  const [isMounted, setIsMounted] = useState(false)

  // コンポーネントがマウントされた後にのみtrueにする
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 基本的なコンテンツ構造をサーバーとクライアントで共通にする
  const content = (
    <div className='flex flex-col justify-center gap-4'>
      <h2 className='text-lg font-bold'>四季守メニュー</h2>
      <div className=''>
        <div className='group flex gap-4 rounded-xl border-2 border-green-200/30 bg-muted p-6 shadow-sm duration-500 hover:border-green-300 hover:shadow-lg'>
          <div className='flex aspect-square h-20 w-20 items-center justify-center rounded-md border-2 border-primary-foreground bg-green-200'>
            画像
          </div>
          <div className='flex flex-col justify-center gap-2'>
            <h2 className='text-md font-bold'>
              ローダー除雪とダンプ排雪サービス
            </h2>
            <p className='text-sm text-muted-foreground'>
              四季守では、秋田県内の、ローダー除雪、排雪の予約ができます。
            </p>
            <p className='text-xs text-muted-foreground'>
              実施期間：2024年10月1日〜2025年03月31日
            </p>
            <p className='text-xs text-muted-foreground'>
              料金：¥50,000〜/hour（要お見積り）
            </p>
            <p className='text-xs text-muted-foreground'>募集：受付中</p>
          </div>
        </div>
      </div>
      <div className=''>
        <div className='group flex gap-4 rounded-xl border bg-muted p-6 shadow-sm duration-500 hover:shadow-lg'>
          <div className='flex aspect-square h-20 w-20 items-center justify-center rounded-md border-2 border-primary-foreground bg-green-200'>
            画像
          </div>
          <div className='flex flex-col justify-center gap-2'>
            <h2 className='text-md font-bold'>重機での草刈り（準備中）</h2>
            <p className='text-sm text-muted-foreground'>
              四季守では、秋田県内の、重機での草刈りの予約ができます。
            </p>
            <p className='text-xs text-muted-foreground'>
              実施期間：2025年4月1日〜2025年10月31日
            </p>
            <p className='text-xs text-muted-foreground'>
              料金：¥50,000〜/hour（要お見積り）
            </p>
            <p className='text-xs text-muted-foreground'>
              募集：2025年3月から予約受け付け予定
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // クライアントサイドの拡張UI要素
  if (isMounted) {
    return (
      <>
        {content}
      </>
    )
  }

  // サーバーサイドレンダリング時は基本的なコンテンツを返す
  return content
}
````

## File: app/components/mobile-nav.tsx
````typescript
'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { navListItems } from '@/data/navigations'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SignedIn } from '@clerk/nextjs'
import { useIsAdmin } from '@/lib/hooks/useIsAdmin'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAdmin, isLoading } = useIsAdmin()

  // クライアントサイドのみで実行
  useEffect(() => {
    setMounted(true)
  }, [])

  // サーバーサイドとクライアントサイドで一貫したコンテンツ
  const mobileMenuButton = (
    <Button size='icon' variant='outline'>
      <Menu size={18} />
    </Button>
  )

  // サーバーサイドレンダリング時は最小限の構造のみを返す
  if (!mounted) {
    return mobileMenuButton
  }

  // クライアントサイドでのみ完全なメニューを表示
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {mobileMenuButton}
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>メニュー</SheetTitle>
        <ul className='flex list-none flex-col'>
          {navListItems.map(item => (
            <li key={item.href} className='my-2'>
              <Button variant='ghost' asChild onClick={() => setOpen(false)}>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
          {/* 管理者リンクの条件付き表示 */}
          <SignedIn>
            {mounted && !isLoading && isAdmin && (
              <li className='my-2'>
                <Button variant='ghost' asChild onClick={() => setOpen(false)}>
                  <Link href='/admin'>管理</Link>
                </Button>
              </li>
            )}
          </SignedIn>
        </ul>
        <div className='grid grid-cols-2 gap-2 sticky top-full'>
          <Button variant='ghost' asChild onClick={() => setOpen(false)}>
            <Link href='/register'>登録</Link>
          </Button>
          <Button variant='ghost' asChild onClick={() => setOpen(false)}>
            <Link href='/login'>ログイン</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
````

## File: app/legalNotice/page.tsx
````typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | 四季守',
  description: '当社の特定商取引法に基づく表記を説明します。',
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 prose prose-sm dark:prose-invert">
      <h1 className="heading2">特定商取引法に基づく表記</h1>

      <div>
        <div>
          <h2>事業者の名称</h2>
          <p>四季守</p>
        </div>

        <div>
          <h2>代表者名</h2>
          <p>代表 三ッ倉 利晃</p>
        </div>

        <div>
          <h2>所在地</h2>
          <p>〒017-0044</p>
          <p>秋田県大館市御成町</p>
        </div>

        <div>
          <h2>お問い合わせ先</h2>
          <p>電話番号：090-1234-5678</p>
          <p>メールアドレス：shikimori@gmail.com</p>
          <p>受付時間：平日9:00〜18:00（土日祝日・年末年始を除く）</p>
        </div>

        <div>
          <h2>提供するサービス</h2>
          <ul>
            <li>除雪サービス</li>
            <li>除草サービス</li>
          </ul>
        </div>

        <div>
          <h2>料金</h2>
          <p>除雪サービス・排雪サービス:</p>
          <ul>
            <li>基本料金：50,000円（税込）/ 1時間</li>
            <li>最低料金：5,000円（税込）</li>
          </ul>
          <p>除草サービス・重機サービス:</p>
          <ul>
            <li>基本料金：50,000円（税込）/ 1時間</li>
            <li>最低料金：10,000円（税込）</li>
          </ul>
          <p>※面積や状況により料金が変動する場合がごさいます。</p>
        </div>

        <div>
          <h2>支払方法</h2>
          <ul>
            <li>クレジットカード決済（VISA, MasterCard, JCB, American Express）</li>
            <li>銀行振込</li>
            <li>現金払い</li>
          </ul>
          <p>※銀行振込の場合、振込手数料はお客様負担となります。</p>
        </div>

        <div>
          <h2>サービス提供時期</h2>
          <p>除雪サービス:</p>
          <ul>
            <li>原則として、降雪後24時間以内に作業を開始</li>
            <li>緊急対応は別途料金にて24時間受付</li>
          </ul>
          <p>除草サービス:</p>
          <ul>
            <li>ご予約日の指定時間に作業を実施</li>
            <li>荒天時は、お客様と相談の上で日程を変更</li>
          </ul>
        </div>

        <div>
          <h2>キャンセルポリシー</h2>
          <ul>
            <li>前日までのキャンセル：料金の80%</li>
            <li>当日キャンセル：料金の100%</li>
            <li>作業開始後のキャンセル：料金の100%</li>
          </ul>
        </div>

        <div>
          <h2>返品・返金について</h2>
          <p>サービスの性質上、返品は承っておりません。</p>
          <p>作業内容に不備があった場合は、無償で補修対応いたします。</p>
        </div>

        <div>
          <h2>その他の特記事項</h2>
          <ul>
            <li>作業に必要な電気・水道は、作業する環境によってお客様のものを使用させていただく場合があります。</li>
            <li>特殊な作業や機材が必要な場合は、別途料金が発生する場合があります。</li>
            <li>当社が責任を負うべき事由により損害が生じた場合、実際に生じた直接の損害に限り補償いたします。</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
````

## File: app/menu/page.tsx
````typescript
import { createClient } from '@/lib/supabase/server';
import ItemCard from './components/ItemCard';
import type { Item } from '@/types/item';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'メニュー | 四季守',
  description: '当店で提供している美味しいメニューの一覧をご覧いただけます。',
};

export default async function Page() {
  let items: Item[] | null = null;
  let fetchError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    items = data;
  } catch (error) {
    console.error('Error fetching items:', error);
    fetchError = '商品の読み込み中にエラーが発生しました。';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="heading2">メニュー一覧</h1>

      {fetchError && <p className="text-red-500">{fetchError}</p>}

      {!fetchError && (!items || items.length === 0) && (
        <p>現在、表示できる商品はありません。</p>
      )}

      {items && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
````

## File: app/privacy/page.tsx
````typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシー・ポリシー | 四季守',
  description: '当社のプライバシー・ポリシーを説明します。',
};

export default function Page() {

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 prose prose-sm dark:prose-invert">
      <h1 className="heading2">プライバシー・ポリシー</h1>
      
      <div>
        <section>
          <h2>1. 個人情報の取得について</h2>
          <p>当社は、サービスの提供にあたり、以下の個人情報を取得いたします：</p>
          <ul>
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>電話番号</li>
            <li>住所</li>
            <li>写真データ</li>
          </ul>
        </section>

        <section>
          <h2>2. 個人情報の利用目的</h2>
          <p>取得した個人情報は、以下の目的で利用いたします：</p>
          <ul>
            <li>サービスの提供および運営</li>
            <li>ご本人確認</li>
            <li>お問い合わせへの対応</li>
            <li>サービスの品質向上</li>
            <li>重要なお知らせの送信</li>
          </ul>
        </section>

        <section>
          <h2>3. 個人情報の管理</h2>
          <p>当社は、お客様の個人情報を適切に管理し、以下を徹底します：</p>
          <ul>
            <li>個人情報への不正アクセス防止のための措置</li>
            <li>個人情報の紛失、破壊、改ざん防止のための措置</li>
            <li>その他の安全管理措置</li>
          </ul>
        </section>

        <section>
          <h2>4. 個人情報の共有</h2>
          <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません：</p>
          <ul>
            <li>お客様の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要な場合</li>
          </ul>
        </section>

        <section>
          <h2>5. 個人情報の開示・訂正・削除・停止</h2>
          <p>お客様は、当社が保有する個人情報について、開示、訂正、削除を請求することができます。その場合は、当社所定の方法にてご連絡ください。</p>
        </section>

        <section>
          <h2>6. お問い合わせ窓口</h2>
          <p>個人情報の取扱いに関するお問い合わせは、以下の窓口までご連絡ください：</p>
          <div>
            <p>メールアドレス：[shikimori@gmail.jp]</p>
            <p>受付時間：平日9:00〜18:00（土日祝日・年末年始を除く）</p>
          </div>
        </section>

        <section>
          <h2>7. プライバシーポリシーの変更</h2>
          <p>当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更した場合は、当ウェブサイトでお知らせいたします。</p>
        </section>

        <div>
          <p>制定日：2025年2月20日</p>
        </div>
      </div>
    </div>
  )
}
````

## File: app/profile/components/ProfileClient.tsx
````typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';
import { supabase } from '@/lib/supabase/client';
import type { ProfileClientProps } from '@/types/profile';

export default function ProfileClient({ mode }: ProfileClientProps) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    bio?: string;
    address?: string;
    created_at: string;
    updated_at: string;
  } | null>(null);
  const [needsCreate, setNeedsCreate] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // ユーザー情報を取得
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();
      
      // ユーザーが存在しない場合は作成する
      if (userError || !userData) {
        console.log('User not found, needs creation');
        setNeedsCreate(true);
        setUserData(null);
      } else {
        setUserData(userData);
        setNeedsCreate(false);
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProfile = useCallback(async () => {
    if (!user || !needsCreate) return;
    
    setLoading(true);
    
    try {
      // 基本的なユーザー情報を取得
      const email = user.primaryEmailAddress?.emailAddress || '';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      
      // 現在の日時を取得
      const now = new Date().toISOString();
      
      // メールアドレスで既存ユーザーを確認
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        console.log('User with this email exists, updating clerk_id');
        
        // 既存ユーザーのclerk_idを更新
        const { error: updateError } = await supabase
          .from('users')
          .update({
            clerk_id: user.id,
            first_name: firstName,
            last_name: lastName,
            updated_at: now,
          })
          .eq('id', existingUser.id);
          
        if (updateError) {
          console.log('Error updating user:', updateError);
          toast.error(`ユーザー情報の更新に失敗しました: ${updateError.message}`);
          return;
        }
        
        toast.success('既存ユーザー情報を更新しました');
      } else {
        // ユーザーを新規作成
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: crypto.randomUUID(), // UUIDを手動で生成
            clerk_id: user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone: '',
            created_at: now,
            updated_at: now,
          });
        
        if (createError) {
          console.log('Error creating user:', createError);
          toast.error(`ユーザー情報の作成に失敗しました: ${createError.message}`);
          return;
        }
        
        toast.success('プロフィールを新規作成しました');
      }
      
      // プロフィールを再取得
      fetchProfile();
    } catch (err) {
      console.log('Unexpected error creating user:', err);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [user, needsCreate, fetchProfile]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user, fetchProfile]);

  useEffect(() => {
    if (needsCreate && mode !== 'create') {
      createProfile();
    }
  }, [needsCreate, mode, createProfile]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-slate-900/20 rounded-lg shadow dark:shadow-slate-800/80">
        <h1 className="heading2">プロフィール</h1>
        <p>プロフィールを表示するにはログインしてください。</p>
      </div>
    );
  }

  if (needsCreate || mode === 'create') {
    return <ProfileForm onSuccess={fetchProfile} />;
  }

  if (mode === 'edit' && userData) {
    return <ProfileForm initialData={userData} onSuccess={fetchProfile} />;
  }

  if (userData) {
    return <ProfileView userData={userData} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-slate-800">
      <h1 className="text-2xl font-bold mb-6">プロフィール</h1>
      <p>プロフィール情報の読み込み中にエラーが発生しました。</p>
    </div>
  );
}
````

## File: app/profile/components/ProfileForm.tsx
````typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import type { ProfileFormData, ProfileFormProps } from '@/types/profile';

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: initialData?.first_name || '',
      lastName: initialData?.last_name || '',
      phone: initialData?.phone || '',
      bio: initialData?.bio || '',
      address: initialData?.address || '',
    }
  });

  /**
   * プロフィール情報を更新する
   */
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast.error('ユーザー情報が取得できません');
      return;
    }
    
    setLoading(true);
    
    try {
      // データベース更新用のオブジェクトを作成
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        bio: data.bio,
        address: data.address,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('clerk_id', user.id);
        
      if (error) {
        console.error('プロフィール更新エラー:', error.message);
        toast.error('プロフィールの更新に失敗しました');
        return;
      }
      
      toast.success('プロフィールを更新しました');
      if (onSuccess) onSuccess();
      
      router.push('/profile');
    } catch (error) {
      console.error('予期せぬエラー:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white dark:bg-slate-900/20 rounded-lg shadow dark:shadow-slate-800/80">
      <h1 className="heading2">プロフィール{initialData ? '編集' : '登録'}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">名</Label>
            <Input
              id="firstName"
              autoComplete='off'
              {...register('firstName', { required: '名は必須です' })}
              placeholder="名"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">姓</Label>
            <Input
              id="lastName"
              autoComplete='off'
              {...register('lastName', { required: '姓は必須です' })}
              placeholder="姓"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">住所</Label>
          <Input
            id="address"
            autoComplete='off'
            {...register('address')}
            placeholder="住所"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete='off'
            {...register('phone')}
            placeholder="電話番号"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">自己紹介</Label>
          <Textarea
            id="bio"
            autoComplete='off'
            {...register('bio')}
            placeholder="自己紹介"
            rows={4}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/profile')}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'プロフィールを保存中...' : 'プロフィールを保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
````

## File: app/profile/components/ProfileView.tsx
````typescript
'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ProfileViewProps } from '@/types/profile';



export default function ProfileView({ userData }: ProfileViewProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', user.id);
        
      if (error) {
        console.log('Error deleting profile:', error);
        toast.error('プロフィールの削除に失敗しました');
      } else {
        toast.success('プロフィールを削除しました');
        window.location.reload();
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };
  return (
    <div className="max-w-4xl mt-10 mx-auto p-4 bg-white dark:bg-slate-900/20 rounded-lg shadow dark:shadow-slate-800/80">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">名前</h2>
          <p>{userData.first_name} {userData.last_name}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">メールアドレス</h2>
          <p>{userData.email}</p>
        </div>
        
        {userData.address && (
          <div>
            <h2 className="text-lg font-semibold">住所</h2>
            <p>{userData.address}</p>
          </div>
        )}
        
        {userData.phone && (
          <div>
            <h2 className="text-lg font-semibold">電話番号</h2>
            <p>{userData.phone}</p>
          </div>
        )}
        
        {userData.bio && (
          <div>
            <h2 className="text-lg font-semibold">自己紹介</h2>
            <p className="whitespace-pre-wrap">{userData.bio}</p>
          </div>
        )}
        
        <div className="pt-4 flex gap-4">
          <Link href="/profile/edit">
            <Button>プロフィールを編集</Button>
          </Link>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">プロフィールを削除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>プロフィールを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。プロフィール情報がすべて削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loading}>
                  {loading ? '削除中...' : '削除する'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
````

## File: tailwind.config.ts
````typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate'), require("@tailwindcss/typography")],
} satisfies Config
````

## File: app/about/page.tsx
````typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '四季守とは | 四季守',
  description: '四季守の概要を説明します。',
};

export default function About() {
  return (
    <>
      <div className='container mx-auto max-w-4xl mt-10 p-6 prose prose-sm dark:prose-invert'>
        <h1>四季守とは</h1>
        <p>
          四季守は、四季の除雪と草刈りを行うサービスです。
        </p>

        <h2>概要</h2>
        <p>
          四季守は、重機によるプロフェッショナルな除雪・草刈りサービスです。個人宅から法人まで、幅広いニーズに対応し、安全・安心・快適な環境づくりに貢献します。
        </p>

        <h2>ブランドコンセプト</h2>
        <p>「四季を彩り、暮らしを守る」</p>
        <p>
          四季折々の自然の美しさを守り、お客様の生活をサポートします。
        </p>

        <h2>サービス内容</h2>
        <h3>重機による除雪サービス</h3>
        <ul>
          <li>
            個人宅向け： 玄関先から駐車場までの除雪、雪かき、排雪など
          </li>
          <li>法人向け： 駐車場、通路、敷地内の除雪と排雪、雪堆積場の確保など</li>
          <li>地域向け： 道路、公園、公共施設の除雪と排雪</li>
        </ul>

        <h3>重機による草刈りサービス</h3>
        <ul>
          <li>個人宅向け： 庭、空き地の草刈り、雑草処理、庭木の剪定など</li>
          <li>法人向け： 敷地内の草刈り、雑草管理、緑地管理など</li>
          <li>地域向け： 公園、河川敷、道路沿いの草刈り</li>
        </ul>

        <h2>強み</h2>
        <ul>
          <li>
            プロフェッショナル:経験豊富な専門スタッフが、安全かつ効率的に作業を行います。
          </li>
          <li>重機: 最新の重機を導入し、短時間で広範囲の作業が可能です。</li>
          <li>安心: 損害保険に加入しており、万が一の事故にも対応します。</li>
          <li>
            柔軟性:
            お客様のニーズに合わせて、柔軟なサービスプランをご提案します。
          </li>
        </ul>

        <h2>料金体系</h2>
        <ul>
          <li>個人宅向け: 定額制プラン、都度払いプラン</li>
          <li>法人向け: 契約プラン、スポットプラン</li>
          <li>地域向け: 協議</li>
        </ul>

        <h2>マーケティング戦略</h2>
        <ul>
          <li>ターゲット層: 個人宅、法人、地域</li>
          <li>プロモーション: チラシ、DM、Web広告、SNS</li>
          <li>
            クロスセリング: 除雪・草刈り以外のサービスとの連携 (例:
            庭木の剪定、害虫駆除)
          </li>
        </ul>

        <h2>運営体制</h2>
        <ul>
          <li>専門スタッフ: 経験豊富なオペレーター、技術者</li>
          <li>品質管理: 作業後の確認、定期的なメンテナンス</li>
          <li>業務効率化: 作業計画の作成、人員配置の最適化</li>
        </ul>

        <h2>将来展開</h2>
        <ul>
          <li>フランチャイズ展開: 全国展開</li>
          <li>サービス拡張: 樹木伐採、害虫駆除、庭のリフォームなど</li>
          <li>地域展開: 地域密着型のサービス展開</li>
        </ul>
        
        <h2>ブランド展開による効果</h2>
        <ul>
          <li>
            多様な顧客ニーズへの対応: 個人宅、法人、地域など、幅広い顧客層に対応
          </li>
          <li>
            収益機会の拡大: 除雪・草刈り以外のサービス展開による収益源の確保
          </li>
          <li>ブランド価値の向上: 高品質なサービス提供による信頼性向上</li>
        </ul>

        <h2>最後に</h2>
        <p>
          四季守は、お客様の暮らしをより快適にするために、常にサービスの向上に努めています。重機による除雪・草刈りサービスのことなら、ぜひ四季守にお任せください。
        </p>
      </div>
    </>
  )
}
````

## File: app/contact/page.tsx
````typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Page() {
  return (
    <div className='container prose prose-sm mx-auto p-6 dark:prose-invert'>
      <p className='mt-10'>
        お見積りのお問い合わせなどこちらからお問い合わせください。
      </p>
      <div className='mt-10 flex flex-col items-center justify-center gap-4 p-4'>
        <div className='min-h-[721px] w-full max-w-2xl'>
          <h2>お問い合わせ</h2>
          <form
            action='https://ssgform.com/s/uV0iqmPuFyP0'
            method='post'
            className='flex flex-col gap-4'
          >
            <label htmlFor='name' className='space-y-1'>
              <span>お名前</span>
              <Input type='text' name='name' id='name' required />
            </label>
            <label htmlFor='email' className='space-y-1'>
              <span>メールアドレス</span>
              <Input type='email' name='email' id='email' required />
            </label>
            <label htmlFor='message' className='space-y-1'>
              <span>お問い合わせ内容</span>
              <Textarea name='message' id='message' required />
            </label>
            <Button variant='default' type='submit'>
              送信する
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
.env.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.windsurfrules

# knowledge
# /knowledge
````

## File: app/profile/page.tsx
````typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロフィール | 四季守',
  description: 'お客様のプロフィールを管理できます。',
};

import ProfileClient from './components/ProfileClient';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="heading2">プロフィール</h1>
      <ProfileClient mode="view" />
    </div>
  );
}
````

## File: app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

body{
	@apply mx-auto bg-white text-black dark:bg-slate-950 dark:text-slate-100  
}

.heading2 {
  @apply text-3xl font-bold mb-4;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}



@layer base {
  * {
    @apply border-border outline-ring/50;}
  body {
    @apply bg-background text-foreground;}}
````

## File: app/page.tsx
````typescript
import { createClient } from '@/lib/supabase/server'

import Hero from './components/Hero'

export default async function Home() {
  let data = null
  let error = null

  try {
    const supabase = await createClient()
    console.log('Supabaseクライアント作成成功')

    const result = await supabase.from('items').select('*')
    data = result.data
    error = result.error

    if (error) {
      console.error('Supabaseエラー:', error)
    } else {
      console.log('データ取得成功:', data ? `${data.length}件のアイテム` : 'データなし')
    }
  } catch (e) {
    console.error('予期せぬエラーが発生しました:', e)
  }

  return (
    <main className='container mx-auto max-w-4xl flex flex-col gap-16 px-6 py-12'>
      <Hero />
      {/* <Achievements /> */}
      {/* <Contact /> */}
    </main>
  )
}
````

## File: app/components/Footer.tsx
````typescript
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { footerNavListItems } from '@/data/navigations'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='sticky top-full w-full border-t mt-10'>
      <div className='flex flex-col items-center justify-center text-muted-foreground p-6 text-sm'>
        <h2>四季守</h2>
        <ul className='flex flex-wrap list-none py-4'>
          {footerNavListItems.map(item => (
            <li key={item.href}>
              <Button variant='ghost' asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <p>&copy; 2025 Shikimori All Rights Reserved.</p>
      </div>
    </footer>
  )
}
````

## File: app/layout.tsx
````typescript
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import Footer from './components/Footer'
import Header from './components/Header'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='ja' suppressHydrationWarning>
        <body
          className={cn(
            geistSans.variable,
            geistMono.variable,
            'min-h-dvh antialiased'
          )}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
            <Toaster position='top-right' />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
````

## File: app/components/Header.tsx
````typescript
'use client'

import { Button } from '@/components/ui/button'
import { navListItems } from '@/data/navigations'
import Link from 'next/link'
import MobileNav from './mobile-nav'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs'
import { useIsAdmin } from '@/lib/hooks/useIsAdmin' // 管理者判定フックをインポート
import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
  const { isAdmin, isLoading } = useIsAdmin(); // 管理者判定フックを使用
  return (
    <header className='flex h-16 items-center justify-between border-b px-6'>
      <h1 className='font-bold'>
        <Button variant='ghost' asChild>
          <Link href='/'>四季守</Link>
        </Button>
      </h1>
      <div className='flex-1' />
      <nav className='hidden md:block'>
        <ul className='flex list-none items-center'>
          {navListItems.map(item => (
            <li key={item.href}>
              <Button variant='ghost' asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
          {/* 管理者リンクの条件付き表示 */}
          <SignedIn>
            {!isLoading && isAdmin && (
              <li>
                <Button variant='ghost' asChild>
                  <Link href='/admin'>ダッシュボード</Link>
                </Button>
              </li>
            )}
          </SignedIn>
        </ul>
      </nav>
      <SignedIn>
        <div className='mr-4'>
          <Button variant='ghost' asChild>
            <Link href='/profile'>プロフィール登録</Link>
          </Button>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton
          mode='modal'
          appearance={{
            elements: {
              rootBox: 'mx-1',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700'
            },
            variables: {
              colorPrimary: '#4f46e5'
            }
          }}
        >
          <Button variant='ghost'>ログイン</Button>
        </SignInButton>
        <SignUpButton
          mode='modal'
          appearance={{
            elements: {
              rootBox: 'mx-1',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700'
            },
            variables: {
              colorPrimary: '#4f46e5'
            }
          }}
        >
          <Button variant='ghost'>登録</Button>
        </SignUpButton>
      </SignedOut>
      <div className='items-center hidden md:block'>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className='md:hidden'>
        <MobileNav />
      </div>
      <div className='ml-6'>
        <ModeToggle />
      </div>
    </header>
  )
}
````

## File: package.json
````json
{
  "name": "shikimori",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:seed": "prisma db seed"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.12.1",
    "@faker-js/faker": "^9.6.0",
    "@prisma/client": "6.5.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-slot": "^1.2.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.1",
    "@tailwindcss/typography": "^0.5.16",
    "add": "^2.0.6",
    "button": "^1.1.1",
    "checkbox": "^0.0.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "dialog": "^0.3.1",
    "lucide-react": "^0.475.0",
    "next": "15.1.4",
    "next-themes": "^0.4.6",
    "prettier": "^3.5.0",
    "prisma": "^6.5.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "shadcn-ui": "^0.9.5",
    "sonner": "^2.0.1",
    "svix": "^1.60.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7"
  },
  "prisma": {
    "seed": "bun --bun prisma/seed.ts"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.1.4",
    "postcss": "^8",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailwindcss": "^3.4.1",
    "textlint": "^14.4.2",
    "textlint-rule-preset-jtf-style": "^3.0.2",
    "typescript": "^5"
  }
}
````
