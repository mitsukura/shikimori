export const SORT_OPTIONS = [
  { value: "desc", label: "新しい順" },
  { value: "asc", label: "古い順" },
] as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "available", label: "販売中" },
  { value: "unavailable", label: "準備中" },
] as const;

export type SortOrder = (typeof SORT_OPTIONS)[number]["value"]; 
export type Status = (typeof STATUS_OPTIONS)[number]["value"];

export type MenuSortOption = typeof SORT_OPTIONS[number];
export type MenuStatusOption = typeof STATUS_OPTIONS[number];
