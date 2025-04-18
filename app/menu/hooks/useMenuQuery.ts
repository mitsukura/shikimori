import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useMenuQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
  const statusParam = searchParams.get("status");
  const initialStatus =
    statusParam && ["all", "available", "unavailable"].includes(statusParam)
      ? statusParam
      : "all";

  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
  const [status, setStatus] = useState<string>(initialStatus);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "created_at");
    params.set("order", sortOrder);
    params.set("status", status);
    router.replace(`?${params.toString()}`);
  }, [sortOrder, status, router, searchParams]);

  return { sortOrder, setSortOrder, status, setStatus };
}
