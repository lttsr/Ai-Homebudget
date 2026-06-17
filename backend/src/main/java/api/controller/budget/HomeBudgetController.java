package api.controller.budget;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import api.context.ResponseDto;
import api.model.budget.DailyHomeBudget;
import api.model.budget.DailyHomeBudgetDetail;
import api.model.budget.DailyHomeBudgetDetail.RegisterDailyHomeBudgetDetail;
import api.model.budget.MontlySummary;
import api.model.budget.type.ExpensesType;
import api.usecase.budget.DailyHomeBudgetService;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home-budget")
@RequiredArgsConstructor
public class HomeBudgetController {
    private final DailyHomeBudgetService service;

    /**
     * 指定された月度の家計簿データを取得します。
     *
     * @param baseDate 基準月 yyyy-MM
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

    /**
     * 指定された月度の家計簿詳細データを全て取得します。
     *
     * @param baseDate 基準月 yyyy-MM
     * @return 家計簿データ
     */
    @GetMapping("/monthly/details")
    public List<ResDetalisList> getDetailsByYearMonth(@RequestParam String baseDate) {
        YearMonth yearMonth = YearMonth.parse(baseDate);
        return service.getDetailsByYM(yearMonth);
    }

    // 月次の家計簿詳細データを表すDTO。
    @Builder
    public static record ResDetalisList(
            @NotNull LocalDate date,
            @NotNull Long budgetId,
            @NotNull Long detailId,
            @NotNull Long categoryId,
            @NotNull Long accountId,
            @NotNull ExpensesType expenseType,
            @NotNull int price,
            String memo) implements ResponseDto {
    }

    /** 月次サマリーを取得します。 */
    @GetMapping("/monthly/summary")
    public MontlySummary getMonthlySummary(@RequestParam String baseDate) {
        YearMonth yearMonth = YearMonth.parse(baseDate);
        return service.getMonthlySummary(yearMonth);
    }
}
