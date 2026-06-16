import type { TaskStatusType, ExpenseType } from "@/types";

/** 月次家計簿確定情報 */
export type MonthlySummary = {
  baseMonth: string; // yyyy-MM
  statusType: TaskStatusType;
  incomeTotal: number;
  expenseTotal: number;
  savings: number;
  savingsTarget: number;
  achievementRate: number;
  comment?: string;
  confirmedDate?: string; // yyyy-MM-dd
};

/** 日次家計簿データ */
export type DailyHomeBudget = {
  budgetId: number;
  baseDate: string; // yyyy-MM-dd
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
  expenseType: ExpenseType;
  memo?: string;
};

/** 日次家計簿明細の登録・更新リクエスト */
export type UpdateDailyHomeBudgetDetail = {
  budgetId: number;
  detailId?: number;
  categoryId: number;
  accountId: number;
  price: number;
  expenseType: ExpenseType;
  memo?: string;
};

/** 口座・決済手段マスタ */
export type PaymentAccount = {
  accountId: number;
  name: string;
};

/** 家計カテゴリ */
export type BudgetCategory = {
  categoryId: number;
  name: string;
  colorCode: string;
};

/** 月次ダイアログ用：日付付き明細（date: yyyy-MM-dd） */
export type MonthlyBudgetDetailRow = DailyHomeBudgetDetail & {
  date: string;
};
