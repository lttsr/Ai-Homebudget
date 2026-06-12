// import axios from "axios";
import type {
  DailyHomeBudget,
  AccountMst,
  CategoryMst,
  DailyHomeBudgetDetail,
  MonthlyBudgetDetailRow,
  MonthlySummary,
} from "../../types";
import {
  dummyCategory,
  dummyDailyHomeBudgets,
  dummyDailyHomeBudgetDetail,
  dummyMonthlyDetailRows,
  dummyMonthlySummary,
  dummyPaymentAccount,
  dummyUpdateMonthlySummarySavingsTarget,
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

export const findDailyHomeBudgetDetail = async (
  budgetId: number,
): Promise<DailyHomeBudgetDetail[]> => {
  // TODO: API
  // const response = await axios.get("/api/daily-home-budget-detail", {
  //   params: { budgetId },
  // });
  // return response.data;
  await Promise.resolve();
  return dummyDailyHomeBudgetDetail(budgetId);
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
export const findMonthlyDetails = async (
  yearMonth: string,
): Promise<MonthlyBudgetDetailRow[]> => {
  // TODO: API
  // const response = await axios.get("/api/monthly-details", {
  //   params: { yearMonth },
  // });
  // return response.data;
  await Promise.resolve();
  return dummyMonthlyDetailRows(yearMonth);
};

/** 月次サマリーを取得します。 */
export const findMonthlySummary = async (
  yearMonth: string,
): Promise<MonthlySummary | null> => {
  // TODO: API
  // const response = await axios.get("/api/monthly-summary", {
  //   params: { yearMonth },
  // });
  // return response.data;
  await Promise.resolve();
  return dummyMonthlySummary(yearMonth);
};

/** 月次サマリーの目標貯蓄金額を更新します。 */
export const updateMonthlySummarySavingsTarget = async (
  yearMonth: string,
  savingsTarget: number,
): Promise<MonthlySummary | null> => {
  // TODO: API
  // const response = await axios.patch("/api/monthly-summary/savings-target", {
  //   baseMonth: yearMonth,
  //   savingsTarget,
  // });
  // return response.data;
  await Promise.resolve();
  return dummyUpdateMonthlySummarySavingsTarget(yearMonth, savingsTarget);
};
