package api.usecase.budget;

import java.time.YearMonth;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.controller.budget.HomeBudgetController.ResDetalisList;
import api.controller.budget.HomeBudgetController.UpdateDetailRequest;
import api.model.budget.DailyHomeBudget;
import api.model.budget.DailyHomeBudgetDetail;
import api.model.budget.DailyHomeBudgetDetail.DailyHomeBudgetDetailId;
import api.model.budget.DailyHomeBudgetDetail.RegisterDetailParam;
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
            List<UpdateDetailRequest> data) {
        // 指定されたdetailID以外を削除
        DailyHomeBudgetDetail.findByBudgetId(rep, budgetId).forEach(detail -> {
            if (data.stream().noneMatch(d -> Objects.equals(d.detailId(), detail.getDetailId()))) {
                detail.delete(rep);
            }
        });
        // 指定されたdetailIDを更新
        data.forEach(d -> {
            var param = RegisterDetailParam.builder()
                    .budgetId(budgetId)
                    .categoryId(d.categoryId())
                    .accountId(d.accountId())
                    .expenseType(d.expenseType())
                    .price(d.price())
                    .memo(d.memo())
                    .build();
            DailyHomeBudgetDetail.findById(rep, DailyHomeBudgetDetailId.of(budgetId, d.detailId()))
                    .ifPresentOrElse(
                            detail -> detail.update(rep, param),
                            () -> DailyHomeBudgetDetail.register(rep, param));
        });
        // 家計簿データを更新
        var details = DailyHomeBudgetDetail.findByBudgetId(rep, budgetId);
        DailyHomeBudget.syncTotals(rep, budgetId, details);
        return details;
    }

    /**
     * 指定された月度の家計簿詳細データを全て取得します。
     *
     * @param baseDate 基準月 yyyy-MM
     * @return 家計簿詳細データ
     */
    public List<ResDetalisList> getDetailsByYM(YearMonth yearMonth) {
        return DailyHomeBudget.findByYearMonth(rep, yearMonth).stream()
                .flatMap(budget -> DailyHomeBudgetDetail.findByBudgetId(rep, budget.getBudgetId()).stream()
                        .map(detail -> ResDetalisList.builder()
                                .date(budget.getBaseDate())
                                .budgetId(budget.getBudgetId())
                                .detailId(detail.getDetailId())
                                .categoryId(detail.getCategoryId())
                                .accountId(detail.getAccountId())
                                .expenseType(detail.getExpenseType())
                                .price(detail.getPrice())
                                .memo(detail.getMemo())
                                .build()))
                .toList();
    }
}
