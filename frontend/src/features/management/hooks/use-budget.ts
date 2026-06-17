import { useCallback } from "react";
import * as api from "./api";
import type { UpdateDailyHomeBudgetDetail } from "../types";

export const useBudget = () => {
  /** 指定された年月の全ての家計簿情報を取得します。 */
  const findDailyHomeBudget = useCallback(async (baseDate: string) => {
    return await api.findDailyHomeBudget(baseDate);
  }, []);

  /** 指定された家計簿IDの全ての明細データを取得します。 */
  const findDailyHomeBudgetDetail = useCallback(async (budgetId: number) => {
    return await api.findDailyHomeBudgetDetail(budgetId);
  }, []);

  /** 日次家計簿の明細データを登録・更新します。 */
  const updateDailyHomeBudgetDetails = useCallback(
    async (budgetId: number, details: UpdateDailyHomeBudgetDetail[]) => {
      return await api.updateDailyHomeBudgetDetails(budgetId, details);
    },
    [],
  );

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

  /** カテゴリマスタを取得します。 */
  const findCategory = useCallback(async () => {
    return await api.findCategory();
  }, []);

  /** 家計カテゴリを登録します。 */
  const registerBudgetCategory = useCallback(
    async (name: string, color: string) => {
      return await api.registerBudgetCategory(name, color);
    },
    [],
  );

  /** 口座・決済手段マスタを取得します。 */
  const findPaymentAccount = useCallback(async () => {
    return await api.findPaymentAccount();
  }, []);

  /** 口座・決済手段マスタを登録します。 */
  const registerPaymentAccount = useCallback(async (name: string) => {
    return await api.registerPaymentAccount(name);
  }, []);

  return {
    findDailyHomeBudget,
    findDailyHomeBudgetDetail,
    updateDailyHomeBudgetDetails,
    findCategory,
    findPaymentAccount,
    registerPaymentAccount,
    registerBudgetCategory,
    findMonthlyDetails,
    findMonthlySummary,
    updateMonthlySummarySavingsTarget,
  };
};
