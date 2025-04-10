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
