'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCategories } from '@/lib/services/post-service'
import type { Category } from '@/lib/services/post-service'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function NewBlogPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('edit')
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log('カテゴリ取得開始')
        const categoriesData = await getCategories()
        console.log('取得したカテゴリデータ:', categoriesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('カテゴリ取得エラー:', error)
      }
    }

    fetchCategories()
  }, [])

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
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            imageUrl: imageUrl || null,
            authorId: userId,
            categoryId: categoryId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
        .select()

      if (supabaseError) {
        throw supabaseError
      }

      router.push('/admin/blog')
    } catch (err) {
      console.error('記事の作成に失敗しました:', err)
      setError('記事の作成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold">新規記事作成</h1>
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
              <label htmlFor="imageUrl" className="text-sm font-medium">
                画像URL（任意）
              </label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="画像のURLを入力（例: https://example.com/image.jpg）"
              />
              <p className="text-xs text-gray-500">画像URLを入力すると、記事に画像が表示されます</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                内容
              </label>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">編集</TabsTrigger>
                  <TabsTrigger value="preview">プレビュー</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="mt-2">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="記事の内容を入力（マークダウン形式）"
                    rows={15}
                    required
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-2">
                  <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                    {content ? (
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        remarkPlugins={[remarkGfm]}
                      >
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-400">プレビューするコンテンツがありません</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
              >
                {activeTab === 'edit' ? 'プレビュー表示' : '編集に戻る'}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : '記事を保存'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
