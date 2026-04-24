export type DailyHomeBudget = {
  budgetId: number;
  date: string; // yyyy-MM-dd
  incomeTotal: number;
  expenseTotal: number;
};

export type HomeBudgetDetail = {
  budgetId: number;
  meisaiId: number;
  category: string;
  price: number;
  expensesFlg: boolean;
  memo?: string;
};
