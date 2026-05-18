import { useState, useEffect, useCallback, useMemo } from "react";
import { AppCarrender } from "@/components/carrender/carrender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EllipsisVertical, FileText } from "lucide-react";
import { DailyDetails } from "./DailyDetails";
import { MonthlyDetails } from "./MonthlyDetails";
import type { DailyHomeBudget } from "../types";
import { useBudget } from "../hooks/use-budget";
import { format } from "date-fns";

export const ManagementHome = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedBudget, setSelectedBudget] = useState<
    DailyHomeBudget | undefined
  >();
  const [dataList, setDataList] = useState<DailyHomeBudget[]>([]);
  const [monthlyDialogOpen, setMonthlyDialogOpen] = useState(false);
  const [monthlyYearMonth, setMonthlyYearMonth] = useState<string | null>(null);
  const { findDailyHomeBudget } = useBudget();

  // 初期表示時 現在月の家計データ取得
  useEffect(() => {
    (async () => {
      const result = await findDailyHomeBudget(format(new Date(), "yyyy-MM"));
      setDataList(result);
    })();
  }, [findDailyHomeBudget]);

  // 月切り替え時
  const onMonthChange = useCallback(
    async (yearMonth: string) => {
      const result = await findDailyHomeBudget(yearMonth);
      setDataList(result);
      setSelectedDate(undefined);
      setSelectedBudget(undefined);
    },
    [findDailyHomeBudget],
  );

  // 日付選択時
  const onSelectDate = useCallback(
    (date: Date | undefined, row: DailyHomeBudget | undefined) => {
      setSelectedDate(date);
      setSelectedBudget(row);
    },
    [],
  );

  const onMonthSummaryClick = useCallback((yearMonth: string) => {
    setMonthlyYearMonth(yearMonth);
    setMonthlyDialogOpen(true);
  }, []);

  const onMonthlyDialogOpenChange = useCallback((open: boolean) => {
    setMonthlyDialogOpen(open);
    if (!open) {
      setMonthlyYearMonth(null);
    }
  }, []);

  const monthlyDialogTitleLabel = useMemo(() => {
    if (monthlyYearMonth == null) {
      return "月次入出金明細";
    }
    const [y, m] = monthlyYearMonth.split("-");
    if (y == null || m == null) {
      return `${monthlyYearMonth} 月次入出金明細`;
    }
    return `${y}年${Number(m)}月 月次入出金明細`;
  }, [monthlyYearMonth]);

  return (
    <div className="box-border flex h-full min-h-0 w-full flex-col p-3 sm:p-2">
      <Card className="flex min-h-0 w-full flex-1 flex-col overflow-hidden shadow-sm">
        <CardHeader className="flex shrink-0 border-b">
          <div className="items-center mt-2">
            <CardTitle>家計管理</CardTitle>
          </div>
          <div className="ml-auto">
            <EllipsisVertical className="size-6" />
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-4 md:grid-cols-[2fr_3fr] md:items-stretch md:gap-5">
            <div className="min-w-0">
              <AppCarrender
                selected={selectedDate}
                onDayChange={onSelectDate}
                onMonthChange={onMonthChange}
                onMonthSummaryClick={onMonthSummaryClick}
                budgetDataList={dataList}
              />
            </div>
            <div
              className={selectedDate ? "min-w-0" : "min-w-0 hidden md:block"}
            >
              {selectedDate != null && (
                <DailyDetails
                  budgetId={selectedBudget?.budgetId}
                  baseDate={format(selectedDate, "yyyy/MM/dd")}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={monthlyDialogOpen} onOpenChange={onMonthlyDialogOpenChange}>
        <DialogContent className="flex max-h-[min(88vh,860px)] w-[min(98vw,1280px)] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden p-4 sm:max-w-[min(98vw,1280px)] sm:p-5 md:max-w-[min(98vw,1280px)] lg:max-w-[min(98vw,1280px)]">
          <DialogTitle className="sr-only">{monthlyDialogTitleLabel}</DialogTitle>
          <DialogHeader className="shrink-0">
            <div className="flex items-center">
              <FileText size={14} />
              <span className="ml-1 font-bold">{monthlyDialogTitleLabel}</span>
            </div>
          </DialogHeader>
          {monthlyYearMonth != null ? (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-2 sm:px-5 sm:py-3">
              <MonthlyDetails
                open={monthlyDialogOpen}
                yearMonth={monthlyYearMonth}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
