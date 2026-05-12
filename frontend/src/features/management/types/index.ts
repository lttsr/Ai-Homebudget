export type DailyHomeBudget = {
  budgetId: number;
  date: string; // yyyy-MM-dd
  incomeTotal: number;
  expenseTotal: number;
};

/** 支払い方法マスタ */
export type AccountMst = {
  accountId: number;
  name: string;
};

export type HomeBudgetDetail = {
  budgetId: number;
  detailId: number;
  categoryId: number;
  accountId: number;
  price: number;
  expensesFlg: boolean;
  memo?: string;
};

export type CategoryMst = {
  categoryId: number;
  name: string;
  color: string;
};

/** 月次ダイアログ用：日付付き明細（date: yyyy-MM-dd） */
export type MonthlyBudgetDetailRow = HomeBudgetDetail & {
  date: string;
};
