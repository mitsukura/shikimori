export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number
          title: string
          content: string
          createdAt: string
          updatedAt: string
          authorId: string
          categoryId: number | null
        }
        Insert: {
          id?: number
          title: string
          content: string
          createdAt?: string
          updatedAt?: string
          authorId: string
          categoryId?: number | null
        }
        Update: {
          id?: number
          title?: string
          content?: string
          createdAt?: string
          updatedAt?: string
          authorId?: string
          categoryId?: number | null
        }
      }
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
    }
  }
}
