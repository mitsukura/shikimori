import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  id?: string;
  className?: string;
};

export default function StatusToggleGroup({ value, onChange, options, id = "", className = "" }: Props) {
  return (
    <ToggleGroup id={id} type="single" value={value} onValueChange={(v) => v && onChange(v)} className={className}>
      {options.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value} className="capitalize">
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
