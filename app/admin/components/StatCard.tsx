import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import type { StatCardProps } from "@/types/dashboard";



export function StatCard({ title, value, diff }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-xs font-medium text-muted-foreground mb-1">{title}</CardDescription>
        <CardTitle className="text-2xl font-bold">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm flex items-center gap-2">
          <span className={diff >= 0 ? "text-green-600" : "text-red-600"}>
            {diff >= 0 ? `+${diff}%` : `${diff}%`}
          </span>
          <span className="text-muted-foreground">先月比</span>
        </div>
      </CardContent>
    </Card>
  );
}
