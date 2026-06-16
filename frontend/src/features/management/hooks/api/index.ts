import { get, post } from "@/lib/axios";
import type {
  DailyHomeBudget,
  PaymentAccount,
  BudgetCategory,
  DailyHomeBudgetDetail,
  MonthlyBudgetDetailRow,
  MonthlySummary,
  UpdateDailyHomeBudgetDetail,
} from "../../types";
import {
  dummyMonthlyDetailRows,
  dummyMonthlySummary,
  dummyUpdateMonthlySummarySavingsTarget,
} from "./dummy-data";

/** 指定された年月の全ての家計簿情報を取得します。 */
export const findDailyHomeBudget = async (
  baseDate: string,
): Promise<DailyHomeBudget[]> => {
  return await get<DailyHomeBudget[]>(`/home-budget/${baseDate}`);
};

/** 指定された家計簿IDの全ての明細データを取得します。 */
export const findDailyHomeBudgetDetail = async (
  budgetId: number,
): Promise<DailyHomeBudgetDetail[]> => {
  return await get<DailyHomeBudgetDetail[]>(`/home-budget/details/${budgetId}`);
};

/** 日次家計簿の明細データを登録・更新します。 */
export const updateDailyHomeBudgetDetails = async (
  budgetId: number,
  details: UpdateDailyHomeBudgetDetail[],
): Promise<DailyHomeBudgetDetail[]> => {
  return await post<DailyHomeBudgetDetail[]>(
    `/home-budget/details/${budgetId}/update`,
    details,
  );
};

/** 家計カテゴリマスタを取得します。 */
export const findCategory = async (): Promise<BudgetCategory[]> => {
  return await get<BudgetCategory[]>("/master/budget-category");
};

/** 家計カテゴリを登録します。 */
export const registerBudgetCategory = async (
  name: string,
  color: string,
): Promise<BudgetCategory> => {
  return await post<BudgetCategory>("/master/budget-category/register", {
    name,
    colorCode: color,
  });
};

/** 口座・決済手段マスタを取得します。 */
export const findPaymentAccount = async (): Promise<PaymentAccount[]> => {
  return await get<PaymentAccount[]>("/master/payment-account");
};

/** 口座・決済手段マスタを登録します。 */
export const registerPaymentAccount = async (
  name: string,
): Promise<PaymentAccount> => {
  return await post<PaymentAccount>("/master/payment-account/register", {
    name,
  });
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
