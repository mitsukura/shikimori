import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MonthlySalesChart } from "@/components/ui/chart";
import { stats, monthlySales, salesHistory } from "./dashboardData";
import { StatCard } from "./components/StatCard";
import { SalesHistoryTable } from "./components/SalesHistoryTable";
import { DashboardSection } from "./components/DashboardSection";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '管理者ダッシュボード',
  description: '管理者用ダッシュボード',
};

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
        <div className="flex space-x-4">
          <Link href="/admin/blog" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <span className="mr-2">ブログ記事管理</span>
          </Link>
        </div>
      </div>
      {/* サマリーカード */}
      <DashboardSection className="p-0 shadow-none bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} diff={stat.diff} />
          ))}
        </div>
      </DashboardSection>
      {/* 月別売上グラフ */}
      <DashboardSection>
        <CardHeader>
          <CardTitle>毎月の売上推移</CardTitle>
          <CardDescription>直近6ヶ月の売上金額</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlySalesChart data={monthlySales} />
        </CardContent>
      </DashboardSection>
      {/* 売上履歴テーブル */}
      <DashboardSection>
        <CardHeader>
          <CardTitle>売上履歴</CardTitle>
          <CardDescription>直近の売上データ</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesHistoryTable items={salesHistory} />
        </CardContent>
      </DashboardSection>
    </div>
  );
}
