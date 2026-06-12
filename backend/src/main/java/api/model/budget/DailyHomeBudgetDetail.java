package api.model.budget;

import java.time.LocalDateTime;

import api.context.DomainEntity;
import api.model.budget.type.ExpensesType;
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
 * 日次の家計簿詳細データを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyHomeBudgetDetail implements DomainEntity {
    private static final String SEQUENCE_ID = "daily_home_budget_detail_id_seq";

    /** 詳細ID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long detailId;

    /** 家計簿ID */
    @NotNull
    private Long budgetId;

    /** カテゴリID */
    @NotNull
    private Long categoryId;

    /** 入出方法ID */
    @NotNull
    private Long accountId;

    /** 入金・支出区分 */
    @NotNull
    private ExpensesType expenseType;

    /** 金額 */
    @NotNull
    private int price;

    /** 備考 */
    private String memo;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredAt;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedAt;

    /** 複合主キーを表すクラス */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor(staticName = "of")
    public static class DailyHomeBudgetDetailId {
        /** 家計簿ID */
        @NotNull
        private Long budgetId;

        /** 詳細ID */
        @NotNull
        private Long detailId;

        public String toString() {
            return budgetId + "-" + detailId;
        }
    }

}
