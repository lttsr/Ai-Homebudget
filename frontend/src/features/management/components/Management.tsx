import { useState, useEffect, useCallback } from "react";
import { AppCarrender } from "@/components/carrender/carrender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { HomeBudgetDetail } from "./HomeBudgetDetail";
import type { DailyHomeBudget } from "../types";
import { useBudget } from "../hooks/use-budget";
import { format } from "date-fns";

export const ManagementHome = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedBudget, setSelectedBudget] = useState<
    DailyHomeBudget | undefined
  >();
  const [dataList, setDataList] = useState<DailyHomeBudget[]>([]);
  const { findDailyHomeBudget } = useBudget();

  // 初期表示時 現在月の家計データ取得
  useEffect(() => {
    (async () => {
      const result = await findDailyHomeBudget(format(new Date(), "yyyy-MM"));
      setDataList(result);
    })();
  }, [findDailyHomeBudget]);

  // 日付選択時
  const onSelectDate = useCallback(
    (date: Date | undefined, row: DailyHomeBudget | undefined) => {
      setSelectedDate(date);
      setSelectedBudget(row);
    },
    [],
  );

  return (
    <div className="box-border flex h-full min-h-0 w-full flex-col p-3 sm:p-4 md:p-5">
      <Card className="flex min-h-0 w-full flex-1 flex-col overflow-hidden shadow-sm">
        <CardHeader className="flex shrink-0 border-b">
          <div className="items-center mt-2">
            <CardTitle>家計管理</CardTitle>
          </div>
          <div className="ml-auto">
            <EllipsisVertical className="size-6" />
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col p-3 md:p-4">
          <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-4 md:grid-cols-[2fr_3fr] md:items-stretch md:gap-5">
            <div className="min-w-0">
              <AppCarrender
                selected={selectedDate}
                onDayChange={onSelectDate}
                budgetDataList={dataList}
              />
            </div>
            <div
              className={selectedDate ? "min-w-0" : "min-w-0 hidden md:block"}
            >
              {selectedDate != null && (
                <HomeBudgetDetail
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
