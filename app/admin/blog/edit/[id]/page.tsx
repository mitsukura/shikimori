'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getPostById, getCategories, type Category } from '@/lib/services/post-service'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft, Upload, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // paramsをReact.use()でアンラップ
  const unwrappedParams = 'then' in params ? use(params) : params;
  const postId = Number.parseInt(unwrappedParams.id, 10);

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  // 画像プレビュー用の別の状態変数を追加
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
          
          // 画像URLがあれば設定
          // Supabaseの型定義ではimageUrlとして定義されている
          if (post.imageUrl) {
            setImageUrl(post.imageUrl)
            // プレビュー用の状態変数も初期化
            setImagePreview(post.imageUrl)
          }
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
        // プレビュー用の状態変数も更新
        setImagePreview(data.url)
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
  
  const handleImageDelete = () => {
    setImageUrl('')
    // プレビュー用の状態変数もクリア
    setImagePreview(null)
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
      setSaving(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('posts')
        .update({
          title,
          content,
          categoryId: categoryId || null,
          image_url: imageUrl || null, // 画像URLを更新
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
      
      {/* 現在の画像表示エリア */}
      {imagePreview && (
        <div className="mb-6">
          <Card className="border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700 dark:text-blue-300">現在のサムネイル画像</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-64 bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-inner">
                <img 
                  src={imagePreview} 
                  alt="現在のサムネイル画像" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=画像読み込みエラー'
                  }}
                />
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">この画像は記事に保存されています。変更する場合は下のフォームで新しい画像をアップロードしてください。</p>
            </CardContent>
          </Card>
        </div>
      )}

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
                {imageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageDelete}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    削除
                  </Button>
                )}
              </div>
              {/* 画像プレビューを必ず表示 */}
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">プレビュー</p>
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="サムネイルプレビュー" 
                      className="w-full h-full object-contain aspect-video"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=画像読み込みエラー'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      画像が設定されていません
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">画像をアップロードするか、URLを入力してください</p>
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
