package api.usecase.budget;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.model.budget.DailyHomeBudget;
import api.model.budget.DailyHomeBudgetDetail;
import api.model.budget.DailyHomeBudgetDetail.DailyHomeBudgetDetailId;
import api.model.budget.DailyHomeBudgetDetail.RegisterDailyHomeBudgetDetail;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DailyHomeBudgetService {
    private final OrmRepository rep;

    /**
     * 指定された日付の家計簿データを取得します。
     *
     * @param baseDate 基準日
     * @return 家計簿データ
     */
    public List<DailyHomeBudget> getDailyHomeBudgets(YearMonth yearMonth) {
        return DailyHomeBudget.findByYearMonth(rep, yearMonth);
    }

    /**
     * 指定された家計簿IDの家計簿詳細データを全て取得します。
     *
     * @param budgetId 家計簿ID
     * @return 家計簿詳細データ
     */
    public List<DailyHomeBudgetDetail> getDailyHomeBudgetDetails(Long budgetId) {
        return DailyHomeBudgetDetail.findByBudgetId(rep, budgetId);
    }

    /**
     * 指定された家計簿IDの家計簿詳細データを更新します。
     *
     * @param budgetId 家計簿ID
     * @param details  家計簿詳細データ
     * @return 家計簿詳細データ
     */
    @Transactional
    public List<DailyHomeBudgetDetail> updateDailyHomeBudgetDetails(Long budgetId,
            List<RegisterDailyHomeBudgetDetail> data) {
        // 指定されたdetailID以外を削除
        DailyHomeBudgetDetail.findByBudgetId(rep, budgetId).forEach(detail -> {
            if (data.stream().noneMatch(d -> Objects.equals(d.detailId(), detail.getDetailId()))) {
                detail.delete(rep);
            }
        });
        // 指定されたdetailIDを更新
        data.forEach(d -> {
            DailyHomeBudgetDetail.findById(rep, DailyHomeBudgetDetailId.of(budgetId, d.detailId()))
                    .ifPresentOrElse(
                            detail -> {
                                detail.setPrice(d.price());
                                detail.setExpenseType(d.expenseType());
                                detail.setCategoryId(d.categoryId());
                                detail.setAccountId(d.accountId());
                                detail.setMemo(d.memo());
                                detail.setUpdatedDate(LocalDateTime.now());
                                rep.update(detail);
                            },
                            () -> DailyHomeBudgetDetail.register(rep, d));
        });
        // 家計簿データを更新
        var details = DailyHomeBudgetDetail.findByBudgetId(rep, budgetId);
        DailyHomeBudget.syncTotals(rep, budgetId, details);
        return details;
    }
}
