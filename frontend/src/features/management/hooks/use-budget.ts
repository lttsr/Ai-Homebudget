import { useCallback } from "react";
import * as api from "./api";

export const useBudget = () => {
  /** 月次家計簿データを取得します。 */
  const findDailyHomeBudget = useCallback(async (baseDate: string) => {
    return await api.findDailyHomeBudget(baseDate);
  }, []);

  /** 家計簿の明細データを取得します。 */
  const findHomeBudgetDetail = useCallback(async (budgetId: number) => {
    return await api.findHomeBudgetDetail(budgetId);
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
  const findMonthlyHomeBudgetDetails = useCallback(
    async (yearMonth: string) => {
      return await api.findMonthlyHomeBudgetDetails(yearMonth);
    },
    [],
  );

  /** 月次家計簿確定情報を取得します。 */
  const findMonthlyHomeBudget = useCallback(async (yearMonth: string) => {
    return await api.findMonthlyHomeBudget(yearMonth);
  }, []);

  /** 家計設定（全体共通）を取得します。 */
  const findHomeBudgetSettings = useCallback(async () => {
    return await api.findHomeBudgetSettings();
  }, []);

  /** 家計設定（全体共通）を更新します。 */
  const updateHomeBudgetSettings = useCallback(
    async (settings: Parameters<typeof api.updateHomeBudgetSettings>[0]) => {
      return await api.updateHomeBudgetSettings(settings);
    },
    [],
  );

  return {
    findDailyHomeBudget,
    findHomeBudgetDetail,
    findCategory,
    findPaymentAccount,
    findMonthlyHomeBudgetDetails,
    findMonthlyHomeBudget,
    findHomeBudgetSettings,
    updateHomeBudgetSettings,
  };
};
