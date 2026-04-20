import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBudget } from "../hooks/use-budget";
import type { HomeBudgetCategory, MonthlyBudgetDetailRow } from "../types";

export function MonthlyDetails({
  open,
  yearMonth,
}: {
  open: boolean;
  yearMonth: string | null;
}) {
  const { findMonthlyHomeBudgetDetails, findCategory } = useBudget();
  const [rows, setRows] = useState<MonthlyBudgetDetailRow[]>([]);
  const [categories, setCategories] = useState<HomeBudgetCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || yearMonth == null) {
      return;
    }
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const [detailRows, cats] = await Promise.all([
          findMonthlyHomeBudgetDetails(yearMonth),
          findCategory(),
        ]);
        if (!cancelled) {
          setRows(detailRows);
          setCategories(cats);
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
  }, [open, yearMonth, findMonthlyHomeBudgetDetails, findCategory]);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c] as const)),
    [categories],
  );

  const resolveCategoryName = useCallback(
    (categoryId: number) =>
      categoryById.get(categoryId)?.name ?? `カテゴリ #${categoryId}`,
    [categoryById],
  );

  const dayGroups = useMemo(() => {
    const m = new Map<string, MonthlyBudgetDetailRow[]>();
    for (const r of rows) {
      const arr = m.get(r.date) ?? [];
      arr.push(r);
      m.set(r.date, arr);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [rows]);

  const monthTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const r of rows) {
      if (r.expensesFlg) {
        expense += r.price;
      } else {
        income += r.price;
      }
    }
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [rows]);

  const formatDayHeading = useCallback((dateStr: string) => {
    try {
      return format(parseISO(dateStr), "M月d日 (EEE)", { locale: ja });
    } catch {
      return dateStr;
    }
  }, []);

  if (!open || yearMonth == null) {
    return null;
  }

  const balancePositive = monthTotals.balance >= 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {!loading && rows.length > 0 ? (
        <div className="grid shrink-0 grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-emerald-500/8 to-transparent px-4 py-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              収入合計
            </div>
            <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-xl">
              +{monthTotals.income.toLocaleString()}
              <span className="ml-1 text-sm font-semibold">円</span>
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-red-500/8 to-transparent px-4 py-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <TrendingDown className="size-3.5 text-red-600 dark:text-red-400" />
              支出合計
            </div>
            <p className="text-lg font-bold tabular-nums text-red-600 dark:text-red-400 sm:text-xl">
              -{monthTotals.expense.toLocaleString()}
              <span className="ml-1 text-sm font-semibold">円</span>
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-primary/6 to-transparent px-4 py-3 shadow-sm sm:col-span-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <Wallet className="size-3.5 text-muted-foreground" />
              収支
            </div>
            <p
              className={cn(
                "text-lg font-bold tabular-nums sm:text-xl",
                balancePositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {balancePositive ? "+" : ""}
              {monthTotals.balance.toLocaleString()}
              <span className="ml-1 text-sm font-semibold">円</span>
            </p>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto rounded-xl border border-border/60 bg-muted/15",
          "shadow-inner",
        )}
      >
        {loading ? (
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : null}
        {!loading && rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border/60">
              <Wallet className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              この月の明細はまだありません
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              カレンダーで日別の登録を行うと、ここに日付順で一覧表示されます。
            </p>
          </div>
        ) : null}
        {!loading && rows.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3">
            {dayGroups.map(([date, items]) => (
              <Card
                key={date}
                size="sm"
                className="flex h-full min-h-0 flex-col gap-0 shadow-sm ring-border/60"
              >
                <CardHeader className="border-b border-border/50 bg-muted/25 px-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <CardTitle className="text-sm font-semibold leading-snug tracking-tight">
                      {formatDayHeading(date)}
                    </CardTitle>
                    <span className="tabular-nums text-[11px] font-medium text-muted-foreground">
                      {items.length} 件
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-y-auto px-3 sm:px-4">
                  <ul className="flex flex-col gap-2">
                    {items.map((detail) => {
                      const cat = categoryById.get(detail.categoryId);
                      const accentColor =
                        cat?.color != null && cat.color !== ""
                          ? cat.color
                          : undefined;

                      return (
                        <li
                          key={`${detail.budgetId}-${detail.detailId}`}
                          className="min-w-0"
                        >
                          <div
                            className={cn(
                              "group relative overflow-hidden rounded-lg border border-border/60 bg-card/90",
                              "shadow-sm transition-all duration-150",
                              "hover:border-border hover:shadow-md",
                            )}
                          >
                            <div
                              aria-hidden
                              className={cn(
                                "absolute inset-y-0 left-0 w-[3px]",
                                accentColor == null ? "bg-border" : "",
                              )}
                              style={
                                accentColor != null
                                  ? { backgroundColor: accentColor }
                                  : undefined
                              }
                            />
                            <div className="flex items-start justify-between gap-2 px-2.5 py-2 pl-3.5 sm:px-3 sm:py-2.5 sm:pl-4">
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span
                                    className={cn(
                                      "inline-flex shrink-0 items-center rounded-md border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide",
                                      detail.expensesFlg
                                        ? "border-red-200/80 bg-red-500/10 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                                        : "border-emerald-200/80 bg-emerald-500/10 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
                                    )}
                                  >
                                    {detail.expensesFlg ? "支出" : "収入"}
                                  </span>
                                  <p className="min-w-0 wrap-break-word text-sm font-semibold leading-snug text-foreground">
                                    {resolveCategoryName(detail.categoryId)}
                                  </p>
                                </div>
                                {detail.memo != null && detail.memo !== "" ? (
                                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                    {detail.memo}
                                  </p>
                                ) : null}
                              </div>
                              <span
                                className={cn(
                                  "shrink-0 tabular-nums text-sm font-bold leading-none sm:text-base",
                                  detail.expensesFlg
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-emerald-600 dark:text-emerald-400",
                                )}
                              >
                                {detail.expensesFlg ? "-" : "+"}
                                {detail.price.toLocaleString()}
                                <span className="ml-0.5 text-[10px] font-semibold opacity-90">
                                  円
                                </span>
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
