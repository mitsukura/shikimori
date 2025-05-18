'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getPosts } from '@/lib/services/post-service'
import type { Post } from '@/lib/services/post-service'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const postsData = await getPosts(100, 0)
        setPosts(postsData)
      } catch (error) {
        console.error('記事の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    // 確認ダイアログを表示
    if (window.confirm('この記事を削除してもよろしいですか？')) {
      try {
        // 実際の削除処理はまだ実装されていません
        // 実装後はここで削除APIを呼び出します
        console.log(`記事ID ${id} を削除します`)
        
        // 削除後は記事一覧を更新
        setPosts(posts.filter(post => post.id !== id))
      } catch (error) {
        console.error('記事の削除に失敗しました:', error)
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ブログ記事管理</h1>
        <Button onClick={() => router.push('/admin/blog/new')}>
          <Plus className="mr-2 h-4 w-4" />
          新規記事作成
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>記事一覧</CardTitle>
          <CardDescription>公開中のブログ記事一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">読み込み中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-lg">記事がありません。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">タイトル</th>
                    <th className="text-left py-3 px-4">作成日</th>
                    <th className="text-left py-3 px-4">更新日</th>
                    <th className="text-right py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <Link href={`/blog/${post.id}`} className="text-blue-600 hover:underline">
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: ja })}
                      </td>
                      <td className="py-3 px-4">
                        {format(new Date(post.updatedAt), 'yyyy年MM月dd日', { locale: ja })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
