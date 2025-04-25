import type { Stat, ChartData, SalesHistoryItem } from "@/types/dashboard";

export const stats = [
  { title: "ユーザー数", value: "1,234人", diff: 5 },
  { title: "売上金額", value: "¥1,200,000", diff: 3 },
  { title: "今月の売上", value: "¥200,000", diff: -2 },
];

export const monthlySales: ChartData[] = [
  { month: "1月", sales: 80000 },
  { month: "2月", sales: 95000 },
  { month: "3月", sales: 120000 },
  { month: "4月", sales: 40000 },
  { month: "5月", sales: 110000 },
  { month: "6月", sales: 90000 },
];

export const salesHistory: SalesHistoryItem[] = [
  { id: "A001", date: "2025-04-01", amount: "¥10,000", user: "山田 太郎" },
  { id: "A002", date: "2025-04-03", amount: "¥15,000", user: "佐藤 花子" },
  { id: "A003", date: "2025-04-06", amount: "¥8,000", user: "鈴木 一郎" },
  { id: "A004", date: "2025-04-10", amount: "¥12,000", user: "田中 美咲" },
  { id: "A005", date: "2025-04-15", amount: "¥20,000", user: "高橋 直樹" },
];
