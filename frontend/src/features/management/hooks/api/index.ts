// import axios from "axios";
import type { DailyHomeBudget, HomeBudgetDetail } from "../../types";

/** 一時: baseDate（yyyy-MM）に応じたダミー一覧 */
function dummyDailyHomeBudgets(ym: string): DailyHomeBudget[] {
  const parts = ym.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  const days = [
    1, 2, 3, 7, 9, 12, 13, 14, 16, 17, 18, 21, 22, 23, 24, 25, 28, 29, 30,
  ];
  return days.map((d, i) => ({
    budgetId: y * 10 + m * 100 + d,
    date: `${y}-${pad(m)}-${pad(d)}`,
    incomeTotal: (i + 1) * 2000,
    expenseTotal: i * 500,
  }));
}

function dummyHomeBudgetDetail(budgetId: number): HomeBudgetDetail[] {
  return [
    {
      budgetId,
      meisaiId: 1,
      category: "スーパー",
      price: 3280,
      expensesFlg: true,
      memo: "週末まとめ買い",
    },
    {
      budgetId,
      meisaiId: 2,
      category: "給与",
      price: 280000,
      expensesFlg: false,
    },
    {
      budgetId,
      meisaiId: 3,
      category: "交通費",
      price: 500,
      expensesFlg: true,
      memo: "通勤（往復）",
    },
    {
      budgetId,
      meisaiId: 4,
      category: "カフェ",
      price: 680,
      expensesFlg: true,
    },
  ];
}

export const findDailyHomeBudget = async (
  baseDate: string,
): Promise<DailyHomeBudget[]> => {
  // TODO: API
  // const response = await axios.get("/api/daily-home-budget", {
  //   params: { baseDate },
  // });
  // return response.data;
  await Promise.resolve();
  return dummyDailyHomeBudgets(baseDate);
};

export const findHomeBudgetDetail = async (
  budgetId: number,
): Promise<HomeBudgetDetail[]> => {
  // TODO: API
  // const response = await axios.get("/api/home-budget-meisai", {
  //   params: { budgetId },
  // });
  // return response.data;
  await Promise.resolve();
  return dummyHomeBudgetDetail(budgetId);
};
