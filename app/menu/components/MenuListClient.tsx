"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  // クエリパラメータ初期値
  const initialSortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
  const statusParam = searchParams.get("status");
const initialStatus =
  statusParam && ["all", "available", "unavailable"].includes(statusParam)
    ? statusParam
    : "all";

  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
  const [status, setStatus] = useState<string>(initialStatus);

  // クエリパラメータを変更
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "created_at");
    params.set("order", sortOrder);
    params.set("status", status);
    router.replace(`?${params.toString()}`);
  }, [sortOrder, status, router, searchParams]);

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
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger id="sort-select" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="status-toggle" className="hidden text-sm font-medium mb-1">販売状態で絞り込み</label>
          <ToggleGroup id="status-toggle" type="single" value={status} onValueChange={(v) => v && setStatus(v)}>
            {STATUS_OPTIONS.map((opt) => (
              <ToggleGroupItem key={opt.value} value={opt.value} className="capitalize">
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
