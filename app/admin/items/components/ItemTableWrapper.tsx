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
        <div className="border rounded-lg overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">商品名</TableHead>
                <TableHead className="whitespace-nowrap">価格</TableHead>
                <TableHead className="whitespace-nowrap">カテゴリ</TableHead>
                <TableHead className="whitespace-nowrap">在庫</TableHead>
                <TableHead className="whitespace-nowrap">販売状態</TableHead>
                <TableHead className="text-right whitespace-nowrap">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium whitespace-nowrap">{item.name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {typeof item.price === 'number'
                      ? item.price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })
                      : Number(item.price).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{item.category || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.stock}</TableCell>
                  <TableCell className="whitespace-nowrap">
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
