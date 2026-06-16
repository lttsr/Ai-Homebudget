package api.model.budget;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import api.context.DomainEntity;
import api.context.RequestDto;
import api.context.orm.OrmRepository;
import api.model.budget.DailyHomeBudgetDetail.DailyHomeBudgetDetailId;
import api.model.budget.type.ExpensesType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 日次の家計簿詳細データを表すエンティティ。
 */
@Entity
@IdClass(DailyHomeBudgetDetailId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyHomeBudgetDetail implements DomainEntity {
    private static final String SEQUENCE_ID = "daily_home_budget_detail_id_seq";

    /** 家計簿ID */
    @Id
    @NotNull
    private Long budgetId;

    /** 詳細ID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long detailId;

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
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;

    /** 複合主キーを表すクラス */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor(staticName = "of")
    public static class DailyHomeBudgetDetailId implements Serializable {
        private static final long serialVersionUID = 1L;

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

    // 指定された家計簿IDの家計簿詳細データを全て取得します。
    public static List<DailyHomeBudgetDetail> findByBudgetId(OrmRepository rep, Long budgetId) {
        return rep.findListBy(DailyHomeBudgetDetail.class, "budgetId", budgetId);
    }

    // 日次の家計簿詳細データを１件取得します。
    public static Optional<DailyHomeBudgetDetail> findById(OrmRepository rep, DailyHomeBudgetDetailId id) {
        return rep.get(DailyHomeBudgetDetail.class, id);
    }

    // 日次の家計簿詳細データを1件取得します。
    public static DailyHomeBudgetDetail load(OrmRepository rep, DailyHomeBudgetDetailId id) {
        return rep.load(DailyHomeBudgetDetail.class, id);
    }

    // 日次の家計簿詳細データを登録します。
    public static DailyHomeBudgetDetail register(OrmRepository rep, RegisterDailyHomeBudgetDetail param) {
        return rep.save(param.create());
    }

    // 日次の家計簿詳細データを削除します。
    public void delete(OrmRepository rep) {
        rep.delete(this);
    }

    /**
     * 日次の家計簿詳細データを登録するためのDTO。
     */
    public static record RegisterDailyHomeBudgetDetail(
            @NotNull Long budgetId,
            Long detailId,
            @NotNull Long categoryId,
            @NotNull Long accountId,
            @NotNull ExpensesType expenseType,
            @NotNull int price,
            String memo) implements RequestDto {

        // 新規登録を行います。
        public DailyHomeBudgetDetail create() {
            return DailyHomeBudgetDetail.builder()
                    .budgetId(budgetId)
                    .categoryId(categoryId)
                    .accountId(accountId)
                    .expenseType(expenseType)
                    .price(price)
                    .memo(memo)
                    .registeredDate(LocalDateTime.now())
                    .updatedDate(LocalDateTime.now())
                    .build();
        }
    }

}
