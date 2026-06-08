/** 日次家計簿データ */
export type DailyHomeBudget = {
  budgetId: number;
  date: string; // yyyy-MM-dd
  incomeTotal: number;
  expenseTotal: number;
};

/** 家計簿の明細データ */
export type HomeBudgetDetail = {
  budgetId: number;
  detailId: number;
  categoryId: number;
  accountId: number;
  price: number;
  expensesFlg: boolean;
  memo?: string;
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
export type MonthlyBudgetDetailRow = HomeBudgetDetail & {
  date: string;
};
