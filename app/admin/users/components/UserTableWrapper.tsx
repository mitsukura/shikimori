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
        <div className="border rounded-md overflow-x-auto">
          <Table className="min-w-full whitespace-nowrap">
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
                        {/* clerk_idまたはclerkIdのどちらかを使用 */}
                        <Link href={`/profile/${user.clerk_id || user.clerkId}`}>詳細</Link>
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
