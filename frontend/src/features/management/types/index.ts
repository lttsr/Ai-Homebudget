export type DailyHomeBudget = {
  budgetId: number;
  date: string; // yyyy-MM-dd
  incomeTotal: number;
  expenseTotal: number;
};

export type HomeBudgetDetail = {
  budgetId: number;
  detailId: number;
  categoryId: number;
  price: number;
  expensesFlg: boolean;
  memo?: string;
};

export type HomeBudgetCategory = {
  categoryId: number;
  name: string;
  color: string;
};

/** 月次ダイアログ用：日付付き明細（date: yyyy-MM-dd） */
export type MonthlyBudgetDetailRow = HomeBudgetDetail & {
  date: string;
};
