import { useMemo } from "react";
import type { Item } from "@/types/item";
import type { Status, SortOrder } from "../constants/menuOptions";

export function filterItems(items: Item[], status: Status): Item[] {
  if (status === "all") return items;
  return items.filter(item =>
    status === "available" ? item.is_available : !item.is_available
  );
}

export function sortItems(items: Item[], sortOrder: SortOrder): Item[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
}

export function useFilteredSortedItems(
  items: Item[],
  status: Status,
  sortOrder: SortOrder
): Item[] {
  return useMemo(() => {
    return sortItems(
      filterItems(items, status),
      sortOrder
    );
  }, [items, status, sortOrder]);
}

