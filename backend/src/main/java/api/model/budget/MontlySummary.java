package api.model.budget;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

import api.context.DomainEntity;
import api.context.orm.OrmRepository;
import api.model.budget.type.TaskStatusType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 月次の家計簿確定情報の集計結果を表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MontlySummary implements DomainEntity {
    /** 基準月（yyyy-MM） */
    @Id
    @NotNull
    private LocalDate baseMonth;

    /** 確定・未確定ステータス */
    @NotNull
    private TaskStatusType statusType;

    /** 収入合計 */
    @NotNull
    private int incomeTotal;

    /** 支出合計 */
    @NotNull
    private int expenseTotal;

    /** 貯蓄合計 */
    @NotNull
    private int savings;

    /** 貯蓄目標 */
    @NotNull
    private int savingsTarget;

    /** 達成率 */
    @NotNull
    private double achievementRate;

    /** AIコメント */
    private String comment;

    /** 集計確定日時 */
    private LocalDateTime confirmedDate;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;

    // 指定された月度の月次サマリーを取得します。
    public static MontlySummary findByYearMonth(OrmRepository rep, YearMonth yearMonth) {
        return rep.findBy(MontlySummary.class, "baseMonth", yearMonth.atDay(1));
    }

    // 指定された月度の月次サマリーを作成します。
    public static MontlySummary register(OrmRepository rep, YearMonth yearMonth, int savingsTarget) {
        return rep.save(MontlySummary.builder()
                .baseMonth(yearMonth.atDay(1))
                .statusType(TaskStatusType.PENDING)
                .incomeTotal(0)
                .expenseTotal(0)
                .savings(0)
                .savingsTarget(savingsTarget)
                .achievementRate(0)
                .comment(null)
                .confirmedDate(null)
                .registeredDate(LocalDateTime.now())
                .updatedDate(LocalDateTime.now())
                .build());
    }

    // 月次サマリーを更新します。
    public MontlySummary update(OrmRepository rep, UpdateMonthlySummaryParam param) {
        return rep.update(param.applyTo(this));
    }

    /**
     * 更新パラメタ
     */
    @Builder
    public static record UpdateMonthlySummaryParam(
            @NotNull TaskStatusType statusType,
            @NotNull int incomeTotal,
            @NotNull int expenseTotal,
            @NotNull int savings,
            @NotNull int savingsTarget,
            @NotNull double achievementRate,
            String comment,
            @NotNull LocalDateTime confirmedDate) {
        // 全更新
        public MontlySummary applyTo(MontlySummary current) {
            current.setStatusType(statusType);
            current.setIncomeTotal(incomeTotal);
            current.setExpenseTotal(expenseTotal);
            current.setSavings(savings);
            current.setSavingsTarget(savingsTarget);
            current.setAchievementRate(achievementRate);
            current.setComment(comment);
            current.setConfirmedDate(confirmedDate);
            current.setUpdatedDate(LocalDateTime.now());
            return current;
        }
    }

    // バッチ 月次サマリの確定処理を行います。
    public static MontlySummary confirm(OrmRepository rep, YearMonth preMonth) {
        var current = findByYearMonth(rep, preMonth);
        int totalIncome = DailyHomeBudget.getTotalIncome(rep, preMonth);
        int totalExpense = DailyHomeBudget.getTotalExpense(rep, preMonth);
        int totalSavings = totalIncome - totalExpense;
        double achievementRate = (double) totalSavings / current.getSavingsTarget() * 100;
        return current.update(rep, UpdateMonthlySummaryParam.builder()
                .statusType(TaskStatusType.FINISHED)
                .incomeTotal(totalIncome)
                .expenseTotal(totalExpense)
                .savings(totalSavings)
                .savingsTarget(current.getSavingsTarget())
                .achievementRate(achievementRate)
                .comment(current.getComment())
                .confirmedDate(LocalDateTime.now())
                .build());
    }

    // コメントを更新します。
    public MontlySummary updateComment(OrmRepository rep, String comment) {
        this.setComment(comment);
        this.setUpdatedDate(LocalDateTime.now());
        return rep.update(this);
    }
}
