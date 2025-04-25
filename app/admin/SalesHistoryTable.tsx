import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SalesHistoryItem } from "@/types/dashboard";

type SalesHistoryTableProps = {
  items: SalesHistoryItem[];
}

export function SalesHistoryTable({ items }: SalesHistoryTableProps) {
  return (
    <Table>
      <TableCaption>最新5件の売上履歴</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>注文ID</TableHead>
          <TableHead>日付</TableHead>
          <TableHead>ユーザー</TableHead>
          <TableHead className="text-right">金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.id}</TableCell>
            <TableCell>{sale.date}</TableCell>
            <TableCell>{sale.user}</TableCell>
            <TableCell className="text-right">{sale.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
