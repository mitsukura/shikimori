"use client";

import { useMemo } from "react";
import { useMenuQuery } from "../hooks/useMenuQuery";
import SortSelect from "./SortSelect";
import StatusToggleGroup from "./StatusToggleGroup";
import ItemCard from "./ItemCard";
import type { Item } from "@/types/item";

const SORT_OPTIONS = [
  { value: "desc", label: "新しい順" },
  { value: "asc", label: "古い順" },
];
const STATUS_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "available", label: "販売中" },
  { value: "unavailable", label: "準備中" },
];

type Props = {
  items: Item[];
};

export default function MenuListClient({ items }: Props) {
  const { sortOrder, setSortOrder, status, setStatus } = useMenuQuery();

  // ソート＆フィルタ済みリスト
  const filteredItems = useMemo(() => {
    let list = [...items];
    // フィルタ
    if (status === "available") {
      list = list.filter((item) => item.is_available);
    } else if (status === "unavailable") {
      list = list.filter((item) => !item.is_available);
    }
    // ソート
    list.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    return list;
  }, [items, sortOrder, status]);

  return (
    <div>
      {/* ソート＆フィルタUI */}
      <div className="flex flex-row gap-4 items-start md:items-end mb-8">
        <div>
          <label htmlFor="sort-select" className="hidden text-sm font-medium mb-1">作成日時で並び替え</label>
          <SortSelect
            value={sortOrder}
            onChange={setSortOrder}
            options={SORT_OPTIONS}
            id="sort-select"
            className="w-36"
          />
        </div>
        <div>
          <label htmlFor="status-toggle" className="hidden text-sm font-medium mb-1">販売状態で絞り込み</label>
          <StatusToggleGroup
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            id="status-toggle"
          />
        </div>
      </div>
      {/* 商品リスト */}
      {filteredItems.length === 0 ? (
        <p>該当する商品はありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
