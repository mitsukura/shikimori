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
import type { Item, ItemFormData, ItemFormProps } from '@/types/item';

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
