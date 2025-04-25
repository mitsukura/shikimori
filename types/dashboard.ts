// ダッシュボード関連の型定義を集約

export type Stat = {
  label: string;
  value: string;
};

export type ChartData = {
  month: string;
  sales: number;
};

export type SalesHistoryItem = {
  id: string;
  date: string;
  amount: string;
  user: string;
};

export type StatCardProps = {
  title: string;
  value: string;
  diff: number;
}