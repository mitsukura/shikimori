import UserTableWrapper from './components/UserTableWrapper';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ユーザー管理</h1>
      <UserTableWrapper />
    </div>
  );
}
