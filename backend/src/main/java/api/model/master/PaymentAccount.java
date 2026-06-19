package api.model.master;

import java.time.LocalDateTime;
import java.util.List;

import api.context.DomainEntity;
import api.context.orm.OrmRepository;
import api.controller.master.PaymentAccountController.RegisterPaymentAccountRequest;
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
 * 口座マスタを表すエンティティ。
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentAccount implements DomainEntity {
    private static final String SEQUENCE_ID = "payment_account_id_seq";

    /** 口座ID */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_ID)
    @SequenceGenerator(name = SEQUENCE_ID, sequenceName = SEQUENCE_ID, allocationSize = 1)
    private Long accountId;

    /** 口座名 */
    @NotNull
    private String name;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;

    // 口座・決済手段一覧を取得します。
    public static List<PaymentAccount> findAll(OrmRepository rep) {
        return rep.findAll(PaymentAccount.class);
    }

    // 口座・決済手段を登録します。
    public static PaymentAccount register(OrmRepository rep, RegisterPaymentAccountRequest param) {
        return rep.save(PaymentAccount.builder()
                .name(param.name())
                .registeredDate(LocalDateTime.now())
                .updatedDate(LocalDateTime.now())
                .build());
    }
}
