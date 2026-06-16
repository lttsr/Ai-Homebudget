package api.controller.master;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.master.BudgetCategory;
import api.model.master.BudgetCategory.RegisterBudgetCategory;
import api.usecase.master.BudgetCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/master/budget-category")
@RequiredArgsConstructor
public class BudgetCategoryController {
    private final BudgetCategoryService service;

    /**
     * カテゴリマスタ一覧を取得します。
     *
     * @return カテゴリマスタ一覧
     */
    @GetMapping
    public List<BudgetCategory> getBudgetCategoryList() {
        return service.getBudgetCategoryList();
    }

    /**
     * カテゴリマスタを登録します。
     *
     * @param param 登録パラメータ
     * @return カテゴリマスタ
     */
    @PostMapping("/register")
    public BudgetCategory registerBudgetCategory(@Valid @RequestBody RegisterBudgetCategory param) {
        return service.registerBudgetCategory(param);
    }
}
