import type { ReactNode } from "react";

interface DashboardSectionProps {
  children: ReactNode;
  className?: string;
}

export function DashboardSection({ children, className = "" }: DashboardSectionProps) {
  return (
    <section className={`bg-background rounded-xl shadow-sm p-6 ${className}`}>
      {children}
    </section>
  );
}
