import type { TaskStatusType } from "@/types";

/** 月次家計簿確定情報 */
export type MonthlySummary = {
  baseMonth: string; // yyyy-MM
  statusType: TaskStatusType;
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  achievementRate: number;
  comment?: string;
  confirmedDate?: string; // yyyy-MM-dd
};

/** 日次家計簿データ */
export type DailyHomeBudget = {
  budgetId: number;
  date: string; // yyyy-MM-dd
  incomeTotal: number;
  expenseTotal: number;
};

/** 日次家計簿の明細データ */
export type DailyHomeBudgetDetail = {
  budgetId: number;
  detailId: number;
  categoryId: number;
  accountId: number;
  price: number;
  expensesFlg: boolean;
  memo?: string;
};

/** 家計設定（全体共通） */
export type HomeBudgetSettings = {
  savingsTarget: number;
};

/** 口座・決済手段マスタ */
export type AccountMst = {
  accountId: number;
  name: string;
};

/** カテゴリマスタ */
export type CategoryMst = {
  categoryId: number;
  name: string;
  color: string;
};

/** 月次ダイアログ用：日付付き明細（date: yyyy-MM-dd） */
export type MonthlyBudgetDetailRow = DailyHomeBudgetDetail & {
  date: string;
};
