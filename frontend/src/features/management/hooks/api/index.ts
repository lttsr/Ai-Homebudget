// import axios from "axios";
import type {
  DailyHomeBudget,
  AccountMst,
  CategoryMst,
  DailyHomeBudgetDetail,
  HomeBudgetSettings,
  MonthlyBudgetDetailRow,
  MonthlySummary,
} from "../../types";
import {
  dummyCategory,
  dummyDailyHomeBudgets,
  dummyDailyHomeBudgetDetail,
  dummyHomeBudgetSettings,
  dummyMonthlyDetailRows,
  dummyMonthlySummary,
  dummyPaymentAccount,
  dummyUpdateHomeBudgetSettings,
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

/** 家計設定（全体共通）を取得します。 */
export const findHomeBudgetSettings = async (): Promise<HomeBudgetSettings> => {
  // TODO: API
  await Promise.resolve();
  return dummyHomeBudgetSettings();
};

/** 家計設定（全体共通）を更新します。 */
export const updateHomeBudgetSettings = async (
  settings: HomeBudgetSettings,
): Promise<HomeBudgetSettings> => {
  // TODO: API
  await Promise.resolve();
  return dummyUpdateHomeBudgetSettings(settings);
};
