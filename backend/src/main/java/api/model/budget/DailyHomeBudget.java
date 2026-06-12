package api.model.budget;

import java.time.LocalDateTime;

import api.context.DomainEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 日次の家計簿データを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyHomeBudget implements DomainEntity {
    private static final String SEQUENCE_ID = "daily_home_budget_id_seq";

    /** 家計簿ID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long budgetId;

    /** 基準日 */
    @NotNull
    private LocalDateTime budgetDate;

    /** 収入合計 */
    @NotNull
    private int incomeTotal;

    /** 支出合計 */
    @NotNull
    private int expenseTotal;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;
}
