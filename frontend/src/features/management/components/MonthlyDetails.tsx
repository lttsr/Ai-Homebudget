import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  CheckCircle2,
  CircleDashed,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TaskStatusType, ExpenseType } from "@/types";
import { useBudget } from "../hooks/use-budget";
import type {
  BudgetCategory,
  MonthlyBudgetDetailRow,
  MonthlySummary,
} from "../types";

export function MonthlyDetails({
  open,
  yearMonth,
}: {
  open: boolean;
  yearMonth: string | null;
}) {
  const {
    findMonthlySummary,
    findMonthlyDetails,
    findCategory,
    updateMonthlySummarySavingsTarget,
  } = useBudget();
  const [monthly, setMonthly] = useState<MonthlySummary | null>(null);
  const [rows, setRows] = useState<MonthlyBudgetDetailRow[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingsTargetInput, setSavingsTargetInput] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

  useEffect(() => {
    if (!open || yearMonth == null) {
      return;
    }
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const [monthlyResult, detailRows, cats] = await Promise.all([
          findMonthlySummary(yearMonth),
          findMonthlyDetails(yearMonth),
          findCategory(),
        ]);
        if (!cancelled) {
          setMonthly(monthlyResult);
          setRows(detailRows);
          setCategories(cats);
          if (monthlyResult != null) {
            setSavingsTargetInput(String(monthlyResult.savingsTarget));
          }
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
  }, [
    open,
    yearMonth,
    findMonthlySummary,
    findMonthlyDetails,
    findCategory,
  ]);

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c.name] as const)),
    [categories],
  );

  const resolveCategoryName = useCallback(
    (categoryId: number) =>
      categoryNameById.get(categoryId) ?? `カテゴリ #${categoryId}`,
    [categoryNameById],
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

  const handleSavingsTargetConfirm = useCallback(async () => {
    if (yearMonth == null) {
      return;
    }
    const parsed = Number(savingsTargetInput.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    setSavingTarget(true);
    try {
      const updated = await updateMonthlySummarySavingsTarget(
        yearMonth,
        parsed,
      );
      if (updated != null) {
        setMonthly(updated);
        setSavingsTargetInput(String(updated.savingsTarget));
      }
    } finally {
      setSavingTarget(false);
    }
  }, [
    yearMonth,
    savingsTargetInput,
    updateMonthlySummarySavingsTarget,
  ]);

  if (!open || yearMonth == null) {
    return null;
  }

  if (loading) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        読み込み中…
      </p>
    );
  }

  if (monthly == null) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        この月の集計データはまだありません。
      </p>
    );
  }

  const isFinished = monthly.statusType === TaskStatusType.FINISHED;
  const savingsPositive = monthly.savings >= 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
              isFinished
                ? "border-emerald-200/80 bg-emerald-500/10 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-amber-200/80 bg-amber-500/10 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
            )}
          >
            {isFinished ? (
              <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <CircleDashed className="size-3.5 shrink-0" aria-hidden />
            )}
            {isFinished ? "確定" : "未確定"}
          </span>
          {isFinished && monthly.confirmedDate != null ? (
            <span className="text-muted-foreground text-xs">
              確定日:{" "}
              {format(parseISO(monthly.confirmedDate), "yyyy年M月d日", {
                locale: ja,
              })}
            </span>
          ) : null}
        </div>

        {isFinished ? (
          <span className="text-muted-foreground text-xs sm:ml-auto">
            目標貯蓄: {monthly.savingsTarget.toLocaleString()} 円
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <label
              htmlFor="monthly-savings-target"
              className="text-muted-foreground shrink-0 text-xs font-medium"
            >
              目標貯蓄金額
            </label>
            <Input
              id="monthly-savings-target"
              name="monthly_savings_target"
              type="number"
              min={1}
              step={1000}
              value={savingsTargetInput}
              placeholder="例：100000"
              className="h-8 w-32"
              onChange={(e) => setSavingsTargetInput(e.target.value)}
            />
            <span className="text-muted-foreground text-xs">円</span>
            <Button
              type="button"
              size="sm"
              className="h-8 shrink-0"
              disabled={savingTarget}
              onClick={() => void handleSavingsTargetConfirm()}
            >
              {savingTarget ? "保存中…" : "確定"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-emerald-500/8 to-transparent px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            収入合計
          </div>
          <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-xl">
            +{monthly.incomeTotal.toLocaleString()}
            <span className="ml-1 text-sm font-semibold">円</span>
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-red-500/8 to-transparent px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <TrendingDown className="size-3.5 text-red-600 dark:text-red-400" />
            支出合計
          </div>
          <p className="text-lg font-bold tabular-nums text-red-600 dark:text-red-400 sm:text-xl">
            -{monthly.expenseTotal.toLocaleString()}
            <span className="ml-1 text-sm font-semibold">円</span>
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-primary/6 to-transparent px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <Wallet className="size-3.5 text-muted-foreground" />
            収支
          </div>
          <p
            className={cn(
              "text-lg font-bold tabular-nums sm:text-xl",
              savingsPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {savingsPositive ? "+" : ""}
            {monthly.savings.toLocaleString()}
            <span className="ml-1 text-sm font-semibold">円</span>
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-linear-to-br from-sky-500/8 to-transparent px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <Target className="size-3.5 text-sky-600 dark:text-sky-400" />
            達成率
          </div>
          <p className="text-lg font-bold tabular-nums text-sky-700 dark:text-sky-300 sm:text-xl">
            {monthly.achievementRate.toFixed(1)}
            <span className="ml-0.5 text-sm font-semibold">%</span>
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {isFinished && monthly.comment != null && monthly.comment !== "" ? (
            <section className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border/60 bg-muted/15 p-4 shadow-inner">
              <span className="text-foreground mb-2 block text-sm font-semibold">
                AI からの評価
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {monthly.comment}
              </p>
            </section>
          ) : !isFinished ? (
            <p className="text-muted-foreground shrink-0 text-sm">
              月末バッチ確定後に AI からの評価コメントが表示されます。
            </p>
          ) : null}
        </div>

        <aside className="flex h-80 min-h-0 w-full shrink-0 flex-col lg:h-auto lg:min-h-0 lg:w-80 lg:flex-1 xl:w-96">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-muted/15 shadow-inner">
            <div className="shrink-0 border-b border-border/50 px-4 py-3">
              <span className="text-foreground block text-sm font-semibold">
                月次明細
              </span>
              <span className="text-muted-foreground text-xs">
                {rows.length} 件
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {rows.length === 0 ? (
                <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                  この月の明細はまだありません。
                </p>
              ) : (
                <div>
                  {dayGroups.map(([date, items]) => (
                    <section key={date}>
                      <div className="bg-muted/30 flex items-baseline justify-between gap-2 border-b border-border/50 px-3 py-2">
                        <span className="text-xs font-semibold">
                          {format(parseISO(date), "M月d日 (EEE)", { locale: ja })}
                        </span>
                        <span className="text-muted-foreground text-[11px] tabular-nums">
                          {items.length} 件
                        </span>
                      </div>
                      {items.map((detail, index) => (
                        <div key={`${detail.budgetId}-${detail.detailId}`}>
                          {index > 0 ? <Separator /> : null}
                          <div className="hover:bg-muted/40 flex items-start justify-between gap-2 px-3 py-2.5">
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex flex-wrap items-center gap-1">
                                <span
                                  className={cn(
                                    "inline-flex shrink-0 items-center rounded border px-1 py-px text-[10px] font-semibold",
                                    detail.expenseType === ExpenseType.EXPENSE
                                      ? "border-red-200/80 bg-red-500/10 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                                      : "border-emerald-200/80 bg-emerald-500/10 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
                                  )}
                                >
                                  {detail.expenseType === ExpenseType.EXPENSE
                                    ? "支出"
                                    : "収入"}
                                </span>
                                <p className="truncate text-xs font-medium">
                                  {resolveCategoryName(detail.categoryId)}
                                </p>
                              </div>
                              {detail.memo != null && detail.memo !== "" ? (
                                <p className="text-muted-foreground line-clamp-2 text-[11px]">
                                  {detail.memo}
                                </p>
                              ) : null}
                            </div>
                            <span
                              className={cn(
                                "shrink-0 tabular-nums text-xs font-semibold",
                                detail.expenseType === ExpenseType.EXPENSE
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-emerald-600 dark:text-emerald-400",
                              )}
                            >
                              {detail.expenseType === ExpenseType.EXPENSE
                                ? "-"
                                : "+"}
                              {detail.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
