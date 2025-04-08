export type ProfileClientProps = {
  mode: 'view' | 'edit' | 'create';
};

export type ProfileViewProps = {
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bio?: string;
    address?: string;
  };
};

// データベースのユーザー型
export type UserRecord = {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio?: string;
  address?: string;
  created_at: string;
  updated_at: string;
};

// コンポーネントのProps型
export type ProfileFormProps = {
  initialData?: Partial<UserRecord>;
  onSuccess?: () => void;
};

// フォーム入力用の型定義
export type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  address: string;
};