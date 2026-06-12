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
 * 口座マスタを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountMst implements DomainEntity {
    private static final String SEQUENCE_ID = "account_mst_id_seq";

    /** 口座ID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long accountId;

    /** 口座名 */
    private String name;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;
}
