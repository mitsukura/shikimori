'use client'

import { useState, useRef } from 'react'
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
import { ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { uploadImage } from '@/lib/upload-service'

export default function NewBlogPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('edit')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('カテゴリ取得エラー:', error)
      }
    }

    fetchCategories()
  }, [])
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // 画像ファイルかどうかチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }
    
    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください')
      return
    }
    
    try {
      setUploading(true)
      setError(null)
      
      // サーバーサイドAPIを使用して画像をアップロード
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '画像のアップロードに失敗しました')
      }
      
      if (data.url) {
        setImageUrl(data.url)
      } else {
        setError('画像のアップロードに失敗しました')
      }
    } catch (err) {
      console.error('画像アップロードエラー:', err)
      setError('画像のアップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

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
      
      console.log('送信データ:', {
        title,
        content: `${content.substring(0, 50)}...`, // テンプレートリテラルを使用
        imageUrl,
        userId,
        categoryId
      })

      // データベースの実際のカラム名を確認するためのクエリ
      const { data: tableInfo, error: tableError } = await supabase
        .from('posts')
        .select('*')
        .limit(1)
      
      if (tableError) {
        console.error('テーブル情報取得エラー:', tableError)
      } else {
        console.log('テーブルカラム:', tableInfo.length > 0 ? Object.keys(tableInfo[0]) : '[データなし]')
      }

      // データの挿入
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const postData: Record<string, unknown> = {
        title,
        content,
        authorId: userId,
        categoryId: categoryId || null,
        // updatedAtとcreatedAtはNOT NULL制約があるため追加
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      
      // imageUrlがあれば追加（データベースのカラム名はimage_urlのみ）
      if (imageUrl) {
        // データベースのカラム名に合わせる
        postData.image_url = imageUrl
        // imageUrlカラムは存在しないのでコメントアウト
        // postData.imageUrl = imageUrl
      }
      
      console.log('挿入データ:', postData)
      
      const { data, error: supabaseError } = await supabase
        .from('posts')
        .insert([postData])
        .select()

      if (supabaseError) {
        console.error('データベースエラー:', supabaseError)
        throw new Error(`データベースエラー: ${supabaseError.message || JSON.stringify(supabaseError)}`)
      }
      
      console.log('作成成功:', data)

      router.push('/admin/blog')
    } catch (err) {
      console.error('記事の作成に失敗しました:', err)
      
      // 詳細なエラーメッセージを表示
      let errorMessage = '記事の作成に失敗しました。'
      
      if (err instanceof Error) {
        errorMessage += ` ${err.message}`
      } else if (typeof err === 'object' && err !== null) {
        try {
          errorMessage += ` ${JSON.stringify(err)}`
        } catch {
          errorMessage += ' 詳細不明のエラーが発生しました。'
        }
      }
      
      setError(errorMessage)
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

            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                サムネイル画像
              </label>
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? '画像をアップロード中...' : '画像をアップロード'}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="または画像のURLを入力"
                  className="flex-1"
                />
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">プレビュー</p>
                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt="サムネイルプレビュー" 
                      className="w-full h-full object-contain aspect-video"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=画像読み込みエラー'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">画像URLを入力すると、記事に画像が表示されます</p>

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
