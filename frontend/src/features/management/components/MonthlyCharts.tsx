import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import PieGraph, { type PieGraphData } from "@/components/graph/PieGraph";
import LineGraph, { type LineGraphData } from "@/components/graph/LineGraph";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TaskStatusType } from "@/types";
import { useBudget } from "../hooks/use-budget";
import type {
  AccountMst,
  CategoryMst,
  HomeBudgetMonthlyAggregate,
  MonthlyBudgetDetailRow,
} from "../types";

type ChartTab = "category" | "account" | "daily";

/** 基準月の直前の yyyy-MM（1月なら前年12月） */
function previousYearMonth(yearMonth: string): string | null {
  const [ys, ms] = yearMonth.split("-");
  if (ys === "" || ms === "" || ys == null || ms == null) return null;
  const y = Number(ys);
  const m = Number(ms);
  if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() - 1);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

function formatYearMonthJapanese(yearMonth: string): string {
  const [y, m] = yearMonth.split("-");
  if (y == null || m == null) {
    return yearMonth;
  }
  return `${y}年${Number(m)}月`;
}

/** ツールチップ用：その日の明細をテキスト化 */
function formatDetailRowsForTooltip(
  list: MonthlyBudgetDetailRow[],
  categoryById: Map<number, CategoryMst>,
  accountById: Map<number, AccountMst>,
): string {
  const sorted = [...list].sort((a, b) => a.detailId - b.detailId);
  return sorted
    .map((r) => {
      const cat =
        categoryById.get(r.categoryId)?.name ?? `カテゴリ#${r.categoryId}`;
      const acc = accountById.get(r.accountId)?.name ?? `支払い#${r.accountId}`;
      const sign = r.expensesFlg ? "-" : "+";
      return `${cat}（${acc}） ${sign}${r.price.toLocaleString("ja-JP")}円`;
    })
    .join("\n");
}

/** 月次明細から支出のみをカテゴリ／決済別に集計し PieGraph 用に変換 */
export function MonthlyCharts({
  open,
  onOpenChange,
  yearMonth,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yearMonth: string | null;
}) {
  const {
    findMonthlyHomeBudgetDetails,
    findHomeBudgetMonthlyAggregate,
    findCategory,
    findPaymentAccount,
  } = useBudget();
  const [tab, setTab] = useState<ChartTab>("category");
  const [rows, setRows] = useState<MonthlyBudgetDetailRow[]>([]);
  const [categories, setCategories] = useState<CategoryMst[]>([]);
  const [accounts, setAccounts] = useState<AccountMst[]>([]);
  const [loading, setLoading] = useState(false);
  const [prevMonthAggregate, setPrevMonthAggregate] =
    useState<HomeBudgetMonthlyAggregate | null>(null);

  useEffect(() => {
    if (!open || yearMonth == null) return;
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        const prevYm = previousYearMonth(yearMonth);
        const [agg, detailRows, cats, accs] = await Promise.all([
          prevYm != null
            ? findHomeBudgetMonthlyAggregate(prevYm)
            : Promise.resolve(null),
          findMonthlyHomeBudgetDetails(yearMonth),
          findCategory(),
          findPaymentAccount(),
        ]);
        if (cancelled) return;
        setPrevMonthAggregate(agg);
        setRows(detailRows);
        setCategories(cats);
        setAccounts(accs);
      } catch {
        if (!cancelled) {
          setPrevMonthAggregate(null);
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
    findMonthlyHomeBudgetDetails,
    findHomeBudgetMonthlyAggregate,
    findCategory,
    findPaymentAccount,
  ]);

  const openingFromPrevMonthAggregate = useMemo(() => {
    if (prevMonthAggregate == null) return 0;
    if (prevMonthAggregate.status !== TaskStatusType.FINISHED) return 0;
    return prevMonthAggregate.amount;
  }, [prevMonthAggregate]);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c] as const)),
    [categories],
  );
  const accountById = useMemo(
    () => new Map(accounts.map((a) => [a.accountId, a] as const)),
    [accounts],
  );

  const expenseRows = useMemo(() => rows.filter((r) => r.expensesFlg), [rows]);

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
          name: ac?.name ?? `支払い #${accountId}`,
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

  /** 月初残高に、日々の収入を足して支出を引いたときの終日残高 */
  const dailyLine: LineGraphData | null = useMemo(() => {
    if (yearMonth == null) return null;
    const [ys, ms] = yearMonth.split("-");
    const y = Number(ys);
    const mon = Number(ms);
    if (!Number.isFinite(y) || !Number.isFinite(mon) || ys === "" || ms === "")
      return null;
    const hasRowInMonth = rows.some((r) => r.date.startsWith(yearMonth));
    if (!hasRowInMonth) return null;

    const lastDay = new Date(y, mon, 0).getDate();
    const rowsByDate = new Map<string, MonthlyBudgetDetailRow[]>();
    for (const r of rows) {
      if (!r.date.startsWith(yearMonth)) continue;
      const list = rowsByDate.get(r.date) ?? [];
      list.push(r);
      rowsByDate.set(r.date, list);
    }

    const byDate = new Map<string, { income: number; expense: number }>();
    for (const r of rows) {
      if (!r.date.startsWith(yearMonth)) continue;
      const cur = byDate.get(r.date) ?? { income: 0, expense: 0 };
      if (r.expensesFlg) {
        cur.expense += r.price;
      } else {
        cur.income += r.price;
      }
      byDate.set(r.date, cur);
    }

    const openingNote =
      prevMonthAggregate != null &&
      prevMonthAggregate.status === TaskStatusType.FINISHED
        ? `前月の確定集計に基づく月初残高です。`
        : `前月の月次集計が未確定です。`;

    const points: Record<string, string | number>[] = [
      {
        day_label: "月初",
        balance: openingFromPrevMonthAggregate,
        detail_note: openingNote,
      },
    ];
    let balance = openingFromPrevMonthAggregate;
    for (let d = 1; d <= lastDay; d++) {
      const dd = String(d).padStart(2, "0");
      const key = `${yearMonth}-${dd}`;
      const v = byDate.get(key) ?? { income: 0, expense: 0 };
      balance += v.income - v.expense;
      const dayRows = rowsByDate.get(key) ?? [];
      const detail_note =
        dayRows.length === 0
          ? ""
          : formatDetailRowsForTooltip(dayRows, categoryById, accountById);
      points.push({
        day_label: `${mon}/${d}`,
        balance,
        detail_note,
      });
    }

    return {
      title: "",
      x_axis: {
        data_key: "day_label",
        label: "",
      },
      y_axis: {
        label: "残高（円）",
      },
      series: [{ data_key: "balance", name: "残高", stroke: "#000000" }],
      tooltip_extra_key: "detail_note",
      points,
    };
  }, [
    rows,
    yearMonth,
    categoryById,
    accountById,
    openingFromPrevMonthAggregate,
    prevMonthAggregate,
  ]);

  const titleLabel = useMemo(() => {
    if (yearMonth == null) {
      return "月次収支グラフ";
    }
    return `${formatYearMonthJapanese(yearMonth)} の収支グラフ`;
  }, [yearMonth]);

  const onDialogOpenChange = useCallback(
    (next: boolean) => {
      if (!next) setTab("category");
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const activePie =
    tab === "category" ? categoryPie : tab === "account" ? accountPie : null;
  const tabDef: { id: ChartTab; label: string }[] = [
    { id: "category", label: "カテゴリ（円）" },
    { id: "account", label: "決済（円）" },
    { id: "daily", label: "残高の推移" },
  ];

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
          ) : tab === "daily" ? (
            dailyLine == null ? (
              <p className="text-muted-foreground py-12 text-center text-sm">
                この月の明細がないため、残高グラフは表示できません。
              </p>
            ) : (
              <div className="space-y-2">
                <h3 className="text-foreground text-sm font-semibold">
                  月初からの終日残高
                </h3>
                <LineGraph data={dailyLine} />
              </div>
            )
          ) : activePie == null ? (
            <p className="text-muted-foreground py-12 text-center text-sm">
              この月の支出に使える集計データがありません。
            </p>
          ) : (
            <div className="space-y-2">
              <h3 className="text-foreground text-sm font-semibold">
                {tab === "category"
                  ? "カテゴリ別（支出）"
                  : "決済方法別（支出）"}
              </h3>
              <PieGraph data={activePie} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
