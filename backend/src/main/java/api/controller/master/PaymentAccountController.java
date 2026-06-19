package api.controller.master;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.context.RequestDto;
import api.model.master.PaymentAccount;
import api.usecase.master.PaymentAccountService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/master/payment-account")
@RequiredArgsConstructor
public class PaymentAccountController {

    private final PaymentAccountService service;

    /**
     * 口座・決済手段一覧を取得します。
     *
     * @return 口座・決済手段一覧
     */
    @GetMapping
    public List<PaymentAccount> getPaymentAccountList() {
        return service.getPaymentAccountList();
    }

    /**
     * 口座・決済手段を登録します。
     *
     * @param param 登録パラメータ
     * @return 口座・決済手段
     */
    @PostMapping("/register")
    public PaymentAccount registerPaymentAccount(@Valid @RequestBody RegisterPaymentAccountRequest param) {
        return service.registerPaymentAccount(param);
    }

    /**
     * リクエストDTO
     */
    public record RegisterPaymentAccountRequest(
            @NotNull String name) implements RequestDto {
    }
}
