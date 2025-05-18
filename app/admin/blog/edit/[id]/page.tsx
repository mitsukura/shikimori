'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getPostById, getCategories, Category } from '@/lib/services/post-service'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // paramsをReact.use()でアンラップ
  const unwrappedParams = 'then' in params ? use(params) : params;
  const postId = Number.parseInt(unwrappedParams.id, 10);

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    async function fetchData() {
      try {
        // 記事データの取得
        const post = await getPostById(postId)
        if (post) {
          setTitle(post.title)
          setContent(post.content)
          setCategoryId(post.categoryId)
        } else {
          setError('記事が見つかりませんでした')
        }

        // カテゴリデータの取得
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (err) {
        console.error('データの取得に失敗しました:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (!Number.isNaN(postId)) {
      fetchData()
    } else {
      setError('無効な記事IDです')
      setLoading(false)
    }
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('タイトルを入力してください')
      return
    }

    if (!content.trim()) {
      setError('内容を入力してください')
      return
    }

    if (!userId) {
      setError('認証情報が取得できませんでした')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('posts')
        .update({
          title,
          content,
          categoryId: categoryId || null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', postId)
        .select()

      if (supabaseError) {
        throw supabaseError
      }

      router.push('/admin/blog')
    } catch (err) {
      console.error('記事の更新に失敗しました:', err)
      setError('記事の更新に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <p className="text-lg">読み込み中...</p>
      </div>
    )
  }

  if (error && !title && !content) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            記事一覧に戻る
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" className="mr-4" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            記事一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">記事編集</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>記事情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                タイトル
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="記事のタイトルを入力"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                カテゴリ
              </label>
              <select
                id="category"
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">カテゴリなし</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                内容
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="記事の内容を入力"
                rows={15}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? '保存中...' : '変更を保存'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
