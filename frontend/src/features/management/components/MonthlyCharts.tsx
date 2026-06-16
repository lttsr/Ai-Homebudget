import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import BarGraph, { type BarGraphData } from "@/components/graph/BarGraph";
import PieGraph, { type PieGraphData } from "@/components/graph/PieGraph";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBudget } from "../hooks/use-budget";
import type { PaymentAccount, BudgetCategory, MonthlyBudgetDetailRow } from "../types";
import { ExpenseType } from "@/types";

type ChartTab = "category" | "account" | "expense-daily";

/** グラフの終了日（当月なら今日、過去月なら月末、未来月は 0） */
function chartEndDay(yearMonth: string): number {
  const [ys, ms] = yearMonth.split("-");
  const y = Number(ys);
  const mon = Number(ms);
  if (!Number.isFinite(y) || !Number.isFinite(mon) || ys === "" || ms === "") {
    return 0;
  }
  const now = new Date();
  const currentYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastOfMonth = new Date(y, mon, 0).getDate();
  if (yearMonth === currentYm) {
    return now.getDate();
  }
  if (yearMonth < currentYm) {
    return lastOfMonth;
  }
  return 0;
}

/** 日別支出グラフの Y 上限をきりのよく切り上げ */
function ceilDailyExpenseAxisMax(rawMax: number): number {
  if (!Number.isFinite(rawMax) || rawMax <= 0) {
    return 10_000;
  }
  const step = 10_000;
  return Math.ceil(rawMax / step) * step;
}

function buildExpenseYAxisTicks(max: number): number[] {
  const tickCount = 5;
  const ticks: number[] = [];
  for (let i = 0; i <= tickCount; i++) {
    ticks.push(Math.round((max * i) / tickCount));
  }
  return ticks;
}

/** ツールチップ用：その日の支出明細のみテキスト化 */
function formatExpenseRowsForTooltip(
  list: MonthlyBudgetDetailRow[],
  categoryById: Map<number, BudgetCategory>,
  accountById: Map<number, PaymentAccount>,
): string {
  const sorted = [...list]
    .filter((r) => r.expenseType === ExpenseType.EXPENSE)
    .sort((a, b) => a.detailId - b.detailId);
  if (sorted.length === 0) {
    return "";
  }
  return sorted
    .map((r) => {
      const cat =
        categoryById.get(r.categoryId)?.name ?? `カテゴリ#${r.categoryId}`;
      const acc =
        accountById.get(r.accountId)?.name ?? `口座・決済手段#${r.accountId}`;
      return `${cat}（${acc}） -${r.price.toLocaleString("ja-JP")}円`;
    })
    .join("\n");
}

/** 月次明細から支出のみをカテゴリ／口座・決済手段別に集計し PieGraph 用に変換 */
export function MonthlyCharts({
  open,
  onOpenChange,
  yearMonth,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yearMonth: string | null;
}) {
  const { findMonthlyDetails, findCategory, findPaymentAccount } =
    useBudget();
  const [tab, setTab] = useState<ChartTab>("category");
  const [rows, setRows] = useState<MonthlyBudgetDetailRow[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || yearMonth == null) return;
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        const [detailRows, cats, accs] = await Promise.all([
          findMonthlyDetails(yearMonth),
          findCategory(),
          findPaymentAccount(),
        ]);
        if (cancelled) return;
        setRows(detailRows);
        setCategories(cats);
        setAccounts(accs);
      } catch {
        if (!cancelled) {
          setRows([]);
          setCategories([]);
          setAccounts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    open,
    yearMonth,
    findMonthlyDetails,
    findCategory,
    findPaymentAccount,
  ]);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c] as const)),
    [categories],
  );
  const accountById = useMemo(
    () => new Map(accounts.map((a) => [a.accountId, a] as const)),
    [accounts],
  );

  const expenseRows = useMemo(
    () => rows.filter((r) => r.expenseType === ExpenseType.EXPENSE),
    [rows],
  );

  const categoryPie: PieGraphData | null = useMemo(() => {
    const totals = new Map<number, number>();
    for (const r of expenseRows) {
      totals.set(r.categoryId, (totals.get(r.categoryId) ?? 0) + r.price);
    }
    const slices = [...totals.entries()]
      .filter(([, v]) => v > 0)
      .map(([categoryId, value]) => {
        const cat = categoryById.get(categoryId);
        return {
          name: cat?.name ?? `カテゴリ #${categoryId}`,
          value,
          fill: cat?.color,
        };
      })
      .sort((a, b) => Number(b.value) - Number(a.value));
    if (slices.length === 0) return null;
    return {
      title: "",
      name_key: "name",
      value_key: "value",
      slices,
    };
  }, [expenseRows, categoryById]);

  const accountPie: PieGraphData | null = useMemo(() => {
    const totals = new Map<number, number>();
    for (const r of expenseRows) {
      totals.set(r.accountId, (totals.get(r.accountId) ?? 0) + r.price);
    }
    const slices = [...totals.entries()]
      .filter(([, v]) => v > 0)
      .map(([accountId, value]) => {
        const ac = accountById.get(accountId);
        return {
          name: ac?.name ?? `口座・決済手段 #${accountId}`,
          value,
        };
      })
      .sort((a, b) => Number(b.value) - Number(a.value));
    if (slices.length === 0) return null;
    return {
      title: "",
      name_key: "name",
      value_key: "value",
      slices,
    };
  }, [expenseRows, accountById]);

  /** 当月1日〜今日（過去月は月末まで）の日別支出合計 */
  const dailyExpenseBar: BarGraphData | null = useMemo(() => {
    if (yearMonth == null) return null;
    const [ys, ms] = yearMonth.split("-");
    const mon = Number(ms);
    if (!Number.isFinite(mon) || ys === "" || ms === "") return null;

    const endDay = chartEndDay(yearMonth);
    if (endDay <= 0) return null;

    const rowsByDate = new Map<string, MonthlyBudgetDetailRow[]>();
    for (const r of rows) {
      if (!r.date.startsWith(yearMonth)) continue;
      const list = rowsByDate.get(r.date) ?? [];
      list.push(r);
      rowsByDate.set(r.date, list);
    }

    const expenseByDate = new Map<string, number>();
    for (const r of expenseRows) {
      if (!r.date.startsWith(yearMonth)) continue;
      expenseByDate.set(r.date, (expenseByDate.get(r.date) ?? 0) + r.price);
    }

    const points: Record<string, string | number>[] = [];
    let maxExpense = 0;
    for (let d = 1; d <= endDay; d++) {
      const dd = String(d).padStart(2, "0");
      const key = `${yearMonth}-${dd}`;
      const expense = expenseByDate.get(key) ?? 0;
      maxExpense = Math.max(maxExpense, expense);
      const dayRows = rowsByDate.get(key) ?? [];
      const detail_note =
        expense === 0
          ? "この日の支出はありません。"
          : formatExpenseRowsForTooltip(dayRows, categoryById, accountById);
      points.push({
        day_label: `${mon}/${d}`,
        expense,
        detail_note,
      });
    }

    const yMax = ceilDailyExpenseAxisMax(maxExpense);
    const dayLabels = points.map((p) => String(p.day_label));

    return {
      title: "",
      x_axis: {
        data_key: "day_label",
        ticks: dayLabels,
        label: "",
      },
      y_axis: {
        label: "支出（円）",
        min: 0,
        max: yMax,
        ticks: buildExpenseYAxisTicks(yMax),
      },
      series: [{ data_key: "expense", name: "支出", fill: "#f97316" }],
      tooltip_extra_key: "detail_note",
      points,
    };
  }, [rows, expenseRows, yearMonth, categoryById, accountById]);

  const titleLabel = useMemo(() => {
    if (yearMonth == null) {
      return "月次収支グラフ";
    }
    const [y, m] = yearMonth.split("-");
    return `${y}年${Number(m)}月 の収支グラフ`;
  }, [yearMonth]);

  const activePie =
    tab === "category" ? categoryPie : tab === "account" ? accountPie : null;

  const onDialogOpenChange = useCallback(
    (next: boolean) => {
      if (!next) setTab("category");
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const tabDef: { id: ChartTab; label: string }[] = [
    { id: "category", label: "カテゴリ（円）" },
    { id: "account", label: "口座・決済手段（円）" },
    { id: "expense-daily", label: "支出の推移" },
  ];

  const expenseChartCaption = useMemo(() => {
    if (yearMonth == null) return "";
    const [y, m] = yearMonth.split("-");
    const ymLabel = `${y}年${Number(m)}月`;
    const endDay = chartEndDay(yearMonth);
    const now = new Date();
    const currentYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (yearMonth === currentYm) {
      return `${ymLabel}1日〜本日（${endDay}日）の支出合計`;
    }
    return `${ymLabel}1日〜${endDay}日の支出合計`;
  }, [yearMonth]);

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,940px)] w-[min(98vw,760px)] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden p-5 sm:w-[min(98vw,800px)] sm:max-w-[min(98vw,800px)] md:p-6">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="shrink-0" />
            <span className="font-bold">{titleLabel}</span>
          </div>
        </DialogHeader>

        <div
          className="bg-muted/50 flex shrink-0 flex-wrap gap-1 rounded-lg border p-1"
          role="tablist"
          aria-label="グラフの切り替え"
        >
          {tabDef.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={cn(
                "focus-visible:ring-ring min-w-18 flex-1 rounded-md px-2 py-2 text-xs font-medium transition-colors sm:min-w-0 sm:px-3 sm:text-sm focus-visible:ring-2 focus-visible:outline-none",
                tab === t.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto" role="tabpanel">
          {loading ? (
            <p className="text-muted-foreground py-12 text-center text-sm">
              読み込み中…
            </p>
          ) : tab === "expense-daily" ? (
            dailyExpenseBar == null ? (
              <p className="text-muted-foreground py-12 text-center text-sm">
                この月はまだ表示できる期間がありません。
              </p>
            ) : (
              <div className="space-y-2">
                <span className="text-foreground block text-sm font-semibold">
                  {expenseChartCaption}
                </span>
                <p className="text-muted-foreground text-xs">
                  収入は含みません。支出がない日は 0 円です。
                </p>
                <BarGraph data={dailyExpenseBar} />
              </div>
            )
          ) : activePie == null ? (
            <p className="text-muted-foreground py-12 text-center text-sm">
              この月の支出に使える集計データがありません。
            </p>
          ) : (
            <div className="space-y-2">
              <span className="text-foreground block text-sm font-semibold">
                {tab === "category"
                  ? "カテゴリ別（支出）"
                  : "口座・決済手段別（支出）"}
              </span>
              <PieGraph data={activePie} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
