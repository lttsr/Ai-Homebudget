import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CalendarClock,
  ChevronRight,
  Download,
  Plus,
  SlidersHorizontal,
  Tags,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useBudget } from "../hooks/use-budget";
import type { PaymentAccount } from "../types";

type BudgetCategory = {
  categoryId: number;
  name: string;
  colorCode: string;
};

type SettingsSection =
  | "category"
  | "payment"
  | "monthly-batch"
  | "display"
  | "export";

type NavGroup = {
  id: string;
  label: string;
  items: {
    id: SettingsSection;
    label: string;
    description: string;
    icon: ReactNode;
  }[];
};

const CATEGORY_COLOR_PRESETS = [
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f97316",
  "#06b6d4",
  "#ca8a04",
  "#64748b",
] as const;

const NAV_GROUPS: NavGroup[] = [
  {
    id: "master",
    label: "マスター",
    items: [
      {
        id: "category",
        label: "カテゴリ",
        description: "支出・収入の分類",
        icon: <Tags className="size-4 shrink-0" aria-hidden />,
      },
      {
        id: "payment",
        label: "口座・決済手段",
        description: "入出金元を管理",
        icon: <Wallet className="size-4 shrink-0" aria-hidden />,
      },
    ],
  },
  {
    id: "behavior",
    label: "家計の動作",
    items: [
      {
        id: "monthly-batch",
        label: "月次集計",
        description: "月末バッチの扱い",
        icon: <CalendarClock className="size-4 shrink-0" aria-hidden />,
      },
      {
        id: "display",
        label: "表示",
        description: "画面の見え方",
        icon: <SlidersHorizontal className="size-4 shrink-0" aria-hidden />,
      },
    ],
  },
  {
    id: "data",
    label: "データ",
    items: [
      {
        id: "export",
        label: "エクスポート",
        description: "CSV など（予定）",
        icon: <Download className="size-4 shrink-0" aria-hidden />,
      },
    ],
  },
];

function SettingsNav({
  active,
  onSelect,
}: {
  active: SettingsSection;
  onSelect: (id: SettingsSection) => void;
}) {
  return (
    <nav
      className="flex shrink-0 flex-col gap-4 md:w-52"
      aria-label="設定メニュー"
    >
      {NAV_GROUPS.map((group) => (
        <div key={group.id}>
          <span className="text-muted-foreground mb-2 px-1 text-xs font-semibold">
            {group.label}
          </span>
          <div role="tablist" className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => onSelect(item.id)}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.label}</span>
                    <span className="text-muted-foreground block truncate text-xs font-normal">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0 opacity-40",
                      isActive && "opacity-100",
                    )}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function CategorySettingsPanel({
  categories,
  onAdd,
}: {
  categories: BudgetCategory[];
  onAdd: (name: string, colorCode: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState<string>(CATEGORY_COLOR_PRESETS[0]);
  const [adding, setAdding] = useState(false);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.categoryId - b.categoryId),
    [categories],
  );

  const handleAdd = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed === "" || adding) return;
    setAdding(true);
    try {
      await onAdd(trimmed, colorCode);
      setName("");
    } finally {
      setAdding(false);
    }
  }, [name, colorCode, onAdd, adding]);

  return (
    <div className="space-y-6">
      <header>
        <span className="block text-lg font-semibold">カテゴリ</span>
        <p className="text-muted-foreground mt-1 text-sm">
          明細登録時に選ぶ分類です。色はグラフや一覧の識別に使います。
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <span className="block text-sm font-semibold">カテゴリを追加</span>
        <div className="mt-4 flex flex-col gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="settings-category-name"
              className="text-muted-foreground text-xs font-medium"
            >
              名前
            </label>
            <Input
              id="settings-category-name"
              name="category_name"
              value={name}
              placeholder="例：日用品"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAdd();
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground shrink-0 text-xs font-medium">
              色
            </span>
            {CATEGORY_COLOR_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full border-2 p-0 hover:scale-105 hover:bg-transparent",
                  colorCode === preset
                    ? "border-foreground ring-2 ring-ring ring-offset-2"
                    : "border-transparent",
                )}
                style={{ backgroundColor: preset }}
                aria-label={`色 ${preset}`}
                aria-pressed={colorCode === preset}
                onClick={() => setColorCode(preset)}
              />
            ))}
            <Button
              type="button"
              className="ml-auto shrink-0"
              disabled={adding}
              onClick={() => void handleAdd()}
            >
              <Plus className="size-4" aria-hidden />
              追加
            </Button>
          </div>
        </div>
      </section>

      <section>
        <span className="mb-3 block text-sm font-semibold">
          登録済み（{sorted.length}件）
        </span>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14 pl-4">色</TableHead>
                <TableHead className="pl-2">名前</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground py-8 text-center"
                  >
                    カテゴリがありません
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((cat) => (
                  <TableRow key={cat.categoryId}>
                    <TableCell className="pl-4">
                      <span
                        className="inline-block size-4 rounded-full ring-1 ring-border"
                        style={{ backgroundColor: cat.colorCode }}
                        aria-hidden
                      />
                    </TableCell>
                    <TableCell className="max-w-0 truncate pl-2 font-medium">
                      {cat.name}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function PaymentSettingsPanel({
  accounts,
  onAdd,
}: {
  accounts: PaymentAccount[];
  onAdd: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  const sorted = useMemo(
    () => [...accounts].sort((a, b) => a.accountId - b.accountId),
    [accounts],
  );

  const handleAdd = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed === "" || adding) return;
    setAdding(true);
    try {
      await onAdd(trimmed);
      setName("");
    } finally {
      setAdding(false);
    }
  }, [name, onAdd, adding]);

  return (
    <div className="space-y-6">
      <header>
        <span className="block text-lg font-semibold">口座・決済手段</span>
        <p className="text-muted-foreground mt-1 text-sm">
          明細の入出金元を登録します。
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <span className="block text-sm font-semibold">
          入金口座・決済手段を追加
        </span>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1.5">
            <label
              htmlFor="settings-payment-name"
              className="text-muted-foreground text-xs font-medium"
            >
              名前
            </label>
            <Input
              id="settings-payment-name"
              name="payment_name"
              value={name}
              placeholder="例：PayPay"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAdd();
              }}
            />
          </div>
          <Button
            type="button"
            className="shrink-0"
            disabled={adding}
            onClick={() => void handleAdd()}
          >
            <Plus className="size-4" aria-hidden />
            {adding ? "追加中…" : "追加"}
          </Button>
        </div>
      </section>

      <section>
        <span className="mb-3 block text-sm font-semibold">
          登録済み（{sorted.length}件）
        </span>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 pl-4">ID</TableHead>
                <TableHead>名前</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground py-8 text-center"
                  >
                    口座・決済手段がありません
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((acc) => (
                  <TableRow key={acc.accountId}>
                    <TableCell className="text-muted-foreground pl-4 tabular-nums">
                      {acc.accountId}
                    </TableCell>
                    <TableCell className="max-w-0 truncate font-medium">
                      {acc.name}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function PlaceholderPanel({
  title,
  body,
  badge,
}: {
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="block text-lg font-semibold">{title}</span>
        {badge != null ? (
          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
            {badge}
          </span>
        ) : null}
      </header>
      <div className="text-muted-foreground rounded-xl border border-dashed border-border bg-muted/30 p-6 text-sm leading-relaxed">
        {body}
      </div>
    </div>
  );
}

export function Settings() {
  const {
    findCategory,
    findPaymentAccount,
    registerPaymentAccount,
    registerBudgetCategory,
  } = useBudget();
  const [section, setSection] = useState<SettingsSection>("category");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [graphDefaultTab, setGraphDefaultTab] = useState<
    "category" | "account" | "expense-daily"
  >("category");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const [cats, accs] = await Promise.all([
          findCategory(),
          findPaymentAccount(),
        ]);
        if (!cancelled) {
          setCategories(cats as unknown as BudgetCategory[]);
          setAccounts(accs);
        }
      } catch {
        if (!cancelled) {
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
  }, [findCategory, findPaymentAccount]);

  const addCategory = useCallback(
    async (name: string, colorCode: string) => {
      const registered = await registerBudgetCategory(name, colorCode);
      setCategories((prev) =>
        [...prev, registered as unknown as BudgetCategory].sort(
          (a, b) => a.categoryId - b.categoryId,
        ),
      );
    },
    [registerBudgetCategory],
  );

  const addAccount = useCallback(
    async (name: string) => {
      const registered = await registerPaymentAccount(name);
      setAccounts((prev) =>
        [...prev, registered].sort((a, b) => a.accountId - b.accountId),
      );
    },
    [registerPaymentAccount],
  );

  const activeNav = useMemo(
    () =>
      NAV_GROUPS.flatMap((g) => g.items).find((item) => item.id === section),
    [section],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <p className="text-muted-foreground shrink-0 text-sm">
        家計管理のマスターと表示の設定です。
      </p>
      <Separator className="shrink-0" />
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden md:flex-row">
        <SettingsNav active={section} onSelect={setSection} />
        <Separator
          orientation="vertical"
          className="hidden md:block"
          decorative
        />
        <div
          className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1"
          role="tabpanel"
          aria-label={activeNav?.label ?? "設定内容"}
        >
          {loading ? (
            <p className="text-muted-foreground py-16 text-center text-sm">
              読み込み中…
            </p>
          ) : section === "category" ? (
            <CategorySettingsPanel
              categories={categories}
              onAdd={addCategory}
            />
          ) : section === "payment" ? (
            <PaymentSettingsPanel accounts={accounts} onAdd={addAccount} />
          ) : section === "monthly-batch" ? (
            <PlaceholderPanel
              title="月次集計"
              body="月末バッチで月次サマリーの集計・確定を行います。目標貯蓄金額は月次入出金明細ダイアログから月ごとに設定できます。確定済みの月は日次明細の編集ができなくなります。"
            />
          ) : section === "display" ? (
            <div className="space-y-6">
              <header>
                <span className="block text-lg font-semibold">表示</span>
                <p className="text-muted-foreground mt-1 text-sm">
                  家計画面の見え方（モック・ローカルのみ）
                </p>
              </header>
              <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <span className="block text-sm font-semibold">
                  月次グラフの初期タブ
                </span>
                <p className="text-muted-foreground mt-1 text-xs">
                  グラフダイアログを開いたときに最初に表示するタブ
                </p>
                <div
                  className="mt-4 flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="月次グラフの初期タブ"
                >
                  {(
                    [
                      { id: "category" as const, label: "カテゴリ（円）" },
                      {
                        id: "account" as const,
                        label: "口座・決済手段（円）",
                      },
                      { id: "expense-daily" as const, label: "支出の推移" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={graphDefaultTab === opt.id}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm transition-colors",
                        graphDefaultTab === opt.id
                          ? "border-primary bg-primary/10 font-medium"
                          : "border-border hover:bg-muted",
                      )}
                      onClick={() => setGraphDefaultTab(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>
              <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <span className="block text-sm font-semibold">金額の表示</span>
                <p className="text-muted-foreground mt-2 text-sm">
                  現状は常に「円」・3桁区切り（`toLocaleString('ja-JP')`）です。
                  通貨切替は API 確定後に検討します。
                </p>
              </section>
            </div>
          ) : (
            <PlaceholderPanel
              title="エクスポート"
              badge="準備中"
              body="月次明細や集計結果を CSV でダウンロードする機能を予定しています。バックエンドのエクスポート API が用意でき次第、この画面から期間を指定して取得できるようにします。"
            />
          )}
        </div>
      </div>
    </div>
  );
}
