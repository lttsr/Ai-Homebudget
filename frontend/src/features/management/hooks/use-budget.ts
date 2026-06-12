import { useCallback } from "react";
import * as api from "./api";

export const useBudget = () => {
  /** 月次家計簿データを取得します。 */
  const findDailyHomeBudget = useCallback(async (baseDate: string) => {
    return await api.findDailyHomeBudget(baseDate);
  }, []);

  /** 日次家計簿の明細データを取得します。 */
  const findDailyHomeBudgetDetail = useCallback(async (budgetId: number) => {
    return await api.findDailyHomeBudgetDetail(budgetId);
  }, []);

  /** カテゴリマスタを取得します。 */
  const findCategory = useCallback(async () => {
    return await api.findCategory();
  }, []);

  /** 口座・決済手段マスタを取得します。 */
  const findPaymentAccount = useCallback(async () => {
    return await api.findPaymentAccount();
  }, []);

  /** 月次の入出金明細（日付順）を取得します。 */
  const findMonthlyDetails = useCallback(async (yearMonth: string) => {
    return await api.findMonthlyDetails(yearMonth);
  }, []);

  /** 月次サマリーを取得します。 */
  const findMonthlySummary = useCallback(async (yearMonth: string) => {
    return await api.findMonthlySummary(yearMonth);
  }, []);

  /** 月次サマリーの目標貯蓄金額を更新します。 */
  const updateMonthlySummarySavingsTarget = useCallback(
    async (yearMonth: string, savingsTarget: number) => {
      return await api.updateMonthlySummarySavingsTarget(
        yearMonth,
        savingsTarget,
      );
    },
    [],
  );

  return {
    findDailyHomeBudget,
    findDailyHomeBudgetDetail,
    findCategory,
    findPaymentAccount,
    findMonthlyDetails,
    findMonthlySummary,
    updateMonthlySummarySavingsTarget,
  };
};
