import { useState, useEffect, useCallback, useMemo } from "react";
import { AppCarrender } from "@/components/carrender/carrender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { EllipsisVertical, FileText, Settings2 } from "lucide-react";
import { DailyDetails } from "./DailyDetails";
import { MonthlyCharts } from "./MonthlyCharts";
import { MonthlyDetails } from "./MonthlyDetails";
import type { DailyHomeBudget } from "../types";
import { useBudget } from "../hooks/use-budget";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Settings } from "./Settings";

export const ManagementHome = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedBudget, setSelectedBudget] = useState<
    DailyHomeBudget | undefined
  >();
  const [dataList, setDataList] = useState<DailyHomeBudget[]>([]);
  const [monthlyDialogOpen, setMonthlyDialogOpen] = useState(false);
  const [monthlyYearMonth, setMonthlyYearMonth] = useState<string | null>(null);
  const [chartsDialogOpen, setChartsDialogOpen] = useState(false);
  const [chartsYearMonth, setChartsYearMonth] = useState<string | null>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
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

  const onMonthGraphClick = useCallback((yearMonth: string) => {
    setChartsYearMonth(yearMonth);
    setChartsDialogOpen(true);
  }, []);

  const onChartsDialogOpenChange = useCallback((open: boolean) => {
    setChartsDialogOpen(open);
    if (!open) {
      setChartsYearMonth(null);
    }
  }, []);

  const onSettingsDialogOpenChange = useCallback((open: boolean) => {
    setSettingsDialogOpen(open);
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
      <Dialog open={monthlyDialogOpen} onOpenChange={onMonthlyDialogOpenChange}>
        <DialogContent className="flex max-h-[min(88vh,860px)] w-[min(98vw,1280px)] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden p-4 sm:max-w-[min(98vw,1280px)] sm:p-5 md:max-w-[min(98vw,1280px)] lg:max-w-[min(98vw,1280px)]">
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
      <Dialog
        open={settingsDialogOpen}
        onOpenChange={onSettingsDialogOpenChange}
      >
        <DialogContent className="flex max-h-[min(88vh,860px)] w-[min(98vw,1280px)] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden p-4 sm:max-w-[min(98vw,1280px)] sm:p-5 md:max-w-[min(98vw,1280px)] lg:max-w-[min(98vw,1280px)]">
          <DialogHeader className="shrink-0">
            <div className="flex items-center">
              <Settings2 size={14} />
              <span className="ml-1 font-bold">設定</span>
            </div>
          </DialogHeader>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-2 sm:px-5 sm:py-3">
            <Settings />
          </div>
        </DialogContent>
      </Dialog>
      <MonthlyCharts
        open={chartsDialogOpen}
        onOpenChange={onChartsDialogOpenChange}
        yearMonth={chartsYearMonth}
      />
      <Card className="flex min-h-0 w-full flex-1 flex-col gap-0 overflow-hidden shadow-sm">
        <CardHeader className="flex shrink-0 items-center justify-between border-b">
          <CardTitle className="leading-none">家計管理</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="メニュー"
            >
              <EllipsisVertical className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuLabel>共通</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
                <Settings2 size={16} className="mr-2" />
                設定
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col pb-3 pt-3">
          <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-3 md:grid-cols-[2fr_3fr] md:gap-4">
            <div className="min-w-0">
              <AppCarrender
                selected={selectedDate}
                onDayChange={onSelectDate}
                onMonthChange={onMonthChange}
                onMonthSummaryClick={onMonthSummaryClick}
                onMonthGraphClick={onMonthGraphClick}
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
    </div>
  );
};
