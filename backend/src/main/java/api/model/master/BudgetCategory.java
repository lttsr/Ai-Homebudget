package api.model.master;

import java.time.LocalDateTime;
import java.util.List;

import api.context.DomainEntity;
import api.context.RequestDto;
import api.context.orm.OrmRepository;
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
 * カテゴリマスタを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetCategory implements DomainEntity {

    private static final String SEQUENCE_ID = "budget_category_id_seq";

    /** カテゴリID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long categoryId;

    /** カテゴリ名 */
    private String name;

    /** カラーコード */
    private String colorCode;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;

    // カテゴリマスタ一覧を取得します。
    public static List<BudgetCategory> findAll(OrmRepository rep) {
        return rep.findAll(BudgetCategory.class);
    }

    // カテゴリマスタを登録します。
    public static BudgetCategory register(OrmRepository rep, RegisterBudgetCategory param) {
        return rep.save(param.create());
    }

    // カテゴリマスタDTO
    public static record RegisterBudgetCategory(
            @NotNull String name,
            @NotNull String colorCode) implements RequestDto {
        public BudgetCategory create() {
            return BudgetCategory.builder()
                    .name(this.name)
                    .colorCode(this.colorCode)
                    .registeredDate(LocalDateTime.now())
                    .updatedDate(LocalDateTime.now())
                    .build();
        }
    }
}
