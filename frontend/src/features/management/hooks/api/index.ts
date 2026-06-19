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

/** 月次の全明細を取得します。 */
export const findMonthlyDetails = async (
  baseDate: string,
): Promise<MonthlyBudgetDetailRow[]> => {
  return await get<MonthlyBudgetDetailRow[]>(`/home-budget/monthly/details`, {
    baseDate,
  });
};

/** 月次サマリーを取得します。 */
export const findMonthlySummary = async (
  baseDate: string,
): Promise<MonthlySummary | null> => {
  return await get<MonthlySummary | null>(`/home-budget/monthly/summary`, {
    baseDate,
  });
};

/** 月次サマリーの目標貯蓄金額を更新します。 */
export const updateMonthlySummary = async (
  baseDate: string,
  savingsTarget: number,
): Promise<MonthlySummary | null> => {
  return await post<MonthlySummary | null>(
    `/home-budget/monthly/summary/update`,
    {
      baseDate,
      savingsTarget,
    },
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
