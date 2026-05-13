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

  /** カテゴリデータを取得します。 */
  const findCategory = useCallback(async () => {
    return await api.findCategory();
  }, []);

  /** 決済／支払い口座マスタを取得します。 */
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

  /** 指定月のバッチ登録済み月次集計を取得します（未登録は null）。 */
  const findHomeBudgetMonthlyAggregate = useCallback(
    async (baseDate: string) => {
      return await api.findHomeBudgetMonthlyAggregate(baseDate);
    },
    [],
  );

  return {
    findDailyHomeBudget,
    findHomeBudgetDetail,
    findCategory,
    findPaymentAccount,
    findMonthlyHomeBudgetDetails,
    findHomeBudgetMonthlyAggregate,
  };
};
