// ユーザー型定義
export type User = {
  id: string;
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  address: string | null;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
};