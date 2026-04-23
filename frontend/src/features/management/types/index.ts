export type DailyHomeBudget = {
  budgetId: string;
  date: Date;
  total: string;
};

export type HomeBudgetMeisai = {
  budgetId: string;
  meisaiId: string;
  category: string;
  price: string;
  expensesFlg: number;
  registerDate: string;
  updateDate: string;
  registerId: string;
  updateId: string;
};
