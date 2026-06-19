package api.usecase.budget;

import java.time.YearMonth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.controller.budget.MontlySummaryController.UpdateMonthlySummaryRequest;
import api.model.budget.MontlySummary;
import api.model.budget.MontlySummary.UpdateMonthlySummaryParam;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MontlySummaryService {
    private final OrmRepository rep;

    /**
     * 指定された月度の月次サマリーを取得します。
     *
     * @param baseDate 基準月 yyyy-MM
     * @return 月次サマリー
     */
    public MontlySummary getMonthlySummary(YearMonth yearMonth) {
        return MontlySummary.findByYearMonth(rep, yearMonth);
    }

    /**
     * 月次サマリーを更新します。
     *
     * @param param 月次サマリー更新パラメータ
     * @return 月次サマリー
     */
    @Transactional
    public MontlySummary updateMonthlySummary(YearMonth yearMonth, UpdateMonthlySummaryRequest param) {
        var current = MontlySummary.findByYearMonth(rep, yearMonth);
        return current.update(rep, UpdateMonthlySummaryParam.builder()
                .statusType(current.getStatusType())
                .incomeTotal(current.getIncomeTotal())
                .expenseTotal(current.getExpenseTotal())
                .savings(current.getSavings())
                .savingsTarget(param.savingsTarget())
                .achievementRate(current.getAchievementRate())
                .comment(current.getComment())
                .confirmedDate(current.getConfirmedDate())
                .build());
    }
}
