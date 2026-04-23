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
