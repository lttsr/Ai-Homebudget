import { useState } from "react";
import { AppCarrender } from "@/components/carrender/carrender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { HomeBudgetDetail } from "./HomeBudgetDetail";
import type { DailyHomeBudget } from "./types";

export const ManagementHome = () => {
  const [item, setSelectedItem] = useState<DailyHomeBudget>();
  const handleItemSelect = (date: Date | undefined) => {
    if (date == null) {
      setSelectedItem(undefined);
      return;
    }
    // TODO: 取得APIができたら date に紐づく DailyHomeBudget をセットする
    setSelectedItem({
      budgetId: `day-${date.toISOString().slice(0, 10)}`,
      date,
      total: '0',
    });
  };
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
        <CardContent className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
          <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-6 md:grid-cols-[2fr_3fr] md:items-stretch md:gap-8">
            <div className="min-w-0">
              <AppCarrender
                selected={item?.date}
                onSelect={handleItemSelect}
              />
            </div>
            <div className={item ? "min-w-0" : "min-w-0 hidden md:block"}>
              {item && <HomeBudgetDetail budgetId={item.budgetId} />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
