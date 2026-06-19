package api.controller.budget;

import java.time.YearMonth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import api.context.RequestDto;
import api.model.budget.MontlySummary;
import api.usecase.budget.MontlySummaryService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home-budget")
@RequiredArgsConstructor
public class MontlySummaryController {
    private final MontlySummaryService service;

    /** 月次サマリーを取得します。 */
    @GetMapping("/monthly/summary")
    public MontlySummary getMonthlySummary(@RequestParam String baseDate) {
        YearMonth yearMonth = YearMonth.parse(baseDate);
        return service.getMonthlySummary(yearMonth);
    }

    /** 月次サマリーを更新します。 */
    @PostMapping("/monthly/summary/update")
    public MontlySummary updateMonthlySummary(@RequestBody UpdateMonthlySummaryRequest param) {
        YearMonth yearMonth = YearMonth.parse(param.baseDate());
        return service.updateMonthlySummary(yearMonth, param);
    }

    /** リクエストDTO */
    public record UpdateMonthlySummaryRequest(
            @NotNull String baseDate,
            @NotNull int savingsTarget) implements RequestDto {
    }
}
