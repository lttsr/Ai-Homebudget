package api.usecase.master;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.model.master.PaymentAccount;
import api.model.master.PaymentAccount.RegisterPaymentAccount;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentAccountService {
    private final OrmRepository rep;

    /**
     * 口座・決済手段一覧を取得します。
     *
     * @return 口座・決済手段一覧
     */
    public List<PaymentAccount> getPaymentAccountList() {
        return PaymentAccount.findAll(rep);
    }

    /**
     * 口座・決済手段を登録します。
     *
     * @param param 口座・決済手段登録パラメータ
     * @return 口座・決済手段
     */
    @Transactional
    public PaymentAccount registerPaymentAccount(RegisterPaymentAccount param) {
        return PaymentAccount.register(rep, param);
    }
}
