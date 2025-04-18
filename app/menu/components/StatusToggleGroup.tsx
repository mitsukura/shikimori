import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { Status, MenuStatusOption } from "../constants/menuOptions";

type Props = {
  value: Status;
  onChange: (value: Status) => void;
  options: readonly MenuStatusOption[];
  id?: string;
  className?: string;
};

export default function StatusToggleGroup({ value, onChange, options, id = "", className = "" }: Props) {
  return (
    <ToggleGroup id={id} type="single" value={value} onValueChange={(v) => v && onChange(v as Status)} className={className}>
      {options.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value} className="capitalize">
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
