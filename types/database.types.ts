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
      achievements: {
        Row: {
          id: string
          title: string
          image_src: string
          alt: string
          date: string
          created_at?: string
        }
        Insert: {
          id?: string
          title: string
          image_src: string
          alt: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          image_src?: string
          alt?: string
          date?: string
          created_at?: string
        }
        Relationships: []
      }
      // 他のテーブルをここに追加できます
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
