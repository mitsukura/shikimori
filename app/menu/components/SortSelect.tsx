import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { SortOrder, MenuSortOption } from "../constants/menuOptions";

type Props = {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
  options: readonly MenuSortOption[];
  id?: string;
  className?: string;
};

export default function SortSelect({ value, onChange, options, id = "", className = "" }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
