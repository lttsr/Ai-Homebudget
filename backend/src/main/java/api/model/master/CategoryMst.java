package api.model.master;

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
 * カテゴリマスタを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryMst implements DomainEntity {

    private static final String SEQUENCE_ID = "category_mst_id_seq";

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
}
