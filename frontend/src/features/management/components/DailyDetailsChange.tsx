import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useBudget } from "../hooks/use-budget";
import type {
  AccountMst,
  CategoryMst,
  HomeBudgetDetail,
} from "../types";

type DraftRow = {
  clientKey: string;
  sourceDetailId: number | null;
  budgetId: number;
  categoryId: number;
  accountId: number;
  price: number;
  expensesFlg: boolean;
  memo?: string;
};

function rowsFromDetails(list: HomeBudgetDetail[]): DraftRow[] {
  return list.map((d) => ({
    clientKey: `existing-${d.detailId}`,
    sourceDetailId: d.detailId,
    budgetId: d.budgetId,
    categoryId: d.categoryId,
    accountId: d.accountId,
    price: d.price,
    expensesFlg: d.expensesFlg,
    memo: d.memo,
  }));
}

export function DailyDetailsChange({
  budgetId,
  details,
  updated,
}: {
  budgetId: number;
  details: HomeBudgetDetail[];
  updated: () => void | Promise<void>;
}) {
  const { findCategory, findPaymentAccount } = useBudget();
  const [categories, setCategories] = useState<CategoryMst[]>([]);
  const [accounts, setAccounts] = useState<AccountMst[]>([]);
  const [rows, setRows] = useState<DraftRow[]>(() => rowsFromDetails(details));
  const newKeyRef = useRef(0);
  const pendingScrollKeyRef = useRef<string | null>(null);

  const categoriesSorted = useMemo(
    () => [...categories].sort((a, b) => a.categoryId - b.categoryId),
    [categories],
  );

  const defaultCategoryId = categoriesSorted[0]?.categoryId ?? 1;
  const defaultAccountId = accounts[0]?.accountId ?? 1;

  useEffect(() => {
    void (async () => {
      try {
        setCategories(await findCategory());
      } catch {
        setCategories([]);
      }
      try {
        setAccounts(await findPaymentAccount());
      } catch {
        setAccounts([]);
      }
    })();
  }, [findCategory, findPaymentAccount]);

  useLayoutEffect(() => {
    const key = pendingScrollKeyRef.current;
    if (key == null) return;
    pendingScrollKeyRef.current = null;

    const run = () => {
      const rowEl = document.getElementById(
        `home-budget-detail-change-row-${key}`,
      );
      const container = document.getElementById(
        "home-budget-detail-change-scroll",
      );
      if (rowEl == null) return;

      if (container != null) {
        const cRect = container.getBoundingClientRect();
        const rRect = rowEl.getBoundingClientRect();
        const nextTop = rRect.top - cRect.top + container.scrollTop - 12;
        container.scrollTo({
          top: Math.max(0, nextTop),
          behavior: "smooth",
        });
        return;
      }

      rowEl.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, [rows]);

  const updateRow = useCallback(
    (clientKey: string, patch: Partial<DraftRow>) => {
      setRows((prev) =>
        prev.map((r) => (r.clientKey === clientKey ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  const addRow = useCallback(() => {
    newKeyRef.current += 1;
    const clientKey = `new-${newKeyRef.current}`;
    pendingScrollKeyRef.current = clientKey;
    setRows((prev) => [
      ...prev,
      {
        clientKey,
        sourceDetailId: null,
        budgetId,
        categoryId: defaultCategoryId,
        accountId: defaultAccountId,
        price: 0,
        expensesFlg: true,
        memo: undefined,
      },
    ]);
  }, [budgetId, defaultAccountId, defaultCategoryId]);

  const removeRow = useCallback((clientKey: string) => {
    setRows((prev) => prev.filter((r) => r.clientKey !== clientKey));
  }, []);

  const resetFromProps = useCallback(() => {
    newKeyRef.current = 0;
    setRows(rowsFromDetails(details));
  }, [details]);

  const handleSave = async () => {
    // TODO: PATCH 明細API（rows を送信）接続後にサーバーへ反映
    await updated();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      <div className="shrink-0 space-y-3">
        <div
          className="home_budget_detail_change_meta text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
          data-slot="home_budget_detail_change_summary"
        >
          <span>
            家計簿 ID：
            <span className="text-foreground font-medium tabular-nums">
              {budgetId}
            </span>
          </span>
          <span className="text-border hidden sm:inline" aria-hidden>
            ·
          </span>
          <span>
            表示：
            <span className="text-foreground font-medium tabular-nums">
              {rows.length}
            </span>
            件
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="home_budget_change_add_row"
            onClick={addRow}
          >
            <PlusIcon className="mr-1 size-4" />
            明細を追加
          </Button>
        </div>
      </div>

      <div
        id="home-budget-detail-change-scroll"
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1"
      >
        {rows.length === 0 ? (
          <div className="home_budget_change_empty text-muted-foreground rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-12 text-center text-sm dark:bg-muted/10">
            明細がありません。「明細を追加」から登録できます。
          </div>
        ) : (
          <ul
            className="home_budget_change_list flex list-none flex-col gap-4 pb-1"
            data-slot="home_budget_change_list"
          >
            {rows.map((row) => (
              <li
                key={row.clientKey}
                id={`home-budget-detail-change-row-${row.clientKey}`}
                className="home_budget_change_row rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5 dark:bg-muted/10"
                data-slot="home_budget_detail_change_row"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div className="text-muted-foreground text-xs font-medium">
                    {row.sourceDetailId != null
                      ? `明細 #${row.sourceDetailId}`
                      : "新規明細（未保存）"}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-8 shrink-0 px-2"
                    onClick={() => removeRow(row.clientKey)}
                  >
                    <TrashIcon className="size-4" />
                    <span className="ml-1 hidden sm:inline">削除</span>
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
                  <div className="lg:col-span-3">
                    <label
                      className="mb-1.5 block text-xs font-medium text-foreground/80"
                      htmlFor={`home-budget-change-category-${row.clientKey}`}
                    >
                      カテゴリ
                    </label>
                    {categoriesSorted.length === 0 ? (
                      <div
                        id={`home-budget-change-category-${row.clientKey}`}
                        className="home_budget_change_category flex h-8 w-full min-w-0 max-w-full items-center rounded-lg border border-border/80 bg-background px-2.5 text-sm text-muted-foreground"
                      >
                        カテゴリを読み込み中…
                      </div>
                    ) : (
                      <Select
                        value={String(row.categoryId)}
                        onValueChange={(v) =>
                          updateRow(row.clientKey, {
                            categoryId: Number(v),
                          })
                        }
                      >
                        <SelectTrigger
                          id={`home-budget-change-category-${row.clientKey}`}
                          size="sm"
                          className="home_budget_change_category w-full min-w-0 max-w-full border-border/80 bg-background shadow-none focus-visible:ring-2 focus-visible:ring-ring/30"
                        >
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="max-h-72 min-w-(--radix-select-trigger-width)"
                        >
                          {categoriesSorted.some(
                            (c) => c.categoryId === row.categoryId,
                          ) ? null : (
                            <SelectItem value={String(row.categoryId)} disabled>
                              ID {row.categoryId}（マスタ未登録）
                            </SelectItem>
                          )}
                          {categoriesSorted.map((c) => (
                            <SelectItem
                              key={c.categoryId}
                              value={String(c.categoryId)}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="size-2.5 shrink-0 rounded-full ring-1 ring-border"
                                  style={{ backgroundColor: c.color }}
                                  aria-hidden
                                />
                                {c.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="lg:col-span-3">
                    <label
                      className="mb-1.5 block text-xs font-medium text-foreground/80"
                      htmlFor={`home-budget-change-account-${row.clientKey}`}
                    >
                      口座・決済手段
                    </label>
                    {accounts.length === 0 ? (
                      <div
                        id={`home-budget-change-account-${row.clientKey}`}
                        className="home_budget_change_account flex h-8 w-full min-w-0 max-w-full items-center rounded-lg border border-border/80 bg-background px-2.5 text-sm text-muted-foreground"
                      >
                        口座・決済手段を読み込み中…
                      </div>
                    ) : (
                      <Select
                        value={String(row.accountId)}
                        onValueChange={(v) =>
                          updateRow(row.clientKey, {
                            accountId: Number(v),
                          })
                        }
                      >
                        <SelectTrigger
                          id={`home-budget-change-account-${row.clientKey}`}
                          size="sm"
                          className="home_budget_change_account w-full min-w-0 max-w-full border-border/80 bg-background shadow-none focus-visible:ring-2 focus-visible:ring-ring/30"
                        >
                          <SelectValue placeholder="口座・決済手段を選択" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="max-h-72 min-w-(--radix-select-trigger-width)"
                        >
                          {accounts.some(
                            (a) => a.accountId === row.accountId,
                          ) ? null : (
                            <SelectItem value={String(row.accountId)} disabled>
                              ID {row.accountId}（マスタ未登録）
                            </SelectItem>
                          )}
                          {accounts.map((a) => (
                            <SelectItem
                              key={a.accountId}
                              value={String(a.accountId)}
                            >
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="lg:col-span-3">
                    <label
                      className="mb-1.5 block text-xs font-medium text-foreground/80"
                      htmlFor={`home-budget-change-price-${row.clientKey}`}
                    >
                      金額（円）
                    </label>
                    <div className="rounded-lg border border-border/80 bg-background shadow-none transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                      <Input
                        id={`home-budget-change-price-${row.clientKey}`}
                        name={`price_${row.clientKey}`}
                        className="home_budget_change_price border-0 bg-transparent shadow-none focus-visible:ring-0"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={row.price}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          updateRow(row.clientKey, {
                            price: Number.isFinite(n) ? Math.max(0, n) : 0,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <span className="mb-1.5 block text-xs font-medium text-foreground/80">
                      種別
                    </span>
                    <div
                      className="home_budget_change_flow bg-muted/60 flex rounded-lg p-0.5 dark:bg-muted/40"
                      role="group"
                      aria-label="収入または支出"
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                          !row.expensesFlg
                            ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() =>
                          updateRow(row.clientKey, { expensesFlg: false })
                        }
                      >
                        収入
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                          row.expensesFlg
                            ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() =>
                          updateRow(row.clientKey, { expensesFlg: true })
                        }
                      >
                        支出
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-12">
                    <label
                      className="mb-1.5 block text-xs font-medium text-foreground/80"
                      htmlFor={`home-budget-change-memo-${row.clientKey}`}
                    >
                      メモ
                    </label>
                    <textarea
                      id={`home-budget-change-memo-${row.clientKey}`}
                      name={`memo_${row.clientKey}`}
                      className="home_budget_change_memo placeholder:text-muted-foreground flex min-h-18 w-full resize-y rounded-lg border border-border/80 bg-background px-2.5 py-2 text-sm shadow-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      value={row.memo ?? ""}
                      onChange={(e) =>
                        updateRow(row.clientKey, {
                          memo:
                            e.target.value === "" ? undefined : e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-border home_budget_change_actions flex shrink-0 flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={resetFromProps}>
          リセット
        </Button>
        <Button type="button" onClick={() => void handleSave()}>
          保存して閉じる
        </Button>
      </div>
    </div>
  );
}
