'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { getPostById } from '@/lib/services/post-service'
import type { Post } from '@/lib/services/post-service'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // paramsをReact.use()でアンラップ
  const unwrappedParams = 'then' in params ? use(params) : params;
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        const postId = Number.parseInt(unwrappedParams.id, 10)
        if (Number.isNaN(postId)) {
          console.error('無効な記事IDです')
          return
        }

        const postData = await getPostById(postId)
        setPost(postData)
      } catch (error) {
        console.error('記事の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [unwrappedParams.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-lg">記事が見つかりませんでした。</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              記事一覧に戻る
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button variant="outline" className="mb-6" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          記事一覧に戻る
        </Link>
      </Button>

      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
        <h1>{post.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: ja })}
        </div>
        {/* 注意: HTMLをサニタイズするライブラリ（DOMPurifyなど）の使用を検討してください */}
        <div className="whitespace-pre-wrap">{post.content}</div>
      </article>
    </main>
  )
}
