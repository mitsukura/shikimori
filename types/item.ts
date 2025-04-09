import type { Decimal } from '@prisma/client/runtime/library';

// Supabaseから取得する商品データの型
export type Item = {
  id: string; // uuid
  name: string;
  description?: string | null;
  price: number | Decimal;
  image_url?: string | null;
  category?: string | null;
  is_available: boolean;
  stock: number;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
};

// 商品フォームで使用するデータの型
export type ItemFormData = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isAvailable: boolean;
  stock: number;
};

// 商品フォームのプロパティ型
export type ItemFormProps = {
  initialData?: Item | null;
  onSuccess?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

// 商品削除ダイアログのプロパティ型
export type DeleteItemAlertProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemId: string | null;
  itemName?: string;
  onConfirm: () => void;
};