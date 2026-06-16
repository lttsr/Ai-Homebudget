package api.controller.budget;

import java.time.YearMonth;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.budget.DailyHomeBudget;
import api.model.budget.DailyHomeBudgetDetail;
import api.model.budget.DailyHomeBudgetDetail.RegisterDailyHomeBudgetDetail;
import api.usecase.budget.DailyHomeBudgetService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home-budget")
@RequiredArgsConstructor
public class HomeBudgetController {
    private final DailyHomeBudgetService service;

    /**
     * 指定された月度の家計簿データを取得します。
     *
     * @param baseDate 基準月
     * @return 家計簿データ
     */
    @GetMapping("/{baseDate}")
    public List<DailyHomeBudget> getDailyHomeBudget(@PathVariable String baseDate) {
        YearMonth yearMonth = YearMonth.parse(baseDate);
        return service.getDailyHomeBudgets(yearMonth);
    }

    /**
     * 指定された家計簿IDの家計簿詳細データを全て取得します。
     *
     * @param budgetId 家計簿ID
     * @return 家計簿詳細データ
     */
    @GetMapping("/details/{budgetId}")
    public List<DailyHomeBudgetDetail> getDailyHomeBudgetDetails(@PathVariable Long budgetId) {
        return service.getDailyHomeBudgetDetails(budgetId);
    }

    /**
     * 指定された家計簿IDの家計簿詳細データを更新します。
     *
     * @param budgetId 家計簿ID
     * @param details  家計簿詳細データ
     * @return 家計簿詳細データ
     */
    @PostMapping("/details/{budgetId}/update")
    public List<DailyHomeBudgetDetail> updateDailyHomeBudgetDetails(@PathVariable Long budgetId,
            @RequestBody List<RegisterDailyHomeBudgetDetail> details) {
        return service.updateDailyHomeBudgetDetails(budgetId, details);
    }
}
