import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudget } from "../hooks/use-budget";
import type { HomeBudgetDetail } from "../types";

export function HomeBudgetDetail({ budgetId }: { budgetId: number }) {
  const { findHomeBudgetDetail } = useBudget();
  const [details, setDetails] = useState<HomeBudgetDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await findHomeBudgetDetail(budgetId);
        if (!cancelled) {
          setDetails(result);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [findHomeBudgetDetail, budgetId]);

  const incomeSum = details
    .filter((d) => !d.expensesFlg)
    .reduce((a, d) => a + d.price, 0);
  const expenseSum = details
    .filter((d) => d.expensesFlg)
    .reduce((a, d) => a + d.price, 0);

  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden shadow-sm">
      <CardHeader className="shrink-0 space-y-1 border-b pb-4">
        <CardTitle className="text-base">この日の明細</CardTitle>
        <CardDescription>
          家計簿 ID: {budgetId.toLocaleString()}
        </CardDescription>
        {!loading && details.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <span className="text-emerald-600 dark:text-emerald-400">
              収入 +{incomeSum} 円
            </span>
            <span className="text-red-600 dark:text-red-400">
              支出 -{expenseSum} 円
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
        {loading && (
          <div className="space-y-3 p-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        )}
        {!loading && details.length === 0 && (
          <p className="text-muted-foreground p-4 text-sm">
            この日の明細はまだありません。
          </p>
        )}
        {!loading &&
          details.length > 0 &&
          details.map((detail, index) => (
            <div key={detail.meisaiId}>
              {index > 0 && <Separator />}
              <div className="hover:bg-muted/40 flex flex-col gap-1 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{detail.category}</p>
                    {detail.memo != null && detail.memo !== "" && (
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {detail.memo}
                      </p>
                    )}
                  </div>
                  <span
                    className={
                      detail.expensesFlg
                        ? "shrink-0 tabular-nums font-semibold text-red-600 dark:text-red-400"
                        : "shrink-0 tabular-nums font-semibold text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {detail.expensesFlg ? "-" : "+"}
                    {detail.price} 円
                  </span>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
