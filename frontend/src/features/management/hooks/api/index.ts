// import axios from "axios";
import type {
  DailyHomeBudget,
  HomeBudgetDetail,
  HomeBudgetCategory,
} from "../../types";

/** 一時: baseDate（yyyy-MM）に応じたダミー一覧 */
function dummyDailyHomeBudgets(ym: string): DailyHomeBudget[] {
  const parts = ym.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  const lastDay = new Date(y, m, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => {
    const d = i + 1;
    return {
      budgetId: y * 10 + m * 100 + d,
      date: `${y}-${pad(m)}-${pad(d)}`,
      incomeTotal: (i + 1) * 2000,
      expenseTotal: i * 500,
    };
  });
}

/**
 * dummyDailyHomeBudgets と同じ式（y * 10 + m * 100 + d）の budgetId だけ載せる。
 * 実API想定: WHERE budget_id = ? でヒットする行だけ返す。
 * ダミー行の月はカレンダーで開く月と揃えること（ズレると常に0件になる）。
 */
const DUMMY_HOME_BUDGET_DETAILS_MASTER: HomeBudgetDetail[] = [
  // 2026-04-01 / 04-03 / 04-07
  {
    budgetId: 20661,
    detailId: 1,
    categoryId: 1,
    price: 3280,
    expensesFlg: true,
    memo: "週末まとめ買い",
  },
  {
    budgetId: 20661,
    detailId: 2,
    categoryId: 2,
    price: 280000,
    expensesFlg: false,
  },
  {
    budgetId: 20663,
    detailId: 1,
    categoryId: 3,
    price: 500,
    expensesFlg: true,
    memo: "通勤（往復）",
  },
  {
    budgetId: 20663,
    detailId: 2,
    categoryId: 4,
    price: 680,
    expensesFlg: true,
  },
  {
    budgetId: 20667,
    detailId: 1,
    categoryId: 5,
    price: 1980,
    expensesFlg: true,
  },
  // 2026-05-01 / 05-03 / 05-07
  {
    budgetId: 20761,
    detailId: 1,
    categoryId: 1,
    price: 3280,
    expensesFlg: true,
    memo: "週末まとめ買い",
  },
  {
    budgetId: 20761,
    detailId: 2,
    categoryId: 2,
    price: 280000,
    expensesFlg: false,
  },
  {
    budgetId: 20763,
    detailId: 1,
    categoryId: 3,
    price: 500,
    expensesFlg: true,
    memo: "通勤（往復）",
  },
  {
    budgetId: 20763,
    detailId: 2,
    categoryId: 4,
    price: 680,
    expensesFlg: true,
  },
  {
    budgetId: 20767,
    detailId: 1,
    categoryId: 5,
    price: 1980,
    expensesFlg: true,
  },
];

const DUMMY_CATEGORY_MASTER: HomeBudgetCategory[] = [
  {
    categoryId: 1,
    name: "スーパー",
    color: "#FF0000",
  },
  {
    categoryId: 2,
    name: "給与",
    color: "#00FF00",
  },
  {
    categoryId: 3,
    name: "交通費",
    color: "#0000FF",
  },
  {
    categoryId: 4,
    name: "カフェ",
    color: "#FFFF00",
  },
  {
    categoryId: 5,
    name: "書籍",
    color: "#a855f7",
  },
];

function dummyHomeBudgetDetail(budgetId: number): HomeBudgetDetail[] {
  return DUMMY_HOME_BUDGET_DETAILS_MASTER.filter(
    (row) => row.budgetId === budgetId,
  );
}

function dummyCategory(): HomeBudgetCategory[] {
  return DUMMY_CATEGORY_MASTER;
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

export const findCategory = async (): Promise<HomeBudgetCategory[]> => {
  // TODO: API
  // const response = await axios.get("/api/category", {
  // });
  // return response.data;
  await Promise.resolve();
  return dummyCategory();
};
