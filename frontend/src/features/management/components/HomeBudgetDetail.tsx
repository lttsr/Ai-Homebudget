import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownWideNarrow,
  EllipsisVertical,
  FileCheck,
  FileEdit,
  FileText,
  FileIcon,
  TrashIcon,
  ChartBarIcon,
  InfoIcon,
} from "lucide-react";
import { useBudget } from "../hooks/use-budget";
import type { HomeBudgetCategory, HomeBudgetDetail } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeBudgetDetailChange } from "./HomeBudgetDetailChange";
import { Button } from "@/components/ui/button";

export function HomeBudgetDetail({
  budgetId,
  baseDate,
}: {
  budgetId?: number;
  baseDate: string;
}) {
  const { findHomeBudgetDetail, findCategory } = useBudget();
  const [details, setDetails] = useState<HomeBudgetDetail[]>([]);
  const [categories, setCategories] = useState<HomeBudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogChange, setDialogChange] = useState(false);
  const [flowFilter, setFlowFilter] = useState<"all" | "income" | "expense">(
    "all",
  );

  const [includedCategoryIds, setIncludedCategoryIds] = useState<
    number[] | null
  >(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    void (async () => {
      const list = await findCategory();
      setCategories(list);
      if (budgetId == null) {
        setDetails([]);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const result = await findHomeBudgetDetail(budgetId);
          setDetails(result);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [findHomeBudgetDetail, findCategory, budgetId]);

  /** カテゴリIDと名前のマッピングを生成します。 */
  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c.name] as const)),
    [categories],
  );

  /** カテゴリIDを元にマッピングから名前を取得します。 */
  const resolveCategoryName = useCallback(
    (categoryId: number) =>
      categoryNameById.get(categoryId) ?? `カテゴリ #${categoryId}`,
    [categoryNameById],
  );

  /** カテゴリフィルター */
  const categoryOptions = useMemo(
    () => [...new Set(details.map((d) => d.categoryId))].sort((a, b) => a - b),
    [details],
  );

  // フィルター設定
  const displayDetails = useMemo(() => {
    let rows = details.filter((d) => {
      if (flowFilter === "income") return !d.expensesFlg;
      if (flowFilter === "expense") return d.expensesFlg;
      return true;
    });
    if (includedCategoryIds !== null) {
      const allow = new Set(includedCategoryIds);
      rows = rows.filter((d) => allow.has(d.categoryId));
    }
    return [...rows].sort((a, b) =>
      priceSort === "desc" ? b.price - a.price : a.price - b.price,
    );
  }, [details, flowFilter, includedCategoryIds, priceSort]);

  const setCategoryChecked = (categoryId: number, nextChecked: boolean) => {
    setIncludedCategoryIds((prev) => {
      if (prev === null) {
        if (!nextChecked) {
          return categoryOptions.filter((id) => id !== categoryId);
        }
        return null;
      }
      if (nextChecked) {
        const merged = [...new Set([...prev, categoryId])];
        if (merged.length >= categoryOptions.length) return null;
        return merged;
      }
      return prev.filter((id) => id !== categoryId);
    });
  };

  const isCategoryChecked = (categoryId: number) =>
    includedCategoryIds === null || includedCategoryIds.includes(categoryId);

  /** 収入合計 */
  const incomeSum = details
    .filter((d) => !d.expensesFlg)
    .reduce((a, d) => a + d.price, 0);
  /** 支出合計 */
  const expenseSum = details
    .filter((d) => d.expensesFlg)
    .reduce((a, d) => a + d.price, 0);

  return (
    <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden shadow-sm">
      <Dialog open={dialogChange} onOpenChange={setDialogChange}>
        <DialogContent className="flex max-h-[min(88vh,860px)] w-[min(98vw,1280px)] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden p-4 sm:max-w-[min(98vw,1280px)] sm:p-5 md:max-w-[min(98vw,1280px)] lg:max-w-[min(98vw,1280px)]">
          <DialogTitle className="sr-only">明細編集</DialogTitle>
          <DialogHeader className="shrink-0">
            <div className="flex items-center">
              <FileEdit size={14} />
              <span className="ml-1 font-bold">明細編集</span>
            </div>
          </DialogHeader>
          {budgetId != null && (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-2 sm:px-5 sm:py-3">
              <HomeBudgetDetailChange
                budgetId={budgetId}
                details={details}
                updated={async () => {
                  const result = await findHomeBudgetDetail(budgetId);
                  setDetails(result);
                  setDialogChange(false);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CardHeader className="shrink-0 space-y-1 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{baseDate} 入出金明細</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <EllipsisVertical className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-48">
              <DropdownMenuLabel>明細情報</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FileCheck size={16} className="mr-2" />
                  情報
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="min-w-38">
                    <DropdownMenuLabel>高度な情報</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <InfoIcon size={16} className="mr-2" />
                      詳細情報
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ChartBarIcon size={16} className="mr-2" />
                      グラフで見る
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>ファイル出力</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <FileText size={16} className="mr-2" />
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileIcon size={16} className="mr-2" />
                      PDF
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={budgetId == null}
                onClick={() => budgetId != null && setDialogChange(true)}
              >
                <FileEdit size={16} className="mr-2" />
                明細編集
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={details.length === 0}
              >
                <TrashIcon size={16} className="mr-2" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {budgetId != null ? `家計簿 ID: ${budgetId}` : ""}
        </CardDescription>
        {!loading && details.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
            <div className="flex flex-wrap gap-3">
              <span className="text-emerald-600 dark:text-emerald-400">
                収入 +{incomeSum} 円
              </span>
              <span className="text-red-600 dark:text-red-400">
                支出 -{expenseSum} 円
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label="明細の表示・並び替え"
                >
                  <ArrowDownWideNarrow className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-56 w-56"
                data-slot="home_budget_detail_filter_menu"
              >
                <DropdownMenuLabel>収支</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={flowFilter}
                  onValueChange={(v) =>
                    setFlowFilter(v as "all" | "income" | "expense")
                  }
                >
                  <DropdownMenuRadioItem value="all">
                    すべて
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="income">
                    収入
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="expense">
                    支出
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>カテゴリ</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="min-w-48">
                      <DropdownMenuLabel>表示するカテゴリ</DropdownMenuLabel>
                      {categoryOptions.length === 0 ? (
                        <DropdownMenuItem disabled>
                          カテゴリがありません
                        </DropdownMenuItem>
                      ) : (
                        categoryOptions.map((categoryId) => (
                          <DropdownMenuCheckboxItem
                            key={categoryId}
                            checked={isCategoryChecked(categoryId)}
                            onCheckedChange={(c) =>
                              setCategoryChecked(categoryId, c === true)
                            }
                          >
                            {resolveCategoryName(categoryId)}
                          </DropdownMenuCheckboxItem>
                        ))
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>金額</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={priceSort}
                  onValueChange={(v) => setPriceSort(v as "asc" | "desc")}
                >
                  <DropdownMenuRadioItem value="asc">
                    昇順
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    降順
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
        {!loading && details.length === 0 && (
          <p className="text-muted-foreground p-4 text-sm">
            この日の明細はまだありません。
          </p>
        )}
        {!loading && details.length > 0 && displayDetails.length === 0 && (
          <p className="text-muted-foreground p-4 text-sm">
            条件に一致する明細がありません。
          </p>
        )}
        {!loading &&
          details.length > 0 &&
          displayDetails.map((detail, index) => (
            <div key={`${detail.budgetId}-${detail.detailId}`}>
              {index > 0 && <Separator />}
              <div className="hover:bg-muted/40 flex flex-col gap-1 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {resolveCategoryName(detail.categoryId)}
                    </p>
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
