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

  return { findDailyHomeBudget, findHomeBudgetDetail, findCategory };
};
