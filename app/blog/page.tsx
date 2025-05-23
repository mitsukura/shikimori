'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getPosts } from '@/lib/services/post-service'
import type { Post } from '@/lib/services/post-service'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const postsData = await getPosts(20, 0)
        setPosts(postsData)
      } catch (error) {
        console.error('記事の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ブログ記事一覧</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">読み込み中...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-lg">記事がありません。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                {post.imageUrl && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=画像がありません'
                      }}
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">{post.content}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                    {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: ja })}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
