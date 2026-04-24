import { useCallback, useMemo, type ReactNode } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { DailyHomeBudget } from "@/features/management/types";

function cellDateToRowDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AppCarrender({
  selected,
  onDayChange,
  className,
  budgetDataList,
}: {
  selected: Date | undefined;
  onDayChange: (
    date: Date | undefined,
    row: DailyHomeBudget | undefined,
  ) => void;
  className?: string;
  budgetDataList?: DailyHomeBudget[];
}) {
  const budgetByDate = useMemo(() => {
    const map = new Map<string, DailyHomeBudget>();
    for (const row of budgetDataList ?? []) {
      map.set(row.date, row);
    }
    return map;
  }, [budgetDataList]);

  const getDayAmount = useMemo(
    () => (cellDate: Date): ReactNode => {
      const row = budgetByDate.get(cellDateToRowDateKey(cellDate));
      if (row == null) {
        return undefined;
      }
      const { incomeTotal, expenseTotal } = row;
      if (incomeTotal === 0 && expenseTotal === 0) {
        return undefined;
      }
      return (
        <span className="flex flex-col items-center justify-center gap-0.5 font-medium">
          {incomeTotal > 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              +{incomeTotal.toLocaleString()}
            </span>
          ) : null}
          {expenseTotal > 0 ? (
            <span className="text-red-600 dark:text-red-400">
              -{expenseTotal.toLocaleString()}
            </span>
          ) : null}
        </span>
      );
    },
    [budgetByDate],
  );

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      const row =
        date == null ? undefined : budgetByDate.get(cellDateToRowDateKey(date));
      onDayChange(date, row);
    },
    [budgetByDate, onDayChange],
  );

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      getDayAmount={getDayAmount}
      className={cn(
        "w-full min-w-0 max-w-full",
        "[--cell-size:3rem] sm:[--cell-size:3.25rem] md:[--cell-size:3.5rem]",
        className,
      )}
    />
  );
}
