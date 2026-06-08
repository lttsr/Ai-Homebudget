import {
  type DailyHomeBudget,
  type AccountMst,
  type HomeBudgetDetail,
  type CategoryMst,
  type MonthlyBudgetDetailRow,
} from "../../types";

/**
 * ダミー専用 budgetId（日次一覧・明細と揃える）
 * 式: year * 10 + month * 100 + day
 */
export function dummyBudgetId(
  year: number,
  month: number,
  day: number,
): number {
  return year * 10 + month * 100 + day;
}

export const DUMMY_CATEGORY_MASTER: CategoryMst[] = [
  { categoryId: 1, name: "スーパー", color: "#FF0000" },
  { categoryId: 2, name: "給与", color: "#00FF00" },
  { categoryId: 3, name: "交通費", color: "#0000FF" },
  { categoryId: 4, name: "カフェ", color: "#FFFF00" },
  { categoryId: 5, name: "書籍", color: "#a855f7" },
  { categoryId: 6, name: "雑費", color: "#f97316" },
  { categoryId: 7, name: "通信費", color: "#06b6d4" },
  { categoryId: 8, name: "前月度収支", color: "#64748b" },
  { categoryId: 9, name: "家賃", color: "#ca8a04" },
  { categoryId: 10, name: "クレジットカード決済", color: "#0ea5e9" },
];

/** 口座・決済手段ダミーマスタ */
export const DUMMY_PAYMENT_ACCOUNT_MASTER: AccountMst[] = [
  {
    accountId: 1,
    name: "現金",
  },
  {
    accountId: 2,
    name: "クレジットカード",
  },
  {
    accountId: 3,
    name: "メイン銀行口座",
  },
  {
    accountId: 4,
    name: "電子マネー",
  },
];

/** 明細マスタから、budgetId 単位の収入・支出合計。 */
export function totalsFromDetailsForBudget(
  budgetId: number,
  details: HomeBudgetDetail[],
): { incomeTotal: number; expenseTotal: number } {
  let incomeTotal = 0;
  let expenseTotal = 0;
  for (const row of details) {
    if (row.budgetId !== budgetId) continue;
    if (row.expensesFlg) {
      expenseTotal += row.price;
    } else {
      incomeTotal += row.price;
    }
  }
  return { incomeTotal, expenseTotal };
}

/**
 * 家計明細ダミー（budgetId は dummyBudgetId(2026, m, d) と一致させる）
 */
export const DUMMY_HOME_BUDGET_DETAILS_MASTER: HomeBudgetDetail[] = [
  // --- 2026-04 ---
  {
    budgetId: dummyBudgetId(2026, 4, 1),
    detailId: 1,
    categoryId: 1,
    accountId: 1,
    price: 3280,
    expensesFlg: true,
    memo: "週末まとめ買い",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 1),
    detailId: 2,
    categoryId: 2,
    accountId: 2,
    price: 280000,
    expensesFlg: false,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 2),
    detailId: 1,
    categoryId: 4,
    accountId: 3,
    price: 420,
    expensesFlg: true,
    memo: "朝コーヒー",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 2),
    detailId: 2,
    categoryId: 7,
    accountId: 4,
    price: 5500,
    expensesFlg: true,
    memo: "スマホ代",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 3),
    detailId: 1,
    categoryId: 3,
    accountId: 1,
    price: 500,
    expensesFlg: true,
    memo: "通勤（往復）",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 3),
    detailId: 2,
    categoryId: 4,
    accountId: 2,
    price: 680,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 4),
    detailId: 1,
    categoryId: 1,
    accountId: 3,
    price: 1890,
    expensesFlg: true,
    memo: "弁当食材",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 5),
    detailId: 1,
    categoryId: 6,
    accountId: 4,
    price: 3200,
    expensesFlg: true,
    memo: "ドラッグストア",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 5),
    detailId: 2,
    categoryId: 5,
    accountId: 1,
    price: 1650,
    expensesFlg: true,
    memo: "技術書",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 6),
    detailId: 1,
    categoryId: 4,
    accountId: 2,
    price: 980,
    expensesFlg: true,
    memo: "ランチ",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 7),
    detailId: 1,
    categoryId: 5,
    accountId: 3,
    price: 1980,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 8),
    detailId: 1,
    categoryId: 3,
    accountId: 4,
    price: 750,
    expensesFlg: true,
    memo: "タクシー（雨）",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 10),
    detailId: 1,
    categoryId: 1,
    accountId: 1,
    price: 4520,
    expensesFlg: true,
    memo: "週次買い出し",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 10),
    detailId: 2,
    categoryId: 4,
    accountId: 2,
    price: 1200,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 12),
    detailId: 1,
    categoryId: 2,
    accountId: 3,
    price: 15000,
    expensesFlg: false,
    memo: "副業振込",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 14),
    detailId: 1,
    categoryId: 6,
    accountId: 4,
    price: 890,
    expensesFlg: true,
    memo: "文房具",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 15),
    detailId: 1,
    categoryId: 1,
    accountId: 1,
    price: 2100,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 15),
    detailId: 2,
    categoryId: 7,
    accountId: 2,
    price: 3980,
    expensesFlg: true,
    memo: "光回線",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 18),
    detailId: 1,
    categoryId: 3,
    accountId: 3,
    price: 500,
    expensesFlg: true,
    memo: "定期",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 20),
    detailId: 1,
    categoryId: 5,
    accountId: 4,
    price: 2420,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 22),
    detailId: 1,
    categoryId: 4,
    accountId: 1,
    price: 650,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 22),
    detailId: 2,
    categoryId: 1,
    accountId: 2,
    price: 980,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 4, 25),
    detailId: 1,
    categoryId: 6,
    accountId: 3,
    price: 12000,
    expensesFlg: true,
    memo: "家電小物",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 28),
    detailId: 1,
    categoryId: 1,
    accountId: 4,
    price: 5600,
    expensesFlg: true,
    memo: "月末まとめ買い",
  },
  {
    budgetId: dummyBudgetId(2026, 4, 28),
    detailId: 2,
    categoryId: 2,
    accountId: 1,
    price: 280000,
    expensesFlg: false,
    memo: "給与",
  },

  // --- 2026-05 ---
  {
    budgetId: dummyBudgetId(2026, 5, 1),
    detailId: 1,
    categoryId: 8,
    accountId: 3,
    price: 98000,
    expensesFlg: false,
    memo: "繰り越し",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 1),
    detailId: 2,
    categoryId: 1,
    accountId: 2,
    price: 3280,
    expensesFlg: true,
    memo: "週末まとめ買い",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 2),
    detailId: 1,
    categoryId: 4,
    accountId: 4,
    price: 380,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 3),
    detailId: 1,
    categoryId: 3,
    accountId: 1,
    price: 500,
    expensesFlg: true,
    memo: "通勤（往復）",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 3),
    detailId: 2,
    categoryId: 4,
    accountId: 2,
    price: 680,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 4),
    detailId: 1,
    categoryId: 5,
    accountId: 3,
    price: 880,
    expensesFlg: true,
    memo: "雑誌",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 5),
    detailId: 1,
    categoryId: 6,
    accountId: 4,
    price: 2200,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 6),
    detailId: 1,
    categoryId: 1,
    accountId: 1,
    price: 1450,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 7),
    detailId: 1,
    categoryId: 5,
    accountId: 2,
    price: 1980,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 8),
    detailId: 1,
    categoryId: 7,
    accountId: 3,
    price: 2200,
    expensesFlg: true,
    memo: "サブスクまとめ",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 10),
    detailId: 1,
    categoryId: 3,
    accountId: 4,
    price: 1200,
    expensesFlg: true,
    memo: "新幹線片道",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 10),
    detailId: 2,
    categoryId: 10,
    accountId: 2,
    price: 100000,
    expensesFlg: true,
    memo: "カード請求お支払い",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 11),
    detailId: 1,
    categoryId: 2,
    accountId: 1,
    price: 8000,
    expensesFlg: false,
    memo: "業務委託",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 12),
    detailId: 1,
    categoryId: 1,
    accountId: 2,
    price: 3980,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 14),
    detailId: 1,
    categoryId: 4,
    accountId: 3,
    price: 520,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 15),
    detailId: 1,
    categoryId: 2,
    accountId: 3,
    price: 300000,
    expensesFlg: false,
    memo: "給与",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 15),
    detailId: 2,
    categoryId: 1,
    accountId: 4,
    price: 2670,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 15),
    detailId: 3,
    categoryId: 6,
    accountId: 1,
    price: 4500,
    expensesFlg: true,
    memo: "衣類",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 18),
    detailId: 1,
    categoryId: 3,
    accountId: 2,
    price: 500,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 20),
    detailId: 1,
    categoryId: 5,
    accountId: 3,
    price: 1320,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 20),
    detailId: 2,
    categoryId: 9,
    accountId: 3,
    price: 120000,
    expensesFlg: true,
    memo: "家賃（振込）",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 22),
    detailId: 1,
    categoryId: 4,
    accountId: 4,
    price: 890,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 22),
    detailId: 2,
    categoryId: 1,
    accountId: 1,
    price: 1120,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 5, 25),
    detailId: 1,
    categoryId: 7,
    accountId: 2,
    price: 5500,
    expensesFlg: true,
    memo: "通信",
  },
  {
    budgetId: dummyBudgetId(2026, 5, 28),
    detailId: 1,
    categoryId: 1,
    accountId: 3,
    price: 6100,
    expensesFlg: true,
  },

  // --- 2026-06（他月サンプル）---
  {
    budgetId: dummyBudgetId(2026, 6, 1),
    detailId: 1,
    categoryId: 4,
    accountId: 1,
    price: 460,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 2),
    detailId: 1,
    categoryId: 1,
    accountId: 2,
    price: 2890,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 3),
    detailId: 1,
    categoryId: 3,
    accountId: 3,
    price: 500,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 5),
    detailId: 1,
    categoryId: 6,
    accountId: 4,
    price: 7800,
    expensesFlg: true,
    memo: "日用品まとめ買い",
  },
  {
    budgetId: dummyBudgetId(2026, 6, 7),
    detailId: 1,
    categoryId: 5,
    accountId: 1,
    price: 2200,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 10),
    detailId: 1,
    categoryId: 2,
    accountId: 2,
    price: 280000,
    expensesFlg: false,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 10),
    detailId: 2,
    categoryId: 1,
    accountId: 3,
    price: 3450,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 12),
    detailId: 1,
    categoryId: 4,
    accountId: 4,
    price: 1340,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 15),
    detailId: 1,
    categoryId: 7,
    accountId: 1,
    price: 3980,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 18),
    detailId: 1,
    categoryId: 3,
    accountId: 2,
    price: 2400,
    expensesFlg: true,
    memo: "レンタカー",
  },
  {
    budgetId: dummyBudgetId(2026, 6, 20),
    detailId: 1,
    categoryId: 1,
    accountId: 3,
    price: 4980,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 22),
    detailId: 1,
    categoryId: 5,
    accountId: 4,
    price: 990,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 25),
    detailId: 1,
    categoryId: 6,
    accountId: 1,
    price: 2100,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 28),
    detailId: 1,
    categoryId: 4,
    accountId: 2,
    price: 760,
    expensesFlg: true,
  },
  {
    budgetId: dummyBudgetId(2026, 6, 29),
    detailId: 1,
    categoryId: 2,
    accountId: 3,
    price: 285000,
    expensesFlg: false,
    memo: "賞与込みサンプル",
  },
];

/** 一時: yyyy-MM の日次一覧（合計は DUMMY_HOME_BUDGET_DETAILS_MASTER と整合） */
export function dummyDailyHomeBudgets(ym: string): DailyHomeBudget[] {
  const parts = ym.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  const lastDay = new Date(y, m, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => {
    const d = i + 1;
    const budgetId = dummyBudgetId(y, m, d);
    const { incomeTotal, expenseTotal } = totalsFromDetailsForBudget(
      budgetId,
      DUMMY_HOME_BUDGET_DETAILS_MASTER,
    );
    return {
      budgetId,
      date: `${y}-${pad(m)}-${pad(d)}`,
      incomeTotal,
      expenseTotal,
    };
  });
}

export function dummyHomeBudgetDetail(budgetId: number): HomeBudgetDetail[] {
  return DUMMY_HOME_BUDGET_DETAILS_MASTER.filter(
    (row) => row.budgetId === budgetId,
  );
}

export function dummyCategory(): CategoryMst[] {
  return DUMMY_CATEGORY_MASTER;
}

export function dummyPaymentAccount(): AccountMst[] {
  return DUMMY_PAYMENT_ACCOUNT_MASTER;
}

/** 月次モーダル用のフラット明細（日付昇順） */
export function dummyMonthlyHomeBudgetDetailRows(
  yearMonth: string,
): MonthlyBudgetDetailRow[] {
  const days = dummyDailyHomeBudgets(yearMonth);
  const idToDate = new Map(days.map((d) => [d.budgetId, d.date] as const));
  const out: MonthlyBudgetDetailRow[] = [];

  for (const row of DUMMY_HOME_BUDGET_DETAILS_MASTER) {
    const date = idToDate.get(row.budgetId);
    if (date == null) continue;
    out.push({ ...row, date });
  }

  out.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    if (a.budgetId !== b.budgetId) return a.budgetId - b.budgetId;
    return a.detailId - b.detailId;
  });

  return out;
}
