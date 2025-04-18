import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Status, SortOrder } from "../constants/menuOptions";

function isStatus(value: string | null): value is Status {
  return value === "all" || value === "available" || value === "unavailable";
}

export function useMenuQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSortOrder: SortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
  const statusParam = searchParams.get("status");
  const initialStatus: Status = isStatus(statusParam) ? statusParam : "all";

  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "created_at");
    params.set("order", sortOrder);
    params.set("status", status);
    router.replace(`?${params.toString()}`);
  }, [sortOrder, status, router, searchParams]);

  return { sortOrder, setSortOrder, status, setStatus };
}
