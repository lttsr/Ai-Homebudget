import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function AppCarrender({
  selected,
  onSelect,
  className,
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}) {
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      className={cn(
        "w-full min-w-0 max-w-full",
        "[--cell-size:3rem] sm:[--cell-size:3.25rem] md:[--cell-size:3.5rem]",
        className,
      )}
    />
  );
}
