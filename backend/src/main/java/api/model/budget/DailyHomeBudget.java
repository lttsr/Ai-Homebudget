package api.model.budget;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import api.context.DomainEntity;
import api.context.RequestDto;
import api.context.orm.OrmRepository;
import api.model.budget.type.ExpensesType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 日次の家計簿データを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyHomeBudget implements DomainEntity {
    private static final String SEQUENCE_ID = "daily_home_budget_id_seq";

    /** 家計簿ID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long budgetId;

    /** 基準日 */
    @NotNull
    private LocalDate baseDate;

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

    // 指定された月度の家計簿データを取得します。
    public static List<DailyHomeBudget> findByYearMonth(OrmRepository rep, YearMonth ym) {
        LocalDate from = ym.atDay(1);
        LocalDate to = ym.plusMonths(1).atDay(1);
        return rep.em().createQuery(
                "SELECT e FROM DailyHomeBudget e "
                        + "WHERE e.baseDate >= :from AND e.baseDate < :to "
                        + "ORDER BY e.baseDate",
                DailyHomeBudget.class)
                .setParameter("from", from)
                .setParameter("to", to)
                .getResultList();
    }

    // 日次の家計簿データを1件取得します。
    public static DailyHomeBudget load(OrmRepository rep, Long budgetId) {
        return rep.load(DailyHomeBudget.class, budgetId);
    }

    // 明細から合計を再計算して家計簿データを更新します。
    public static void syncTotals(OrmRepository rep, Long budgetId, List<DailyHomeBudgetDetail> details) {
        load(rep, budgetId).update(rep, UpdateDailyHomeBudget.calculatePrice(details));
    }

    // 日次の家計簿データを更新します。
    public DailyHomeBudget update(OrmRepository rep, UpdateDailyHomeBudget param) {
        return rep.update(param.applyTo(this));
    }

    /**
     * 日次の家計簿データを更新するためのDTO。
     */
    public static record UpdateDailyHomeBudget(
            @NotNull int incomeTotal,
            @NotNull int expenseTotal) implements RequestDto {

        // 明細から収入合計と支出合計を再計算します。
        public static UpdateDailyHomeBudget calculatePrice(List<DailyHomeBudgetDetail> details) {
            int incomeTotal = details.stream()
                    .filter(d -> d.getExpenseType() == ExpensesType.INCOME)
                    .mapToInt(DailyHomeBudgetDetail::getPrice)
                    .sum();
            int expenseTotal = details.stream()
                    .filter(d -> d.getExpenseType() == ExpensesType.EXPENSE)
                    .mapToInt(DailyHomeBudgetDetail::getPrice)
                    .sum();
            return new UpdateDailyHomeBudget(incomeTotal, expenseTotal);
        }

        public DailyHomeBudget applyTo(DailyHomeBudget budget) {
            budget.setIncomeTotal(incomeTotal);
            budget.setExpenseTotal(expenseTotal);
            budget.setUpdatedDate(LocalDateTime.now());
            return budget;
        }

    }
}
