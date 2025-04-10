import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロフィール | 四季守',
  description: 'お客様のプロフィールを管理できます。',
};

import ProfileClient from './components/ProfileClient';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="heading2">プロフィール</h1>
      <ProfileClient mode="view" />
    </div>
  );
}