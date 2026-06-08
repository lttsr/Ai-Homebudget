// import axios from "axios";
import type {
  DailyHomeBudget,
  AccountMst,
  CategoryMst,
  HomeBudgetDetail,
  MonthlyBudgetDetailRow,
} from "../../types";
import {
  dummyCategory,
  dummyDailyHomeBudgets,
  dummyHomeBudgetDetail,
  dummyMonthlyHomeBudgetDetailRows,
  dummyPaymentAccount,
} from "./dummy-data";

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

export const findCategory = async (): Promise<CategoryMst[]> => {
  // TODO: API
  // const response = await axios.get("/api/category", {
  // });
  // return response.data;
  await Promise.resolve();
  return dummyCategory();
};

/** 口座・決済手段マスタを取得します。 */
export const findPaymentAccount =
  async (): Promise<AccountMst[]> => {
    // TODO: API
    await Promise.resolve();
    return dummyPaymentAccount();
  };

/** 月次の全明細（日付昇順・実API接続時は params: { yearMonth } 想定） */
export const findMonthlyHomeBudgetDetails = async (
  yearMonth: string,
): Promise<MonthlyBudgetDetailRow[]> => {
  // TODO: API
  // const response = await axios.get("/api/monthly-home-budget-details", {
  //   params: { yearMonth },
  // });
  // return response.data;
  await Promise.resolve();
  return dummyMonthlyHomeBudgetDetailRows(yearMonth);
};
