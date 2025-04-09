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
