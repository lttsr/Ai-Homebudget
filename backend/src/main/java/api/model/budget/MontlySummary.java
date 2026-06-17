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
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 月次の家計簿確定情報の集計結果を表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    @NotNull
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
}
