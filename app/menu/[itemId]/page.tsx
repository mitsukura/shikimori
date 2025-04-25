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
  const { itemId } = await params;
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
  const { itemId } = await params;
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
                  現在、秋田県の県北部および周辺地域で対応しております。詳細なエリアについては、お問い合わせください。
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
